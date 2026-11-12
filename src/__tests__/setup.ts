import { mock } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

mock.module('react-native', () => ({
  AppState: { addEventListener: () => ({ remove: () => {} }) },
  NativeModules: {},
  Platform: { OS: 'ios' },
  TurboModuleRegistry: {
    getEnforcing: () => {
      throw new Error('Tests use the mocked MMKV, never the native module.');
    },
  },
}));
