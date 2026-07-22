import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaceCapture, type CapturedFace } from '@/components/FaceCapture';
import { GlassCard } from '@/components/GlassCard';
import { Colors, Radius } from '@/constants/colors';
import { useFaces } from '@/hooks/useFaces';

const ANGLES: CapturedFace['angle'][] = ['Front', 'Left', 'Right'];
const TIPS = ['Good lighting', 'Face visible', 'No glasses'];

export default function FaceScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { faces, addFace } = useFaces();
  const [angleIndex, setAngleIndex] = useState(0);

  const currentAngle = ANGLES[Math.min(angleIndex, ANGLES.length - 1)];
  const isDone = angleIndex >= ANGLES.length;

  const handleCapture = useCallback(
    async (face: CapturedFace) => {
      await addFace(face);
      setAngleIndex((prev) => Math.min(prev + 1, ANGLES.length));
    },
    [addFace]
  );

  const handleContinue = useCallback(() => {
    router.push('/auth');
  }, [router]);

  const progressText = useMemo(
    () => `${Math.min(angleIndex + 1, ANGLES.length)}/${ANGLES.length}`,
    [angleIndex]
  );

  return (
    <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Scan Your Face</Text>
        <Text style={styles.subtitle}>Take 3-5 photos for best results</Text>

        {!isDone ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Angle: {currentAngle}</Text>
              <Text style={styles.progressCount}>{progressText}</Text>
            </View>
            <FaceCapture angle={currentAngle} onCapture={handleCapture} />
          </>
        ) : (
          <GlassCard style={styles.doneCard}>
            <Text style={styles.doneText}>All angles captured</Text>
          </GlassCard>
        )}

        {faces.length > 0 && (
          <View style={styles.thumbnailsRow}>
            {faces.map((face, i) => (
              <Image key={`${face.angle}-${i}`} source={{ uri: face.uri }} style={styles.thumbnail} />
            ))}
          </View>
        )}

        <GlassCard style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips</Text>
          <View style={styles.tipsList}>
            {TIPS.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </ScrollView>

      <Pressable
        style={[
          styles.continueButton,
          { marginBottom: insets.bottom + 20 },
          faces.length === 0 && styles.continueDisabled,
        ]}
        onPress={handleContinue}
        disabled={faces.length === 0}>
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  doneCard: {
    padding: 40,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  tipsCard: {
    marginTop: 24,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  continueButton: {
    marginHorizontal: 24,
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    borderRadius: Radius.button,
    alignItems: 'center',
  },
  continueDisabled: {
    opacity: 0.4,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08080c',
  },
});
