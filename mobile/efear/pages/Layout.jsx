/**
 * Layout.jsx — React Native
 *
 * Replaces the web Layout which wrapped every page via <Outlet>.
 * In RN, each screen renders <Layout> as a wrapper component.
 *
 * Web → RN mapping:
 *   <Outlet>              → {children}
 *   loadStripe / Elements → @stripe/stripe-react-native StripeProvider
 *                           (install: npx expo install @stripe/stripe-react-native)
 *                           Stubbed here — swap the comment block in when ready.
 *   window.scrollTo(0,0)  → scrollViewRef.current.scrollTo({ y:0 })
 *                           triggered via navigation focus event
 *   useLocation           → useFocusEffect (react-navigation)
 *   localStorage cookie   → AsyncStorage (matches our Storage util)
 *   BestSelling           → rendered below children as on web
 *   CookieBanner          → Modal with accept/reject (stub — convert separately)
 *   separator-animated-border → AnimatedBorder component (same as ProductCarousel)
 *   Footer2               → rendered below scroll content
 *
 * Usage — wrap any screen component:
 *   export default function HomeScreen() {
 *     return (
 *       <Layout>
 *         <Home2 />
 *       </Layout>
 *     );
 *   }
 *
 * Or use as a navigator screen wrapper in App.jsx:
 *   function LayoutScreen({ children }) { return <Layout>{children}</Layout>; }
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchProducts }    from '../features/products/slice';
import { fetchCategories }  from '../features/categories/slice';
import { selectAllProducts, selectProductsLoading, selectProductsError } from '../features/products/slice';
import { selectAllCategories } from '../features/categories/slice';

import Header                from '../components/header/Header';
import { HeaderScrollContext } from '../components/header/HeaderScrollContext';
//import BestSelling            from '../components/products/BestSelling';
//import Footer2                from '../components/common/Footer2';

// ─── Design tokens ─────────────────────────────────────────────────────────
const T = {
  red:    '#b30e1c',
  dark0:  '#0d0d0d',
  dark1:  '#111111',
  border: '#222222',
  mid:    'rgba(255,255,255,0.58)',
  white:  '#ffffff',
};

const COOKIE_KEY = '@efear:cookie-consent';

// ─── Animated top border (replaces .separator-animated-border) ────────────────
const AnimatedBorder = () => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    ).start();
  }, []);
  const borderColor = anim.interpolate({ inputRange: [0, 1], outputRange: [T.border, T.red] });
  return <Animated.View style={[styles.animatedBorder, { borderTopColor: borderColor }]} />;
};

// ─── Cookie banner ─────────────────────────────────────────────────────────
const CookieBanner = ({ onAccept, onReject }) => (
  <View style={styles.cookieBanner}>
    <Text style={styles.cookieText}>
      We use cookies to improve your experience. Accept to continue or reject non-essential cookies.
    </Text>
    <View style={styles.cookieActions}>
      <Pressable style={styles.cookieReject} onPress={onReject}>
        <Text style={styles.cookieRejectText}>Reject</Text>
      </Pressable>
      <Pressable style={styles.cookieAccept} onPress={() => onAccept({ essential: true, analytics: true })}>
        <Text style={styles.cookieAcceptText}>Accept All</Text>
      </Pressable>
    </View>
  </View>
);

// ─── Layout ───────────────────────────────────────────────────────────────────
const Layout = ({ children }) => {
  const dispatch   = useDispatch();
  const scrollRef  = useRef(null);

  const products   = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const loading    = useSelector(selectProductsLoading);
  const error      = useSelector(selectProductsError);

  const [cookieStatus, setCookieStatus] = useState(null); // null | 'visible' | 'accepted' | 'rejected'

  // Shared scroll value — Header2 reads this for hide/compact/progress
  const scrollY = useRef(new Animated.Value(0)).current;

  // ── Fetch data on mount ─────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  // ── Cookie consent ──────────────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(COOKIE_KEY).then((raw) => {
      if (!raw) {
        setTimeout(() => setCookieStatus('visible'), 600);
      } else {
        setCookieStatus('accepted');
      }
    }).catch(() => setCookieStatus('visible'));
  }, []);

  const handleAccept = useCallback(async (prefs) => {
    await AsyncStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
    setCookieStatus('accepted');
  }, []);

  const handleReject = useCallback(async () => {
    await AsyncStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true }));
    setCookieStatus('rejected');
  }, []);

  // ── Scroll-to-top on screen focus (replaces ScrollToTop component) ──────
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  // ── Stripe (stub — uncomment when @stripe/stripe-react-native is installed)
  // import { StripeProvider } from '@stripe/stripe-react-native';
  // const publishableKey = process.env.EXPO_PUBLIC_STRIPE_API_KEY;
  // Wrap the return in <StripeProvider publishableKey={publishableKey}>...</StripeProvider>

  return (
    <HeaderScrollContext.Provider value={{ scrollY }}>
      <SafeAreaView style={styles.root}>

        {/* Animated accent border at very top */}
        <AnimatedBorder />

        {/* Header — sits OUTSIDE the ScrollView so it stays fixed */}
        <Header />

        {/* Page content */}
        <Animated.ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {/* Main screen content */}
          {!loading && products.length > 0 && children}

          {/* Loading state */}
          {loading && (
            <View style={styles.loadingWrap}>
              <View style={styles.loadingSpinner} />
            </View>
          )}

          {/* BestSelling shown on every page below screen content */}
          { /* <BestSelling /> */ }

          {/* Footer 
          <Footer2
            categories={loading ? [] : categories}
            products={products}
          />
          */}
        </Animated.ScrollView>

        {/* Cookie banner */}
        {cookieStatus === 'visible' && (
          <CookieBanner onAccept={handleAccept} onReject={handleReject} />
        )}

      </SafeAreaView>
    </HeaderScrollContext.Provider>
  );
};

export default Layout;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: T.dark0,
  },
  animatedBorder: {
    height:       2,
    borderTopWidth: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingWrap: {
    minHeight:      300,
    alignItems:     'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width:           48,
    height:          48,
    borderWidth:      3,
    borderColor:     T.border,
    borderTopColor:  T.red,
    borderRadius:    24,
    // CSS animation: spin — use Animated.loop in a real implementation
    // or install react-native-animated-spinkit
  },

  // Cookie banner
  cookieBanner: {
    position:        'absolute',
    bottom:           0,
    left:             0,
    right:            0,
    backgroundColor: T.dark1,
    borderTopWidth:   1,
    borderTopColor:  T.border,
    padding:          20,
    gap:               12,
    zIndex:           500,
    elevation:         10,
  },
  cookieText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    lineHeight:         18,
    color:             T.mid,
    includeFontPadding: false,
  },
  cookieActions: {
    flexDirection: 'row',
    gap:            10,
  },
  cookieReject: {
    flex:             1,
    paddingVertical:  10,
    alignItems:       'center',
    borderWidth:       1,
    borderColor:      T.border,
  },
  cookieRejectText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
  cookieAccept: {
    flex:             1,
    paddingVertical:  10,
    alignItems:       'center',
    backgroundColor: T.red,
  },
  cookieAcceptText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.white,
    includeFontPadding: false,
  },
});