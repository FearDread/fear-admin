import { Stack, Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../features/store';

/**
 * Route group: (protected)
 * Maps to web routes: /account/**  /checkout/**
 *
 * Mirrors PrivateRoute – unauthenticated users are redirected to /login.
 * All screens inside this group can assume the user is signed in.
 */
export default function ProtectedLayout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="account" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
}