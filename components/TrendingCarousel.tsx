import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

import { Colors, Gradients, Radius } from '@/constants/colors';
import type { AnyScene } from '@/constants/scenes';

interface TrendingSlide {
  scene: AnyScene;
  minis: AnyScene[];
}

interface TrendingCarouselProps {
  slides: TrendingSlide[];
  onGenerate: (scene: AnyScene) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_WIDTH = SCREEN_WIDTH - 32;
const LEFT_HEIGHTS = [100, 70, 115];
const RIGHT_HEIGHTS = [75, 110, 80];
const AUTO_SLIDE_MS = 4500;

function MiniCard({ scene, height }: { scene: AnyScene; height: number }) {
  return (
    <LinearGradient colors={scene.bgColors} style={[styles.miniCard, { height }]}>
      <Text style={styles.miniEmoji}>{scene.emoji}</Text>
      <Text style={styles.miniName} numberOfLines={1}>
        {scene.name}
      </Text>
    </LinearGradient>
  );
}

function Slide({
  slide,
  onGenerate,
}: {
  slide: TrendingSlide;
  onGenerate: (scene: AnyScene) => void;
}) {
  const left = slide.minis.slice(0, 3);
  const right = slide.minis.slice(3, 6);
  const handlePress = useCallback(() => onGenerate(slide.scene), [onGenerate, slide.scene]);

  return (
    <View style={[styles.slide, { width: SLIDE_WIDTH }]}>
      <View style={styles.masonry}>
        <View style={styles.col}>
          {left.map((s, i) => (
            <MiniCard key={s.id} scene={s} height={LEFT_HEIGHTS[i] ?? 90} />
          ))}
        </View>
        <View style={[styles.col, { marginTop: 20 }]}>
          {right.map((s, i) => (
            <MiniCard key={s.id} scene={s} height={RIGHT_HEIGHTS[i] ?? 90} />
          ))}
        </View>
      </View>
      <LinearGradient colors={Gradients.cardOverlay} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow} pointerEvents="none">
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingBadgeText}>🔥 TRENDING</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{slide.scene.views.toLocaleString()} views</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.bottomInfo} pointerEvents="none">
            <Text style={styles.sceneName} numberOfLines={1}>
              {slide.scene.name}
            </Text>
            <Text style={styles.sceneLocation} numberOfLines={1}>
              {slide.scene.location}
            </Text>
          </View>
          <Pressable style={styles.generateButton} onPress={handlePress}>
            <Text style={styles.generateButtonText}>Generate</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

export function TrendingCarousel({ slides, onGenerate }: TrendingCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      scrollRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
      indexRef.current = next;
      setIndex(next);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    indexRef.current = newIndex;
    setIndex(newIndex);
  }, []);

  if (slides.length === 0) return null;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}>
        {slides.map((slide) => (
          <Slide key={slide.scene.id} slide={slide} onGenerate={onGenerate} />
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((slide, i) => (
          <View
            key={slide.scene.id}
            style={[styles.dot, i === index ? styles.dotActive : null]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 0,
  },
  slide: {
    height: 260,
    borderRadius: Radius.card,
    overflow: 'hidden',
    backgroundColor: '#0d0a1f',
  },
  masonry: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  col: {
    flex: 1,
    gap: 8,
  },
  miniCard: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniEmoji: {
    fontSize: 22,
  },
  miniName: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trendingBadge: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomInfo: {
    flexShrink: 1,
  },
  sceneName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sceneLocation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  generateButton: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.pill,
  },
  generateButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
});

export default TrendingCarousel;
