import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV || 'dev';

  const baseConfig = {
    ...config,
    name: 'GroupCoin',
    slug: 'groupcoin-mobile',
    owner: 'giska1923',
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
        // Same source as the iOS icon. logo.png already has its padding/black
        // border baked in, so it sits inside the adaptive-icon safe zone.
        foregroundImage: './assets/logo.png',
        backgroundColor: '#000000',
        // monochromeImage requires assets/android-icon-monochrome.png, which
        // isn't in the repo — re-add the line once that asset exists.
      },
      package: getBundleId(appEnv),
      // FCM config for push notifications. Contains entries for all three
      // package names (dev/staging/prod), so one file covers every profile.
      googleServicesFile: './google-services.json',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-notifications',
        {
          defaultChannel: 'groupcoin-default',
          enableBackgroundRemoteNotifications: true,
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        // iOS needs the reversed-client-ID URL scheme to receive the OAuth
        // callback. Derived from the iOS client ID so there's a single source.
        { iosUrlScheme: getGoogleIosUrlScheme() },
      ],
    ],
    extra: {
      apiUrl: getApiUrl(appEnv),
      appEnv,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      eas: {
        // The EAS project ID powers Expo push tokens and `eas` CLI linking.
        // Literal default (overridable by env) so it's always statically
        // readable — required for the dynamic config to resolve and to stop
        // `eas` commands from trying to re-link the project.
        projectId:
          process.env.EAS_PROJECT_ID ??
          'a2a9de89-30f2-4b6a-804e-2c409a08d776',
      },
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

/**
 * Builds the iOS URL scheme the Google plugin needs from the iOS client ID.
 * An iOS client ID like "1234-abc.apps.googleusercontent.com" maps to the
 * reversed scheme "com.googleusercontent.apps.1234-abc". Falls back to a
 * harmless placeholder when the ID isn't configured so prebuild never crashes.
 */
function getGoogleIosUrlScheme(): string {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const suffix = '.apps.googleusercontent.com';
  if (iosClientId && iosClientId.endsWith(suffix)) {
    const id = iosClientId.slice(0, -suffix.length);
    return `com.googleusercontent.apps.${id}`;
  }
  return 'com.googleusercontent.apps.placeholder';
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
