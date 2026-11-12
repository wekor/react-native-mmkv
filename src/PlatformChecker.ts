type Process = { env: Record<string, string | undefined> };

export function isTest(): boolean {
  // In a web browser or Electron there is no `process`.
  const env = (globalThis as { process?: Process }).process?.env;
  if (env == null) return false;
  return (
    env.JEST_WORKER_ID != null ||
    env.VITEST_WORKER_ID != null ||
    // `bun test` sets NODE_ENV to "test"; inside an app it is "development" or "production".
    ('Bun' in globalThis && env.NODE_ENV === 'test')
  );
}
