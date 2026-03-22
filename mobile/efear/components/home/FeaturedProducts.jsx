/**
 * FeaturedProducts.jsx — React Native
 *
 * Web → RN:
 *   useSelector / Redux         → unchanged ✓
 *   CSS perspective + rotateY   → RN transform array [{ perspective }, { rotateY }]
 *   translateZ depth            → approximated via scale (RN has no translateZ in transforms)
 *   onMouseDown/Up drag         → PanResponder (built-in, no extra install)
 *   onTouchStart/End swipe      → PanResponder (unified with mouse drag above)
 *   isHovered pause             → PanResponder onStart/Release + state
 *   CSS fp-progress keyframe    → Animated.timing width (useNativeDriver: false)
 *   fp-active-badge animation   → Animated opacity fade-in
 *   display: 'none' far cards   → opacity 0 + pointerEvents 'none'
 *   fp-glow-pool radial blur    → View + borderRadius, opacity pulse (Animated.loop)
 *   fp-halftone / fp-scanlines  → ⚠ omitted — use react-native-svg for dot pattern
 *   fp-card-wrap box shadow     → elevation (Android) + shadowColor (iOS)
 *   bx icons                    → text arrows (install @expo/vector-icons for real icons)
 *
 * ⚠ IMPORTANT — overflow: 'visible' on Android:
 *   Side cards extend beyond the stage bounds. On Android, child views are
 *   clipped by their parent by default inside a ScrollView. Two fixes:
 *     A) Use react-native-gesture-handler + Reanimated for a proper shared-element
 *        carousel (recommended for production).
 *     B) Set a tall enough stage height so side cards fit inside it, and accept
 *        the slight vertical overflow. The dim opacity (0.18) makes it subtle.
 *
 * Install:
 *   npx expo install @expo-google-fonts/anton @expo-google-fonts/space-mono expo-font
 *   (Redux already installed from previous setup)
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
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectFeaturedProducts } from '../../features/products/slice';
import ProductCard from '../products/ProductCard';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  red:    '#b30e1c',
  dark0:  '#0d0d0d',
  dark2:  '#141414',
  border: '#222222',
  borderHi: '#2e2e2e',
  dim:    'rgba(255,255,255,0.32)',
  mid:    'rgba(255,255,255,0.58)',
  white:  '#ffffff',
};

const SW         = Dimensions.get('window').width;
const CARD_W     = Math.min(SW * 0.68, 270);   // matches fp-card-wrap: 270px max
const CARD_OFFSET = CARD_W * 0.85;              // translateX distance between cards
const STAGE_H    = SW < 640 ? 440 : 520;
const AUTO_DELAY = 4000;
const SWIPE_THRESHOLD = 50;

// ─── Glow pool (pulsing ellipse beneath active card) ─────────────────────────
const GlowPool = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opac  = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
          Animated.timing(opac,  { toValue: 1.0, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.0, duration: 1500, useNativeDriver: true }),
          Animated.timing(opac,  { toValue: 0.85, duration: 1500, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        s.glowPool,
        { opacity: opac, transform: [{ scaleY: scale }] },
      ]}
      pointerEvents="none"
    />
  );
};

// ─── Active badge (fades in when a card becomes active) ──────────────────────
const ActiveBadge = () => {
  const opac = useRef(new Animated.Value(0)).current;
  const tY   = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    opac.setValue(0);
    tY.setValue(-6);
    Animated.parallel([
      Animated.timing(opac, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(tY,   { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[s.activeBadge, { opacity: opac, transform: [{ translateY: tY }] }]}
    >
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
      anim.current = Animated.timing(w, {
        toValue:         200,
        duration:        AUTO_DELAY,
        useNativeDriver: false,   // animating width
      });
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

// ─── Card wrapper ─────────────────────────────────────────────────────────────
// Applies the 3-D carousel transform for each card based on its offset from active.
const CardWrap = ({ product, offset, total, isActive, onPress }) => {
  // Normalise offset so it wraps around shortest path
  let off = offset;
  if (off >  total / 2) off -= total;
  if (off < -total / 2) off += total;
  const abs = Math.abs(off);

  // Cards more than 2 positions away are invisible (matches web display:'none')
  if (abs > 2) return null;

  const opacity   = abs === 0 ? 1 : abs === 1 ? 0.52 : 0.18;
  const scaleVal  = 1 - abs * 0.14;
  const rotateY   = `${off * -6}deg`;
  const txVal     = off * CARD_OFFSET;

  return (
    <Animated.View
      style={[
        s.cardWrap,
        {
          opacity,
          zIndex:      10 - abs,
          transform: [
            { perspective: 1200 },    // enables 3-D — must come first
            { translateX: txVal },
            { rotateY },
            { scale: scaleVal },
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

// ─── Main component ───────────────────────────────────────────────────────────
export const FeaturedProducts = ({ data }) => {
  const nav = useNavigation();

  const [activeIdx,   setActiveIdx]   = useState(0);
  const [paused,      setPaused]      = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef(null);

  // ── Redux ──
  const prodState        = useSelector(selectFeaturedProducts);
  const productData      = useMemo(() => data || prodState, [data, prodState]);
  const featuredProducts = useMemo(() => productData?.slice(13, 19) || [], [productData]);
  const total            = featuredProducts.length;

  // ── Navigation ──
  const goTo = useCallback((idx) => {
    setActiveIdx((idx + total) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);
  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);

  // ── Auto-advance ──
  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, AUTO_DELAY);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  // ── PanResponder (replaces onMouseDown/Up + onTouchStart/End) ──
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
        if (Math.abs(delta) > SWIPE_THRESHOLD) {
          delta > 0 ? next() : prev();
        }
        // Resume auto-play after a short pause post-swipe
        setTimeout(() => setPaused(false), 1200);
      },
      onPanResponderTerminate: () => setPaused(false),
    })
  ).current;

  const pad = (n) => String(n + 1).padStart(2, '0');

  if (!total) return null;

  return (
    <View style={s.section}>
      {/* ── Header ── */}
      <View style={s.container}>
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>// Drop Zone</Text>
            <Text style={s.title}>
              Featured <Text style={s.titleAccent}>Products</Text>
            </Text>
          </View>
          <View style={s.headerRight}>
            {/* Counter */}
            <Text style={s.counter}>
              <Text style={s.counterCur}>{pad(activeIdx)}</Text>
              <Text style={s.counterSep}> / </Text>
              <Text style={s.counterTot}>{pad(total - 1)}</Text>
            </Text>
            {/* View all CTA */}
            <Pressable
              onPress={() => nav.navigate('Shop')}
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

        {/* Cards — all absolute, centered, transformed by offset */}
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

        {/* Prev / Next (hidden on small screens via SW check) */}
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

      {/* ── Footer ── */}
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

export default FeaturedProducts;

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  section: {
    borderTopWidth:    1,
    borderBottomWidth: 1,
    borderColor:       T.border,
    paddingTop:        64,
    paddingBottom:     48,
  },
  container: {
    paddingHorizontal: 24,
  },

  // ── Header ──
  header: {
    flexDirection:   'row',
    alignItems:      'flex-end',
    justifyContent:  'space-between',
    flexWrap:        'wrap',
    gap:              16,
    marginBottom:     40,
  },
  eyebrow: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      3.5,
    textTransform:     'uppercase',
    color:              T.red,
    marginBottom:       6,
    includeFontPadding: false,
  },
  title: {
    fontFamily:        'Anton_400Regular',
    fontSize:           36,
    textTransform:     'uppercase',
    color:              T.white,
    lineHeight:         36,
    letterSpacing:      0.7,
    includeFontPadding: false,
  },
  titleAccent: {
    color: T.red,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            20,
  },
  counter: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize:    11,
    letterSpacing: 1.9,
  },
  counterCur: {
    color:    T.white,
    fontSize: 15,
    includeFontPadding: false,
  },
  counterSep: {
    color: 'rgba(255,255,255,0.25)',
    includeFontPadding: false,
  },
  counterTot: {
    color: T.dim,
    includeFontPadding: false,
  },
  viewAll: {
    paddingVertical:   9,
    paddingHorizontal: 20,
    borderWidth:        1,
    borderColor:       T.border,
  },
  viewAllText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:              T.mid,
    includeFontPadding: false,
  },

  // ── Stage ──
  stageWrap: {
    height:          STAGE_H,
    position:       'relative',
    alignItems:     'center',
    justifyContent: 'center',
    // overflow: 'visible' — on Android this may clip; see header comment
  },
  glowPool: {
    position:        'absolute',
    bottom:             0,
    alignSelf:       'center',
    width:            280,
    height:            80,
    borderRadius:     140,
    backgroundColor: T.red,
    opacity:           0.3,
    // CSS had filter:blur(28px) — use @shopify/react-native-skia for blur
    zIndex:             0,
  },
  stage: {
    position:       'absolute',
    top:              0,
    bottom:           0,
    left:             0,
    right:            0,
    alignItems:     'center',
    justifyContent: 'center',
  },
  cardWrap: {
    position: 'absolute',
    width:     CARD_W,
  },
  cardWrapActive: {
    // CSS had filter:drop-shadow — use elevation on Android
    elevation:   8,
    shadowColor: T.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius:  16,
  },

  // ── Active badge ──
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
    color:              T.white,
    includeFontPadding: false,
  },

  // ── Nav buttons ──
  navBtn: {
    position:          'absolute',
    top:                '40%',
    zIndex:             20,
    width:              44,
    height:             44,
    backgroundColor:   T.dark2,
    borderWidth:        1,
    borderColor:       T.borderHi,
    alignItems:        'center',
    justifyContent:    'center',
  },
  navPrev: { left: 0 },
  navNext: { right: 0 },
  navBtnText: {
    color:              'rgba(255,255,255,0.6)',
    fontSize:            24,
    includeFontPadding: false,
  },

  // ── Footer ──
  footer: {
    alignItems:  'center',
    gap:          16,
    marginTop:    24,
    paddingHorizontal: 24,
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