import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  MMKV,
  Mode,
  useMMKVNumber,
  useMMKVString,
} from '@wekor/react-native-mmkv';

const storage = new MMKV();

// Read before this launch increments it: 0 on a fresh install, then one more each launch.
const launchesBefore = storage.getNumber('launches') ?? 0;
console.log(`MMKV LAUNCHES ${launchesBefore}`);

type Check = { name: string; run: () => void };

function expectEqual(actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`expected ${e}, got ${a}`);
}

/** Checks against the real native module; the app prints `MMKV CHECKS` to the log when they finish. */
const checks: Check[] = [
  {
    name: 'types round-trip',
    run: () => {
      const s = new MMKV({ id: 'check-types' });
      s.clearAll();
      s.set('string', 'hello');
      s.set('number', 42.5);
      s.set('boolean', true);
      expectEqual(s.getString('string'), 'hello');
      expectEqual(s.getNumber('number'), 42.5);
      expectEqual(s.getBoolean('boolean'), true);
      expectEqual(s.getAllKeys().sort(), ['boolean', 'number', 'string']);
      s.delete('string');
      expectEqual(s.contains('string'), false);
      s.clearAll();
      expectEqual(s.getAllKeys(), []);
    },
  },
  {
    name: 'ArrayBuffer',
    run: () => {
      const s = new MMKV({ id: 'check-buffer' });
      s.set('buffer', new Uint8Array([1, 2, 255]).buffer);
      const buffer = s.getBuffer('buffer');
      expectEqual(buffer && Array.from(new Uint8Array(buffer)), [1, 2, 255]);
    },
  },
  {
    name: 'encryption and recrypt',
    run: () => {
      const s = new MMKV({ id: 'check-encrypted', encryptionKey: 'key-1' });
      s.set('secret', 'value');
      s.recrypt('key-2');
      expectEqual(s.getString('secret'), 'value');
      s.recrypt(undefined);
      expectEqual(s.getString('secret'), 'value');
    },
  },
  {
    name: 'multi-process mode',
    run: () => {
      const s = new MMKV({ id: 'check-multi', mode: Mode.MULTI_PROCESS });
      s.set('key', 1);
      expectEqual(s.getNumber('key'), 1);
    },
  },
  {
    name: 'read-only instance',
    run: () => {
      // MMKV caches instances by id, so this id is never opened writable in the same process.
      const s = new MMKV({ id: 'check-readonly', readOnly: true });
      expectEqual(s.isReadOnly, true);
      s.getAllKeys();
    },
  },
  {
    name: 'size and trim',
    run: () => {
      const s = new MMKV({ id: 'check-size' });
      s.set('key', 'x'.repeat(1024));
      if (s.size <= 0) throw new Error(`size is ${s.size}`);
      s.trim();
    },
  },
];

function runChecks(): string[] {
  const results = checks.map(({ name, run }) => {
    try {
      run();
      return `PASS ${name}`;
    } catch (e) {
      return `FAIL ${name}: ${e instanceof Error ? e.message : String(e)}`;
    }
  });
  console.log(`MMKV CHECKS\n${results.join('\n')}`);
  // Release builds don't log to Metro: the result is also kept as plain text in the `check-results` file
  // (Documents/mmkv on iOS, files/mmkv on Android), which tests pull from the app's container.
  new MMKV({ id: 'check-results' }).set(
    'report',
    `MMKV LAUNCHES ${launchesBefore}\nMMKV CHECKS\n${results.join('\n')}\nMMKV END`
  );
  return results;
}

export default function App() {
  const [results] = useState(runChecks);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [launches = 0, setLaunches] = useMMKVNumber('launches');
  const [lastRead, setLastRead] = useMMKVString('last-read');

  useEffect(() => setLaunches((n) => (n ?? 0) + 1), [setLaunches]);

  return (
    <View style={styles.root}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>MMKV</Text>
        <Text>Launches: {launches}</Text>
        {results.map((line) => (
          <Text
            key={line}
            style={line.startsWith('PASS') ? styles.pass : styles.fail}
          >
            {line}
          </Text>
        ))}
        <View style={styles.form}>
          <TextInput
            placeholder="Key"
            style={styles.input}
            value={key}
            onChangeText={setKey}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Value"
            style={styles.input}
            value={value}
            onChangeText={setValue}
            autoCapitalize="none"
          />
          <Button
            title="Save"
            disabled={key.length === 0}
            onPress={() => storage.set(key, value)}
          />
          <Button
            title="Read"
            disabled={key.length === 0}
            onPress={() => setLastRead(`${key} = ${storage.getString(key)}`)}
          />
          {lastRead != null && <Text>{lastRead}</Text>}
          <Text style={styles.keys}>
            Keys: {storage.getAllKeys().join(', ')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingTop: 64, gap: 8 },
  title: { fontSize: 24, fontWeight: '600' },
  pass: { color: '#1a7f37' },
  fail: { color: '#cf222e' },
  form: { marginTop: 16, gap: 8 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    padding: 10,
  },
  keys: { color: 'gray' },
});
