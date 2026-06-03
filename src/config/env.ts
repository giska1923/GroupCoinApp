import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Type-safe environment configuration
interface AppConfig {
  apiUrl: string;
  appEnv: 'dev' | 'staging' | 'prod';
}

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<AppConfig>;

const DEV_API_URL = '192.168.1.117';
const DEFAULT_DEV_API_PORT = '3000';

/** Metro dev-server host (e.g. 192.168.1.117 from exp://192.168.1.117:8081). */
function hasMetroHost(): boolean {
  const hostUri = Constants.expoConfig?.hostUri;
  return !!hostUri;
}

/**
 * Resolves the API base URL. In dev, prefer the Metro host so the app always
 * targets the same machine as the bundler (avoids stale 10.0.2.2 / localhost in extra).
 */
function resolveApiUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  if (__DEV__) {
    if (hasMetroHost()) {
      const isAndroidEmulator =
        Platform.OS === 'android' &&
        !Constants.isDevice &&
        (DEV_API_URL === 'localhost' || DEV_API_URL === '127.0.0.1');

      if (isAndroidEmulator) {
        return `http://10.0.2.2:${DEFAULT_DEV_API_PORT}`;
      }

      return `http://${DEV_API_URL}:${DEFAULT_DEV_API_PORT}`;
    }
  }

  if (extra.apiUrl) {
    let url = String(extra.apiUrl).replace(/\/$/, '');
    if (
      hasMetroHost() &&
      (url.includes('localhost') || url.includes('127.0.0.1'))
    ) {
      url = url.replace(/localhost|127\.0\.0\.1/g, DEV_API_URL);
    }
    return url;
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

// Environment checks
export const isDev = env.appEnv === 'dev';
export const isStaging = env.appEnv === 'staging';
export const isProd = env.appEnv === 'prod';
