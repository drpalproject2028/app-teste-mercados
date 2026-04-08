import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: '#0F0F0F',
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        headerStyle: { backgroundColor: Colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { color: Colors.text, fontWeight: '700', fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Guarda-Roupa',
          tabBarLabel: 'Roupa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Os Meus Outfits',
          tabBarLabel: 'Outfits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
