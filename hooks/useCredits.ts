import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const CREDITS_KEY = 'flexme_credits';
const STARTING_CREDITS = 8440;

export function useCredits() {
  const [credits, setCredits] = useState(STARTING_CREDITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CREDITS_KEY);
        if (raw !== null) {
          setCredits(parseInt(raw, 10));
        } else {
          await AsyncStorage.setItem(CREDITS_KEY, String(STARTING_CREDITS));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const spend = useCallback(async (amount: number): Promise<boolean> => {
    let success = false;
    setCredits((prev) => {
      if (prev < amount) {
        success = false;
        return prev;
      }
      success = true;
      const next = prev - amount;
      AsyncStorage.setItem(CREDITS_KEY, String(next));
      return next;
    });
    return success;
  }, []);

  const addCredits = useCallback(async (amount: number) => {
    setCredits((prev) => {
      const next = prev + amount;
      AsyncStorage.setItem(CREDITS_KEY, String(next));
      return next;
    });
  }, []);

  return { credits, loading, spend, addCredits };
}

export default useCredits;
