import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import { useAuthStore } from '../stores/auth.store';
import { unregisterPushTokenForLogout } from '../notifications/session';
import { signInWithGoogle, signOutFromGoogle } from '../auth/google';
import type {
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  VerifyEmailPayload,
} from '../types/api';

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
    onSuccess: async ({ user, accessToken, refreshToken }) => {
      await setSession(user, accessToken, refreshToken);
    },
  });
};

/**
 * Registers the account and triggers the verification email. Deliberately does
 * NOT open a session — the user must verify the emailed code first (see
 * {@link useVerifyEmail}). Returns the pending-verification payload so the
 * caller can route to the verification screen with the email prefilled.
 */
export const useRegister = () =>
  useMutation({
    mutationFn: (body: RegisterPayload) => authApi.register(body),
  });

/**
 * Confirms the emailed 6-digit code. On success the backend returns a real
 * session, which we persist here — the same effect as a login.
 */
export const useVerifyEmail = () => {
  const setSession = useAuthStore(s => s.setSession);
  return useMutation({
    mutationFn: (body: VerifyEmailPayload) => authApi.verifyEmail(body),
    onSuccess: async ({ user, accessToken, refreshToken }) => {
      await setSession(user, accessToken, refreshToken);
    },
  });
};

/** Requests a fresh verification code for an unverified account. */
export const useResendVerification = () =>
  useMutation({
    mutationFn: (body: ResendVerificationPayload) =>
      authApi.resendVerification(body),
  });

/**
 * Drives the full Google flow: native sign-in to obtain an ID token, then
 * exchange it at the backend for our own access/refresh tokens.
 */
export const useGoogleLogin = () => {
  const setSession = useAuthStore(s => s.setSession);
  return useMutation({
    mutationFn: async () => {
      const idToken = await signInWithGoogle();
      return authApi.google({ idToken });
    },
    onSuccess: async ({ user, accessToken, refreshToken }) => {
      await setSession(user, accessToken, refreshToken);
    },
  });
};

export const useLogout = () => {
  const clearSession = useAuthStore(s => s.clearSession);
  const qc = useQueryClient();
  return async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    await unregisterPushTokenForLogout();
    await signOutFromGoogle();
    // Best-effort server-side revocation; the local session is cleared
    // regardless so logout always succeeds offline.
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Ignore — clearing the local session is what matters here.
      }
    }
    await clearSession();
    qc.clear();
  };
};
