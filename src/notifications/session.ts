import { notificationsApi } from '../api/resources/notifications';
import { clearStoredPushToken, getStoredPushToken } from './tokenStorage';

export async function unregisterPushTokenForLogout(): Promise<void> {
  const storedToken = await getStoredPushToken();
  if (storedToken) {
    try {
      await notificationsApi.removeDeviceToken(storedToken);
    } catch {
      // Best effort before clearing the session.
    }
  }
  await clearStoredPushToken();
}
