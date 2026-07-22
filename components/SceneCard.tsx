import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Gradients, Radius } from '@/constants/colors';
import { getSceneImageSource } from '@/constants/sceneImages';
import type { AnyScene } from '@/constants/scenes';

interface SceneCardProps {
  scene: AnyScene;
  onPress: (scene: AnyScene) => void;
  width?: number;
  height?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BADGE_COLORS: Record<string, string> = {
  NEW: Colors.green,
  PRO: Colors.gold,
  HOT: Colors.red,
};

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`;
  }
  return `${views}`;
}

function SceneCardComponent({ scene, onPress, width, height = 150 }: SceneCardProps) {
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

  const handlePress = useCallback(() => {
    onPress(scene);
  }, [onPress, scene]);

  const imageSource = getSceneImageSource(scene.id);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, width ? { width } : styles.flexItem, { height }]}>
      <LinearGradient
        colors={scene.bgColors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {scene.badge && (
          <View style={[styles.badge, { backgroundColor: BADGE_COLORS[scene.badge] }]}>
            <Text style={styles.badgeText}>{scene.badge}</Text>
          </View>
        )}
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{scene.emoji}</Text>
          </View>
        )}
        <LinearGradient colors={Gradients.cardOverlay} style={styles.overlay}>
          <Text style={styles.name} numberOfLines={1}>
            {scene.name}
          </Text>
          <View style={styles.bottomRow}>
            <Text style={styles.location} numberOfLines={1}>
              {scene.location}
            </Text>
            <Text style={styles.views}>{formatViews(scene.views)}</Text>
          </View>
        </LinearGradient>
      </LinearGradient>
    </AnimatedPressable>
  );
}

export const SceneCard = memo(SceneCardComponent);

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: Radius.card - 4,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#08080c',
  },
  emojiWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    paddingHorizontal: 10,
    paddingTop: 24,
    paddingBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 10,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  views: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});

export default SceneCard;
