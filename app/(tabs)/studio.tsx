import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/AppBackground';
import { SceneShopCard } from '@/components/SceneShopCard';
import { Colors, Radius } from '@/constants/colors';
import { getSceneById, type Scene } from '@/constants/scenes';

type Mode = 'Photo' | 'TextToPhoto';

// Only the scenes with a real reference image (constants/sceneImages.ts) are
// shown for now. The rest of constants/scenes.ts stays intact for later.
const VISIBLE_SCENE_IDS = ['girlfriend_jet_bugatti', 'dubai_valet', 'dubai_shopping_lambo', 'highrise_pool'];
const VISIBLE_SCENES: Scene[] = VISIBLE_SCENE_IDS.map(getSceneById).filter(
  (scene): scene is Scene => scene !== undefined
);

export default function StudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('Photo');

  const scenes = useMemo(() => (mode === 'Photo' ? VISIBLE_SCENES : []), [mode]);

  const handleScenePress = useCallback(
    (scene: Scene) => {
      router.push({ pathname: '/scene/[id]', params: { id: scene.id } });
    },
    [router]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppBackground />
      <View style={styles.headerRow}>
        <Text style={styles.logo}>FLEXME</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Générer</Text>
        <Text style={styles.subtitle}>Pick a scene, add your face, generate.</Text>
      </View>

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setMode('Photo')}
          style={[styles.togglePill, mode === 'Photo' && styles.togglePillActive]}>
          <Text style={[styles.toggleText, mode === 'Photo' && styles.toggleTextActive]} numberOfLines={1}>
            Photo
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('TextToPhoto')}
          style={[styles.togglePill, mode === 'TextToPhoto' && styles.togglePillActive]}>
          <Text style={[styles.toggleText, mode === 'TextToPhoto' && styles.toggleTextActive]} numberOfLines={1}>
            Text to Photo
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={scenes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[styles.gridContent, { paddingBottom: insets.bottom + 140 }]}
        renderItem={({ item }) => <SceneShopCard scene={item} onPress={handleScenePress} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name={mode === 'Photo' ? 'images-outline' : 'chatbubble-ellipses-outline'}
                size={26}
                color={Colors.textMuted}
              />
            </View>
            <Text style={styles.emptyText}>
              {mode === 'Photo' ? 'New scenes are coming soon.' : 'Text to Photo is coming soon.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 44,
  },
  logo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  titleBlock: {
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderTopColor: Colors.reliefTop,
    borderLeftColor: Colors.reliefTop,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.reliefBottom,
    padding: 3,
  },
  togglePill: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  togglePillActive: {
    backgroundColor: Colors.accent,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: '#fff',
  },
  gridContent: {
    paddingHorizontal: 16,
  },
  gridRow: {
    gap: 10,
    marginBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 14,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
