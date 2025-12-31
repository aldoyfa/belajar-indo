/**
 * Lab Services
 * Service untuk mengelola virtual lab operations dan data
 * Siap untuk implementasi di masa depan
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types';

const API_URL = 'https://belajar-indo.vercel.app';

/**
 * Helper untuk membuat request dengan autentikasi
 */
const makeRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = await AsyncStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
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
 * Lab Service - untuk virtual lab operations
 * Fitur ini sedang dalam tahap perencanaan
 */
export const labService = {
  /**
   * Get list of available lab modules
   */
  getModules: async (): Promise<ApiResponse> => {
    return makeRequest('/api/lab/modules', { method: 'GET' });
  },

  /**
   * Get detail dari sebuah lab module
   */
  getModuleDetail: async (moduleId: string): Promise<ApiResponse> => {
    return makeRequest(`/api/lab/modules/${moduleId}`, { method: 'GET' });
  },

  /**
   * Submit lab experiment result
   */
  submitExperiment: async (data: {
    moduleId: string;
    experimentData: Record<string, any>;
  }): Promise<ApiResponse> => {
    return makeRequest('/api/lab/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get lab progress untuk user
   */
  getProgress: async (): Promise<ApiResponse> => {
    return makeRequest('/api/lab/progress', { method: 'GET' });
  },

  /**
   * Save lab progress
   */
  saveProgress: async (data: {
    moduleId: string;
    progress: number;
    experimentStep: number;
  }): Promise<ApiResponse> => {
    return makeRequest('/api/lab/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get lab statistics
   */
  getStats: async (): Promise<ApiResponse> => {
    return makeRequest('/api/lab/stats', { method: 'GET' });
  },
};

export { API_URL };
