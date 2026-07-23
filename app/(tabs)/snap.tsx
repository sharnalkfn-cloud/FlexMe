import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/AppBackground';
import { FaceCapture, type CapturedFace } from '@/components/FaceCapture';
import { Colors, Radius } from '@/constants/colors';
import { useFaces } from '@/hooks/useFaces';

export default function SnapScreen() {
  const insets = useSafeAreaInsets();
  const { faces, addFace, removeFace } = useFaces();

  const handleCapture = useCallback(
    async (face: CapturedFace) => {
      await addFace(face);
    },
    [addFace]
  );

  const handleUploadFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]?.base64) {
      await addFace({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  }, [addFace]);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <AppBackground />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Snap</Text>
          <Text style={styles.subtitle}>Capture or upload your face to unlock every scene</Text>
        </View>

        <View style={styles.captureWrap}>
          <FaceCapture onCapture={handleCapture} />
        </View>

        <Pressable style={styles.uploadButton} onPress={handleUploadFromLibrary}>
          <Ionicons name="images-outline" size={18} color={Colors.textPrimary} />
          <Text style={styles.uploadButtonText}>Upload from library</Text>
        </Pressable>

        {faces.length > 0 && (
          <View style={styles.facesSection}>
            <Text style={styles.facesTitle}>Your faces ({faces.length})</Text>
            <View style={styles.faceGrid}>
              {faces.map((face, i) => (
                <Pressable key={`${face.uri}-${i}`} onLongPress={() => removeFace(i)}>
                  <Image source={{ uri: face.uri }} style={styles.faceThumb} />
                </Pressable>
              ))}
            </View>
            <Text style={styles.faceHint}>Long-press a photo to remove it.</Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
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
  captureWrap: {
    paddingHorizontal: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: Radius.button,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  facesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  facesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  faceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  faceThumb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  faceHint: {
    fontSize: 11,
    color: Colors.textFaint,
    marginTop: 10,
  },
});
