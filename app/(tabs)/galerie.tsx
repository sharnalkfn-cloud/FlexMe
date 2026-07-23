import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/AppBackground';
import { Colors } from '@/constants/colors';
import {
  deleteGenerationRecord,
  getGenerationHistory,
  type GenerationRecord,
} from '@/hooks/useGemini';

const GRID_HORIZONTAL_PADDING = 16;
const GRID_GAP = 6;
const GRID_COLUMNS = 3;

export default function GalerieScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const columnWidth =
    (windowWidth - GRID_HORIZONTAL_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const itemHeight = columnWidth * (14 / 9);
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
      <AppBackground />
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
          <Pressable
            style={[styles.item, { height: itemHeight }]}
            onLongPress={() => handleLongPress(item)}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.surface,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
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
