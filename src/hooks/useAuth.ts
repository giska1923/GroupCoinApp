import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import { unregisterPushTokenForLogout } from '../notifications/session';
import type { LoginPayload, RegisterPayload } from '../types/api';

/** Validates the persisted token against the backend (GET /auth/me). */
export const useCurrentUser = () => {
  const token = useAuthStore(s => s.token);
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled: !!token,
    staleTime: 60_000,
  });
};

export const useLogin = () => {
  const setSession = useAuthStore(s => s.setSession);
  return useMutation({
    mutationFn: (body: LoginPayload) => authApi.login(body),
    onSuccess: async ({ user, token }) => {
      await setSession(user, token);
    },
  });
};

export const useRegister = () => {
  const setSession = useAuthStore(s => s.setSession);
  return useMutation({
    mutationFn: (body: RegisterPayload) => authApi.register(body),
    onSuccess: async ({ user, token }) => {
      await setSession(user, token);
    },
  });
};

export const useLogout = () => {
  const clearSession = useAuthStore(s => s.clearSession);
  const qc = useQueryClient();
  return async () => {
    await unregisterPushTokenForLogout();
    await clearSession();
    qc.clear();
  };
};
