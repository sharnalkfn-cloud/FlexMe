import { Ionicons } from '@expo/vector-icons';
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

interface MasonrySceneCardProps {
  scene: AnyScene;
  height: number;
  onPress: (scene: AnyScene) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BADGE_COLORS: Record<string, string> = {
  NEW: Colors.green,
  PRO: Colors.gold,
  HOT: Colors.red,
};

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return `${count}`;
}

function MasonrySceneCardComponent({ scene, height, onPress }: MasonrySceneCardProps) {
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

  const likes = Math.round(scene.views * 0.045);
  const comments = Math.round(scene.views * 0.012);
  const imageSource = getSceneImageSource(scene.id);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, { height }]}>
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
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Ionicons name="heart" size={10} color={Colors.textPrimary} />
              <Text style={styles.statPillText}>{formatCount(likes)}</Text>
            </View>
            <View style={styles.statPill}>
              <Ionicons name="chatbubble" size={10} color={Colors.textPrimary} />
              <Text style={styles.statPillText}>{formatCount(comments)}</Text>
            </View>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {scene.name}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {scene.location}
          </Text>
        </LinearGradient>
      </LinearGradient>
    </AnimatedPressable>
  );
}

export const MasonrySceneCard = memo(MasonrySceneCardComponent);

const styles = StyleSheet.create({
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
    paddingTop: 30,
    paddingBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  statPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  location: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

export default MasonrySceneCard;
