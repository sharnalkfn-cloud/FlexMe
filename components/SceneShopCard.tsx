import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Gradients, Radius } from '@/constants/colors';
import type { Scene } from '@/constants/scenes';

interface SceneShopCardProps {
  scene: Scene;
  onPress: (scene: Scene) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BADGE_STYLES: Record<string, { background: string; text: string }> = {
  NEW: { background: Colors.green, text: '#08120c' },
  HOT: { background: Colors.red, text: '#ffffff' },
};

function SceneShopCardComponent({ scene, onPress }: SceneShopCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.96, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress(scene);
  }, [onPress, scene]);

  const badge = scene.badge ? BADGE_STYLES[scene.badge] : null;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.flexItem, animatedStyle]}>
      <LinearGradient colors={scene.bgColors} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badge.background }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{scene.badge}</Text>
          </View>
        )}
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{scene.emoji}</Text>
        </View>
        <LinearGradient colors={Gradients.cardOverlay} style={styles.overlay}>
          <Text style={styles.name} numberOfLines={1}>
            Photo IA
          </Text>
          <View style={styles.priceRow}>
            <Ionicons name="logo-bitcoin" size={12} color={Colors.gold} />
            <Text style={styles.priceText}>{scene.credits} CRÉDITS</Text>
          </View>
        </LinearGradient>
      </LinearGradient>
    </AnimatedPressable>
  );
}

export const SceneShopCard = memo(SceneShopCardComponent);

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
    height: 190,
  },
  card: {
    flex: 1,
    borderRadius: Radius.card,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  emojiWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 44,
  },
  overlay: {
    paddingHorizontal: 12,
    paddingTop: 30,
    paddingBottom: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
  },
});

export default SceneShopCard;
