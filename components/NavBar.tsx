import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
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

interface TabLayout {
  x: number;
  width: number;
}

function TabItem({
  routeName,
  focused,
  onPress,
  onLayout,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const pressScale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(focused ? 1.08 : 1, { stiffness: 460, damping: 22 }) },
      { translateY: withSpring(focused ? -1 : 0, { stiffness: 460, damping: 22 }) },
    ],
  }));

  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(0.86, { stiffness: 500, damping: 22 });
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSpring(1, { stiffness: 500, damping: 22 });
  }, [pressScale]);

  const iconName = (focused ? TAB_ICONS[routeName] : TAB_ICONS_OUTLINE[routeName]) ?? 'ellipse';

  return (
    <Animated.View style={pressStyle} onLayout={onLayout}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.tabButton}
        accessibilityLabel={TAB_LABELS[routeName] ?? routeName}>
        <Animated.View style={iconStyle}>
          <Ionicons
            name={iconName}
            size={20}
            color={focused ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.48)'}
            style={
              focused
                ? {
                    textShadowColor: 'rgba(255,255,255,0.6)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 6,
                  }
                : undefined
            }
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function NavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState(false);

  const layouts = useRef<Record<number, TabLayout>>({});
  const hasSnappedInitial = useRef(false);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);
  const mountOpacity = useSharedValue(0);
  const mountTranslateY = useSharedValue(60);

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
      if (enabled) {
        mountOpacity.value = 1;
        mountTranslateY.value = 0;
      } else {
        mountOpacity.value = withDelay(100, withSpring(1, { stiffness: 260, damping: 26 }));
        mountTranslateY.value = withDelay(100, withSpring(0, { stiffness: 260, damping: 26 }));
      }
    });
  }, [mountOpacity, mountTranslateY]);

  const moveIndicatorTo = useCallback(
    (index: number, animate: boolean) => {
      const layout = layouts.current[index];
      if (!layout) return;
      if (animate && !reduceMotion) {
        indicatorX.value = withSpring(layout.x, { stiffness: 400, damping: 28 });
        indicatorWidth.value = withSpring(layout.width, { stiffness: 400, damping: 28 });
      } else {
        indicatorX.value = layout.x;
        indicatorWidth.value = layout.width;
      }
      indicatorOpacity.value = withTiming(1, { duration: reduceMotion ? 0 : 150 });
    },
    [indicatorOpacity, indicatorWidth, indicatorX, reduceMotion]
  );

  const handleLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      layouts.current[index] = { x, width };
      if (index === state.index && !hasSnappedInitial.current) {
        hasSnappedInitial.current = true;
        moveIndicatorTo(index, false);
      }
    },
    [moveIndicatorTo, state.index]
  );

  React.useEffect(() => {
    if (hasSnappedInitial.current) {
      moveIndicatorTo(state.index, true);
    }
  }, [moveIndicatorTo, state.index]);

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

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  const mountStyle = useAnimatedStyle(() => ({
    opacity: mountOpacity.value,
    transform: [{ translateY: mountTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, { bottom: insets.bottom + 14 }, mountStyle]}
      pointerEvents="box-none">
      <View style={styles.pillWrapper}>
        <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFillObject} />
        <View style={styles.row}>
          <Animated.View style={[styles.activeBg, indicatorStyle]} pointerEvents="none" />
          {state.routes.map((route, index) => (
            <TabItem
              key={route.key}
              routeName={route.name}
              focused={state.index === index}
              onPress={() => handlePress(route.name, index)}
              onLayout={handleLayout(index)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
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
    left: 0,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
});

export default NavBar;
