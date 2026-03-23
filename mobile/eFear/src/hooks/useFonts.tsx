import { useFonts } from 'expo-font';
import {
  Anton_400Regular,
} from '@expo-google-fonts/anton';
import {
  SpaceMono_400Regular,
  SpaceMono_400Regular_Italic,
} from '@expo-google-fonts/space-mono';

/**
 * useEfearFonts
 *
 * Call once at the root of the app (app/_layout.tsx).
 * Blocks the splash screen until both fonts are ready.
 *
 * Required packages:
 *   npx expo install expo-font @expo-google-fonts/anton @expo-google-fonts/space-mono
 */
export function useFearFonts() {
  const [fontsLoaded, fontError] = useFonts({
    Anton: Anton_400Regular,
    SpaceMono: SpaceMono_400Regular,
    'SpaceMono-Italic': SpaceMono_400Regular_Italic,
  });

  return { fontsLoaded, fontError };
}