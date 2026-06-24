import { isRemotePushSupported } from './support';

type NotificationsModule = typeof import('expo-notifications');

let cached: NotificationsModule | null | undefined;

/** Loads expo-notifications only when remote push is supported in this runtime. */
export async function loadNotificationsModule(): Promise<NotificationsModule | null> {
  if (!isRemotePushSupported()) return null;

  if (cached === undefined) {
    cached = await import('expo-notifications');
  }

  return cached;
}
