import { BlurView } from 'expo-blur';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius } from '@/constants/colors';

interface GlassCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  radius?: number;
  onPress?: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  style,
  intensity = 60,
  radius = Radius.card,
  onPress,
  disabled,
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
  }, [scale]);

  const content = (
    <View style={[styles.wrapper, { borderRadius: radius }, style]}>
      {Platform.OS === 'web' ? (
        // Safari breaks backdrop-filter when any ancestor has a CSS
        // transform (react-navigation's screen containers do), rendering
        // it as opaque white instead of blurring. Use a flat translucent
        // fill on web instead of relying on BlurView there.
        <View style={[StyleSheet.absoluteFillObject, styles.webGlassFallback, { borderRadius: radius }]} />
      ) : (
        <BlurView
          tint="dark"
          intensity={intensity}
          style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}>
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  webGlassFallback: {
    backgroundColor: 'rgba(10,10,16,0.72)',
  },
  content: {
    width: '100%',
  },
});

export default GlassCard;
