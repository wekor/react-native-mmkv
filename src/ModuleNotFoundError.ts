import { Platform } from 'react-native';

// Set up by expo-modules-core in Expo apps.
type ExpoGlobal = {
  modules?: { ExponentConstants?: { appOwnership?: string | null } };
};

const BULLET_POINT = '\n* ';

function messageWithSuggestions(
  message: string,
  suggestions: string[]
): string {
  return message + BULLET_POINT + suggestions.join(BULLET_POINT);
}

function getFrameworkType(): 'react-native' | 'expo' | 'expo-go' {
  const constants = (globalThis as { expo?: ExpoGlobal }).expo?.modules
    ?.ExponentConstants;
  if (constants == null) return 'react-native';
  return constants.appOwnership === 'expo' ? 'expo-go' : 'expo';
}

export class ModuleNotFoundError extends Error {
  constructor(cause?: unknown) {
    const framework = getFrameworkType();
    if (framework === 'expo-go') {
      super(
        'react-native-mmkv is not supported in Expo Go! Use a development build (`expo prebuild` or EAS Build) instead.',
        { cause }
      );
      return;
    }

    const message =
      'Failed to create a new MMKV instance: The native MMKV Module could not be found.';
    const suggestions: string[] = [];
    suggestions.push(
      'Make sure react-native-mmkv is correctly autolinked (run `npx react-native config` or `npx expo-modules-autolinking react-native-config` to verify)'
    );
    suggestions.push(
      'Make sure CodeGen properly generated the RNMmkvSpec specs.'
    );
    suggestions.push('Make sure you rebuilt the app.');
    if (framework === 'expo') {
      suggestions.push('Make sure you ran `expo prebuild`.');
    }
    switch (Platform.OS) {
      case 'ios':
      case 'macos':
        suggestions.push(
          'Make sure you ran `pod install` in the ios/ directory.'
        );
        break;
      case 'android':
        suggestions.push('Make sure gradle is synced.');
        break;
      default:
        throw new Error(`MMKV is not supported on ${Platform.OS}!`);
    }

    super(messageWithSuggestions(message, suggestions), { cause });
  }
}
