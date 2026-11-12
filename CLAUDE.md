# @wekor/react-native-mmkv

A maintained fork of react-native-mmkv 3.x (upstream stopped at 3.3.3; 4.x moved to Nitro). The JS API stays
compatible with 3.x; the work here is keeping the native build current with React Native and Expo. New Architecture
only, React Native 0.80+.

## Layout

- `src/` — the TS API. `NativeMmkv.ts` is the C++ TurboModule spec (`MmkvCxx`), `NativeMmkvPlatformContext.ts` the
  platform module spec (`MmkvPlatformContext`: base and App Group directories). `Types.ts` repeats the spec types so
  web never imports the TurboModule registry. `createMMKV.mock.ts` is used under Jest, Vitest and `bun test`.
- `cpp/` — `NativeMmkvModule` (the C++ TurboModule) and `MmkvHostObject` (one `jsi::HostObject` per instance).
- `ios/` — `MmkvOnLoad.mm` registers the C++ module, `MmkvPlatformContextModule.mm` the platform module (found through
  `codegenConfig.ios.modulesProvider`).
- `android/` — `MmkvPackage` / `MmkvPlatformContextModule` (Java). `CMakeLists.txt` is built by the app's CMake through
  the `cxxModule*` fields in `react-native.config.js`, not by this library's Gradle file.
- `MMKV/` — the Tencent/MMKV submodule; only `MMKV/Core` ships. Don't edit it.
- `example/` — an Expo app; `ios/` and `android/` come from `expo prebuild`. On launch it checks the native module and
  logs `MMKV CHECKS`.

## Commands

```sh
bun install
bun run check        # biome
bun run typecheck
bun run test         # bun test
bun run prepare      # bob build
bun run build:android:prepare && bun run build:android
bun run build:ios:prepare && bun run build:ios
```

No Jest, ESLint, Prettier or Lefthook.

## Rules

- Don't change the JS API or the native module names (`MmkvCxx`, `MmkvPlatformContext`, `RNMmkvSpec`): apps install
  this as `react-native-mmkv` and expect 3.x behavior.
- No deprecated React Native or Gradle APIs. When React Native deprecates something this library uses, replace it.
- Verify a change end to end on real phones, Android and iOS, not only simulators: build the example, run it
  against Metro (Debug forwards `console.log` there), read `MMKV CHECKS`, then kill and relaunch the app and check
  that `MMKV LAUNCHES` went up. Do it for Debug and Release (Hermes bytecode; R8 on Android). Release builds don't
  log to Metro: Android still logs to logcat (`ReactNativeJS`); on iOS pull `Documents/mmkv/check-results` with
  `xcrun devicectl device copy from --domain-type appDataContainer` and read it with `strings`.
