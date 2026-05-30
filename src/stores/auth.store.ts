import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { UserDTO } from '../types/api';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  setSession: (user: UserDTO, token: string) => Promise<void>;
  clearSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  status: 'loading',

  setSession: async (user: UserDTO, token: string) => {
    try {
      // Store in secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      
      // Update state
      set({ user, token, status: 'authenticated' });
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  clearSession: async () => {
    try {
      // Remove from secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      
      // Update state
      set({ user: null, token: null, status: 'anonymous' });
    } catch (error) {
      console.error('Failed to clear session:', error);
      // Still update state even if storage fails
      set({ user: null, token: null, status: 'anonymous' });
    }
  },

  initializeAuth: async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson) as UserDTO;
        set({ user, token, status: 'authenticated' });
      } else {
        set({ status: 'anonymous' });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ status: 'anonymous' });
    }
  },
}));