import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL - ganti dengan URL backend Anda
const API_URL = 'https://belajar-indo.vercel.app';

/**
 * Helper untuk membuat request dengan autentikasi
 */
const makeRequest = async (endpoint, options = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
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
    return { ok: false, error: error.message };
  }
};

/**
 * Auth Services
 */
export const authService = {
  // Register user baru
  register: async (name, email, password) => {
    return makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  // Login user
  login: async (email, password) => {
    const result = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.ok && result.data.token) {
      // Simpan token dan user data
      await AsyncStorage.setItem('token', result.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
    }
    
    return result;
  },
  
  // Logout user
  logout: async () => {
    await makeRequest('/api/auth/logout', { method: 'POST' });
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: async () => {
    return makeRequest('/api/auth/me', { method: 'GET' });
  },
};

/**
 * Quiz Services
 */
export const quizService = {
  // Submit quiz result
  submitQuiz: async (quizData) => {
    return makeRequest('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },
  
  // Get quiz results/history
  getResults: async () => {
    return makeRequest('/api/quiz/results', { method: 'GET' });
  },
  
  // Get quiz statistics
  getStats: async () => {
    return makeRequest('/api/quiz/stats', { method: 'GET' });
  },
  
  // Save quiz progress
  saveProgress: async (progressData) => {
    return makeRequest('/api/quiz/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },
  
  // Get quiz progress
  getProgress: async () => {
    return makeRequest('/api/quiz/progress', { method: 'GET' });
  },
};

/**
 * Vocabulary Services
 */
export const vocabService = {
  // Save vocabulary progress
  saveProgress: async (progressData) => {
    return makeRequest('/api/vocab/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },
  
  // Get vocabulary progress
  getProgress: async () => {
    return makeRequest('/api/vocab/progress', { method: 'GET' });
  },
};

/**
 * Health Check
 */
export const healthCheck = async () => {
  return makeRequest('/api/health', { method: 'GET' });
};

export { API_URL };
