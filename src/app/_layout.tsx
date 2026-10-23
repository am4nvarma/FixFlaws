import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAuthListener } from '../hooks/useAuthListener';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isLoggedIn } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useAuthListener();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to sign-in if not logged in
      router.replace('/(auth)/sign-in');
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to main app if logged in
      router.replace('/(tabs)/jobs');
    }
  }, [isLoggedIn, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Expo Router automatically discovers (auth) and (tabs) now */}
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}