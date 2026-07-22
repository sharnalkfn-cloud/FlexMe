import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { onAuthStateChanged } from '@/services/firebase';
import { isOnboardingComplete } from '@/services/onboarding';

type AuthState = 'loading' | 'signed-in' | 'signed-out';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setAuthState(user ? 'signed-in' : 'signed-out');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    isOnboardingComplete().then(setOnboardingComplete);
  }, []);

  useEffect(() => {
    if (authState === 'loading' || onboardingComplete === null) return;
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    if (!onboardingComplete) {
      router.replace('/(onboarding)/index');
    } else if (authState === 'signed-out') {
      router.replace('/(onboarding)/auth');
    } else {
      router.replace('/(tabs)/explore');
    }
  }, [authState, onboardingComplete, router, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scene/[id]" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
