import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Home from './screens/Home';
/*
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';


import Layout from "./pages/Layout";
import Dashboard from "./pages/account/Dashboard"

import CheckoutShipping from "./pages/checkout/CheckoutShipping";
import CheckoutPayment from "./pages/checkout/CheckoutPayment";
import CheckoutDetails from "./pages/checkout/CheckoutDetails";
import CheckoutReview from "./pages/checkout/CheckoutReview";
import CheckoutComplete from "./pages/checkout/CheckoutComplete";

import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/Faq";
import Shop from "./pages/shop/Shop";
import ShopCart from "./pages/shop/ShopCart";
import ShopCategories from "./pages/shop/ShopCategories";
import ProductComparison from "./pages/products/ProductComparison";
import ProductDetails from "./pages/products/ProductDetails";
import Wishlist from './pages/Wishlist';
import Orders from "./pages/account/Orders";
import UserDetails from "./pages/account/UserDetails";
import AccountPayment from "./pages/account/PaymentMethods";
import Addresses from "./pages/account/Addresses";
import ForgotPassword from "./pages/auth/ForgotPassword"));
import ResetPassword from "./pages/auth/ResetPassword"));
import TermsOfService from "./pages/policies/Terms"));
import PrivacyPolicy from "./pages/policies/Privacy"));
import ReturnPolicy from "./pages/policies/Returns"));
*/

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/*
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      */}
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Home" component={Home} />
      {/*
      <AppStack.Screen name="Shop" component={Shop} />
      <AppStack.Screen name="ProductDetails" component={ProductDetails} />
      <AppStack.Screen name="Cart" component={ShopCart} />
      <AppStack.Screen name="Dashboard" component={Dashboard} />
      <AppStack.Screen name="Orders" component={Orders} />
      */}
    </AppStack.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}