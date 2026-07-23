import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import {
  deleteGenerationRecord,
  getGenerationHistory,
  type GenerationRecord,
} from '@/hooks/useGemini';

export default function GalerieScreen() {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<GenerationRecord[]>([]);

  const load = useCallback(async () => {
    setHistory(await getGenerationHistory());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLongPress = useCallback((record: GenerationRecord) => {
    Alert.alert('Delete photo', 'Remove this generated photo from your gallery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => setHistory(await deleteGenerationRecord(record.id)),
      },
    ]);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Galerie</Text>
        <Text style={styles.subtitle}>{history.length} photos générées</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.gridContent, { paddingBottom: insets.bottom + 140 }]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Génère ta première photo</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.item} onLongPress={() => handleLongPress(item)}>
            <Image source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }} style={styles.itemImage} />
          </Pressable>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  gridContent: {
    paddingHorizontal: 16,
  },
  row: {
    gap: 6,
    marginBottom: 6,
  },
  item: {
    flex: 1,
    aspectRatio: 9 / 14,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  itemImage: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
