import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SceneShopCard } from '@/components/SceneShopCard';
import { Colors, Radius } from '@/constants/colors';
import { SCENES, type Scene } from '@/constants/scenes';
import { useCredits } from '@/hooks/useCredits';

type Mode = 'Photo' | 'Video';

export default function StudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { credits } = useCredits();
  const [mode, setMode] = useState<Mode>('Photo');

  const scenes = useMemo(() => (mode === 'Photo' ? SCENES : []), [mode]);

  const handleScenePress = useCallback(
    (scene: Scene) => {
      router.push({ pathname: '/scene/[id]', params: { id: scene.id } });
    },
    [router]
  );

  const handleMenuPress = useCallback(() => {
    Alert.alert('FlexMe', 'Settings, credits, and account options coming soon.');
  }, []);

  const handleChatPress = useCallback(() => {
    Alert.alert('Chat', 'AI assistant coming soon.');
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={handleMenuPress} style={styles.iconButton}>
          <Ionicons name="menu" size={22} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.logo}>FLEXME</Text>
        <View style={styles.headerRight}>
          <View style={styles.creditsPill}>
            <Ionicons name="logo-bitcoin" size={14} color={Colors.gold} />
            <Text style={styles.creditsText}>{credits.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={handleChatPress} style={styles.chatButton}>
        <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
      </Pressable>

      <Text style={styles.title}>STUDIO</Text>

      <View style={styles.toggleRow}>
        <Pressable onPress={() => setMode('Photo')} style={[styles.togglePill, mode === 'Photo' && styles.togglePillActive]}>
          <Text style={[styles.toggleText, mode === 'Photo' && styles.toggleTextActive]}>Photo</Text>
        </Pressable>
        <Pressable onPress={() => setMode('Video')} style={[styles.togglePill, mode === 'Video' && styles.togglePillActive]}>
          <Text style={[styles.toggleText, mode === 'Video' && styles.toggleTextActive]}>Video</Text>
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
            <Text style={styles.emptyText}>Video generation is coming soon.</Text>
          </View>
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  logo: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.red,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  creditsText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  chatButton: {
    position: 'absolute',
    right: 16,
    top: 56,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  togglePill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  togglePillActive: {
    backgroundColor: Colors.red,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: '#fff',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gridRow: {
    gap: 10,
    marginBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
