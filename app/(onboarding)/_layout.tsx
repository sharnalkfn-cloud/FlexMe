import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade',
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="face-scan" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="trial" />
    </Stack>
  );
}
