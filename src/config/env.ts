import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Type-safe environment configuration
interface AppConfig {
  apiUrl: string;
  appEnv: 'dev' | 'staging' | 'prod';
}

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<AppConfig>;

const DEFAULT_DEV_API_PORT = '3000';

/** Removes trailing slashes so the base URL concatenates predictably with paths. */
function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/**
 * Host of the machine running the Metro bundler, parsed from Expo's hostUri
 * (e.g. "192.168.1.117:8081" -> "192.168.1.117"). Lets a physical device in dev
 * reach the backend on the bundler's machine without hardcoding a LAN IP.
 */
function getMetroHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost;
  if (!hostUri) return null;
  // Strip an optional scheme ("exp://") and the ":port" suffix.
  const host = hostUri.replace(/^[a-z]+:\/\//i, '').split(':')[0];
  return host || null;
}

/**
 * Resolves the API base URL, in order of precedence:
 *   1. EXPO_PUBLIC_API_URL — explicit override, honored in every build.
 *   2. Dev — the Metro bundler's host, so a device/emulator hits your local backend.
 *   3. extra.apiUrl — the per-environment URL baked in by app.config.ts
 *      (e.g. https://groupcoin.onrender.com in prod).
 *   4. Localhost fallbacks.
 */
function resolveApiUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) {
    return normalizeUrl(explicit);
  }

  if (__DEV__) {
    const metroHost = getMetroHost();
    if (metroHost) {
      return `http://${metroHost}:${DEFAULT_DEV_API_PORT}`;
    }
    // The Android emulator reaches the host machine via 10.0.2.2, not localhost.
    if (Platform.OS === 'android' && !Constants.isDevice) {
      return `http://10.0.2.2:${DEFAULT_DEV_API_PORT}`;
    }
    return `http://localhost:${DEFAULT_DEV_API_PORT}`;
  }

  if (extra.apiUrl) {
    return normalizeUrl(String(extra.apiUrl));
  }

  if (Platform.OS === 'android' && !Constants.isDevice) {
    return `http://10.0.2.2:${DEFAULT_DEV_API_PORT}`;
  }

  return `http://localhost:${DEFAULT_DEV_API_PORT}`;
}

export const env: AppConfig = {
  apiUrl: resolveApiUrl(),
  appEnv: extra.appEnv ?? 'dev',
};

if (__DEV__) {
  // Surfaces the resolved base URL in the Metro console so connection issues
  // are easy to diagnose. Remove once the connection is confirmed working.
  console.log('[env] apiUrl =', env.apiUrl);
}

// Environment checks
export const isDev = env.appEnv === 'dev';
export const isStaging = env.appEnv === 'staging';
export const isProd = env.appEnv === 'prod';
