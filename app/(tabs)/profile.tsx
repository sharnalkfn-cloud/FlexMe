import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { User } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { Colors, Radius } from '@/constants/colors';
import { getGenerationHistory } from '@/hooks/useGemini';
import { useFaces } from '@/hooks/useFaces';
import { useSubscription } from '@/hooks/useSubscription';
import { onAuthStateChanged, signOut, updateUserProfile } from '@/services/firebase';

const APP_VERSION = '1.0.0';

const SETTINGS_ITEMS = [
  { icon: 'notifications-outline' as const, label: 'Notifications' },
  { icon: 'language-outline' as const, label: 'Language' },
  { icon: 'lock-closed-outline' as const, label: 'Privacy' },
  { icon: 'star-outline' as const, label: 'Rate FlexMe' },
  { icon: 'share-social-outline' as const, label: 'Share App' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { faces, addFace } = useFaces();
  const { status, purchasing, startTrial } = useSubscription();
  const [user, setUser] = useState<User | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [publicFeed, setPublicFeed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    getGenerationHistory().then((history) => setGeneratedCount(history.length));
  }, []);

  const handleTogglePublicFeed = useCallback(
    async (value: boolean) => {
      setPublicFeed(value);
      if (user) {
        await updateUserProfile(user.uid, { publicFeed: value }).catch(() => {});
      }
    },
    [user]
  );

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }, []);

  const handleUpgrade = useCallback(() => {
    startTrial();
  }, [startTrial]);

  const handleManageFaces = useCallback(async () => {
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

  const subscriptionLabel = status.isActive
    ? status.isTrial
      ? `${status.trialDaysLeft} days left in trial`
      : 'Premium Active'
    : 'Upgrade';

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}>
        <View style={styles.headerSection}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color={Colors.textPrimary} />
            </View>
          )}
          <Text style={styles.displayName}>{user?.displayName ?? 'FlexMe User'}</Text>
          <Text style={styles.handle}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.statsRow}>
          <GlassCard style={styles.statChip}>
            <Text style={styles.statValue}>{generatedCount}</Text>
            <Text style={styles.statLabel}>Generated</Text>
          </GlassCard>
          <GlassCard style={styles.statChip}>
            <Text style={styles.statValue}>{faces.length}</Text>
            <Text style={styles.statLabel}>Scenes</Text>
          </GlassCard>
          <GlassCard style={styles.statChip}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </GlassCard>
        </View>

        <GlassCard style={[styles.subscriptionCard, status.isActive && styles.subscriptionCardGold]}>
          <Text style={[styles.subscriptionLabel, status.isActive && styles.subscriptionLabelGold]}>
            {subscriptionLabel}
          </Text>
          {!status.isActive && (
            <Pressable style={styles.upgradeButton} onPress={handleUpgrade} disabled={purchasing}>
              <Text style={styles.upgradeButtonText}>{purchasing ? 'Please wait…' : 'Upgrade'}</Text>
            </Pressable>
          )}
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Face Photos</Text>
          <GlassCard style={styles.facesCard}>
            {faces.length === 0 ? (
              <Text style={styles.facesEmpty}>No face photos saved yet.</Text>
            ) : (
              <View style={styles.faceThumbRow}>
                {faces.map((face, i) => (
                  <Image key={`${face.uri}-${i}`} source={{ uri: face.uri }} style={styles.faceThumb} />
                ))}
              </View>
            )}
            <Pressable style={styles.manageFacesButton} onPress={handleManageFaces}>
              <Text style={styles.manageFacesText}>Add face photo</Text>
            </Pressable>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <GlassCard style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Public feed</Text>
              <Switch
                value={publicFeed}
                onValueChange={handleTogglePublicFeed}
                trackColor={{ true: Colors.accent, false: Colors.glassBorder }}
              />
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <GlassCard style={styles.settingsCard}>
            {SETTINGS_ITEMS.map((item, i) => (
              <View
                key={item.label}
                style={[styles.settingRow, i < SETTINGS_ITEMS.length - 1 && styles.settingRowBorder]}>
                <Ionicons name={item.icon} size={18} color={Colors.textPrimary} />
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            ))}
          </GlassCard>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Text style={styles.versionText}>Version {APP_VERSION}</Text>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  handle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  subscriptionCard: {
    marginHorizontal: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subscriptionCardGold: {
    borderColor: Colors.gold,
  },
  subscriptionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subscriptionLabelGold: {
    color: Colors.gold,
  },
  upgradeButton: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#08080c',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  facesCard: {
    padding: 16,
  },
  facesEmpty: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  faceThumbRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  faceThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  manageFacesButton: {
    marginTop: 14,
  },
  manageFacesText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  toggleCard: {
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingsCard: {
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  settingRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.glassBorder,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  signOutButton: {
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.red,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 8,
  },
});
