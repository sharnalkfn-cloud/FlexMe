import { Tabs } from 'expo-router';
import React from 'react';

import { NavBar } from '@/components/NavBar';
import { Colors } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.background },
      }}>
      <Tabs.Screen name="snap" options={{ title: 'Snap' }} />
      <Tabs.Screen name="studio" options={{ title: 'Studio' }} />
      <Tabs.Screen name="galerie" options={{ title: 'Galerie' }} />
    </Tabs>
  );
}
