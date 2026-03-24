/**
 * CategoryCards.jsx — React Native
 *
 * Web → RN:
 *   Link to={c.link}          → Pressable + useNavigation
 *   --cat-accent CSS var       → plain JS prop passed per card
 *   clip-path: polygon()       → ⚠ not supported — sharp corners used
 *   .cat-glow mix-blend-mode   → ⚠ not supported — opacity tint overlay instead
 *   cat-img scale on hover     → Animated.timing on scale (Pressable)
 *   grid auto-fit minmax(280)  → FlatList 1-col on mobile, 3-col on tablet
 */

import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
  dark1:  '#111111',
  dark2:  '#141414',
  dark3:  '#1a1a1a',
  border: '#222222',
  dim:    'rgba(255,255,255,0.40)',
  mid:    'rgba(255,255,255,0.50)',
  white:  '#ffffff',
};

const SW = Dimensions.get('window').width;
// 1 column on phone (<600), 2 on small tablet, 3 on large
const NUM_COLS = SW < 600 ? 1 : SW < 960 ? 2 : 3;
const GUTTER   = 24;
const GAP      = 16;
const CARD_W   = (SW - GUTTER * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

// ─── Data ────────────────────────────────────────────────────────────────────
const CATS = [
  {
    label:   'Comics',
    tagline: 'Marvel, DC & beyond',
    blurb:   'From first prints to modern variants. Every issue bagged, boarded, near-mint.',
    accent:  '#c40717',
    image:   require('../../../assets/images/comics/super1.png'),
    screen:  'Shop',
    params:  { cat: 'comics' },
  },
  {
    label:   'E-Books',
    tagline: 'Starting at $9',
    blurb:   'Cookbooks, manifestos, graphic novels, and more. Also available on Amazon.',
    accent:  '#6f11e1',
    image:   require('../../../assets/images/ebooks/01.jpg'),
    screen:  'Shop',
    params:  { cat: 'books' },
  },
  {
    label:   'Collectibles',
    tagline: 'Cards, slabs & rarities',
    blurb:   'Pokémon, NFL, NBA, Baseball. Some packs will make you cry. All of them will.',
    accent:  '#1081a7',
    image:   require('../../../assets/images/comics/super3.png'),
    screen:  'Shop',
    params:  { cat: 'cards' },
  },
];

// ─── Single card ─────────────────────────────────────────────────────────────
const CatCard = ({ label, tagline, blurb, accent, image, screen, params }) => {
  const nav      = useNavigation();
  const scale    = useRef(new Animated.Value(1)).current;
  const glowOpac = useRef(new Animated.Value(0)).current;

  const onIn = () => {
    Animated.parallel([
      Animated.timing(scale,    { toValue: 1.05, duration: 400, useNativeDriver: true }),
      Animated.timing(glowOpac, { toValue: 0.25, duration: 300, useNativeDriver: false }),
    ]).start();
  };
  const onOut = () => {
    Animated.parallel([
      Animated.timing(scale,    { toValue: 1,    duration: 400, useNativeDriver: true }),
      Animated.timing(glowOpac, { toValue: 0,    duration: 300, useNativeDriver: false }),
    ]).start();
  };

  return (
    <Pressable
      onPress={() => nav.navigate(screen, params)}
      onPressIn={onIn}
      onPressOut={onOut}
      style={[s.card, { width: NUM_COLS === 1 ? '100%' : CARD_W }]}
    >
      {/* Image */}
      <View style={s.imgWrap}>
        <Animated.Image
          source={image}
          style={[s.img, { transform: [{ scale }] }]}
          resizeMode="cover"
        />
        {/*
          .cat-glow: mix-blend-mode overlay not supported in RN.
          Approximated with a flat tint overlay. Replace with
          expo-linear-gradient for a diagonal fade effect.
        */}
        <Animated.View
          style={[s.glowOverlay, { backgroundColor: accent, opacity: glowOpac }]}
          pointerEvents="none"
        />
      </View>

      {/* Info */}
      <View style={s.info}>
        <Text style={[s.badge, { color: accent }]}>{tagline}</Text>
        <Text style={s.name}>{label}</Text>
        <Text style={s.blurb}>{blurb}</Text>
        <Text style={[s.cta, { color: accent }]}>Shop {label} →</Text>
      </View>
    </Pressable>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────
export const CategoryCards = () => (
  <View style={s.section}>
    {/* Header */}
    <View style={s.header}>
      <Text style={s.eyebrow}>Shop by category</Text>
      <Text style={s.title}>What are you into?</Text>
    </View>

    {/* Grid */}
    {NUM_COLS === 1 ? (
      // Single-column: plain vertical list (no FlatList needed, avoids nested scroll)
      <View style={s.container}>
        {CATS.map((c) => <CatCard key={c.label} {...c} />)}
      </View>
    ) : (
      <FlatList
        data={CATS}
        keyExtractor={(c) => c.label}
        numColumns={NUM_COLS}
        key={NUM_COLS}                       // force re-render on orientation change
        contentContainerStyle={s.container}
        columnWrapperStyle={NUM_COLS > 1 ? s.row : undefined}
        scrollEnabled={false}                // parent ScrollView handles scrolling
        renderItem={({ item }) => <CatCard {...item} />}
      />
    )}
  </View>
);

export default CategoryCards;

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  section: {
    paddingVertical: 64,
  },
  container: {
    paddingHorizontal: GUTTER,
    gap: GAP,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  header: {
    alignItems:    'center',
    marginBottom:  40,
    paddingHorizontal: GUTTER,
  },
  eyebrow: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      3.2,
    textTransform:     'uppercase',
    color:              T.dim,
    marginBottom:       8,
    includeFontPadding: false,
  },
  title: {
    fontFamily:        'Anton_400Regular',
    fontSize:           40,
    color:              T.white,
    textTransform:     'uppercase',
    includeFontPadding: false,
  },

  // ── Card ──
  card: {
    backgroundColor: T.dark2,
    borderWidth:      1,
    borderColor:      T.border,
    overflow:        'hidden',
    // clip-path not supported — sharp corner is the brutalist fallback
    marginBottom:     GAP,
  },
  imgWrap: {
    height:          220,
    backgroundColor: T.dark3,
    overflow:        'hidden',
  },
  img: {
    width:  '100%',
    height: '100%',
  },
  glowOverlay: {
    position: 'absolute',
    inset:    0,
    top: 0, bottom: 0, left: 0, right: 0,
  },
  info: {
    padding: 22,
  },
  badge: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      2.4,
    textTransform:     'uppercase',
    marginBottom:       8,
    includeFontPadding: false,
  },
  name: {
    fontFamily:        'Anton_400Regular',
    fontSize:           28,
    color:              T.white,
    textTransform:     'uppercase',
    marginBottom:       10,
    includeFontPadding: false,
  },
  blurb: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           13,
    lineHeight:         21,
    color:              T.mid,
    flex:               1,
    includeFontPadding: false,
  },
  cta: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           12,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    marginTop:          16,
    includeFontPadding: false,
  },
});