import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.sideTab, pressed && styles.sideTabPressed]}
      accessibilityLabel={TAB_LABELS[routeName]}>
      <Ionicons
        name={TAB_ICONS[routeName] ?? 'ellipse-outline'}
        size={20}
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
    centerScale.value = withSpring(0.92, { stiffness: 500, damping: 20 });
  }, [centerScale]);

  const handleCenterPressOut = useCallback(() => {
    centerScale.value = withSpring(1, { stiffness: 500, damping: 20 });
  }, [centerScale]);

  const snapIndex = state.routes.findIndex((r) => r.name === 'snap');
  const studioIndex = state.routes.findIndex((r) => r.name === 'studio');
  const galerieIndex = state.routes.findIndex((r) => r.name === 'galerie');
  const studioFocused = state.index === studioIndex;

  return (
    <View style={[styles.container, { bottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <SideTab
          routeName="snap"
          focused={state.index === snapIndex}
          onPress={() => handlePress('snap', snapIndex)}
        />

        <AnimatedPressable
          onPress={() => handlePress('studio', studioIndex)}
          onPressIn={handleCenterPressIn}
          onPressOut={handleCenterPressOut}
          style={[styles.centerTab, centerStyle]}
          accessibilityLabel="Générer">
          <View style={[styles.centerIconWrap, studioFocused && styles.centerIconWrapActive]}>
            <Ionicons name="sparkles" size={18} color={studioFocused ? '#fff' : Colors.accent} />
          </View>
          <Text style={[styles.sideTabLabel, studioFocused && styles.sideTabLabelActive]}>Générer</Text>
        </AnimatedPressable>

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
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 68,
    borderRadius: 24,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderTopColor: Colors.reliefTop,
    borderLeftColor: Colors.reliefTop,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.reliefBottom,
    paddingHorizontal: 24,
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
    gap: 3,
    width: 64,
  },
  sideTabPressed: {
    opacity: 0.6,
  },
  sideTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  sideTabLabelActive: {
    color: Colors.textPrimary,
  },
  centerTab: {
    alignItems: 'center',
    gap: 3,
    width: 64,
  },
  centerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(108,92,231,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(108,92,231,0.35)',
  },
  centerIconWrapActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
});

export default NavBar;
