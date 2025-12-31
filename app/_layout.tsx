import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after app loads
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#f4f6fb' }
      }}
    >
      {/* Entry point - auth check */}
      <Stack.Screen name="index" />
      
      {/* Auth screens group */}
      <Stack.Screen name="(auth)" />
      
      {/* Main app screens (tabs) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}