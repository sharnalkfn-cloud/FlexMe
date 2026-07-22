import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { SceneCard } from '@/components/SceneCard';
import { Colors, Gradients, Radius } from '@/constants/colors';
import { REAL_SCENES, isRealScene, type AnyScene } from '@/constants/scenes';
import { GENERATION_STEPS, getStoredApiKey, setStoredApiKey, useGemini } from '@/hooks/useGemini';
import { useFaces } from '@/hooks/useFaces';

const MAX_FACES = 5;
const MAX_PROMPT_LENGTH = 500;

export default function GenerateScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sceneId?: string }>();
  const { faces, addFace } = useFaces();
  const { generate, loading, stepIndex, error, result } = useGemini();

  const [apiKey, setApiKey] = useState('');
  const [selectedScene, setSelectedScene] = useState<AnyScene | null>(null);
  const [customPromptEnabled, setCustomPromptEnabled] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    getStoredApiKey().then(setApiKey);
  }, []);

  useEffect(() => {
    if (params.sceneId) {
      const scene = REAL_SCENES.find((s) => s.id === params.sceneId);
      if (scene) setSelectedScene(scene);
    }
  }, [params.sceneId]);

  const handleApiKeyChange = useCallback(async (value: string) => {
    setApiKey(value);
    await setStoredApiKey(value);
  }, []);

  const handleAddFace = useCallback(async () => {
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
      await addFace({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        angle: 'Front',
      });
    }
  }, [addFace]);

  const finalPrompt = useMemo(() => {
    if (customPromptEnabled) return customPrompt.trim();
    if (selectedScene && isRealScene(selectedScene)) return selectedScene.prompt;
    return '';
  }, [customPrompt, customPromptEnabled, selectedScene]);

  const currentStep = useMemo(() => {
    if (faces.length === 0) return 0;
    if (!finalPrompt) return 1;
    return 2;
  }, [faces.length, finalPrompt]);

  const isReady = faces.length > 0 && finalPrompt.length > 0 && apiKey.length > 0 && !loading;

  const handleGenerate = useCallback(async () => {
    if (!isReady) return;
    await generate({
      apiKey,
      prompt: finalPrompt,
      faceImagesBase64: faces.map((f) => f.base64),
      sceneId: selectedScene?.id ?? 'custom',
      sceneName: selectedScene?.name ?? 'Custom Scene',
    });
  }, [apiKey, faces, finalPrompt, generate, isReady, selectedScene]);

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

  const handleShare = useCallback(async () => {
    await handleDownload();
  }, [handleDownload]);

  const handleSceneSelect = useCallback((scene: AnyScene) => {
    setSelectedScene(scene);
    setCustomPromptEnabled(false);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Generate</Text>
          <Text style={styles.subtitle}>Create your next photorealistic flex</Text>
        </View>

        <View style={styles.progressBar}>
          {[0, 1, 2].map((step) => (
            <View
              key={step}
              style={[styles.progressSegment, step <= currentStep && styles.progressSegmentActive]}
            />
          ))}
        </View>

        <GlassCard style={styles.apiKeyCard}>
          <Text style={styles.sectionLabel}>Gemini API Key</Text>
          <TextInput
            value={apiKey}
            onChangeText={handleApiKeyChange}
            placeholder="AIza..."
            placeholderTextColor={Colors.textMuted}
            style={styles.apiKeyInput}
            secureTextEntry
            autoCapitalize="none"
          />
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Face Photos</Text>
          <Pressable style={styles.uploadZone} onPress={handleAddFace}>
            <Ionicons name="cloud-upload-outline" size={22} color={Colors.textMuted} />
            <Text style={styles.uploadText}>Tap to add face photos</Text>
          </Pressable>

          {faces.length > 0 && (
            <View style={styles.faceThumbRow}>
              {faces.map((face, i) => (
                <Image key={`${face.uri}-${i}`} source={{ uri: face.uri }} style={styles.faceThumb} />
              ))}
            </View>
          )}

          <View style={styles.faceProgressTrack}>
            <View
              style={[
                styles.faceProgressFill,
                { width: `${Math.min(100, (faces.length / MAX_FACES) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.faceProgressText}>
            {faces.length}/{MAX_FACES} faces
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Scene</Text>
          <View style={styles.sceneGrid}>
            {REAL_SCENES.map((scene) => (
              <Pressable
                key={scene.id}
                style={styles.sceneGridItem}
                onPress={() => handleSceneSelect(scene)}>
                <View
                  style={[
                    styles.sceneSelectWrap,
                    selectedScene?.id === scene.id && !customPromptEnabled && styles.sceneSelected,
                  ]}>
                  <SceneCard scene={scene} onPress={handleSceneSelect} height={110} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <GlassCard style={styles.section}>
          <View style={styles.toggleRow}>
            <Text style={styles.sectionTitle}>Custom Prompt</Text>
            <Switch
              value={customPromptEnabled}
              onValueChange={setCustomPromptEnabled}
              trackColor={{ true: Colors.accent, false: Colors.glassBorder }}
            />
          </View>
          {customPromptEnabled && (
            <>
              <TextInput
                value={customPrompt}
                onChangeText={(text) => setCustomPrompt(text.slice(0, MAX_PROMPT_LENGTH))}
                placeholder="e.g. Standing on a yacht deck at sunset, wearing a linen shirt..."
                placeholderTextColor={Colors.textMuted}
                style={styles.customPromptInput}
                multiline
              />
              <Text style={styles.charCount}>
                {customPrompt.length}/{MAX_PROMPT_LENGTH}
              </Text>
              <Text style={styles.promptTip}>
                Tip: describe location, lighting, outfit, and mood for best results.
              </Text>
            </>
          )}
        </GlassCard>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[styles.generateButton, !isReady && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={!isReady}>
          {loading ? (
            <ActivityIndicator color="#08080c" />
          ) : (
            <Text style={styles.generateButtonText}>Generate</Text>
          )}
        </Pressable>

        {loading && (
          <View style={styles.loadingSteps}>
            {GENERATION_STEPS.map((step, i) => (
              <View key={step} style={styles.loadingStepRow}>
                <View
                  style={[
                    styles.loadingDot,
                    i <= stepIndex && styles.loadingDotActive,
                  ]}
                />
                <Text style={[styles.loadingStepText, i <= stepIndex && styles.loadingStepTextActive]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}

        {result && (
          <View style={styles.resultSection}>
            <LinearGradient colors={Gradients.violetBlue} style={styles.resultFrame}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${result.imageBase64}` }}
                style={styles.resultImage}
                resizeMode="cover"
              />
            </LinearGradient>
            <View style={styles.resultActions}>
              <Pressable style={styles.resultButton} onPress={handleDownload}>
                <Ionicons name="download-outline" size={18} color={Colors.textPrimary} />
                <Text style={styles.resultButtonText}>Download</Text>
              </Pressable>
              <Pressable style={styles.resultButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={18} color={Colors.textPrimary} />
                <Text style={styles.resultButtonText}>Share</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
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
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  progressSegment: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.glassBorder,
    borderRadius: 1,
  },
  progressSegmentActive: {
    backgroundColor: Colors.accent,
  },
  apiKeyCard: {
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  apiKeyInput: {
    color: Colors.gold,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  uploadZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.glassBorder,
    borderRadius: Radius.card,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.glassBg,
  },
  uploadText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  faceThumbRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  faceThumb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  faceProgressTrack: {
    height: 4,
    backgroundColor: Colors.glassBorder,
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  faceProgressFill: {
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  faceProgressText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sceneGridItem: {
    width: '48%',
  },
  sceneSelectWrap: {
    borderRadius: Radius.card,
  },
  sceneSelected: {
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: Radius.card,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customPromptInput: {
    color: Colors.textPrimary,
    fontSize: 13,
    minHeight: 90,
    marginTop: 12,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  promptTip: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 8,
    lineHeight: 16,
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  generateButton: {
    marginHorizontal: 16,
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    borderRadius: Radius.button,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.35,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08080c',
  },
  loadingSteps: {
    marginHorizontal: 16,
    marginTop: 20,
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
    backgroundColor: Colors.glassBorder,
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
    marginHorizontal: 16,
    marginTop: 24,
  },
  resultFrame: {
    aspectRatio: 9 / 16,
    borderRadius: Radius.card,
    padding: 2,
    overflow: 'hidden',
  },
  resultImage: {
    flex: 1,
    borderRadius: Radius.card - 2,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  resultButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    paddingVertical: 14,
    borderRadius: Radius.button,
  },
  resultButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
