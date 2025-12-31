/**
 * Authentication Service
 * Mengelola semua operasi autentikasi
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
} from '../types';

const API_URL = 'https://belajar-indo.vercel.app';
const AUTH_TOKEN_KEY = 'token';
const USER_DATA_KEY = 'user';

/**
 * Helper untuk membuat request dengan autentikasi
 */
const makeRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge dengan additional headers
    const finalHeaders: HeadersInit = {
      ...headers,
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: finalHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return { ok: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Auth Service object dengan semua auth-related methods
 */
export const authService = {
  /**
   * Register user baru
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const result = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.ok && result.data?.token) {
      // Simpan token dan user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
      if (result.data.user) {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(result.data.user));
      }
    }

    return {
      ok: result.ok,
      data: result.data,
      error: result.error,
    };
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const result = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.ok && result.data?.token) {
      // Simpan token dan user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
      if (result.data.user) {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(result.data.user));
      }
    }

    return {
      ok: result.ok,
      data: result.data,
      error: result.error,
    };
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await makeRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request error:', error);
    } finally {
      // Selalu hapus token dan user data dari storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    }
  },

  /**
   * Get current user dari storage
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get auth token dari storage
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Check jika user sudah login
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  /**
   * Refresh user data dari server
   */
  refreshUserData: async (): Promise<User | null> => {
    try {
      const result = await makeRequest<{ user: User }>('/api/auth/me', {
        method: 'GET',
      });

      if (result.ok && result.data?.user) {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(result.data.user));
        return result.data.user;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  },

  /**
   * Clear semua auth data (digunakan untuk reset/clear app)
   */
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};

export { API_URL };
