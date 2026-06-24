import * as SecureStore from 'expo-secure-store';
import { PUSH_TOKEN_STORAGE_KEY } from './constants';

export async function getStoredPushToken(): Promise<string | null> {
  return SecureStore.getItemAsync(PUSH_TOKEN_STORAGE_KEY);
}

export async function storePushToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(PUSH_TOKEN_STORAGE_KEY, token);
}

export async function clearStoredPushToken(): Promise<void> {
  await SecureStore.deleteItemAsync(PUSH_TOKEN_STORAGE_KEY);
}
