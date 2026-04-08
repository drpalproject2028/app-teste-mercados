import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0A0A0A' },
            headerTintColor: '#FFFFFF',
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#0A0A0A' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="item/add"
            options={{
              presentation: 'modal',
              title: 'Nova Peça',
              headerStyle: { backgroundColor: '#0A0A0A' },
              headerTintColor: '#D4AF37',
              headerTitleStyle: { color: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="item/[id]"
            options={{
              presentation: 'modal',
              title: 'Detalhes',
              headerStyle: { backgroundColor: '#0A0A0A' },
              headerTintColor: '#D4AF37',
              headerTitleStyle: { color: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="outfit/generate"
            options={{
              presentation: 'fullScreenModal',
              title: 'Gerar Outfit',
              headerStyle: { backgroundColor: '#0A0A0A' },
              headerTintColor: '#D4AF37',
              headerTitleStyle: { color: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              presentation: 'modal',
              title: 'Definições',
              headerStyle: { backgroundColor: '#0A0A0A' },
              headerTintColor: '#D4AF37',
              headerTitleStyle: { color: '#FFFFFF' },
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
