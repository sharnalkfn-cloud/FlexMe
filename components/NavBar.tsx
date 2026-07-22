import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  AccessibilityInfo,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
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

const EXPAND_TRANSITION = { stiffness: 260, damping: 24 };

function TabItem({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const [labelWidth, setLabelWidth] = useState(0);

  const paddingHorizontal = useSharedValue(8);
  const labelProgress = useSharedValue(0);

  React.useEffect(() => {
    paddingHorizontal.value = withSpring(focused ? 16 : 8, EXPAND_TRANSITION);
    labelProgress.value = withSpring(focused ? 1 : 0, EXPAND_TRANSITION);
  }, [focused, labelProgress, paddingHorizontal]);

  const buttonStyle = useAnimatedStyle(() => ({
    paddingHorizontal: paddingHorizontal.value,
    backgroundColor: focused ? 'rgba(255,255,255,0.10)' : 'transparent',
  }));

  const labelStyle = useAnimatedStyle(() => ({
    width: labelProgress.value * labelWidth,
    opacity: labelProgress.value,
    marginLeft: labelProgress.value * 6,
  }));

  const handleMeasureLabel = useCallback((e: LayoutChangeEvent) => {
    setLabelWidth(e.nativeEvent.layout.width);
  }, []);

  const iconName = (focused ? TAB_ICONS[routeName] : TAB_ICONS_OUTLINE[routeName]) ?? 'ellipse';
  const label = TAB_LABELS[routeName] ?? routeName;

  return (
    <Pressable onPress={onPress} accessibilityLabel={label}>
      <Animated.View style={[styles.tabButton, buttonStyle]}>
        <Ionicons
          name={iconName}
          size={18}
          color={focused ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.48)'}
        />
        <Animated.View style={[styles.labelWrap, labelStyle]}>
          <Text style={styles.labelText} numberOfLines={1}>
            {label}
          </Text>
        </Animated.View>
        {/* Offscreen measure pass: captures the label's natural width once. */}
        <Text style={styles.labelMeasure} onLayout={handleMeasureLabel}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function NavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const mountOpacity = useSharedValue(0);
  const mountTranslateY = useSharedValue(60);

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (enabled) {
        mountOpacity.value = 1;
        mountTranslateY.value = 0;
      } else {
        mountOpacity.value = withDelay(100, withSpring(1, { stiffness: 260, damping: 26 }));
        mountTranslateY.value = withDelay(100, withSpring(0, { stiffness: 260, damping: 26 }));
      }
    });
  }, [mountOpacity, mountTranslateY]);

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

  const mountStyle = useAnimatedStyle(() => ({
    opacity: mountOpacity.value,
    transform: [{ translateY: mountTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, { bottom: insets.bottom + 14 }, mountStyle]}
      pointerEvents="box-none">
      <View style={styles.pillWrapper}>
        {Platform.OS === 'web' ? (
          // Safari breaks backdrop-filter when an ancestor has a CSS
          // transform (react-navigation's screen containers do), rendering
          // it as opaque white. Use a flat translucent fill on web instead.
          <View style={[StyleSheet.absoluteFillObject, styles.webGlassFallback]} />
        ) : (
          <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFillObject} />
        )}
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
  webGlassFallback: {
    backgroundColor: 'rgba(10,10,16,0.72)',
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
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 14,
    overflow: 'hidden',
  },
  labelWrap: {
    overflow: 'hidden',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)',
  },
  labelMeasure: {
    position: 'absolute',
    opacity: 0,
    fontSize: 13,
    fontWeight: '700',
    left: 9999,
  },
});

export default NavBar;
