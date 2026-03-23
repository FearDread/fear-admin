/**
 * Header2.jsx — React Native
 *
 * Web → RN mapping:
 *   position: sticky / top:0    → no direct equiv — header is placed at top of
 *                                  Layout OUTSIDE the ScrollView so it stays fixed
 *   window.scrollY / scroll evt → Animated.Value injected from Layout via context
 *   transform: translateY (hide)→ Animated.Value interpolated on the header View
 *   hdr-compact (topbar hide)   → Animated height from 0↔38
 *   Link to={path}              → useNavigation().navigate(screen)
 *   useLocation (active route)  → useNavigationState(state => ...)
 *   document.addEventListener   → BackHandler for drawer close on Android
 *   CSS dropdown position:abs   → Modal (bottom sheet) for mobile; for nav items a
 *                                  positioned View with elevation
 *   CartDropdown / CatDropdown  → inline RN implementations (convert those separately
 *                                  or stub them — see comment below)
 *   flag-icon CSS               → country flag emoji
 *   hdr-scroll-progress         → Animated.Value width on the nav bar
 *
 * Scroll integration:
 *   Layout passes a `scrollY` Animated.Value via HeaderScrollContext.
 *   Header reads it to drive hide/compact/progress animations.
 *
 * Install:
 *   npx expo install @react-navigation/native
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useDispatch, useSelector }          from 'react-redux';

import { selectIsAuthenticated, selectCurrentUser } from '../../features/user/slice';
import { selectCartItems, selectCartCount }         from '../../features/cart/slice';
import { useHeaderScroll }                          from './HeaderScrollContext';
import SearchBar                                    from './SearchBar';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  red:    '#b30e1c',
  dark0:  '#0d0d0d',
  dark1:  '#111111',
  dark2:  '#141414',
  dark3:  '#1a1a1a',
  border: '#222222',
  dim:    'rgba(255,255,255,0.32)',
  mid:    'rgba(255,255,255,0.58)',
  hi:     'rgba(255,255,255,0.92)',
  white:  '#ffffff',
};

const SW = Dimensions.get('window').width;
const TOPBAR_H  = 38;
const COMPACT_Y = 60;   // scrollY threshold to hide topbar
const HIDE_Y    = 120;  // scrollY threshold to hide entire header

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOP_LINKS = [
  { label: 'Compare',   screen: 'ProductComparison' },
  { label: 'About',     screen: 'About' },
  { label: 'Our Store', screen: 'Shop' },
  { label: 'Blog',      screen: 'Blog' },
  { label: 'Contact',   screen: 'Contact' },
  { label: 'FAQs',      screen: 'FAQ' },
];

const CURRENCIES = ['USD', 'EUR'];
const LANGUAGES  = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'German' },
  { code: 'fr', flag: '🇫🇷', label: 'French' },
  { code: 'hi', flag: '🇮🇳', label: 'Hindi' },
  { code: 'zh', flag: '🇨🇳', label: 'Chinese' },
  { code: 'ar', flag: '🇦🇪', label: 'Arabic' },
];
const SOCIAL_LINKS = [
  { icon: '𝒇', url: 'https://facebook.com', label: 'Facebook' },
  { icon: '𝕏', url: 'https://twitter.com',  label: 'Twitter' },
  { icon: 'in',url: 'https://linkedin.com',  label: 'LinkedIn' },
];
const CATEGORIES_DATA = {
  'Comics & Books': [
    { label: 'Comic Books',    screen: 'Shop', params: { search: 'comics' } },
    { label: 'E-Books',        screen: 'Shop', params: { search: 'E-Books' } },
    { label: 'Graphic Novels', screen: 'Shop', params: { search: 'GraphicNovels' } },
    { label: 'Manga',          screen: 'Shop', params: { search: 'Manga' } },
    { label: 'Anime',          screen: 'Shop', params: { category: 'Anime' } },
  ],
  'Trading Cards': [
    { label: 'Basketball',        screen: 'Shop', params: { category: 'Basketball' } },
    { label: 'Football',          screen: 'Shop', params: { category: 'Football' } },
    { label: 'Magic The Gathering',screen:'Shop', params: { category: 'MTG' } },
    { label: 'Baseball',          screen: 'Shop', params: { category: 'Baseball' } },
    { label: 'Pokemon',           screen: 'Shop', params: { search: 'pokemon' } },
  ],
};
const MAIN_NAV = [
  { label: 'Home',     screen: 'Home' },
  { label: 'Blog',     screen: 'Blog' },
  { label: 'About Us', screen: 'About' },
  { label: 'Contact',  screen: 'Contact' },
  { label: 'Our Store',screen: 'Shop' },
];
const ACCOUNT_LINKS = [
  { label: 'Dashboard',       screen: 'Dashboard' },
  { label: 'Orders',          screen: 'Orders' },
  { label: 'Payment Methods', screen: 'PaymentMethods' },
  { label: 'User Details',    screen: 'UserDetails' },
  { label: 'Saved Addresses', screen: 'Addresses' },
];

// ─── Small Dropdown Menu ──────────────────────────────────────────────────────
const UtilDropdown = ({ items, onSelect, onClose }) => (
  <View style={s.utilDropdown}>
    {items.map((item) => (
      <Pressable
        key={item.label || item}
        style={({ pressed }) => [s.utilDropdownItem, pressed && { backgroundColor: T.dark2 }]}
        onPress={() => { onSelect(item); onClose(); }}
      >
        {item.flag ? <Text style={s.utilDropdownFlag}>{item.flag}</Text> : null}
        <Text style={s.utilDropdownText}>{item.label || item}</Text>
      </Pressable>
    ))}
  </View>
);

// ─── Header2 ─────────────────────────────────────────────────────────────────
export const Header2 = () => {
  const nav      = useNavigation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser     = useSelector(selectCurrentUser);
  const cartItems       = useSelector(selectCartItems);
  const cartCount       = useSelector(selectCartCount);

  const [currency,      setCurrency]      = useState('USD');
  const [language,      setLanguage]      = useState(LANGUAGES[0]);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [cartOpen,      setCartOpen]      = useState(false);
  const [accountOpen,   setAccountOpen]   = useState(false);
  const [categoriesOpen,setCategoriesOpen]= useState(false);
  const [currencyOpen,  setCurrencyOpen]  = useState(false);
  const [languageOpen,  setLanguageOpen]  = useState(false);

  // Animated values for scroll behaviour
  const { scrollY }     = useHeaderScroll();
  const topbarH         = useRef(new Animated.Value(TOPBAR_H)).current;
  const topbarOpac      = useRef(new Animated.Value(1)).current;
  const headerTranslate = useRef(new Animated.Value(0)).current;
  const lastScrollY     = useRef(0);

  // Drive animations from scrollY
  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      // Compact: hide topbar when scrolled past 60
      const compact = value > COMPACT_Y;
      Animated.parallel([
        Animated.timing(topbarH,    { toValue: compact ? 0 : TOPBAR_H, duration: 250, useNativeDriver: false }),
        Animated.timing(topbarOpac, { toValue: compact ? 0 : 1,        duration: 200, useNativeDriver: true }),
      ]).start();

      // Hide: slide header off-screen when scrolling down fast past 120
      if      (value > lastScrollY.current + 8 && value > HIDE_Y) {
        Animated.timing(headerTranslate, { toValue: -120, duration: 300, useNativeDriver: true }).start();
      } else if (value < lastScrollY.current - 4) {
        Animated.timing(headerTranslate, { toValue: 0,    duration: 300, useNativeDriver: true }).start();
      }
      lastScrollY.current = value;
    });
    return () => scrollY.removeListener(id);
  }, [scrollY]);

  // Close drawer on Android back press
  useEffect(() => {
    if (!mobileOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setMobileOpen(false);
      return true;
    });
    return () => sub.remove();
  }, [mobileOpen]);

  const navigate = useCallback((screen, params) => {
    setMobileOpen(false);
    setAccountOpen(false);
    setCategoriesOpen(false);
    nav.navigate(screen, params);
  }, [nav]);

  const closeAll = () => {
    setAccountOpen(false);
    setCategoriesOpen(false);
    setCurrencyOpen(false);
    setLanguageOpen(false);
    setCartOpen(false);
  };

  // Current route name for active state
  const currentRoute = useNavigationState((state) => {
    try { return state.routes[state.index]?.name; } catch { return ''; }
  });

  return (
    <>
      <Animated.View style={[s.outer, { transform: [{ translateY: headerTranslate }] }]}>

        {/* ── TOP BAR ── */}
        <Animated.View style={[s.topbar, { height: topbarH, opacity: topbarOpac, overflow: 'hidden' }]}>
          <View style={s.topbarInner}>
            <Text style={s.topbarBrand}>
              Welcome to <Text style={{ color: T.red }}>e-FEAR</Text> — Comics · E-Books · Collectibles
            </Text>
            <View style={s.topbarRight}>
              {/* Currency */}
              <View>
                <Pressable style={s.utilBtn} onPress={() => { closeAll(); setCurrencyOpen((v) => !v); }}>
                  <Text style={s.utilBtnText}>{currency} <Text style={s.utilArrow}>▾</Text></Text>
                </Pressable>
                {currencyOpen && (
                  <UtilDropdown
                    items={CURRENCIES}
                    onSelect={(c) => setCurrency(c)}
                    onClose={() => setCurrencyOpen(false)}
                  />
                )}
              </View>

              {/* Language */}
              <View>
                <Pressable style={s.utilBtn} onPress={() => { closeAll(); setLanguageOpen((v) => !v); }}>
                  <Text style={s.utilBtnText}>{language.flag} {language.code.toUpperCase()} <Text style={s.utilArrow}>▾</Text></Text>
                </Pressable>
                {languageOpen && (
                  <UtilDropdown
                    items={LANGUAGES}
                    onSelect={(l) => setLanguage(l)}
                    onClose={() => setLanguageOpen(false)}
                  />
                )}
              </View>

              {/* Social */}
              {SOCIAL_LINKS.map((sl) => (
                <Text key={sl.label} style={s.socialIcon}>{sl.icon}</Text>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ── MAIN BAR ── */}
        <View style={s.mainBar}>
          <View style={s.mainBarInner}>

            {/* Hamburger (always shown in RN — no lg:hidden equiv) */}
            <Pressable style={s.hamburger} onPress={() => setMobileOpen(true)}>
              <Text style={s.hamburgerIcon}>☰</Text>
            </Pressable>

            {/* Logo */}
            <Pressable onPress={() => navigate('Home')} style={s.logo}>
              <Image
                source={require('../../assets/images/fear/efear-logo.png')}
                style={s.logoImg}
                resizeMode="contain"
              />
            </Pressable>

            {/* Search — hidden on narrow phones, shown on wider */}
            {SW >= 400 && (
              <View style={s.searchWrap}>
                <SearchBar />
              </View>
            )}

            {/* Icons */}
            <View style={s.icons}>
              {isAuthenticated ? (
                <>
                  <Pressable style={s.iconBtn} onPress={() => navigate('Dashboard')}>
                    <Text style={s.iconBtnText}>👤</Text>
                  </Pressable>
                  <Pressable style={s.iconBtn} onPress={() => navigate('Wishlist')}>
                    <Text style={s.iconBtnText}>♡</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable style={s.btnLogin}    onPress={() => navigate('Login')}>
                    <Text style={s.btnLoginText}>Login</Text>
                  </Pressable>
                  <Pressable style={s.btnRegister} onPress={() => navigate('Register')}>
                    <Text style={s.btnRegisterText}>Register</Text>
                  </Pressable>
                </>
              )}

              {/* Cart */}
              <Pressable style={s.iconBtn} onPress={() => navigate('Cart')}>
                <Text style={s.iconBtnText}>🛒</Text>
                {cartCount > 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Search on narrow screens below main bar */}
          {SW < 400 && (
            <View style={s.searchBelow}>
              <SearchBar />
            </View>
          )}
        </View>

        {/* ── PRIMARY NAV BAR ── */}
        <View style={s.navBar}>
          {/* Scroll progress bar */}
          <Animated.View style={[s.scrollProgress, { width: scrollY.interpolate({
            inputRange:  [0, 3000],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }) }]} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.navBarInner}
          >
            {MAIN_NAV.map((item) => (
              <Pressable
                key={item.screen}
                style={s.navItem}
                onPress={() => navigate(item.screen)}
              >
                <Text style={[s.navLink, currentRoute === item.screen && s.navLinkActive]}>
                  {item.label}
                </Text>
                {currentRoute === item.screen && <View style={s.navActiveLine} />}
              </Pressable>
            ))}

            {/* Categories */}
            <View>
              <Pressable style={s.navItem} onPress={() => { closeAll(); setCategoriesOpen((v) => !v); }}>
                <Text style={[s.navLink, categoriesOpen && s.navLinkActive]}>
                  Categories <Text style={s.navArrow}>▾</Text>
                </Text>
              </Pressable>
              {categoriesOpen && (
                <View style={s.catDropdown}>
                  {Object.entries(CATEGORIES_DATA).map(([group, items]) => (
                    <View key={group}>
                      <Text style={s.catGroupTitle}>{group}</Text>
                      {items.map((item) => (
                        <Pressable
                          key={item.label}
                          style={({ pressed }) => [s.catItem, pressed && { backgroundColor: T.dark2 }]}
                          onPress={() => { setCategoriesOpen(false); nav.navigate(item.screen, item.params); }}
                        >
                          <Text style={s.catItemText}>{item.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* My Account */}
            <View style={{ marginLeft: 'auto' }}>
              <Pressable style={s.navItem} onPress={() => { closeAll(); setAccountOpen((v) => !v); }}>
                <Text style={[s.navLink, accountOpen && s.navLinkActive]}>
                  {isAuthenticated && currentUser
                    ? `Hi, ${currentUser.firstName || 'User'}`
                    : 'My Account'
                  } <Text style={s.navArrow}>▾</Text>
                </Text>
              </Pressable>
              {accountOpen && (
                <View style={[s.catDropdown, { right: 0, left: 'auto', minWidth: 200 }]}>
                  {ACCOUNT_LINKS.map((link) => (
                    <Pressable
                      key={link.screen}
                      style={({ pressed }) => [s.catItem, pressed && { backgroundColor: T.dark2 }]}
                      onPress={() => { setAccountOpen(false); nav.navigate(link.screen); }}
                    >
                      <Text style={s.catItemText}>{link.label}</Text>
                    </Pressable>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <Pressable style={s.catItem} onPress={() => { setAccountOpen(false); navigate('Login'); }}>
                        <Text style={[s.catItemText, { color: T.red }]}>Login</Text>
                      </Pressable>
                      <Pressable style={s.catItem} onPress={() => { setAccountOpen(false); navigate('Register'); }}>
                        <Text style={[s.catItemText, { color: T.red }]}>Register</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Animated.View>

      {/* ── MOBILE DRAWER ── */}
      <Modal
        visible={mobileOpen}
        transparent
        animationType="none"
        onRequestClose={() => setMobileOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMobileOpen(false)}>
          <View style={s.drawerOverlay} />
        </TouchableWithoutFeedback>

        <Animated.View style={s.drawer}>
          {/* Head */}
          <View style={s.drawerHead}>
            <Text style={s.drawerTitle}>e<Text style={{ color: T.red }}>Fear</Text></Text>
            <Pressable style={s.drawerClose} onPress={() => setMobileOpen(false)}>
              <Text style={s.drawerCloseText}>✕</Text>
            </Pressable>
          </View>

          {/* Search */}
          <View style={s.drawerSearch}>
            <SearchBar placeholder="Search products..." />
          </View>

          {/* Nav links */}
          <ScrollView style={s.drawerNav} bounces={false}>
            {MAIN_NAV.map((item) => (
              <Pressable key={item.screen} style={s.drawerNavLink} onPress={() => navigate(item.screen)}>
                <Text style={[s.drawerNavText, currentRoute === item.screen && { color: T.white }]}>
                  {currentRoute === item.screen && <Text style={{ color: T.red }}>▌ </Text>}
                  {item.label}
                </Text>
                <Text style={s.drawerArrow}>→</Text>
              </Pressable>
            ))}

            {/* Category groups */}
            {Object.entries(CATEGORIES_DATA).map(([group, items]) => (
              <View key={group}>
                <View style={s.drawerSectionTitle}>
                  <Text style={s.drawerSectionTitleText}>{group}</Text>
                </View>
                {items.map((item) => (
                  <Pressable
                    key={item.label}
                    style={s.drawerCatLink}
                    onPress={() => { setMobileOpen(false); nav.navigate(item.screen, item.params); }}
                  >
                    <Text style={s.drawerCatText}>{item.label}</Text>
                    <Text style={s.drawerArrow}>→</Text>
                  </Pressable>
                ))}
              </View>
            ))}

            {/* Account */}
            <View style={s.drawerSectionTitle}>
              <Text style={s.drawerSectionTitleText}>My Account</Text>
            </View>
            {ACCOUNT_LINKS.map((link) => (
              <Pressable key={link.screen} style={s.drawerCatLink} onPress={() => navigate(link.screen)}>
                <Text style={s.drawerCatText}>{link.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={s.drawerFooter}>
            {!isAuthenticated ? (
              <>
                <Pressable style={s.drawerBtnLogin}    onPress={() => navigate('Login')}>
                  <Text style={s.drawerBtnLoginText}>Login</Text>
                </Pressable>
                <Pressable style={s.drawerBtnRegister} onPress={() => navigate('Register')}>
                  <Text style={s.drawerBtnRegText}>Register</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={s.drawerBtnLogin} onPress={() => navigate('Dashboard')}>
                <Text style={s.drawerBtnLoginText}>My Dashboard</Text>
              </Pressable>
            )}
            <View style={s.drawerCurrencyRow}>
              {CURRENCIES.map((c) => (
                <Pressable
                  key={c}
                  style={[s.drawerCurrBtn, currency === c && s.drawerCurrBtnActive]}
                  onPress={() => setCurrency(c)}
                >
                  <Text style={[s.drawerCurrText, currency === c && { color: T.white }]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default Header2;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  outer: {
    backgroundColor: T.dark0,
    zIndex:           100,
    elevation:         10,
    // Shadow for compact mode
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.5,
    shadowRadius:    16,
  },

  // Topbar
  topbar: {
    backgroundColor: T.dark0,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  topbarInner: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: 20,
    height:            TOPBAR_H,
  },
  topbarBrand: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      3.2,
    textTransform:     'uppercase',
    color:             T.dim,
    flex:               1,
    includeFontPadding: false,
  },
  topbarRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            4,
  },
  utilBtn: {
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderLeftWidth:   1,
    borderLeftColor:  T.border,
  },
  utilBtnText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.dim,
    includeFontPadding: false,
  },
  utilArrow: { fontSize: 7 },
  socialIcon: {
    fontSize:          13,
    color:             T.dim,
    paddingHorizontal:  4,
  },

  // Util dropdown
  utilDropdown: {
    position:        'absolute',
    top:              '100%',
    right:            0,
    backgroundColor: T.dark1,
    borderWidth:      1,
    borderColor:     T.border,
    borderTopWidth:   2,
    borderTopColor:  T.red,
    minWidth:         130,
    zIndex:           9999,
    elevation:         20,
  },
  utilDropdownItem: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:               8,
    paddingVertical:   10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  utilDropdownFlag: { fontSize: 14 },
  utilDropdownText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },

  // Main bar
  mainBar: {
    backgroundColor:  T.dark1,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  mainBarInner: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: 16,
    paddingVertical:    10,
    gap:               12,
  },

  // Hamburger
  hamburger: {
    width:           40,
    height:          40,
    backgroundColor: T.dark2,
    borderWidth:      1,
    borderColor:     T.border,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:       0,
  },
  hamburgerIcon: { color: T.mid, fontSize: 18 },

  // Logo
  logo: { flexShrink: 0 },
  logoImg: { height: 38, width: 80 },

  // Search
  searchWrap: { flex: 1, minWidth: 0 },
  searchBelow: {
    paddingHorizontal: 16,
    paddingBottom:     10,
  },

  // Icon buttons
  icons: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            4,
    flexShrink:     0,
  },
  iconBtn: {
    width:           42,
    height:          42,
    backgroundColor: T.dark2,
    borderWidth:      1,
    borderColor:     T.border,
    alignItems:      'center',
    justifyContent:  'center',
    position:       'relative',
  },
  iconBtnText: { fontSize: 18 },
  badge: {
    position:        'absolute',
    top:             -5,
    right:           -5,
    width:            18,
    height:           18,
    backgroundColor: T.red,
    borderRadius:     9,
    borderWidth:      2,
    borderColor:     T.dark1,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           8,
    color:             T.white,
    includeFontPadding: false,
  },

  // Auth buttons
  btnLogin: {
    paddingVertical:   8,
    paddingHorizontal: 14,
    borderWidth:       1,
    borderColor:       T.border,
  },
  btnLoginText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
  btnRegister: {
    paddingVertical:   8,
    paddingHorizontal: 14,
    backgroundColor:  T.red,
    borderWidth:       1,
    borderColor:      T.red,
  },
  btnRegisterText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.white,
    includeFontPadding: false,
  },

  // Nav bar
  navBar: {
    backgroundColor:  T.dark2,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    position:         'relative',
  },
  scrollProgress: {
    position:        'absolute',
    bottom:           0,
    left:             0,
    height:           2,
    backgroundColor: T.red,
    zIndex:           2,
  },
  navBarInner: {
    flexDirection:    'row',
    alignItems:       'stretch',
    paddingHorizontal: 16,
  },
  navItem: {
    justifyContent:  'center',
    paddingVertical:  12,
    paddingHorizontal: 12,
    position:        'relative',
  },
  navLink: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
  navLinkActive: { color: T.white },
  navActiveLine: {
    position:        'absolute',
    bottom:           0,
    left:             12,
    right:            12,
    height:           2,
    backgroundColor: T.red,
  },
  navArrow: { fontSize: 8, color: T.dim },

  // Cat / Account dropdown
  catDropdown: {
    position:        'absolute',
    top:              '100%',
    left:             0,
    backgroundColor: T.dark1,
    borderWidth:      1,
    borderColor:     T.border,
    borderTopWidth:   2,
    borderTopColor:  T.red,
    minWidth:         200,
    zIndex:           9999,
    elevation:         20,
  },
  catGroupTitle: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      3.2,
    textTransform:     'uppercase',
    color:             T.dim,
    paddingVertical:    8,
    paddingHorizontal:  14,
    backgroundColor:   T.dark0,
    borderBottomWidth:  1,
    borderBottomColor: T.border,
    includeFontPadding: false,
  },
  catItem: {
    paddingVertical:   10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  catItemText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },

  // Mobile drawer
  drawerOverlay: {
    position:        'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  drawer: {
    position:        'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width:           Math.min(300, SW * 0.85),
    backgroundColor: T.dark1,
    borderRightWidth: 1,
    borderRightColor: T.border,
    flexDirection:   'column',
  },
  drawerHead: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: 20,
    paddingVertical:   16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  drawerTitle: {
    fontFamily:        'Anton_400Regular',
    fontSize:           20,
    textTransform:     'uppercase',
    color:             T.white,
    includeFontPadding: false,
  },
  drawerClose: {
    width:            34,
    height:           34,
    borderWidth:       1,
    borderColor:      T.border,
    alignItems:       'center',
    justifyContent:   'center',
  },
  drawerCloseText: { color: T.mid, fontSize: 16 },
  drawerSearch: {
    padding:           16,
    borderBottomWidth:  1,
    borderBottomColor: T.border,
  },
  drawerNav: { flex: 1 },
  drawerNavLink: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  drawerNavText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
  drawerArrow: { color: T.dim, fontSize: 10 },
  drawerSectionTitle: {
    paddingHorizontal: 20,
    paddingVertical:    8,
    backgroundColor:   T.dark0,
    borderBottomWidth:  1,
    borderBottomColor: T.border,
  },
  drawerSectionTitleText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      3.2,
    textTransform:     'uppercase',
    color:             T.dim,
    includeFontPadding: false,
  },
  drawerCatLink: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: 28,
    paddingVertical:   12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  drawerCatText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1,
    textTransform:     'uppercase',
    color:             T.dim,
    includeFontPadding: false,
  },
  drawerFooter: {
    padding:           20,
    borderTopWidth:     1,
    borderTopColor:    T.border,
    gap:               10,
  },
  drawerBtnLogin: {
    paddingVertical:   12,
    alignItems:        'center',
    borderWidth:        1,
    borderColor:       T.border,
  },
  drawerBtnLoginText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
  drawerBtnRegister: {
    paddingVertical:   12,
    alignItems:        'center',
    backgroundColor:  T.red,
  },
  drawerBtnRegText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.white,
    includeFontPadding: false,
  },
  drawerCurrencyRow: { flexDirection: 'row', gap: 8 },
  drawerCurrBtn: {
    flex:              1,
    paddingVertical:   10,
    alignItems:        'center',
    backgroundColor:  T.dark2,
    borderWidth:       1,
    borderColor:      T.border,
  },
  drawerCurrBtnActive: {
    backgroundColor: T.red,
    borderColor:     T.red,
  },
  drawerCurrText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    color:             T.dim,
    includeFontPadding: false,
  },
});