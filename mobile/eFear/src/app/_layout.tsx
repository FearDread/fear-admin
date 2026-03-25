import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from '../features/store';
import { useFearFonts } from '../hooks/useFearFonts';
import { Colors } from '../constants/theme';

// Hold splash screen until eFear fonts (Anton + Space Mono) are loaded
SplashScreen.preventAutoHideAsync();

function Providers({ children }: { children: React.ReactNode }) {
  return ( <SafeAreaProvider>
    <Provider store={store}>{children}</Provider>
  </SafeAreaProvider> );
}

export default function RootLayout() {
  const { fontsLoaded, fontError } = useFearFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Providers>
      <StatusBar style="light" backgroundColor={Colors.dark0} />
      <Stack
        screenOptions={{headerShown: false, contentStyle: { backgroundColor: Colors.dark0 } }}
      >
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </Providers>
  );
}