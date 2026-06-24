import axios from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../stores/auth.store';
import { mapAxiosError } from './errors';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  // Generous timeout to tolerate Render free-tier cold starts (~30s spin-up
  // after inactivity) on the first request.
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

// Normalize errors and force-logout on 401 from anywhere.
apiClient.interceptors.response.use(
  response => response,
  error => {
    const mapped = mapAxiosError(error);
    if (mapped.statusCode === 401) {
      void useAuthStore.getState().clearSession();
    }
    return Promise.reject(mapped);
  },
);
