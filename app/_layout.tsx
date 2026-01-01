import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from './contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

// 1. Kita pisahkan logika "Satpam" ke komponen internal
function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Jangan lakukan apa-apa kalau Context masih loading data dari storage
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Satpam tendang ke Login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Satpam antar ke Home
      router.replace('/(tabs)');
    }

    // Hilangkan splash screen kalau semua sudah siap
    SplashScreen.hideAsync();
  }, [isAuthenticated, segments, loading]);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#f4f6fb' }
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// 2. Default export yang membungkus AuthGuard dengan Provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}