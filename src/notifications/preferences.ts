import * as SecureStore from 'expo-secure-store';
import { NOTIFICATIONS_ENABLED_KEY } from './constants';

export async function getLocalNotificationsEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(NOTIFICATIONS_ENABLED_KEY);
  return value === 'true';
}

export async function setLocalNotificationsEnabled(
  enabled: boolean,
): Promise<void> {
  await SecureStore.setItemAsync(
    NOTIFICATIONS_ENABLED_KEY,
    enabled ? 'true' : 'false',
  );
}
