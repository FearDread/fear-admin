/**
 * ProductCarousel.jsx — React Native
 *
 * This is the 3-D "fp-stage" style carousel used for Related Products.
 * Uses the same architecture as FeaturedProducts.jsx (home page carousel)
 * with these differences:
 *   - Section label: "Related Products"
 *   - Animated border accent (replaces .animated-border CSS)
 *   - Uses state.products.data directly (same as web)
 *
 * Web → RN mapping:
 *   CSS perspective + rotateY      → transform array with { perspective }
 *   translateZ depth               → scale approximation (no translateZ in RN)
 *   onMouseEnter/Leave (pause)     → PanResponder onGrant/Release
 *   CSS @keyframes progress bar    → Animated.timing on width
 *   fp-active-badge fade-in        → Animated opacity + translateY
 *   animated-border CSS animation  → Animated loop on borderColor / opacity
 *   fp-glow-pool blur              → semi-transparent View + Animated pulse
 *   fp-halftone / fp-scanlines     → omitted (use react-native-svg for dots)
 *
 * Install:
 *   npx expo install @expo-google-fonts/anton @expo-google-fonts/space-mono
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation }        from '@react-navigation/native';
import { useSelector }          from 'react-redux';
import ProductCard              from './ProductCard';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  red:      '#b30e1c',
  dark0:    '#0d0d0d',
  dark2:    '#141414',
  borderHi: '#2e2e2e',
  border:   '#222222',
  dim:      'rgba(255,255,255,0.32)',
  mid:      'rgba(255,255,255,0.58)',
  hi:       'rgba(255,255,255,0.92)',
  white:    '#ffffff',
};

const SW            = Dimensions.get('window').width;
const CARD_W        = Math.min(SW * 0.68, 270);
const CARD_OFFSET   = CARD_W * 0.85;
const STAGE_H       = SW < 640 ? 440 : 520;
const AUTO_DELAY    = 4000;
const SWIPE_THRESH  = 50;

// ─── Animated border (replaces .animated-border CSS animation) ────────────────
const AnimatedBorder = () => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);
  const borderColor = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [T.border, T.red],
  });
  return <Animated.View style={[s.animatedBorder, { borderColor }]} />;
};

// ─── Glow pool ────────────────────────────────────────────────────────────────
const GlowPool = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opac  = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
          Animated.timing(opac,  { toValue: 0.5, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opac,  { toValue: 0.3, duration: 1500, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={[s.glowPool, { opacity: opac, transform: [{ scaleY: scale }] }]}
      pointerEvents="none"
    />
  );
};

// ─── Active badge ─────────────────────────────────────────────────────────────
const ActiveBadge = () => {
  const opac = useRef(new Animated.Value(0)).current;
  const tY   = useRef(new Animated.Value(-6)).current;
  useEffect(() => {
    opac.setValue(0); tY.setValue(-6);
    Animated.parallel([
      Animated.timing(opac, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(tY,   { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[s.activeBadge, { opacity: opac, transform: [{ translateY: tY }] }]}>
      <Text style={s.activeBadgeText}>⚡ Featured</Text>
    </Animated.View>
  );
};

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ slideKey, paused }) => {
  const w    = useRef(new Animated.Value(0)).current;
  const anim = useRef(null);
  useEffect(() => {
    w.setValue(0);
    if (anim.current) anim.current.stop();
    if (!paused) {
      anim.current = Animated.timing(w, { toValue: 200, duration: AUTO_DELAY, useNativeDriver: false });
      anim.current.start();
    }
    return () => { if (anim.current) anim.current.stop(); };
  }, [slideKey, paused]);
  return (
    <View style={s.progressTrack}>
      <Animated.View style={[s.progressBar, { width: w }]} />
    </View>
  );
};

// ─── Card wrapper with 3-D transform ─────────────────────────────────────────
const CardWrap = ({ product, offset, total, isActive, onPress }) => {
  let off = offset;
  if (off >  total / 2) off -= total;
  if (off < -total / 2) off += total;
  const abs = Math.abs(off);
  if (abs > 2) return null;

  return (
    <Animated.View
      style={[
        s.cardWrap,
        {
          opacity: abs === 0 ? 1 : abs === 1 ? 0.52 : 0.18,
          zIndex:  10 - abs,
          transform: [
            { perspective:  1200 },   // must be first
            { translateX:   off * CARD_OFFSET },
            { rotateY:      `${off * -6}deg` },
            { scale:         1 - abs * 0.14 },
          ],
        },
        isActive && s.cardWrapActive,
      ]}
      pointerEvents={abs === 0 ? 'auto' : 'none'}
    >
      {isActive && <ActiveBadge />}
      <Pressable onPress={onPress} disabled={isActive}>
        <ProductCard {...product} product={product} />
      </Pressable>
    </Animated.View>
  );
};

// ─── Main carousel ────────────────────────────────────────────────────────────
export const ProductCarousel = ({ data }) => {
  const navigation = useNavigation();

  const [activeIdx,   setActiveIdx]   = useState(0);
  const [paused,      setPaused]      = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef(null);

  const prodState        = useSelector((state) => state.products.data);
  const productData      = useMemo(() => data || prodState, [data, prodState]);
  const featuredProducts = useMemo(() => productData?.slice(13, 19) || [], [productData]);
  const total            = featuredProducts.length;

  const goTo = useCallback((idx) => {
    setActiveIdx((idx + total) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);
  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, AUTO_DELAY);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  // PanResponder handles swipe + pause-on-interaction
  const dragX = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        dragX.current = e.nativeEvent.pageX;
        setPaused(true);
      },
      onPanResponderRelease: (e) => {
        const delta = dragX.current - e.nativeEvent.pageX;
        if (Math.abs(delta) > SWIPE_THRESH) {
          delta > 0 ? next() : prev();
        }
        setTimeout(() => setPaused(false), 1200);
      },
      onPanResponderTerminate: () => setPaused(false),
    })
  ).current;

  const pad = (n) => String(n + 1).padStart(2, '0');

  if (!total) return null;

  return (
    <View style={s.section}>
      <AnimatedBorder />

      {/* ── Header ── */}
      <View style={s.container}>
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>// Drop Zone</Text>
            <Text style={s.title}>
              Related <Text style={s.titleAccent}>Products</Text>
            </Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.counter}>
              <Text style={s.counterCur}>{pad(activeIdx)}</Text>
              <Text style={s.counterSep}> / </Text>
              <Text style={s.counterTot}>{pad(total - 1)}</Text>
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Shop')}
              style={({ pressed }) => [s.viewAll, pressed && { borderColor: T.red }]}
            >
              <Text style={s.viewAllText}>All Products →</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Stage ── */}
      <View style={s.stageWrap} {...panResponder.panHandlers}>
        <GlowPool />

        <View style={s.stage}>
          {featuredProducts.map((product, i) => (
            <CardWrap
              key={product._id}
              product={product}
              offset={i - activeIdx}
              total={total}
              isActive={i === activeIdx}
              onPress={() => goTo(i)}
            />
          ))}
        </View>

        {/* Nav buttons (hidden on small screens) */}
        {SW >= 640 && (
          <>
            <Pressable style={[s.navBtn, s.navPrev]} onPress={prev}>
              <Text style={s.navBtnText}>‹</Text>
            </Pressable>
            <Pressable style={[s.navBtn, s.navNext]} onPress={next}>
              <Text style={s.navBtnText}>›</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* ── Footer: dots + progress ── */}
      <View style={s.footer}>
        <View style={s.dots}>
          {featuredProducts.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={[s.dot, i === activeIdx && s.dotActive]}
            />
          ))}
        </View>
        <ProgressBar slideKey={progressKey} paused={paused} />
      </View>
    </View>
  );
};

export default ProductCarousel;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  section: {
    borderTopWidth:  1,
    borderColor:     T.border,
    paddingTop:      12,
    paddingBottom:   48,
  },

  // Animated border accent (replaces .animated-border)
  animatedBorder: {
    height:      2,
    borderTopWidth: 2,
    marginBottom: 16,
  },

  container: {
    paddingHorizontal: 24,
  },

  // Header
  header: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-between',
    flexWrap:       'wrap',
    gap:             12,
    marginBottom:    36,
  },
  eyebrow: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      3.5,
    textTransform:     'uppercase',
    color:             T.red,
    marginBottom:       6,
    includeFontPadding: false,
  },
  title: {
    fontFamily:        'Anton_400Regular',
    fontSize:           32,
    textTransform:     'uppercase',
    color:             T.white,
    lineHeight:         32,
    letterSpacing:      0.6,
    includeFontPadding: false,
  },
  titleAccent: { color: T.red },
  headerRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            18,
  },
  counter: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize:    11,
    letterSpacing: 1.9,
  },
  counterCur: { color: T.white,   fontSize: 15, includeFontPadding: false },
  counterSep: { color: 'rgba(255,255,255,0.25)', includeFontPadding: false },
  counterTot: { color: T.dim,                    includeFontPadding: false },
  viewAll: {
    paddingVertical:   8,
    paddingHorizontal: 18,
    borderWidth:        1,
    borderColor:       T.border,
  },
  viewAllText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },

  // Stage
  stageWrap: {
    height:         STAGE_H,
    position:      'relative',
    alignItems:    'center',
    justifyContent: 'center',
  },
  glowPool: {
    position:        'absolute',
    bottom:           0,
    alignSelf:       'center',
    width:            280,
    height:            80,
    borderRadius:     140,
    backgroundColor: T.red,
    opacity:           0.3,
    zIndex:             0,
  },
  stage: {
    position:      'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    alignItems:    'center',
    justifyContent: 'center',
  },
  cardWrap: {
    position: 'absolute',
    width:     CARD_W,
  },
  cardWrapActive: {
    elevation:     8,
    shadowColor:   T.red,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius:  16,
  },

  // Active badge
  activeBadge: {
    position:          'absolute',
    top:               -14,
    alignSelf:         'center',
    backgroundColor:   T.red,
    paddingVertical:    4,
    paddingHorizontal: 12,
    zIndex:             20,
  },
  activeBadgeText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      2.9,
    textTransform:     'uppercase',
    color:             T.white,
    includeFontPadding: false,
  },

  // Nav buttons
  navBtn: {
    position:         'absolute',
    top:              '40%',
    zIndex:            20,
    width:             44,
    height:            44,
    backgroundColor:  T.dark2,
    borderWidth:       1,
    borderColor:      T.borderHi,
    alignItems:       'center',
    justifyContent:   'center',
  },
  navPrev: { left:  0 },
  navNext: { right: 0 },
  navBtnText: {
    color:              'rgba(255,255,255,0.6)',
    fontSize:            24,
    includeFontPadding: false,
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap:         14,
    marginTop:   20,
  },
  dots: {
    flexDirection: 'row',
    gap:            8,
    alignItems:    'center',
  },
  dot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: {
    width:           22,
    borderRadius:     3,
    backgroundColor: T.red,
  },
  progressTrack: {
    width:           200,
    height:            2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius:      2,
    overflow:        'hidden',
  },
  progressBar: {
    height:          '100%',
    backgroundColor: T.red,
    borderRadius:     2,
  },
});