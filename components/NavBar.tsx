import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
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
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius } from '@/constants/colors';

// Real native blur on iOS/Android via expo-blur. On web, expo-blur's
// BlurView has previously rendered as opaque white in this app (a WebKit
// backdrop-filter + transformed-ancestor bug), so web gets its own CSS
// backdrop-filter applied directly via style, with an opaque-enough
// fallback backgroundColor underneath in case the browser doesn't support
// backdrop-filter at all — it still reads as a solid glass pill either way.
function NavBarBlur() {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: 'rgba(20,19,24,0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          } as never,
        ]}
      />
    );
  }
  return <BlurView tint="dark" intensity={65} style={StyleSheet.absoluteFillObject} />;
}

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  snap: 'camera-outline',
  studio: 'sparkles-outline',
  galerie: 'folder-outline',
};

const TAB_ICONS_ACTIVE: Record<string, keyof typeof Ionicons.glyphMap> = {
  snap: 'camera',
  studio: 'sparkles',
  galerie: 'folder',
};

const TAB_LABELS: Record<string, string> = {
  snap: 'Outfit',
  studio: 'Générer',
  galerie: 'Galerie',
};

const PILL_TRANSITION = { stiffness: 260, damping: 24 };

function Tab({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const [labelWidth, setLabelWidth] = useState(0);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, PILL_TRANSITION);
  }, [focused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.85 + progress.value * 0.15 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    width: progress.value * labelWidth,
    opacity: progress.value,
    marginLeft: progress.value * 4,
  }));

  const handleMeasureLabel = useCallback((e: LayoutChangeEvent) => {
    setLabelWidth(e.nativeEvent.layout.width);
  }, []);

  const label = TAB_LABELS[routeName] ?? routeName;
  const iconName = (focused ? TAB_ICONS_ACTIVE[routeName] : TAB_ICONS[routeName]) ?? 'ellipse-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
      accessibilityLabel={label}>
      <Animated.View style={[styles.tabPill, pillStyle]} />
      <View style={styles.tabIconWrap}>
        <Ionicons name={iconName} size={20} color={focused ? '#fff' : Colors.textMuted} />
      </View>
      <Animated.View style={[styles.tabLabelWrap, labelStyle]}>
        <Text style={styles.tabLabelText} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
      <Text style={styles.labelMeasure} onLayout={handleMeasureLabel} pointerEvents="none">
        {label}
      </Text>
    </Pressable>
  );
}

export function NavBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(
    (routeName: string, index: number) => {
      Haptics.selectionAsync();
      if (state.index !== index) {
        navigation.navigate(routeName);
      }
    },
    [navigation, state.index]
  );

  return (
    <View style={[styles.container, { bottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <NavBarBlur />
        {state.routes.map((route, index) => (
          <Tab
            key={route.key}
            routeName={route.name}
            focused={state.index === index}
            onPress={() => handlePress(route.name, index)}
          />
        ))}
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 60,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 22,
    gap: 22,
  },
  tab: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexGrow: 0,
    flexShrink: 0,
    height: 42,
    minWidth: 42,
    paddingHorizontal: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  tabIconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPressed: {
    opacity: 0.75,
  },
  tabPill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
  },
  tabLabelWrap: {
    overflow: 'hidden',
  },
  tabLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  labelMeasure: {
    position: 'absolute',
    opacity: 0,
    top: 0,
    left: 0,
    zIndex: -1,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default NavBar;
