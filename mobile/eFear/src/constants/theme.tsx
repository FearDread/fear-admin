/**
 * eFear Design Tokens
 * Direct translation of :root CSS custom properties → JS constants
 * Use these in every StyleSheet to stay on-brand.
 */
import { StyleSheet, Dimensions } from "react-native";
export const Colors = {
  // Surfaces
  dark0:    '#0d0d0d',   // deepest background
  dark1:    '#111111',   // card / panel
  dark2:    '#141414',   // input / elevated surface
  dark3:    '#1a1a1a',   // subtle lift

  // Borders
  border:   '#222222',
  borderHi: '#2e2e2e',

  // Text
  textDim:  'rgba(255,255,255,0.32)',
  textMid:  'rgba(255,255,255,0.58)',
  textHi:   'rgba(255,255,255,0.92)',
  white:    '#ffffff',

  // Accents
  red:      '#b30e1c',   // primary CTA
  redFaded: 'rgba(179,14,28,0.12)',
  redBorder:'rgba(179,14,28,0.28)',
  teal:     '#2a9d8f',
  tealFaded:'rgba(42,157,143,0.12)',
  tealBorder:'rgba(42,157,143,0.35)',
  orange:   '#f4a261',
  purp:     '#6120d9',
} as const;
const T = Colors;
/** Font family names – must match the names loaded via expo-font */
export const Fonts = {
  display: 'Anton',           // headings / display
  mono:    'SpaceMono',       // body / labels / UI
} as const;

/** Shared spacing scale (px) */
export const Space = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

/** Border radius (eFear uses sharp corners; 0 = square, 2 = subtle) */
export const Radius = {
  none:  0,
  sm:    2,
  md:    4,
} as const;

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 48 - 12) / 2; // two-column grid with gap

const s = StyleSheet.create({
  // Root
  root: {
    flex: 1,
    backgroundColor: T.dark0,
  },
  rootContent: {
    // no padding — sections control their own spacing
  },

  // Shared container
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },

  // ── MarqueeBand ──
  marqueeWrap: {
    backgroundColor: T.red,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  marqueeTrack: {
    flexDirection: 'row',
  },
  marqueeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  marqueeText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: T.white,
    includeFontPadding: false,
  },
  marqueeSep: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginLeft: 8,
    includeFontPadding: false,
  },

  // ── WhyUs ──
  whySection: {
    backgroundColor: T.dark1,
    paddingVertical: 80,
  },
  whyStory: {
    marginBottom: 40,
  },
  whyEyebrow: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: T.red,
    marginBottom: 12,
    includeFontPadding: false,
  },
  whyTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 32,
    lineHeight: 34,
    color: T.white,
    textTransform: 'uppercase',
    marginBottom: 20,
    includeFontPadding: false,
  },
  whyBody: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 14,
    includeFontPadding: false,
  },
  whyBodyEm: {
    fontFamily: 'SpaceMono_400Regular_Italic',
    color: 'rgba(255,255,255,0.85)',
  },
  btnTextLink: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: T.red,
    paddingBottom: 2,
  },
  btnTextLinkText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1.9,
    textTransform: 'uppercase',
    color: T.red,
    includeFontPadding: false,
  },
  whyFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  whyCard: {
    width: CARD_W,
    backgroundColor: T.dark4,
    borderWidth: 1,
    borderColor: '#252525',
    padding: 20,
  },
  whyCardHover: {
    borderColor: T.red,
  },
  whyIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  whyCardTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    textTransform: 'uppercase',
    color: T.white,
    marginBottom: 8,
    includeFontPadding: false,
  },
  whyCardBody: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.5)',
    includeFontPadding: false,
  },

  // ── CtaBanner ──
  ctaBanner: {
    backgroundColor: T.red,
    paddingVertical: 64,
  },
  ctaInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 28,
  },
  ctaText: {
    flex: 1,
    minWidth: 240,
  },
  ctaHeading: {
    fontFamily: 'Anton_400Regular',
    fontSize: 36,
    textTransform: 'uppercase',
    color: T.white,
    lineHeight: 38,
    marginBottom: 12,
    includeFontPadding: false,
  },
  ctaSub: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.8)',
    includeFontPadding: false,
  },
  ctaActions: {
    gap: 14,
    alignItems: 'flex-start',
  },
  // Clipped button approximated — clip-path not supported in RN
  // Using a plain rectangle with sharp corners to match brutalist feel
  btnCtaMain: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    backgroundColor: T.white,
  },
  btnCtaMainText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: T.red,
    includeFontPadding: false,
  },
  btnCtaGhost: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
    paddingBottom: 2,
  },
  btnCtaGhostText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    includeFontPadding: false,
  },

  // ── OfferHighlights ──
  offersSection: {
    paddingVertical: 64,
  },
  offersGrid: {
    gap: 16,
  },
  offerCard: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: T.dark2,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
    marginBottom: 4,
  },
  offerImg: {
    width: '100%',
    height: '100%',
  },
  // Gradient overlay — RN doesn't support CSS gradients on plain Views.
  // Use expo-linear-gradient for the actual gradient, or this dark overlay as fallback.
  // Replace View with:
  //   import { LinearGradient } from 'expo-linear-gradient';
  //   <LinearGradient colors={['transparent','rgba(0,0,0,0.9)']} style={s.offerOverlay}>
  offerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    padding: 24,
  },
  offerNote: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: T.red,
    marginBottom: 6,
    includeFontPadding: false,
  },
  offerCat: {
    fontFamily: 'Anton_400Regular',
    fontSize: 30,
    textTransform: 'uppercase',
    color: T.white,
    marginBottom: 10,
    includeFontPadding: false,
  },
  offerBtn: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
    includeFontPadding: false,
  },
});