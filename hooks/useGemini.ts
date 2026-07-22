import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

import { generateSceneImage } from '@/services/gemini';

const HISTORY_STORAGE_KEY = 'flexme_history';
const API_KEY_STORAGE_KEY = 'flexme_gemini_api_key';

export interface GenerationRecord {
  id: string;
  sceneId: string;
  sceneName: string;
  imageBase64: string;
  createdAt: number;
}

export const GENERATION_STEPS = [
  'Analyzing face structure',
  'Composing scene',
  'Rendering photorealistic details',
  'Finalizing image',
] as const;

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationRecord | null>(null);

  const generate = useCallback(
    async (params: {
      apiKey: string;
      prompt: string;
      faceImagesBase64: string[];
      sceneId: string;
      sceneName: string;
    }) => {
      setLoading(true);
      setError(null);
      setResult(null);
      setStepIndex(0);

      const stepTimer = setInterval(() => {
        setStepIndex((prev) => Math.min(prev + 1, GENERATION_STEPS.length - 1));
      }, 1500);

      try {
        const response = await generateSceneImage({
          apiKey: params.apiKey,
          prompt: params.prompt,
          faceImagesBase64: params.faceImagesBase64,
        });

        if (!response.success || !response.imageBase64) {
          setError(response.error ?? 'Generation failed.');
          return null;
        }

        const record: GenerationRecord = {
          id: `gen-${Date.now()}`,
          sceneId: params.sceneId,
          sceneName: params.sceneName,
          imageBase64: response.imageBase64,
          createdAt: Date.now(),
        };

        setResult(record);
        await appendToHistory(record);
        return record;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error.');
        return null;
      } finally {
        clearInterval(stepTimer);
        setStepIndex(GENERATION_STEPS.length - 1);
        setLoading(false);
      }
    },
    []
  );

  return { generate, loading, stepIndex, error, result };
}

async function appendToHistory(record: GenerationRecord): Promise<void> {
  const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
  const history: GenerationRecord[] = raw ? JSON.parse(raw) : [];
  history.unshift(record);
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export async function getGenerationHistory(): Promise<GenerationRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as GenerationRecord[]) : [];
}

export async function deleteGenerationRecord(id: string): Promise<GenerationRecord[]> {
  const history = await getGenerationHistory();
  const next = history.filter((r) => r.id !== id);
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function getStoredApiKey(): Promise<string> {
  return (await AsyncStorage.getItem(API_KEY_STORAGE_KEY)) ?? '';
}

export async function setStoredApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export default useGemini;
