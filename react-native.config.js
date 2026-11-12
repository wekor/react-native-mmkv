// https://github.com/react-native-community/cli/blob/main/docs/dependencies.md
module.exports = {
  dependency: {
    platforms: {
      ios: {},
      android: {
        // The C++ TurboModule (`MmkvCxx`) is built by the app's CMake build.
        cxxModuleCMakeListsModuleName: 'react-native-mmkv',
        cxxModuleCMakeListsPath: 'CMakeLists.txt',
        cxxModuleHeaderName: 'NativeMmkvModule',
      },
    },
  },
};
