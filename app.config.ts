import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV || 'dev';

  const baseConfig = {
    ...config,
    name: 'GroupCoin',
    slug: 'groupcoin-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0ea5e9',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: getBundleId(appEnv),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: getBundleId(appEnv),
    },
    web: {
      favicon: './assets/favicon.png',
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
  switch (env) {
    case 'prod':
      return 'https://api.groupcoin.com';
    case 'staging':
      return 'https://staging-api.groupcoin.com';
    default:
      return 'http://10.0.2.2:3000';
  }
}
