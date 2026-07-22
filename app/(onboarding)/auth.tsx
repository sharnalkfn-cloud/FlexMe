import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { signInWithAppleCredential, signInWithGoogleIdToken } from '@/services/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  const goToTrial = useCallback(() => {
    router.push('/trial');
  }, [router]);

  useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.authentication?.idToken) {
      setBusy(true);
      signInWithGoogleIdToken(googleResponse.authentication.idToken)
        .then(goToTrial)
        .catch((err) => setError(err instanceof Error ? err.message : 'Google sign-in failed.'))
        .finally(() => setBusy(false));
    }
  }, [goToTrial, googleResponse]);

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    await promptGoogleAsync();
  }, [promptGoogleAsync]);

  const handleAppleSignIn = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        await signInWithAppleCredential(credential.identityToken);
        goToTrial();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apple sign-in failed.');
    } finally {
      setBusy(false);
    }
  }, [goToTrial]);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Join FlexMe</Text>
        <Text style={styles.subtitle}>Save your photos and access all scenes</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable onPress={handleGoogleSignIn} disabled={busy}>
          <GlassCard style={styles.authButtonCard}>
            <View style={styles.authButtonRow}>
              <Ionicons name="logo-google" size={20} color={Colors.textPrimary} />
              <Text style={styles.authButtonText}>Continue with Google</Text>
            </View>
          </GlassCard>
        </Pressable>

        {(appleAvailable || Platform.OS === 'ios') && (
          <Pressable onPress={handleAppleSignIn} disabled={busy}>
            <GlassCard style={styles.authButtonCard}>
              <View style={styles.authButtonRow}>
                <Ionicons name="logo-apple" size={22} color={Colors.textPrimary} />
                <Text style={styles.authButtonText}>Continue with Apple</Text>
              </View>
            </GlassCard>
          </Pressable>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <Text style={[styles.privacyText, { marginBottom: insets.bottom + 20 }]}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
  },
  buttons: {
    gap: 14,
  },
  authButtonCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  authButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  authButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  privacyText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
