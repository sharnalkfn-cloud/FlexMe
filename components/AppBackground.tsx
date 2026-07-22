import React, { useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const BASE_COLOR = '#0A0A10';

// Exact CSS reference. react-native-web forwards unknown style keys like
// backgroundImage straight to the DOM node, so on web we use this verbatim
// instead of the SVG approximation below (which native platforms need,
// since there's no CSS engine there).
const WEB_BACKGROUND_IMAGE = [
  'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(100,210,50,0.35) 0%, transparent 70%)',
  'radial-gradient(circle at 85% 25%, rgba(139,92,246,0.18) 0%, transparent 50%)',
  'radial-gradient(circle at 10% 45%, rgba(59,130,246,0.14) 0%, transparent 45%)',
  'radial-gradient(circle at 50% 60%, rgba(236,72,153,0.08) 0%, transparent 40%)',
  'radial-gradient(circle at 20% 80%, rgba(20,184,166,0.10) 0%, transparent 42%)',
  'radial-gradient(circle at 80% 75%, rgba(251,146,60,0.09) 0%, transparent 38%)',
].join(', ');

interface GlowStop {
  id: string;
  cxFrac: number;
  cyFrac: number;
  rxFrac?: number;
  ryFrac?: number;
  color: [number, number, number, number];
  transparentAt: number;
}

const GLOWS: GlowStop[] = [
  { id: 'lime', cxFrac: 0.5, cyFrac: 0, rxFrac: 0.8, ryFrac: 0.35, color: [100, 210, 50, 0.35], transparentAt: 0.7 },
  { id: 'violet', cxFrac: 0.85, cyFrac: 0.25, color: [139, 92, 246, 0.18], transparentAt: 0.5 },
  { id: 'blue', cxFrac: 0.1, cyFrac: 0.45, color: [59, 130, 246, 0.14], transparentAt: 0.45 },
  { id: 'pink', cxFrac: 0.5, cyFrac: 0.6, color: [236, 72, 153, 0.08], transparentAt: 0.4 },
  { id: 'teal', cxFrac: 0.2, cyFrac: 0.8, color: [20, 184, 166, 0.1], transparentAt: 0.42 },
  { id: 'orange', cxFrac: 0.8, cyFrac: 0.75, color: [251, 146, 60, 0.09], transparentAt: 0.38 },
];

function farthestCornerDistance(cx: number, cy: number, width: number, height: number): number {
  const corners = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ];
  return Math.max(...corners.map(([x, y]) => Math.hypot(x - cx, y - cy)));
}

function NativeAppBackground() {
  const { width, height } = useWindowDimensions();

  const glows = useMemo(() => {
    return GLOWS.map((glow) => {
      const cx = glow.cxFrac * width;
      const cy = glow.cyFrac * height;
      const rx = glow.rxFrac !== undefined ? glow.rxFrac * width : farthestCornerDistance(cx, cy, width, height);
      const ry = glow.ryFrac !== undefined ? glow.ryFrac * height : rx;
      return { ...glow, cx, cy, rx, ry };
    });
  }, [width, height]);

  if (width === 0 || height === 0) {
    return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: BASE_COLOR }]} />;
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: BASE_COLOR }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Defs>
          {glows.map((glow) => {
            const [r, g, b, a] = glow.color;
            const transform = `translate(${glow.cx} ${glow.cy}) scale(${glow.rx} ${glow.ry})`;
            return (
              <RadialGradient
                key={glow.id}
                id={glow.id}
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform={transform}>
                <Stop offset={0} stopColor={`rgb(${r},${g},${b})`} stopOpacity={a} />
                <Stop offset={glow.transparentAt} stopColor={`rgb(${r},${g},${b})`} stopOpacity={0} />
                <Stop offset={1} stopColor={`rgb(${r},${g},${b})`} stopOpacity={0} />
              </RadialGradient>
            );
          })}
        </Defs>
        {glows.map((glow) => (
          <Rect key={glow.id} x={0} y={0} width={width} height={height} fill={`url(#${glow.id})`} />
        ))}
      </Svg>
    </View>
  );
}

export function AppBackground() {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: BASE_COLOR, backgroundImage: WEB_BACKGROUND_IMAGE } as never,
        ]}
      />
    );
  }
  return <NativeAppBackground />;
}

export default AppBackground;
