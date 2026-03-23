/**
 * App.jsx — updated to use Layout wrapper for all app screens
 *
 * The web Layout used <Outlet> to inject screen content.
 * In RN we wrap each screen component with Layout so every screen
 * automatically gets: Header2 + scroll-to-top + BestSelling + Footer2
 * + cookie banner + product/category data fetch.
 *
 * Screens that should NOT have the layout (auth flow) stay bare.
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
import Layout from './pages/Layout';

// ── Auth screens (no header/footer) ─────────────────────────────────────────
/*
import Login          from './pages/auth/Login';
import Register       from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword  from './pages/auth/ResetPassword';
*/
// ── App screens (all wrapped in Layout) ─────────────────────────────────────
import Home           from './screens/Home';
import AboutUs        from './screens/AboutUs';
/*
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
import Terms          from './pages/policies/Terms';
import Privacy        from './pages/policies/Privacy';
import Returns        from './pages/policies/Returns';
import Dashboard      from './pages/account/Dashboard';
import Orders         from './pages/account/Orders';
import UserDetails    from './pages/account/UserDetails';
import Addresses      from './pages/account/Addresses';
import PaymentMethods from './pages/account/PaymentMethods';
import CheckoutDetails  from './pages/checkout/CheckoutDetails';
import CheckoutShipping from './pages/checkout/CheckoutShipping';
import CheckoutPayment  from './pages/checkout/CheckoutPayment';
import CheckoutReview   from './pages/checkout/CheckoutReview';
import CheckoutComplete from './pages/checkout/CheckoutComplete';
*/
// ── Helper: wrap any screen component in Layout ───────────────────────────────
function withLayout(ScreenComponent) {
  return function LayoutWrapped(props) {
    return (
      <Layout>
        <ScreenComponent {...props} />
      </Layout>
    );
  };
}

// ── Navigators ────────────────────────────────────────────────────────────────
const AuthStack = createNativeStackNavigator();
const AppStack  = createNativeStackNavigator();
const NO_HEADER = { headerShown: false };

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={NO_HEADER}>
      {/*
      <AuthStack.Screen name="Login"          component={Login} />
      <AuthStack.Screen name="Register"       component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="ResetPassword"  component={ResetPassword} />
      */}
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={NO_HEADER} initialRouteName="Home">
      <AppStack.Screen name="Home"              component={withLayout(Home)} />
      <AppStack.Screen name="About"             component={withLayout(AboutUs)} />
      {/* 
      <AppStack.Screen name="Contact"           component={withLayout(ContactUs)} />
      <AppStack.Screen name="Blog"              component={withLayout(Blog)} />
      <AppStack.Screen name="BlogPost"          component={withLayout(BlogPost)} />
      <AppStack.Screen name="Shop"              component={withLayout(Shop)} />
      <AppStack.Screen name="Cart"              component={withLayout(ShopCart)} />
      <AppStack.Screen name="ShopCategories"   component={withLayout(ShopCategories)} />
      <AppStack.Screen name="ProductDetails"   component={withLayout(ProductDetails)} />
      <AppStack.Screen name="ProductComparison" component={withLayout(ProductComparison)} />
      <AppStack.Screen name="Wishlist"          component={withLayout(Wishlist)} />
      <AppStack.Screen name="FAQ"               component={withLayout(FAQ)} />
      <AppStack.Screen name="Terms"             component={withLayout(Terms)} />
      <AppStack.Screen name="Privacy"           component={withLayout(Privacy)} />
      <AppStack.Screen name="Returns"           component={withLayout(Returns)} />
      <AppStack.Screen name="Dashboard"         component={withLayout(Dashboard)} />
      <AppStack.Screen name="Orders"            component={withLayout(Orders)} />
      <AppStack.Screen name="UserDetails"       component={withLayout(UserDetails)} />
      <AppStack.Screen name="Addresses"         component={withLayout(Addresses)} />
      <AppStack.Screen name="PaymentMethods"    component={withLayout(PaymentMethods)} />
      <AppStack.Screen name="Checkout"          component={withLayout(CheckoutDetails)} />
      <AppStack.Screen name="CheckoutDetails"   component={withLayout(CheckoutDetails)} />
      <AppStack.Screen name="CheckoutShipping"  component={withLayout(CheckoutShipping)} />
      <AppStack.Screen name="CheckoutPayment"   component={withLayout(CheckoutPayment)} />
      <AppStack.Screen name="CheckoutReview"    component={withLayout(CheckoutReview)} />
      <AppStack.Screen name="CheckoutComplete"  component={withLayout(CheckoutComplete)} />
      */}
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
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular,
    SpaceMono_400Regular,
    SpaceMono_400Regular_Italic,
  });

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (fontError) console.warn('[App] Font load error:', fontError);
  }, [fontError]);

  if (!fontsLoaded && !fontError) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  loading: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d0d',
  },
});