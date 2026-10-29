import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useAuthListener } from '../hooks/useAuthListener';

const queryClient = new QueryClient();

export default function RootLayout() {
  // 1. Grab isInitializing from Zustand
  const { isLoggedIn, isInitializing } = useAuthStore(); 
  const segments = useSegments();
  const router = useRouter();

  useAuthListener();

  useEffect(() => {
    if (isInitializing) return; // Wait until Supabase finishes checking!

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)/jobs');
    }
  }, [isLoggedIn, segments, isInitializing]);

  // 2. Show a full-screen spinner while checking the session
  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#006064" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}