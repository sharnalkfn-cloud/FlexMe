import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
} from 'react-native-purchases';

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

export const WEEKLY_PRODUCT_ID = 'flexme_weekly_399';
export const ENTITLEMENT_ID = 'premium';

let configured = false;

export function configureRevenueCat(userId?: string): void {
  if (configured) return;
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  if (!apiKey) return;
  Purchases.configure({ apiKey, appUserID: userId });
  configured = true;
}

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  expirationDate: string | null;
}

export function parseSubscriptionStatus(info: CustomerInfo): SubscriptionStatus {
  const entitlement = info.entitlements.active[ENTITLEMENT_ID];
  if (!entitlement) {
    return { isActive: false, isTrial: false, trialDaysLeft: 0, expirationDate: null };
  }

  const isTrial = entitlement.periodType === 'TRIAL';
  let trialDaysLeft = 0;
  if (isTrial && entitlement.expirationDate) {
    const msLeft = new Date(entitlement.expirationDate).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  }

  return {
    isActive: true,
    isTrial,
    trialDaysLeft,
    expirationDate: entitlement.expirationDate,
  };
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const info = await Purchases.getCustomerInfo();
    return parseSubscriptionStatus(info);
  } catch {
    return { isActive: false, isTrial: false, trialDaysLeft: 0, expirationDate: null };
  }
}

export async function getWeeklyOffering(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch {
    return null;
  }
}

export async function purchaseWeeklyTrial(): Promise<SubscriptionStatus> {
  const offering = await getWeeklyOffering();
  const weeklyPackage = offering?.availablePackages.find(
    (pkg) => pkg.product.identifier === WEEKLY_PRODUCT_ID
  ) ?? offering?.availablePackages[0];

  if (!weeklyPackage) {
    throw new Error('No subscription package available.');
  }

  const { customerInfo } = await Purchases.purchasePackage(weeklyPackage);
  return parseSubscriptionStatus(customerInfo);
}

export async function restorePurchases(): Promise<SubscriptionStatus> {
  const info = await Purchases.restorePurchases();
  return parseSubscriptionStatus(info);
}
