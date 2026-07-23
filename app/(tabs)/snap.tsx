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

        <Pressable
          style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}
          onPress={handleUploadFromLibrary}>
          <Ionicons name="images-outline" size={18} color={Colors.textPrimary} />
          <Text style={styles.uploadButtonText}>Upload from library</Text>
        </Pressable>

        <View style={styles.facesSection}>
          <View style={styles.facesHeaderRow}>
            <Text style={styles.facesTitle}>Your faces</Text>
            {faces.length > 0 && (
              <View style={styles.facesCountPill}>
                <Text style={styles.facesCountText}>{faces.length}</Text>
              </View>
            )}
          </View>

          {faces.length > 0 ? (
            <>
              <View style={styles.faceGrid}>
                {faces.map((face, i) => (
                  <Pressable key={`${face.uri}-${i}`} onLongPress={() => removeFace(i)} style={styles.faceThumbWrap}>
                    <Image source={{ uri: face.uri }} style={styles.faceThumb} />
                  </Pressable>
                ))}
              </View>
              <Text style={styles.faceHint}>Long-press a photo to remove it.</Text>
            </>
          ) : (
            <View style={styles.facesEmpty}>
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.facesEmptyText}>No faces added yet</Text>
            </View>
          )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 5,
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
  uploadButtonPressed: {
    opacity: 0.7,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  facesSection: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  facesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  facesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  facesCountPill: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facesCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  faceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  faceThumbWrap: {
    borderRadius: 34,
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
    marginTop: 12,
  },
  facesEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: Radius.card,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  facesEmptyText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
