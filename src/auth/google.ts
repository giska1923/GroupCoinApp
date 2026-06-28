import { Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { env } from '../config/env';

/** Thrown by signInWithGoogle so callers can branch on why it failed. */
export class GoogleSignInError extends Error {
  constructor(
    message: string,
    /** 'CANCELLED' is a normal user action and should be shown as an error. */
    public readonly code: 'CANCELLED' | 'NOT_CONFIGURED' | 'FAILED',
  ) {
    super(message);
    this.name = 'GoogleSignInError';
  }
}

let configured = false;

/**
 * Configures the native Google client once. Safe to call repeatedly. webClientId
 * is what makes Android return an ID token; iosClientId drives the iOS flow.
 */
export function configureGoogleSignin(): void {
  if (configured) return;
  if (!env.googleWebClientId) return; // configured lazily once IDs exist

  GoogleSignin.configure({
    webClientId: env.googleWebClientId,
    iosClientId: env.googleIosClientId,
    // We only need identity; no server-side Google API access.
    offlineAccess: false,
  });
  configured = true;
}

/**
 * Runs the native Google sign-in flow and returns the OpenID Connect ID token
 * to hand to our backend. Throws a typed GoogleSignInError on cancel/failure.
 */
export async function signInWithGoogle(): Promise<string> {
  if (!env.googleWebClientId) {
    throw new GoogleSignInError(
      'Google sign-in is not configured.',
      'NOT_CONFIGURED',
    );
  }

  configureGoogleSignin();

  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      throw new GoogleSignInError('Sign-in was cancelled.', 'CANCELLED');
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new GoogleSignInError(
        'Google did not return an ID token.',
        'FAILED',
      );
    }
    return idToken;
  } catch (error) {
    if (error instanceof GoogleSignInError) throw error;

    // Map the library's native status codes to our typed error.
    const code = (error as { code?: string } | null)?.code;
    if (code === statusCodes.SIGN_IN_CANCELLED) {
      throw new GoogleSignInError('Sign-in was cancelled.', 'CANCELLED');
    }
    if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new GoogleSignInError(
        'Google Play Services is unavailable or outdated.',
        'FAILED',
      );
    }
    // DEVELOPER_ERROR (Android code "10"/"DEVELOPER_ERROR") means the app's
    // package name + signing SHA-1 don't match an Android OAuth client in
    // Google Cloud Console, or the webClientId is wrong.
    if (code === 'DEVELOPER_ERROR' || code === '10') {
      throw new GoogleSignInError(
        __DEV__
          ? 'Google sign-in is misconfigured (DEVELOPER_ERROR): the app package/SHA-1 has no matching Android OAuth client, or the webClientId is wrong.'
          : 'Could not sign in with Google. Please try again.',
        'FAILED',
      );
    }
    throw new GoogleSignInError(
      // Surface the raw native code in dev so failures are diagnosable.
      __DEV__ && code
        ? `Could not sign in with Google (code: ${code}).`
        : 'Could not sign in with Google. Please try again.',
      'FAILED',
    );
  }
}

/** Clears the cached native Google session (used on logout). */
export async function signOutFromGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Best effort; the local app session is cleared regardless.
  }
}
