import { beforeEach, expect, test } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { MMKV, useMMKVNumber, useMMKVObject, useMMKVString } from '..';

const mmkv = new MMKV();

beforeEach(() => {
  mmkv.clearAll();
});

test('hooks update when the value is changed directly through the instance', () => {
  const { result } = renderHook(() => useMMKVString('string-key', mmkv));
  expect(result.current[0]).toBeUndefined();

  act(() => result.current[1]('value 1'));
  expect(result.current[0]).toBe('value 1');

  act(() => mmkv.set('string-key', 'value 2'));
  expect(result.current[0]).toBe('value 2');

  act(() => result.current[1](undefined));
  expect(mmkv.contains('string-key')).toBe(false);
});

// https://github.com/mrousavy/react-native-mmkv/issues/599
test('functional updates apply one after another within one render', () => {
  const { result } = renderHook(() => useMMKVNumber('number-key', mmkv));

  act(() => {
    result.current[1]((current) => (current ?? 0) + 1);
    result.current[1]((current) => (current ?? 0) + 1);
  });
  expect(result.current[0]).toBe(2);

  act(() => {
    result.current[1]((current) => (current ?? 0) + 1);
    result.current[1]((current) => (current ?? 0) + 1);
  });
  expect(result.current[0]).toBe(4);
});

test('two hooks on the same key stay in sync', () => {
  const { result } = renderHook(() => ({
    first: useMMKVObject<{ count: number }>('object-key', mmkv),
    second: useMMKVObject<{ count: number }>('object-key', mmkv),
  }));

  act(() => result.current.first[1]({ count: 1 }));
  expect(result.current.second[0]).toEqual({ count: 1 });

  act(() =>
    result.current.second[1]((prev) => ({ count: (prev?.count ?? 0) + 1 }))
  );
  expect(result.current.first[0]).toEqual({ count: 2 });
});
