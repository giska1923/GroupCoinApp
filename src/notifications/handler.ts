import { loadNotificationsModule } from './module';

/** Show banners for notifications received while the app is open. */
export async function configureForegroundNotificationHandler(): Promise<void> {
  const Notifications = await loadNotificationsModule();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
