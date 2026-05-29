import Constants from 'expo-constants';

// Type-safe environment configuration
interface AppConfig {
  apiUrl: string;
  appEnv: 'dev' | 'staging' | 'prod';
}

const extra = Constants.expoConfig?.extra || {};

export const env: AppConfig = {
  apiUrl: extra.apiUrl || 'http://localhost:3000',
  appEnv: extra.appEnv || 'dev',
};

// Environment checks
export const isDev = env.appEnv === 'dev';
export const isStaging = env.appEnv === 'staging';
export const isProd = env.appEnv === 'prod';