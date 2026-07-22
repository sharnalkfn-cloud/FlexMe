import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { MasonrySceneCard } from '@/components/MasonrySceneCard';
import { TrendingCarousel } from '@/components/TrendingCarousel';
import { Colors } from '@/constants/colors';
import {
  ALL_SCENES,
  EXTRA_SCENES,
  FILTER_CATEGORIES,
  REAL_SCENES,
  type AnyScene,
} from '@/constants/scenes';
import { getGenerationHistory } from '@/hooks/useGemini';
import { onAuthStateChanged } from '@/services/firebase';

const HISTORY_KEY = 'flexme_history';
const MASONRY_MIN_HEIGHT = 150;
const MASONRY_HEIGHT_RANGE = 90;

function buildTrendingSlides() {
  return REAL_SCENES.slice(0, 5).map((scene, i) => ({
    scene,
    minis: EXTRA_SCENES.slice(i * 6, i * 6 + 6),
  }));
}

const TRENDING_SLIDES = buildTrendingSlides();

function hashSceneHeight(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return MASONRY_MIN_HEIGHT + (hash % MASONRY_HEIGHT_RANGE);
}

interface MasonryItem {
  scene: AnyScene;
  height: number;
}

function buildMasonryColumns(scenes: AnyScene[]): { left: MasonryItem[]; right: MasonryItem[] } {
  const left: MasonryItem[] = [];
  const right: MasonryItem[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const scene of scenes) {
    const item: MasonryItem = { scene, height: hashSceneHeight(scene.id) };
    if (leftHeight <= rightHeight) {
      left.push(item);
      leftHeight += item.height;
    } else {
      right.push(item);
      rightHeight += item.height;
    }
  }

  return { left, right };
}

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof FILTER_CATEGORIES)[number]>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    getGenerationHistory().then((history) => setGeneratedCount(history.length));
    const unsubscribe = onAuthStateChanged((user) => {
      setPhotoURL(user?.photoURL ?? null);
    });
    return unsubscribe;
  }, []);

  const refreshCounts = useCallback(async () => {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    setGeneratedCount(history.length);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshCounts();
    setRefreshing(false);
  }, [refreshCounts]);

  const filteredScenes = useMemo(() => {
    return ALL_SCENES.filter((scene) => {
      const matchesCategory = category === 'All' || scene.category === category;
      const matchesSearch =
        search.trim().length === 0 ||
        scene.name.toLowerCase().includes(search.toLowerCase()) ||
        scene.location.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const masonryColumns = useMemo(() => buildMasonryColumns(filteredScenes), [filteredScenes]);

  const handleScenePress = useCallback(
    (scene: AnyScene) => {
      router.push({ pathname: '/scene/[id]', params: { id: scene.id } });
    },
    [router]
  );

  const handleGenerate = useCallback(
    (scene: AnyScene) => {
      router.push({ pathname: '/generate', params: { sceneId: scene.id } });
    },
    [router]
  );

  const handleAvatarPress = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={styles.statsRow}>
          <GlassCard style={styles.statChip}>
            <Text style={styles.statValue}>{ALL_SCENES.length}</Text>
            <Text style={styles.statLabel}>Scenes</Text>
          </GlassCard>
          <GlassCard style={styles.statChip}>
            <Text style={styles.statValue}>{generatedCount}</Text>
            <Text style={styles.statLabel}>Generated</Text>
          </GlassCard>
          <GlassCard style={styles.statChip}>
            <Text style={styles.statValue}>{Math.max(0, 3 - generatedCount)}</Text>
            <Text style={styles.statLabel}>Free left</Text>
          </GlassCard>
        </View>

        <GlassCard style={styles.searchBar}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={16} color={Colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search scenes..."
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
            />
          </View>
        </GlassCard>

        <FlatList
          data={FILTER_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.pillsRow}
          renderItem={({ item }) => (
            <Pressable onPress={() => setCategory(item)}>
              <View style={[styles.pill, category === item && styles.pillActive]}>
                <Text style={[styles.pillText, category === item && styles.pillTextActive]}>
                  {item}
                </Text>
              </View>
            </Pressable>
          )}
        />

        <TrendingCarousel slides={TRENDING_SLIDES} onGenerate={handleGenerate} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALL SCENES</Text>
          <Pressable onPress={() => setCategory('All')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
      </View>
    ),
    [category, generatedCount, handleGenerate, search]
  );

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        refreshControl={<RefreshControl tintColor={Colors.accent} refreshing={refreshing} onRefresh={handleRefresh} />}>
        <View style={styles.headerRow}>
          <Text style={styles.logo}>FlexMe</Text>
          <Pressable onPress={handleAvatarPress} style={styles.avatarButton}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={18} color={Colors.textPrimary} />
            )}
          </Pressable>
        </View>
        {renderHeader()}

        <View style={styles.masonryGrid}>
          <View style={styles.masonryColumn}>
            {masonryColumns.left.map(({ scene, height }) => (
              <MasonrySceneCard key={scene.id} scene={scene} height={height} onPress={handleScenePress} />
            ))}
          </View>
          <View style={styles.masonryColumn}>
            {masonryColumns.right.map(({ scene, height }) => (
              <MasonrySceneCard key={scene.id} scene={scene} height={height} onPress={handleScenePress} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  statChip: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 18,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  pillActive: {
    backgroundColor: Colors.textPrimary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: '#08080c',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  masonryGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  masonryColumn: {
    flex: 1,
    gap: 8,
  },
});
