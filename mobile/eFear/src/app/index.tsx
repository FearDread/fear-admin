import { Redirect } from 'expo-router';

/**
 * The app root just redirects to the public home screen.
 * Expo Router will match app/(public)/index.tsx as the home.
 */
export default function Index() {
  return <Redirect href="/(public)" />;
}