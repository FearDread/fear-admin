/**
 * App.jsx — React Native
 *
 * Replaces the web App.js (react-router-dom) with React Navigation.
 * Fonts are loaded HERE once — every screen inherits them, nothing
 * returns null waiting for its own font load.
 *
 * Navigator structure (mirrors APP_ROUTES from web App.js):
 *   AuthStack   → Login, Register, ForgotPassword, ResetPassword
 *   AppStack    → all public + protected screens inside a root Layout
 *
 * Auth routing:
 *   PrivateRoute / PublicRoute wrappers are NOT used here.
 *   Instead we swap the entire navigator based on isAuthenticated — the
 *   correct React Navigation pattern. PrivateRoute / PublicRoute can still
 *   be used for per-screen logic inside a stack if needed.
 *
 * Install:
 *   npx expo install @react-navigation/native @react-navigation/native-stack
 *   npx expo install react-native-screens react-native-safe-area-context
 *   npx expo install expo-font
 *   npx expo install @expo-google-fonts/anton
 *   npx expo install @expo-google-fonts/space-mono
 */

import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer }                  from '@react-navigation/native';
import { createNativeStackNavigator }           from '@react-navigation/native-stack';
import { useSelector }                          from 'react-redux';
import { useFonts, Anton_400Regular }           from '@expo-google-fonts/anton';
import {
  SpaceMono_400Regular,
  SpaceMono_400Regular_Italic,
} from '@expo-google-fonts/space-mono';

import { selectIsAuthenticated } from './features/user/slice';

import Home           from './screens/Home';          // your converted Home2
import AboutUs        from './screens/AboutUs';
// ── Screen imports ────────────────────────────────────────────────────────────
// Auth screens

import Login          from './pages/auth/Login';
import Register       from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword  from './pages/auth/ResetPassword';

// Public screens

import ContactUs      from './pages/ContactUs';
import Blog           from './pages/Blog';
import BlogPost       from './pages/BlogPost';
import Shop           from './pages/shop/Shop';
import ShopCart       from './pages/shop/ShopCart';
import ShopCategories from './pages/shop/ShopCategories';
import ProductDetails from './pages/products/ProductDetails';
import ProductComparison from './pages/products/ProductComparison';
import Wishlist       from './pages/Wishlist';
import FAQ            from './pages/Faq';

// Policy screens
import Terms          from './pages/policies/Terms';
import Privacy        from './pages/policies/Privacy';
import Returns        from './pages/policies/Returns';

// Protected screens
import Dashboard      from './pages/account/Dashboard';
import Orders         from './pages/account/Orders';
import UserDetails    from './pages/account/UserDetails';
import Addresses      from './pages/account/Addresses';
import PaymentMethods from './pages/account/PaymentMethods';

// Checkout screens
import CheckoutDetails  from './pages/checkout/CheckoutDetails';
import CheckoutShipping from './pages/checkout/CheckoutShipping';
import CheckoutPayment  from './pages/checkout/CheckoutPayment';
import CheckoutReview   from './pages/checkout/CheckoutReview';
import CheckoutComplete from './pages/checkout/CheckoutComplete';

// ── Navigators ────────────────────────────────────────────────────────────────
const AuthStack = createNativeStackNavigator();
const AppStack  = createNativeStackNavigator();

// Shared screen options — no header (screens handle their own headers)
const NO_HEADER = { headerShown: false };

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={NO_HEADER}>
      <AuthStack.Screen name="Login"          component={Login} />
      <AuthStack.Screen name="Register"       component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="ResetPassword"  component={ResetPassword} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={NO_HEADER} initialRouteName="Home">
      {/* Public */}
      <AppStack.Screen name="Home"              component={Home} />
      <AppStack.Screen name="About"             component={AboutUs} />
      <AppStack.Screen name="Contact"           component={ContactUs} />
      <AppStack.Screen name="Blog"              component={Blog} />
      <AppStack.Screen name="BlogPost"          component={BlogPost} />
      <AppStack.Screen name="Shop"              component={Shop} />
      <AppStack.Screen name="Cart"              component={ShopCart} />
      <AppStack.Screen name="ShopCategories"   component={ShopCategories} />
      <AppStack.Screen name="ProductDetails"   component={ProductDetails} />
      <AppStack.Screen name="ProductComparison" component={ProductComparison} />
      <AppStack.Screen name="Wishlist"          component={Wishlist} />
      <AppStack.Screen name="FAQ"               component={FAQ} />

      {/* Policies */}
      <AppStack.Screen name="Terms"    component={Terms} />
      <AppStack.Screen name="Privacy"  component={Privacy} />
      <AppStack.Screen name="Returns"  component={Returns} />

      {/* Protected — navigator-level auth check via PrivateRoute inside each screen */}
      <AppStack.Screen name="Dashboard"       component={Dashboard} />
      <AppStack.Screen name="Orders"          component={Orders} />
      <AppStack.Screen name="UserDetails"     component={UserDetails} />
      <AppStack.Screen name="Addresses"       component={Addresses} />
      <AppStack.Screen name="PaymentMethods"  component={PaymentMethods} />

      {/* Checkout */}
      <AppStack.Screen name="Checkout"         component={CheckoutDetails} />
      <AppStack.Screen name="CheckoutDetails"  component={CheckoutDetails} />
      <AppStack.Screen name="CheckoutShipping" component={CheckoutShipping} />
      <AppStack.Screen name="CheckoutPayment"  component={CheckoutPayment} />
      <AppStack.Screen name="CheckoutReview"   component={CheckoutReview} />
      <AppStack.Screen name="CheckoutComplete" component={CheckoutComplete} />
    </AppStack.Navigator>
  );
}

// ── Loading splash ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <View style={s.loading}>
      <ActivityIndicator size="large" color="#b30e1c" />
    </View>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function App() {
  // ── Load both fonts once for the entire app ──────────────────────────────
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular,
    SpaceMono_400Regular,
    SpaceMono_400Regular_Italic,
  });

  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If fonts fail, log but don't block the app
  useEffect(() => {
    if (fontError) console.warn('[App] Font load error:', fontError);
  }, [fontError]);

  // Show spinner until fonts are ready (prevents every screen returning null)
  if (!fontsLoaded && !fontError) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  loading: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: '#0d0d0d',
  },
});