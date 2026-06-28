import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../stores/auth.store';
import { endpoints } from './endpoints';
import { mapAxiosError } from './errors';
import type { AuthResponseDTO } from '../types/api';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  // Generous timeout to tolerate Render free-tier cold starts (~30s spin-up
  // after inactivity) on the first request.
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Bare client with no interceptors, used only to refresh tokens so the refresh
// request can't itself trigger the 401-refresh loop below.
const refreshClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject the bearer token on every request.
apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single in-flight refresh shared by all concurrent 401s, so a burst of
// requests triggers exactly one /auth/refresh round-trip.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data } = await refreshClient.post<AuthResponseDTO>(
    endpoints.auth.refresh,
    { refreshToken },
  );
  await setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

// Normalize errors and transparently refresh on 401, falling back to logout.
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const status = error.response?.status;
    const canRetry =
      status === 401 &&
      original &&
      !original._retry &&
      !!useAuthStore.getState().refreshToken;

    if (canRetry) {
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const newToken = await refreshPromise;

        original._retry = true;
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original as AxiosRequestConfig);
      } catch {
        // Refresh failed — the session is no longer recoverable.
        await useAuthStore.getState().clearSession();
        return Promise.reject(mapAxiosError(error));
      } finally {
        refreshPromise = null;
      }
    }

    // A 401 we can't recover from (no refresh token, or retry already failed).
    if (status === 401) {
      await useAuthStore.getState().clearSession();
    }

    return Promise.reject(mapAxiosError(error));
  },
);
