import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/resources/notifications';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import { loadNotificationsModule } from '../notifications/module';
import { isRemotePushSupported } from '../notifications/support';
import {
  getLocalNotificationsEnabled,
  getStoredPushToken,
  navigateFromPushNotification,
  registerForPushNotificationsAsync,
} from '../notifications';

/** Keeps the device push token in sync and handles notification taps. */
export function usePushNotifications() {
  const token = useAuthStore(s => s.token);
  const userId = useAuthStore(s => s.user?.id);
  const qc = useQueryClient();

  useEffect(() => {
    if (!token || !userId || !isRemotePushSupported()) return;

    let cancelled = false;

    const syncToken = async () => {
      const enabled = await getLocalNotificationsEnabled();
      if (!enabled || cancelled) return;

      const storedToken = await getStoredPushToken();
      if (storedToken) {
        try {
          await notificationsApi.registerDeviceToken({
            token: storedToken,
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
          });
        } catch {
          // Token may be stale; a fresh registration happens when the user toggles on.
        }
        return;
      }

      const result = await registerForPushNotificationsAsync();
      if (!result.ok || cancelled) return;

      await notificationsApi.registerDeviceToken({
        token: result.token,
        platform: result.platform,
      });
    };

    void syncToken();

    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  useEffect(() => {
    if (!isRemotePushSupported()) return;

    let receivedSub: { remove: () => void } | undefined;
    let responseSub: { remove: () => void } | undefined;

    const attachListeners = async () => {
      const Notifications = await loadNotificationsModule();
      if (!Notifications) return;

      receivedSub = Notifications.addNotificationReceivedListener(() => {
        qc.invalidateQueries({ queryKey: queryKeys.invitations.all });
        qc.invalidateQueries({ queryKey: queryKeys.groups.all });
      });

      responseSub = Notifications.addNotificationResponseReceivedListener(
        response => {
          navigateFromPushNotification(
            response.notification.request.content.data as Record<string, unknown>,
          );
        },
      );

      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastResponse) {
        navigateFromPushNotification(
          lastResponse.notification.request.content.data as Record<
            string,
            unknown
          >,
        );
      }
    };

    void attachListeners();

    return () => {
      receivedSub?.remove();
      responseSub?.remove();
    };
  }, [qc]);
}
