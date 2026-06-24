import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV || 'dev';

  const baseConfig = {
    ...config,
    name: 'GroupCoin',
    slug: 'groupcoin-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/logo.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/nobg.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: getBundleId(appEnv),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/nobg.png',
        backgroundColor: '#000000',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: getBundleId(appEnv),
    },
    plugins: ['expo-router', 'expo-secure-store'],
    extra: {
      apiUrl: getApiUrl(appEnv),
      appEnv,
    },
  } as ExpoConfig;

  return baseConfig;
};

function getBundleId(env: string): string {
  const base = 'com.groupcoin.mobile';
  switch (env) {
    case 'prod':
      return base;
    case 'staging':
      return `${base}.staging`;
    default:
      return `${base}.dev`;
  }
}

function getApiUrl(env: string): string {
  // A build-time override always wins, regardless of environment.
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) {
    return override;
  }

  switch (env) {
    case 'prod':
    case 'staging':
      // Single Render deployment serves both tiers for now; split this out
      // once a dedicated staging service exists.
      return 'https://groupcoin.onrender.com';
    default:
      return 'http://localhost:3000';
  }
}
