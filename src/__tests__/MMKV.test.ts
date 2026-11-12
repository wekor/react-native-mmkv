import { expect, test } from 'bun:test';
import { MMKV } from '..';

test('stores each type and only returns it as that type', () => {
  const storage = new MMKV({ id: 'types' });
  storage.set('testString', 'value');
  storage.set('testNumber', 99);
  storage.set('testBoolean', false);

  expect(storage.getString('testString')).toBe('value');
  expect(storage.getNumber('testString')).toBeUndefined();
  expect(storage.getBoolean('testString')).toBeUndefined();
  expect(storage.getString('testNumber')).toBeUndefined();
  expect(storage.getNumber('testNumber')).toBe(99);
  expect(storage.getBoolean('testNumber')).toBeUndefined();
  expect(storage.getString('testBoolean')).toBeUndefined();
  expect(storage.getNumber('testBoolean')).toBeUndefined();
  expect(storage.getBoolean('testBoolean')).toBe(false);
  expect(storage.getAllKeys()).toEqual(
    expect.arrayContaining(['testString', 'testNumber', 'testBoolean'])
  );

  storage.delete('testBoolean');
  expect(storage.contains('testBoolean')).toBe(false);

  storage.clearAll();
  expect(storage.toString()).toBe('MMKV (types): []');
});

test('listeners hear set, delete and clearAll until removed', () => {
  const storage = new MMKV({ id: 'listeners' });
  const changed: string[] = [];
  const listener = storage.addOnValueChangedListener((key) =>
    changed.push(key)
  );

  storage.set('a', 1);
  storage.set('b', 2);
  storage.delete('a');
  storage.clearAll();
  listener.remove();
  storage.set('c', 3);

  expect(changed).toEqual(['a', 'b', 'a', 'b']);
});
