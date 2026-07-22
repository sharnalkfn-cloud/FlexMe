import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { Colors, Gradients, Radius } from '@/constants/colors';
import { useSubscription } from '@/hooks/useSubscription';
import { markOnboardingComplete } from '@/services/onboarding';

const FEATURES = [
  'Unlimited generations',
  'All scenes unlocked',
  'No watermark',
  'Priority generation',
];

export default function TrialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { startTrial, purchasing, error } = useSubscription();
  const [localError, setLocalError] = useState<string | null>(null);

  const finish = useCallback(async () => {
    await markOnboardingComplete();
    router.replace('/(tabs)/explore');
  }, [router]);

  const handleStartTrial = useCallback(async () => {
    setLocalError(null);
    const result = await startTrial();
    if (result) {
      await finish();
    } else {
      setLocalError('Could not start trial. You can try again from your profile.');
    }
  }, [finish, startTrial]);

  const handleMaybeLater = useCallback(() => {
    finish();
  }, [finish]);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Start Your Free Trial</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3 DAYS FREE</Text>
        </View>
      </View>

      <GlassCard style={styles.featuresCard}>
        {FEATURES.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </GlassCard>

      <Text style={styles.priceText}>Then 3.99€/week. Cancel anytime.</Text>

      {(error || localError) && <Text style={styles.errorText}>{error ?? localError}</Text>}

      <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
        <Pressable onPress={handleStartTrial} disabled={purchasing}>
          <LinearGradient colors={Gradients.gold} style={styles.ctaButton}>
            <Text style={styles.ctaText}>
              {purchasing ? 'Starting…' : 'Start Free Trial'}
            </Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={handleMaybeLater} disabled={purchasing}>
          <Text style={styles.laterText}>Maybe later</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  badge: {
    marginTop: 16,
    backgroundColor: 'rgba(232,184,75,0.16)',
    borderWidth: 0.5,
    borderColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  badgeText: {
    color: Colors.gold,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  featuresCard: {
    padding: 20,
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmark: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  featureText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  priceText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: Colors.red,
    fontSize: 13,
    marginTop: 12,
  },
  footer: {
    gap: 16,
  },
  ctaButton: {
    paddingVertical: 18,
    borderRadius: Radius.button,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08080c',
  },
  laterText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
