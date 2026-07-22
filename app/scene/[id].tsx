import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { Colors, Radius } from '@/constants/colors';
import { getSceneById, isRealScene } from '@/constants/scenes';

export default function SceneDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);

  const scene = getSceneById(id);

  const handleGenerate = useCallback(() => {
    if (!scene) return;
    router.replace({ pathname: '/(tabs)/generate', params: { sceneId: scene.id } });
  }, [router, scene]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const toggleSave = useCallback(() => {
    setSaved((prev) => !prev);
  }, []);

  if (!scene) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>Scene not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={styles.previewWrap}>
          <LinearGradient colors={scene.bgColors} style={styles.preview}>
            <Text style={styles.previewEmoji}>{scene.emoji}</Text>
          </LinearGradient>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{scene.name}</Text>
              <Text style={styles.location}>{scene.location}</Text>
            </View>
            <Text style={styles.views}>{scene.views.toLocaleString()} views</Text>
          </View>

          {isRealScene(scene) && (
            <>
              <GlassCard style={styles.card}>
                <Text style={styles.cardTitle}>What you&apos;ll get</Text>
                <Text style={styles.cardBody}>{scene.description}</Text>
              </GlassCard>

              <GlassCard style={styles.card}>
                <Text style={styles.cardTitle}>Example outfit</Text>
                <Text style={styles.cardBody}>{scene.outfitDetails}</Text>
              </GlassCard>
            </>
          )}

          <View style={styles.actions}>
            <Pressable style={styles.generateButton} onPress={handleGenerate}>
              <Text style={styles.generateText}>Generate with my face</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={toggleSave}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={Colors.textPrimary}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 40,
  },
  previewWrap: {
    height: 240,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: {
    fontSize: 72,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  location: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  views: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  generateButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: Radius.button,
    alignItems: 'center',
  },
  generateText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08080c',
  },
  saveButton: {
    width: 52,
    borderRadius: Radius.button,
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
