import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Gradients } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700 });
    scale.value = withTiming(1, { duration: 700 });
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [opacity, router, scale, taglineOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.ambientPurple}
        style={[styles.glow, styles.glowTop]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={Gradients.ambientBlue}
        style={[styles.glow, styles.glowBottom]}
        pointerEvents="none"
      />
      <Animated.View style={logoStyle}>
        <Text style={styles.logo}>FlexMe</Text>
      </Animated.View>
      <Animated.View style={taglineStyle}>
        <Text style={styles.tagline}>YOUR FACE · ANY PLACE</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  glowTop: {
    top: -120,
    left: -80,
  },
  glowBottom: {
    bottom: -140,
    right: -100,
  },
  logo: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
