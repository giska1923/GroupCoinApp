import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { UserDTO } from '../types/api';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  refreshToken: string | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  setSession: (
    user: UserDTO,
    token: string,
    refreshToken: string,
  ) => Promise<void>;
  /** Updates just the tokens after a silent refresh, keeping the user. */
  setTokens: (token: string, refreshToken: string) => Promise<void>;
  /** Updates the cached user (e.g. after a profile edit), keeping tokens. */
  setUser: (user: UserDTO) => Promise<void>;
  clearSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  status: 'loading',

  setSession: async (user: UserDTO, token: string, refreshToken: string) => {
    try {
      // Store in secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      // Update state
      set({ user, token, refreshToken, status: 'authenticated' });
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  setTokens: async (token: string, refreshToken: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      set({ token, refreshToken });
    } catch (error) {
      console.error('Failed to save refreshed tokens:', error);
    }
  },

  setUser: async (user: UserDTO) => {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  },

  clearSession: async () => {
    try {
      // Remove from secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      // Update state
      set({ user: null, token: null, refreshToken: null, status: 'anonymous' });
    } catch (error) {
      console.error('Failed to clear session:', error);
      // Still update state even if storage fails
      set({ user: null, token: null, refreshToken: null, status: 'anonymous' });
    }
  },

  initializeAuth: async () => {
    try {
      const [token, refreshToken, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (token && refreshToken && userJson) {
        const user = JSON.parse(userJson) as UserDTO;
        set({ user, token, refreshToken, status: 'authenticated' });
      } else {
        set({ status: 'anonymous' });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ status: 'anonymous' });
    }
  },
}));
