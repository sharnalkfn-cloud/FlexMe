import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { Colors, Gradients, Radius } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: readonly [string, string];
}

const FEATURES: Feature[] = [
  {
    icon: '🌍',
    title: 'Any Scene',
    description: 'Drop yourself into Dubai supercars, private jets, or the Amalfi Coast in seconds.',
    gradient: Gradients.purpleBlue,
  },
  {
    icon: '✨',
    title: 'Ultra Realistic',
    description: 'Your exact face, reproduced 1:1 with photorealistic lighting and no AI look.',
    gradient: Gradients.violetBlue,
  },
  {
    icon: '⚡',
    title: 'Instant Share',
    description: 'Generate, download, and share stunning photos ready for your feed.',
    gradient: Gradients.gold,
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setIndex(newIndex);
  }, []);

  const handleSkip = useCallback(() => {
    router.push('/face-scan');
  }, [router]);

  const handleGetStarted = useCallback(() => {
    router.push('/face-scan');
  }, [router]);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Welcome to FlexMe</Text>
        <Text style={styles.subtitle}>Everything you need to flex, in one app.</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.carousel}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={{ width: CARD_WIDTH }}>
            <GlassCard style={styles.card}>
              <LinearGradient colors={feature.gradient} style={styles.iconCircle}>
                <Text style={styles.iconText}>{feature.icon}</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </GlassCard>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {FEATURES.map((feature, i) => (
          <View key={feature.title} style={[styles.dot, i === index ? styles.dotActive : null]} />
        ))}
      </View>

      <Pressable
        style={[styles.ctaButton, { marginBottom: insets.bottom + 24 }]}
        onPress={handleGetStarted}>
        <Text style={styles.ctaText}>Get Started</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    marginBottom: 24,
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
  carousel: {
    paddingHorizontal: 24,
  },
  card: {
    padding: 28,
    alignItems: 'flex-start',
    minHeight: 260,
    marginRight: 0,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 26,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.accent,
  },
  ctaButton: {
    marginTop: 'auto',
    marginHorizontal: 24,
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    borderRadius: Radius.button,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08080c',
  },
});
