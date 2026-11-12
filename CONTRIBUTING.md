# Contributing

## Setup

```sh
git clone --recurse-submodules https://github.com/wekor/react-native-mmkv.git
cd react-native-mmkv
bun install
```

`MMKV/` is the [Tencent/MMKV](https://github.com/Tencent/MMKV) submodule; only `MMKV/Core` is shipped.

## Commands

```sh
bun run check            # biome
bun run fix              # biome, applying fixes
bun run typecheck
bun run test             # bun test
bun run format:cpp       # clang-format for cpp/, ios/, android/src/main/cpp
bun run prepare          # bob build

bun run build:android:prepare && bun run build:android
bun run build:ios:prepare && bun run build:ios

bun run example start    # Metro for the example app
bun run example android
bun run example ios
```

The example app (`example/`) is an Expo app whose native folders come from `expo prebuild`. On launch it runs checks
against the real native module and logs them under `MMKV CHECKS`.

## Pull requests

Keep the JS API compatible with react-native-mmkv 3.x. Run `check`, `typecheck`, `test` and both builds before opening a
pull request.
