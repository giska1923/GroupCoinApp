import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

/** Remote push is unavailable in Expo Go on Android (SDK 53+). */
export function isRemotePushSupported(): boolean {
  return !(Platform.OS === 'android' && isRunningInExpoGo());
}

export const EXPO_GO_ANDROID_PUSH_MESSAGE =
  'Push notifications are not available in Expo Go on Android. Create a development build to test notifications on a device.';
