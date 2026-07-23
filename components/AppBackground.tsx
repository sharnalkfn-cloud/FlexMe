import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

// Subtle radial highlight top-center fading into the base dark gray, giving
// the flat background a touch of depth ("relief") instead of a single flat
// fill. CSS radial-gradient on web (react-native-web forwards unknown style
// keys like backgroundImage straight to the DOM), a soft diagonal
// LinearGradient overlay on native since there's no CSS engine there.
const WEB_BACKGROUND_IMAGE = [
  'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)',
  'radial-gradient(ellipse 70% 40% at 50% 100%, rgba(0,0,0,0.35) 0%, transparent 70%)',
].join(', ');

export function AppBackground() {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: Colors.background, backgroundImage: WEB_BACKGROUND_IMAGE } as never,
        ]}
      />
    );
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.background }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'transparent', 'rgba(0,0,0,0.3)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

export default AppBackground;
