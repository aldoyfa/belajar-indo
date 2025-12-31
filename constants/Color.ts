/**
 * Color constants untuk seluruh aplikasi
 * Digunakan untuk konsistensi warna di semua komponen
 */

export const Colors = {
  // Primary colors
  primary: '#667eea',
  primaryLight: '#8b9eef',
  primaryDark: '#5568d3',

  // Secondary colors
  secondary: '#764ba2',
  secondaryLight: '#9b6bb4',
  secondaryDark: '#5a3788',

  // Gradients
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
  gradientAlt1: '#f093fb',
  gradientAlt2: '#f5576c',

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  grayDark: '#374151',

  // Semantic colors
  success: '#10b981',
  successLight: '#d1fae5',
  error: '#ef4444',
  errorLight: '#fee2e2',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Background colors
  background: '#f4f6fb',
  backgroundCard: '#ffffff',
  border: '#e5e7eb',

  // Text colors
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textWhite: '#ffffff',

  // Tab colors
  tabInactive: '#9ca3af',
  tabActive: '#667eea',

  // Button colors
  buttonDefault: '#667eea',
  buttonDisabled: '#d1d5db',
  buttonHover: '#5568d3',
};

export type ColorKey = keyof typeof Colors;
