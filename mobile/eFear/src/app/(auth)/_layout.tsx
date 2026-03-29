import { Stack, Redirect, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from "../../features/user/slice";

/**
 * Route group: (protected)
 * Maps to web routes: /account/**  /checkout/**
 *
 * Mirrors PrivateRoute – unauthenticated users are redirected to /login.
 * All screens inside this group can assume the user is signed in.
 */
export default function AuthLayout() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return router.push("/(protected)/login");
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}