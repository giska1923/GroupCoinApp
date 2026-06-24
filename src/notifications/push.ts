import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { ANDROID_NOTIFICATION_CHANNEL_ID } from './constants';
import { loadNotificationsModule } from './module';
import {
  EXPO_GO_ANDROID_PUSH_MESSAGE,
  isRemotePushSupported,
} from './support';
import { storePushToken } from './tokenStorage';
import type { PushPlatform } from '../types/api';

export type PushPermissionResult =
  | { ok: true; token: string; platform: PushPlatform }
  | { ok: false; reason: 'unsupported' | 'denied' | 'missing_project_id' | 'token_error'; message: string };

export {
  clearStoredPushToken,
  getStoredPushToken,
  storePushToken,
} from './tokenStorage';

function getEasProjectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: string } }
    | undefined;

  return (
    extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    undefined
  );
}

/** Request OS permission and obtain an Expo push token for this device. */
export async function registerForPushNotificationsAsync(): Promise<PushPermissionResult> {
  if (!isRemotePushSupported()) {
    return {
      ok: false,
      reason: 'unsupported',
      message: EXPO_GO_ANDROID_PUSH_MESSAGE,
    };
  }

  if (!Device.isDevice) {
    return {
      ok: false,
      reason: 'unsupported',
      message: 'Push notifications require a physical phone or tablet.',
    };
  }

  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return {
      ok: false,
      reason: 'unsupported',
      message: EXPO_GO_ANDROID_PUSH_MESSAGE,
    };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_NOTIFICATION_CHANNEL_ID, {
      name: 'Group activity',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0ea5e9',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return {
      ok: false,
      reason: 'denied',
      message:
        'Notification permission was denied. Enable notifications for GroupCoin in your device settings to receive group alerts.',
    };
  }

  const projectId = getEasProjectId();
  if (!projectId) {
    return {
      ok: false,
      reason: 'missing_project_id',
      message:
        'Push notifications are not configured for this build. Set EAS_PROJECT_ID before creating a development build.',
    };
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    await storePushToken(token);

    return {
      ok: true,
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    };
  } catch {
    return {
      ok: false,
      reason: 'token_error',
      message: 'Could not register this device for push notifications.',
    };
  }
}
