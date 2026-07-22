import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  explore: 'compass',
  generate: 'sparkles',
  history: 'time',
  profile: 'person',
};

const TAB_ICONS_OUTLINE: Record<string, keyof typeof Ionicons.glyphMap> = {
  explore: 'compass-outline',
  generate: 'sparkles-outline',
  history: 'time-outline',
  profile: 'person-outline',
};

const TAB_LABELS: Record<string, string> = {
  explore: 'Explore',
  generate: 'Generate',
  history: 'History',
  profile: 'Profile',
};

function TabItem({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const activeBgStyle = useAnimatedStyle(() => ({
    opacity: withSpring(focused ? 1 : 0, { stiffness: 400, damping: 28 }),
    transform: [{ scale: withSpring(focused ? 1 : 0.8, { stiffness: 400, damping: 28 }) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(focused ? 1.08 : 1, { stiffness: 460, damping: 22 }) },
      { translateY: withSpring(focused ? -1 : 0, { stiffness: 460, damping: 22 }) },
    ],
  }));

  const iconName = (focused ? TAB_ICONS[routeName] : TAB_ICONS_OUTLINE[routeName]) ?? 'ellipse';

  return (
    <Pressable onPress={onPress} style={styles.tabButton} accessibilityLabel={TAB_LABELS[routeName] ?? routeName}>
      <Animated.View style={[styles.activeBg, activeBgStyle]} />
      <Animated.View style={iconStyle}>
        <Ionicons
          name={iconName}
          size={20}
          color={focused ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.48)'}
        />
      </Animated.View>
    </Pressable>
  );
}

export function NavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(
    (routeName: string, index: number) => {
      Haptics.selectionAsync();
      const isFocused = state.index === index;
      if (!isFocused) {
        navigation.navigate(routeName);
      }
    },
    [navigation, state.index]
  );

  return (
    <View style={[styles.container, { bottom: insets.bottom + 14 }]} pointerEvents="box-none">
      <View style={styles.pillWrapper}>
        <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFillObject} />
        <View style={styles.row}>
          {state.routes.map((route, index) => (
            <TabItem
              key={route.key}
              routeName={route.name}
              focused={state.index === index}
              onPress={() => handlePress(route.name, index)}
            />
          ))}
        </View>
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
  pillWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  tabButton: {
    width: 54,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBg: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    bottom: 0,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
});

export default NavBar;
