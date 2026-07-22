import { useCallback, useEffect, useState } from 'react';

import {
  configureRevenueCat,
  getSubscriptionStatus,
  purchaseWeeklyTrial,
  restorePurchases,
  type SubscriptionStatus,
} from '@/services/revenuecat';

const DEFAULT_STATUS: SubscriptionStatus = {
  isActive: false,
  isTrial: false,
  trialDaysLeft: 0,
  expirationDate: null,
};

export function useSubscription(userId?: string) {
  const [status, setStatus] = useState<SubscriptionStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await getSubscriptionStatus();
      setStatus(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    configureRevenueCat(userId);
    refresh();
  }, [refresh, userId]);

  const startTrial = useCallback(async () => {
    setPurchasing(true);
    setError(null);
    try {
      const next = await purchaseWeeklyTrial();
      setStatus(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed.');
      return null;
    } finally {
      setPurchasing(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setPurchasing(true);
    setError(null);
    try {
      const next = await restorePurchases();
      setStatus(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed.');
      return null;
    } finally {
      setPurchasing(false);
    }
  }, []);

  return { status, loading, purchasing, error, refresh, startTrial, restore };
}

export default useSubscription;
