import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL - sesuaikan dengan URL backend Anda
const API_URL = 'https://belajar-indo.vercel.app';

interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

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
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Auth Services
 */
export const authService = {
  // Register user baru
  register: async (name: string, email: string, password: string): Promise<ApiResponse> => {
    return makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  // Login user
  login: async (email: string, password: string): Promise<ApiResponse> => {
    const result = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.ok && result.data?.token) {
      // Simpan token dan user data
      await AsyncStorage.setItem('token', result.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
    }
    
    return result;
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    await makeRequest('/api/auth/logout', { method: 'POST' });
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: async (): Promise<ApiResponse> => {
    return makeRequest('/api/auth/me', { method: 'GET' });
  },
};

/**
 * Quiz Services
 */
export const quizService = {
  // Submit quiz result
  submitQuiz: async (quizData: {
    quizType: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  }): Promise<ApiResponse> => {
    return makeRequest('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },
  
  // Get quiz results/history
  getResults: async (): Promise<ApiResponse> => {
    return makeRequest('/api/quiz/results', { method: 'GET' });
  },
  
  // Get quiz statistics
  getStats: async (): Promise<ApiResponse> => {
    return makeRequest('/api/quiz/stats', { method: 'GET' });
  },
  
  // Save quiz progress
  saveProgress: async (progressData: {
    quizCategory: string;
    progress: number;
    currentQuestion: number;
  }): Promise<ApiResponse> => {
    return makeRequest('/api/quiz/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },
  
  // Get quiz progress
  getProgress: async (): Promise<ApiResponse> => {
    return makeRequest('/api/quiz/progress', { method: 'GET' });
  },
};

/**
 * Vocabulary Services
 */
export const vocabService = {
  // Save vocabulary progress
  saveProgress: async (progressData: {
    quizCategory: string;
    progress: number;
    currentQuestion: number;
  }): Promise<ApiResponse> => {
    return makeRequest('/api/vocab/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },
  
  // Get vocabulary progress
  getProgress: async (): Promise<ApiResponse> => {
    return makeRequest('/api/vocab/progress', { method: 'GET' });
  },
};

/**
 * Health Check
 */
export const healthCheck = async (): Promise<ApiResponse> => {
  return makeRequest('/api/health', { method: 'GET' });
};

export { API_URL };