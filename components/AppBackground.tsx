import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

export function AppBackground() {
  return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.background }]} />;
}

export default AppBackground;
