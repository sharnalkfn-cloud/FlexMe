import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius } from '@/constants/colors';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  explore: 'compass',
  generate: 'sparkles',
  history: 'time',
  profile: 'person',
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
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1 : 0.94, { damping: 14 }) }],
  }));

  const iconName = TAB_ICONS[routeName] ?? 'ellipse';

  return (
    <Pressable onPress={onPress} style={styles.tabPressable}>
      <Animated.View
        style={[
          styles.tabItem,
          animatedStyle,
          focused ? styles.tabItemActive : null,
        ]}>
        <Ionicons
          name={iconName}
          size={18}
          color={focused ? '#08080c' : Colors.textPrimary}
        />
        {focused && (
          <Text style={styles.tabLabel} numberOfLines={1}>
            {TAB_LABELS[routeName] ?? routeName}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function NavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(
    (routeName: string, index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const isFocused = state.index === index;
      if (!isFocused) {
        navigation.navigate(routeName);
      }
    },
    [navigation, state.index]
  );

  return (
    <View style={[styles.container, { bottom: insets.bottom + 32 }]} pointerEvents="box-none">
      <View style={styles.pillWrapper}>
        <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
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
    borderRadius: Radius.pill,
    overflow: 'hidden',
    backgroundColor: Colors.glassBg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  tabPressable: {
    marginHorizontal: 2,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.pill,
  },
  tabItemActive: {
    backgroundColor: Colors.textPrimary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08080c',
  },
});

export default NavBar;
