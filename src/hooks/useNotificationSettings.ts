import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { notificationsApi } from '../api/resources/notifications';
import { usersApi } from '../api/resources/users';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import { useCurrentUser } from './useAuth';
import { ClientError } from '../api/errors';
import {
  clearStoredPushToken,
  getLocalNotificationsEnabled,
  getStoredPushToken,
  registerForPushNotificationsAsync,
  setLocalNotificationsEnabled,
} from '../notifications';

export function useNotificationSettings() {
  const userId = useAuthStore(s => s.user?.id);
  const setSession = useAuthStore(s => s.setSession);
  const token = useAuthStore(s => s.token);
  const { data: fetchedUser } = useCurrentUser();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const local = await getLocalNotificationsEnabled();
      const fromServer = fetchedUser?.notificationsEnabled;

      if (!cancelled) {
        setEnabled(fromServer ?? local);
        setReady(true);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [fetchedUser?.notificationsEnabled]);

  const persistPreference = useMutation({
    mutationFn: async (nextEnabled: boolean) => {
      if (!userId) throw new Error('Not signed in');

      if (nextEnabled) {
        const result = await registerForPushNotificationsAsync();
        if (!result.ok) {
          throw new ClientError(result.message, 400, 'PUSH_PERMISSION_DENIED');
        }

        await notificationsApi.registerDeviceToken({
          token: result.token,
          platform: result.platform,
        });
      } else {
        const storedToken = await getStoredPushToken();
        if (storedToken) {
          await notificationsApi.removeDeviceToken(storedToken);
        }
        await clearStoredPushToken();
      }

      const user = await usersApi.update(userId, {
        notificationsEnabled: nextEnabled,
      });

      await setLocalNotificationsEnabled(nextEnabled);

      if (token) {
        await setSession(user, token);
      }

      return user;
    },
  });

  const toggle = useCallback(
    (nextEnabled: boolean) => {
      if (!ready || persistPreference.isPending) return;

      persistPreference.mutate(nextEnabled, {
        onSuccess: () => setEnabled(nextEnabled),
        onError: error => {
          const message =
            error instanceof ClientError
              ? error.message
              : 'Could not update notification settings.';

          Alert.alert('Notifications', message);
        },
      });
    },
    [persistPreference, ready],
  );

  return {
    enabled,
    ready,
    isUpdating: persistPreference.isPending,
    toggle,
  };
}
