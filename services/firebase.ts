import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import * as firebaseAuthModule from 'firebase/auth';
import {
  GoogleAuthProvider,
  OAuthProvider,
  browserLocalPersistence,
  initializeAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type Auth,
  type Persistence,
  type User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import {
  doc,
  getDoc,
  getFirestore,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadString, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

// Without real credentials, initializing the Firebase SDK throws immediately
// (auth/invalid-api-key) and takes the whole app down with it. In that case we
// fall back to a local in-memory auth/store stand-in so the UI stays testable.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  const firebaseApp = initializeApp(firebaseConfig);

  // getReactNativePersistence is resolved via Metro's "react-native" package
  // export condition on native platforms but doesn't exist on web, where
  // firebase/auth resolves to the browser build instead.
  auth =
    Platform.OS === 'web'
      ? initializeAuth(firebaseApp, { persistence: browserLocalPersistence })
      : initializeAuth(firebaseApp, {
          persistence: (
            firebaseAuthModule as typeof firebaseAuthModule & {
              getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
            }
          ).getReactNativePersistence(AsyncStorage),
        });

  firestore = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
} else if (__DEV__) {
  console.warn(
    '[FlexMe] Firebase env vars are missing (EXPO_PUBLIC_FIREBASE_*) — running with a local demo auth stub. Sign-in and cloud sync are disabled.'
  );
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  faces: string[];
  generationsCount: number;
  publicFeed: boolean;
  createdAt: unknown;
  onboardingComplete: boolean;
}

// --- Demo auth stub (used only when Firebase isn't configured) ---
let demoUser: User | null = null;
const demoListeners = new Set<(user: User | null) => void>();

function notifyDemoListeners(): void {
  demoListeners.forEach((listener) => listener(demoUser));
}

function makeDemoUser(displayName: string, email: string): User {
  return {
    uid: 'demo-user',
    displayName,
    email,
    photoURL: null,
  } as User;
}

/**
 * Use this instead of importing onAuthStateChanged from 'firebase/auth' directly,
 * so screens keep working when running without real Firebase credentials.
 */
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    return firebaseOnAuthStateChanged(auth, callback);
  }
  demoListeners.add(callback);
  callback(demoUser);
  return () => demoListeners.delete(callback);
}

export async function signInWithGoogleIdToken(idToken: string): Promise<User> {
  if (isFirebaseConfigured && auth) {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    await ensureUserDocument(result.user);
    return result.user;
  }
  demoUser = makeDemoUser('Demo User', 'demo@flexme.app');
  notifyDemoListeners();
  return demoUser;
}

export async function signInWithAppleCredential(
  identityToken: string,
  nonce?: string
): Promise<User> {
  if (isFirebaseConfigured && auth) {
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({ idToken: identityToken, rawNonce: nonce });
    const result = await signInWithCredential(auth, credential);
    await ensureUserDocument(result.user);
    return result.user;
  }
  demoUser = makeDemoUser('Demo User', 'demo@flexme.app');
  notifyDemoListeners();
  return demoUser;
}

export async function signOut(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
    return;
  }
  demoUser = null;
  notifyDemoListeners();
}

async function ensureUserDocument(user: User): Promise<void> {
  if (!firestore) return;
  const userRef = doc(firestore, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName ?? 'FlexMe User',
      email: user.email ?? '',
      photoURL: user.photoURL,
      faces: [],
      generationsCount: 0,
      publicFeed: false,
      createdAt: serverTimestamp(),
      onboardingComplete: false,
    };
    await setDoc(userRef, profile);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!firestore) return null;
  const snapshot = await getDoc(doc(firestore, 'users', uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  if (!firestore) return;
  await updateDoc(doc(firestore, 'users', uid), data);
}

export function listenToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
): () => void {
  if (!firestore) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(firestore!, 'users', uid), (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
  });
}

export async function incrementGenerationCount(uid: string): Promise<void> {
  if (!firestore) return;
  await updateDoc(doc(firestore, 'users', uid), {
    generationsCount: increment(1),
  });
}

export async function uploadFacePhoto(uid: string, base64Jpeg: string, index: number): Promise<string> {
  if (!storage) return '';
  const storageRef = ref(storage, `faces/${uid}/${index}.jpg`);
  await uploadString(storageRef, base64Jpeg, 'base64', { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

export async function uploadGeneratedImage(
  uid: string,
  base64Jpeg: string,
  generationId: string
): Promise<string> {
  if (!storage) return '';
  const storageRef = ref(storage, `generations/${uid}/${generationId}.jpg`);
  await uploadString(storageRef, base64Jpeg, 'base64', { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}
