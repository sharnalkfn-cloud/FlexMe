import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const FACES_STORAGE_KEY = 'flexme_faces';

export interface StoredFace {
  uri: string;
  base64: string;
}

export function useFaces() {
  const [faces, setFaces] = useState<StoredFace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FACES_STORAGE_KEY);
        if (raw) {
          setFaces(JSON.parse(raw) as StoredFace[]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: StoredFace[]) => {
    setFaces(next);
    await AsyncStorage.setItem(FACES_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addFace = useCallback(
    async (face: StoredFace) => {
      await persist([...faces, face]);
    },
    [faces, persist]
  );

  const removeFace = useCallback(
    async (index: number) => {
      await persist(faces.filter((_, i) => i !== index));
    },
    [faces, persist]
  );

  return { faces, loading, addFace, removeFace };
}

export default useFaces;
