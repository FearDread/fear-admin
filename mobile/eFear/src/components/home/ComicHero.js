/**
 * ComicHero.jsx — React Native
 *
 * Web → RN:
 *   setInterval auto-play     → useEffect + setInterval (unchanged logic)
 *   CSS heroFadeIn keyframe   → Animated opacity + translateY per textKey change
 *   CSS hero-progress width   → Animated.timing width (useNativeDriver: false)
 *   hero-img-glow blur        → View with borderRadius + semi-transparent bg
 *   --accent CSS var          → JS variable per slide, passed as prop
 *   halftone radial-gradient  → ⚠ not replicable — omitted (use react-native-svg)
 *   clip-path buttons         → sharp rectangle corners
 *   Link to={ctaLink}         → Pressable + useNavigation
 *   onMouseEnter/Leave pause  → onPressIn/Out on stage wrapper
 *   hero-image-wrap hidden    → shown on mobile (stacked above text)
 *
 * Install:
 *   npx expo install @expo-google-fonts/anton @expo-google-fonts/space-mono expo-font
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  dark0:  '#0d0d0d',
  dark2:  '#141414',
  border: '#222222',
  mid:    'rgba(255,255,255,0.45)',
  sub:    'rgba(255,255,255,0.75)',
  white:  '#ffffff',
};

const SW           = Dimensions.get('window').width;
const AUTO_DELAY   = 5000;

// ─── Slide data ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id:      1,
    eyebrow: 'New Arrivals Every Week',
    heading: 'Comics',
    sub:     'Marvel · DC · Dark Horse · Indie',
    body:    'Thousands of titles. Every one bagged, boarded, and mint. Your pull list just got dangerous.',
    cta:     'Browse Comics',
    screen:  'Shop',
    params:  { cat: 'comics' },
    accent:  '#c40717',
    image:   require('../../assets/images/comics/home04.png'),
  },
  {
    id:      2,
    eyebrow: 'Also on Amazon',
    heading: 'E-Books',
    sub:     'Cookbooks · Manifestos · Biographies',
    body:    'Words that hit harder than a Mjolnir swing. Available instantly — no shipping required.',
    cta:     'Explore E-Books',
    screen:  'Shop',
    params:  { cat: 'books' },
    accent:  '#6f11e1',
    image:   require('../../assets/images/ebooks/01.jpg'),
  },
  {
    id:      3,
    eyebrow: 'Limited Stock',
    heading: 'Collectibles',
    sub:     'Pokémon · NFL · NBA · Baseball Cards',
    body:    'Rare cards. Graded slabs. Pack pulls that will either make your day or haunt your dreams.',
    cta:     'Shop Collectibles',
    screen:  'Shop',
    params:  { cat: 'cards' },
    accent:  '#1081a7',
    image:   require('../../assets/images/comics/banner/05.png'),
  },
];

// ─── Animated text block (fades + slides up on each slide change) ────────────
const SlideText = ({ slide, onShopPress, onAllPress }) => {
  const fadeY = useRef(new Animated.Value(18)).current;
  const opac  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeY.setValue(18);
    opac.setValue(0);
    Animated.parallel([
      Animated.timing(fadeY, { toValue: 0,   duration: 480, useNativeDriver: true }),
      Animated.timing(opac,  { toValue: 1,   duration: 400, useNativeDriver: true }),
    ]).start();
  }, [slide.id]);

  return (
    <Animated.View style={[s.textBlock, { opacity: opac, transform: [{ translateY: fadeY }] }]}>
      <View style={[s.eyebrowPill, { borderColor: slide.accent }]}>
        <Text style={[s.eyebrowText, { color: slide.accent }]}>{slide.eyebrow}</Text>
      </View>

      <Text style={s.heading}>{slide.heading}</Text>
      <Text style={s.sub}>{slide.sub}</Text>
      <Text style={s.body}>{slide.body}</Text>

      <View style={s.buttons}>
        <Pressable
          onPress={onShopPress}
          style={({ pressed }) => [
            s.btnPrimary,
            { backgroundColor: slide.accent },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={s.btnPrimaryText}>{slide.cta}</Text>
        </Pressable>
        <Pressable
          onPress={onAllPress}
          style={({ pressed }) => [s.btnGhost, pressed && { opacity: 0.6 }]}
        >
          <Text style={s.btnGhostText}>View All</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

// ─── Progress bar (resets and runs for AUTO_DELAY each slide) ────────────────
const ProgressBar = ({ slideKey, paused, accent }) => {
  const width = useRef(new Animated.Value(0)).current;
  const anim  = useRef(null);

  useEffect(() => {
    width.setValue(0);
    if (anim.current) anim.current.stop();
    if (!paused) {
      anim.current = Animated.timing(width, {
        toValue:         200,           // track is 200px wide
        duration:        AUTO_DELAY,
        useNativeDriver: false,         // width cannot use native driver
      });
      anim.current.start();
    }
    return () => { if (anim.current) anim.current.stop(); };
  }, [slideKey, paused]);

  return (
    <View style={s.progressTrack}>
      <Animated.View style={[s.progressBar, { width, backgroundColor: accent }]} />
    </View>
  );
};

// ─── Hero ────────────────────────────────────────────────────────────────────
export const HeroSection = () => {
  const nav              = useNavigation();
  const [idx, setIdx]    = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef         = useRef(null);

  const slide = SLIDES[idx];

  const goTo = useCallback((next) => {
    if (transitioning) return;
    setTransitioning(true);
    setIdx((next + SLIDES.length) % SLIDES.length);
    setTimeout(() => setTransitioning(false), 600);
  }, [transitioning]);

  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);
  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, AUTO_DELAY);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  return (
    <Pressable
      style={s.hero}
      onPressIn={() => setPaused(true)}
      onPressOut={() => setPaused(false)}
    >
      {/* Slide image (stacked above text on mobile) */}
      <View style={s.imageWrap}>
        <Image source={slide.image} style={s.heroImg} resizeMode="contain" />
        {/* Glow beneath image — approximates CSS blur + radial gradient */}
        <View style={[s.imgGlow, { backgroundColor: slide.accent }]} />
      </View>

      {/* Text content */}
      <SlideText
        slide={slide}
        onShopPress={() => nav.navigate(slide.screen, slide.params)}
        onAllPress={() => nav.navigate('Shop')}
      />

      {/* Prev / Next */}
      <Pressable style={[s.navBtn, s.navPrev]} onPress={prev} disabled={transitioning}>
        <Text style={s.navBtnText}>←</Text>
      </Pressable>
      <Pressable style={[s.navBtn, s.navNext]} onPress={next} disabled={transitioning}>
        <Text style={s.navBtnText}>→</Text>
      </Pressable>

      {/* Dots + progress */}
      <View style={s.footer}>
        <View style={s.dots}>
          {SLIDES.map((sl, i) => (
            <Pressable
              key={sl.id}
              onPress={() => goTo(i)}
              style={[
                s.dot,
                i === idx && [s.dotActive, { backgroundColor: slide.accent }],
              ]}
            />
          ))}
        </View>
        {!paused && (
          <ProgressBar slideKey={idx} paused={paused} accent={slide.accent} />
        )}
      </View>
    </Pressable>
  );
};

export default HeroSection;

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  hero: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    overflow:        'hidden',
    paddingBottom:    32,
    // ⚠ halftone dot overlay not replicated — use react-native-svg for the pattern
  },

  // Image
  imageWrap: {
    height:          280,
    alignItems:      'center',
    justifyContent:  'center',
    position:        'relative',
    marginBottom:     8,
  },
  heroImg: {
    width:  SW * 0.6,
    height: 260,
    zIndex: 1,
  },
  imgGlow: {
    position:     'absolute',
    width:         240,
    height:         80,
    bottom:           0,
    alignSelf:     'center',
    borderRadius:   120,
    opacity:          0.2,
    // CSS: filter blur(90px) — RN has no blur on View; use @shopify/react-native-skia
  },

  // Text block
  textBlock: {
    paddingHorizontal: 24,
    paddingTop:         8,
  },
  eyebrowPill: {
    borderWidth:       1,
    alignSelf:        'flex-start',
    paddingHorizontal: 12,
    paddingVertical:    4,
    marginBottom:      16,
  },
  eyebrowText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      3.2,
    textTransform:     'uppercase',
    includeFontPadding: false,
  },
  heading: {
    fontFamily:        'Anton_400Regular',
    fontSize:           72,
    lineHeight:         66,
    color:             '#ffffff',
    textTransform:     'uppercase',
    letterSpacing:     -1,
    marginBottom:       12,
    includeFontPadding: false,
  },
  sub: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      1.9,
    textTransform:     'uppercase',
    color:             'rgba(255,255,255,0.45)',
    marginBottom:       12,
    includeFontPadding: false,
  },
  body: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           13,
    lineHeight:         21,
    color:             'rgba(255,255,255,0.75)',
    maxWidth:           400,
    marginBottom:       28,
    includeFontPadding: false,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:            12,
    alignItems:    'center',
  },
  btnPrimary: {
    paddingVertical:   13,
    paddingHorizontal: 32,
  },
  btnPrimaryText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           12,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             '#ffffff',
    includeFontPadding: false,
  },
  btnGhost: {
    paddingVertical:   13,
    paddingHorizontal: 32,
    borderWidth:        1,
    borderColor:       'rgba(255,255,255,0.30)',
  },
  btnGhostText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           12,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             'rgba(255,255,255,0.80)',
    includeFontPadding: false,
  },

  // Nav buttons
  navBtn: {
    position:          'absolute',
    top:                '40%',
    width:              44,
    height:             44,
    backgroundColor:   '#141414',
    borderWidth:        1,
    borderColor:       '#2e2e2e',
    alignItems:        'center',
    justifyContent:    'center',
    zIndex:             10,
  },
  navPrev: { left: 0 },
  navNext: { right: 0 },
  navBtnText: {
    color:              'rgba(255,255,255,0.6)',
    fontSize:            20,
    includeFontPadding: false,
  },

  // Footer
  footer: {
    alignItems:  'center',
    gap:          12,
    marginTop:    28,
    paddingHorizontal: 24,
  },
  dots: {
    flexDirection:  'row',
    gap:             8,
    alignItems:     'center',
  },
  dot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: {
    width:        22,
    height:        6,
    borderRadius:  3,
    // backgroundColor set inline from slide.accent
  },

  // Progress bar
  progressTrack: {
    width:           200,
    height:            2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius:      2,
    overflow:        'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});