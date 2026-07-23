import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/AppBackground';
import { Colors, Radius } from '@/constants/colors';
import { getSceneImageSource } from '@/constants/sceneImages';
import { getSceneById } from '@/constants/scenes';
import { useCredits } from '@/hooks/useCredits';
import { useFaces } from '@/hooks/useFaces';
import { GENERATION_STEPS, getStoredApiKey, setStoredApiKey, useGemini } from '@/hooks/useGemini';

export default function SceneDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scene = getSceneById(id);
  const previewImage = getSceneImageSource(id);
  const { faces } = useFaces();
  const { credits, spend } = useCredits();
  const { generate, loading, stepIndex, error, result } = useGemini();
  const [apiKey, setApiKey] = useState('');
  const [creditError, setCreditError] = useState<string | null>(null);

  useEffect(() => {
    getStoredApiKey().then(setApiKey);
  }, []);

  const handleApiKeyChange = useCallback(async (value: string) => {
    setApiKey(value);
    await setStoredApiKey(value);
  }, []);

  const handleClose = useCallback(() => router.back(), [router]);

  const handleGenerate = useCallback(async () => {
    if (!scene) return;
    setCreditError(null);
    if (faces.length === 0) {
      setCreditError('Add a face in the Snap tab first.');
      return;
    }
    if (!apiKey) {
      setCreditError('Add your Gemini API key below.');
      return;
    }
    const spent = await spend(scene.credits);
    if (!spent) {
      setCreditError('Not enough credits for this scene.');
      return;
    }
    await generate({
      apiKey,
      prompt: scene.prompt,
      faceImagesBase64: faces.map((f) => f.base64),
      sceneId: scene.id,
      sceneName: scene.name,
    });
  }, [apiKey, faces, generate, scene, spend]);

  const handleDownload = useCallback(async () => {
    if (!result) return;
    const path = `${FileSystem.cacheDirectory}${result.id}.jpg`;
    await FileSystem.writeAsStringAsync(path, result.imageBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: 'image/jpeg' });
    }
  }, [result]);

  if (!scene) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>Scene not found</Text>
      </View>
    );
  }

  const isReady = faces.length > 0 && apiKey.length > 0 && !loading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppBackground />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={styles.previewWrap}>
          {previewImage ? (
            <Image source={previewImage} style={styles.preview} resizeMode="cover" />
          ) : (
            <LinearGradient colors={scene.bgColors} style={styles.preview}>
              <Text style={styles.previewEmoji}>{scene.emoji}</Text>
            </LinearGradient>
          )}
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
            <View style={styles.priceTag}>
              <Ionicons name="logo-bitcoin" size={14} color={Colors.gold} />
              <Text style={styles.priceText}>{scene.credits}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What you&apos;ll get</Text>
            <Text style={styles.cardBody}>{scene.description}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Example outfit</Text>
            <Text style={styles.cardBody}>{scene.outfitDetails}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gemini API Key</Text>
            <TextInput
              value={apiKey}
              onChangeText={handleApiKeyChange}
              placeholder="AIza..."
              placeholderTextColor={Colors.textFaint}
              style={styles.apiKeyInput}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.balanceText}>Balance: {credits.toLocaleString()} credits</Text>

          {(error || creditError) && <Text style={styles.errorText}>{error ?? creditError}</Text>}

          <Pressable
            style={[styles.generateButton, !isReady && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={!isReady}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateButtonText}>Generate for {scene.credits} credits</Text>
            )}
          </Pressable>

          {loading && (
            <View style={styles.loadingSteps}>
              {GENERATION_STEPS.map((step, i) => (
                <View key={step} style={styles.loadingStepRow}>
                  <View style={[styles.loadingDot, i <= stepIndex && styles.loadingDotActive]} />
                  <Text style={[styles.loadingStepText, i <= stepIndex && styles.loadingStepTextActive]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {result && (
            <View style={styles.resultSection}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${result.imageBase64}` }}
                style={styles.resultImage}
                resizeMode="cover"
              />
              <Pressable style={styles.downloadButton} onPress={handleDownload}>
                <Ionicons name="download-outline" size={18} color="#fff" />
                <Text style={styles.downloadButtonText}>Download / Share</Text>
              </Pressable>
            </View>
          )}
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
    overflow: 'hidden',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
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
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gold,
  },
  card: {
    padding: 16,
    borderRadius: Radius.card,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
  apiKeyInput: {
    color: Colors.gold,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  balanceText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.accent,
    fontSize: 13,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: Radius.button,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.4,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  loadingSteps: {
    gap: 10,
  },
  loadingStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  loadingDotActive: {
    backgroundColor: Colors.accent,
  },
  loadingStepText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  loadingStepTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  resultSection: {
    marginTop: 8,
    gap: 12,
  },
  resultImage: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: Radius.card,
    backgroundColor: Colors.surface,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: Radius.button,
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
