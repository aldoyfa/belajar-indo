/**
 * Type definitions untuk seluruh aplikasi
 */

// ============ AUTH TYPES ============
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthResponse {
  ok: boolean;
  data?: {
    user?: User;
    token?: string;
    refreshToken?: string;
  };
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ============ API TYPES ============
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  message?: string;
}

// ============ QUIZ TYPES ============
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSubmission {
  quizType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: number[]; // Index of selected answers
}

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  category: string;
  completedAt: string;
  percentage: number;
}

export interface QuizProgress {
  quizCategory: string;
  progress: number; // 0-100
  currentQuestion: number;
  answeredQuestions: number;
  lastUpdated: string;
}

export interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number;
  byCategory: {
    [category: string]: {
      count: number;
      averageScore: number;
      highestScore: number;
    };
  };
}

// ============ VOCABULARY TYPES ============
export interface VocabularyCard {
  id: string;
  indonesian: string;
  english: string;
  pronunciation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
  example?: string;
}

export interface VocabProgress {
  quizCategory: string;
  progress: number; // 0-100
  currentQuestion: number;
  learnedCards: string[]; // IDs of learned cards
  lastUpdated: string;
}

// ============ COMPONENT TYPES ============
export interface CardProps {
  title: string;
  description: string;
  icon?: string;
  onPress?: () => void;
  gradient?: string[];
}

export interface ModalProps {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  onConfirm?: () => void;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

// ============ NAVIGATION TYPES ============
export interface TabNavigationParams {
  index: {
    params?: {};
  };
  vocabulary: {
    params?: {};
  };
  quiz: {
    params?: {};
  };
  profile: {
    params?: {};
  };
  lab?: {
    params?: {};
  };
}

// ============ ERROR TYPES ============
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}
