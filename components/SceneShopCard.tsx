import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Gradients, Radius } from '@/constants/colors';
import { getSceneImageSource } from '@/constants/sceneImages';
import type { Scene } from '@/constants/scenes';

interface SceneShopCardProps {
  scene: Scene;
  onPress: (scene: Scene) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Matches studio.tsx's grid: gridContent paddingHorizontal 16, gridRow gap 10.
const GRID_HORIZONTAL_PADDING = 16;
const GRID_GAP = 10;

function SceneShopCardComponent({ scene, onPress }: SceneShopCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const columnWidth = (windowWidth - GRID_HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;
  const cardHeight = columnWidth * (4 / 3);

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

  const imageSource = getSceneImageSource(scene.id);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.flexItem, { height: cardHeight }, animatedStyle]}>
      <LinearGradient colors={scene.bgColors} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{scene.emoji}</Text>
          </View>
        )}
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
  },
  card: {
    flex: 1,
    borderRadius: Radius.card,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  emojiWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  emoji: {
    fontSize: 44,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
