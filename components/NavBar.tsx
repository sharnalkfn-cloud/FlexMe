import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Gradients } from '@/constants/colors';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  snap: 'camera-outline',
  galerie: 'folder-outline',
};

const TAB_LABELS: Record<string, string> = {
  snap: 'Snap',
  galerie: 'Galerie',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SideTab({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.sideTab} accessibilityLabel={TAB_LABELS[routeName]}>
      <Ionicons
        name={TAB_ICONS[routeName] ?? 'ellipse-outline'}
        size={22}
        color={focused ? Colors.textPrimary : Colors.textMuted}
      />
      <Text style={[styles.sideTabLabel, focused && styles.sideTabLabelActive]}>
        {TAB_LABELS[routeName] ?? routeName}
      </Text>
    </Pressable>
  );
}

export function NavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const centerScale = useSharedValue(1);

  const centerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerScale.value }],
  }));

  const handlePress = useCallback(
    (routeName: string, index: number) => {
      Haptics.selectionAsync();
      if (state.index !== index) {
        navigation.navigate(routeName);
      }
    },
    [navigation, state.index]
  );

  const handleCenterPressIn = useCallback(() => {
    centerScale.value = withSpring(0.9, { stiffness: 500, damping: 20 });
  }, [centerScale]);

  const handleCenterPressOut = useCallback(() => {
    centerScale.value = withSpring(1, { stiffness: 500, damping: 20 });
  }, [centerScale]);

  const snapIndex = state.routes.findIndex((r) => r.name === 'snap');
  const studioIndex = state.routes.findIndex((r) => r.name === 'studio');
  const galerieIndex = state.routes.findIndex((r) => r.name === 'galerie');

  return (
    <View style={[styles.container, { bottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <SideTab
          routeName="snap"
          focused={state.index === snapIndex}
          onPress={() => handlePress('snap', snapIndex)}
        />

        <View style={styles.centerSlot}>
          <AnimatedPressable
            onPress={() => handlePress('studio', studioIndex)}
            onPressIn={handleCenterPressIn}
            onPressOut={handleCenterPressOut}
            style={[styles.centerButton, centerStyle]}
            accessibilityLabel="Studio">
            <LinearGradient colors={Gradients.accent} style={StyleSheet.absoluteFillObject} />
            <Ionicons name="sparkles" size={24} color="#fff" />
          </AnimatedPressable>
        </View>

        <SideTab
          routeName="galerie"
          focused={state.index === galerieIndex}
          onPress={() => handlePress('galerie', galerieIndex)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 260,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderTopColor: Colors.reliefTop,
    borderLeftColor: Colors.reliefTop,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.reliefBottom,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  sideTab: {
    alignItems: 'center',
    gap: 2,
    width: 56,
  },
  sideTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  sideTabLabelActive: {
    color: Colors.textPrimary,
  },
  centerSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: -28,
    borderWidth: 3,
    borderColor: Colors.background,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default NavBar;
