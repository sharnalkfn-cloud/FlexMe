import { Tabs } from 'expo-router';
import React from 'react';

import { NavBar } from '@/components/NavBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}>
      <Tabs.Screen name="snap" options={{ title: 'Snap' }} />
      <Tabs.Screen name="studio" options={{ title: 'Studio' }} />
      <Tabs.Screen name="galerie" options={{ title: 'Galerie' }} />
    </Tabs>
  );
}
