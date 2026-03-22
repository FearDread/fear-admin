import { StyleSheet } from 'react-native';

const { width: SW } = Dimensions.get('window');
const GUTTER    = 24;
const COL2_GAP  = 14;
const CARD_HALF = (SW - GUTTER * 2 - COL2_GAP) / 2;
const CARD_3RD  = (SW - GUTTER * 2 - COL2_GAP * 2) / 3;

export const T = {
  red:      '#b30e1c',
  orange:   '#61f472',
  teal:     '#2a9d8f',
  purp:     '#6120d9',
  dark0:    '#0d0d0d',
  dark1:    '#111111',
  dark2:    '#141414',
  dark3:    '#1a1a1a',
  dark4:    '#161616',
  border:   '#222222',
  borderHi: '#2e2e2e',
  dim:      'rgba(255,255,255,0.32)',
  mid:      'rgba(255,255,255,0.58)',
  hi:       'rgba(255,255,255,0.92)',
  white:    '#ffffff',
};

export const CARD_W = (SCREEN_W - 48 - 12) / 2; // two-column grid with gap

export const homeStyles = StyleSheet.create({
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

export const aboutStyles = StyleSheet.create({

  // Root
  root: { flex: 1, backgroundColor: T.dark0 },
  rootContent: {},

  // Container
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: GUTTER,
  },

  // Spacing helpers
  mb12: { marginBottom: 12 },
  mt14: { marginTop: 14 },
  mt20: { marginTop: 20 },

  // Shared typography
  textDisplay: {
    fontFamily: 'Anton_400Regular',
    color: T.white,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  eyebrow: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: T.red,
    includeFontPadding: false,
  },
  bodyText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    lineHeight: 22,
    color: T.mid,
    includeFontPadding: false,
  },
  em: {
    fontFamily: 'SpaceMono_400Regular_Italic',
    color: T.hi,
  },

  // Shared section title
  sectionTitle: {
    fontSize: 32,
    lineHeight: 34,
    marginTop: 10,
    marginBottom: 20,
  },

  // Shared centered header
  centerHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  centerHeaderSub: {
    textAlign: 'center',
    maxWidth: 480,
    marginTop: 12,
  },

  // Shared primary button
  btnPrimary: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: T.red,
  },
  btnPrimaryText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: T.white,
    includeFontPadding: false,
  },

  // Shared ghost button (underline style)
  btnGhost: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 2,
    alignSelf: 'flex-start',
  },
  btnGhostText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
    includeFontPadding: false,
  },

  // ── MarqueeBand ──
  marqueeWrap: {
    backgroundColor: T.red,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  marqueeTrack: { flexDirection: 'row' },
  marqueeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24 },
  marqueeText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: T.white,
    includeFontPadding: false,
  },
  marqueeSep: { color: 'rgba(255,255,255,0.5)', fontSize: 16 },

  // ── PageHero ──
  heroSection: {
    backgroundColor: T.dark0,
    paddingTop: 96,
    paddingBottom: 80,
    overflow: 'hidden',
    position: 'relative',
  },
  heroAccentBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: T.red,
  },
  heroGhostWord: {
    position: 'absolute',
    right: -8,
    top: '30%',
    fontFamily: 'Anton_400Regular',
    fontSize: 120,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.03)',
    includeFontPadding: false,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  breadcrumbLink: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: T.dim,
    includeFontPadding: false,
  },
  breadcrumbSep: { color: T.red, fontSize: 11 },
  breadcrumbCurrent: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: T.red,
    includeFontPadding: false,
  },
  heroTitle: {
    fontSize: 72,
    lineHeight: 68,
    marginBottom: 24,
    // WebkitTextStroke not supported — see comment in component
  },
  heroTitleRed: { color: T.red },
  heroBody: {
    fontSize: 16,
    lineHeight: 26,
    color: T.mid,
    maxWidth: 480,
    marginBottom: 32,
    includeFontPadding: false,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
  },

  // ── OriginStory ──
  originSection: {
    backgroundColor: T.dark1,
    paddingVertical: 80,
  },
  originImgWrap: {
    position: 'relative',
    aspectRatio: 4 / 5,
    backgroundColor: T.dark2,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  originImg: { width: '100%', height: '100%' },
  originImgOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    // Replace with expo-linear-gradient for the red fade
    backgroundColor: 'rgba(230,57,70,0.75)',
    padding: 20,
  },
  originImgCaption: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    color: T.white,
    includeFontPadding: false,
  },
  originBadge: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: T.red,
    padding: 18,
    minWidth: 100,
    alignItems: 'center',
  },
  originBadgeValue: {
    fontFamily: 'Anton_400Regular',
    fontSize: 36,
    color: T.white,
    lineHeight: 38,
    includeFontPadding: false,
  },
  originBadgeLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    includeFontPadding: false,
  },
  originTextSide: {},
  pullQuote: {
    borderLeftWidth: 3,
    borderLeftColor: T.red,
    paddingLeft: 20,
    marginVertical: 28,
  },
  pullQuoteText: {
    fontFamily: 'SpaceMono_400Regular_Italic',
    fontSize: 13,
    lineHeight: 22,
    color: T.hi,
    includeFontPadding: false,
  },

  // ── StatsRow ──
  statsSection: {
    backgroundColor: T.dark0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: T.border,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  statCell: {
    flex: 1,
    minWidth: (SW - 2) / 2,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  statCellBorder: {
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  statValue: {
    fontFamily: 'Anton_400Regular',
    fontSize: 48,
    color: T.red,
    lineHeight: 50,
    marginBottom: 6,
    includeFontPadding: false,
  },
  statLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: T.white,
    marginBottom: 4,
    textAlign: 'center',
    includeFontPadding: false,
  },
  statNote: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: T.dim,
    textAlign: 'center',
    includeFontPadding: false,
  },

  // ── WhatWeOffer ──
  offerSection: { paddingVertical: 80 },
  offerTile: {
    backgroundColor: T.dark2,
    borderWidth: 1,
    borderColor: T.border,
    padding: 28,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    gap: 14,
  },
  offerTileBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 4,
  },
  offerTileTop: { gap: 6 },
  offerTileIcon: { fontSize: 36 },
  offerTileEyebrow: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 2.9,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  offerTileTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 30,
    textTransform: 'uppercase',
    color: T.white,
    includeFontPadding: false,
  },
  offerTileBody: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    lineHeight: 22,
    color: T.mid,
    includeFontPadding: false,
  },
  offerTileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingTop: 14,
    marginTop: 4,
  },
  offerTileDetail: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: T.dim,
    includeFontPadding: false,
  },
  offerTileLink: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },

  // ── OurPromise ──
  promiseSection: {
    backgroundColor: T.dark0,
    paddingVertical: 80,
  },
  promiseHeader: { marginBottom: 32 },
  promiseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COL2_GAP,
  },
  promiseCard: {
    width: CARD_HALF,
    backgroundColor: T.dark2,
    borderWidth: 1,
    borderColor: T.border,
    padding: 22,
    gap: 10,
  },
  promiseIcon: { fontSize: 32 },
  promiseTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 17,
    textTransform: 'uppercase',
    color: T.white,
    includeFontPadding: false,
  },

  // ── WhatMakesUsDifferent ──
  diffSection: { paddingVertical: 80 },
  diffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COL2_GAP,
    justifyContent: 'center',
  },
  diffCard: {
    width: CARD_HALF,
    backgroundColor: T.dark2,
    borderWidth: 1,
    borderColor: T.border,
    padding: 28,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    gap: 14,
  },
  diffIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffIconImg: { width: 44, height: 44 },
  diffTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 18,
    textTransform: 'uppercase',
    color: T.white,
    textAlign: 'center',
    includeFontPadding: false,
  },
  diffUnderline: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 3,
    transformOrigin: 'left',   // note: supported in RN 0.74+, else use left + width
  },

  // ── OurTeam ──
  teamSection: {
    backgroundColor: T.dark0,
    paddingVertical: 80,
  },
  teamTextSide: { marginBottom: 40 },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  miniStat: { alignItems: 'flex-start' },
  miniStatIcon: { fontSize: 24, marginBottom: 4 },
  miniStatLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.9,
    textTransform: 'uppercase',
    color: T.white,
    includeFontPadding: false,
  },
  miniStatSub: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: T.dim,
    marginTop: 2,
    includeFontPadding: false,
  },
  disclaimer: { fontSize: 10, marginTop: 12, color: T.dim },
  quoteCards: { gap: 16 },
  quoteCard: {
    backgroundColor: T.dark2,
    borderWidth: 1,
    borderColor: T.border,
    borderLeftWidth: 4,
    padding: 20,
    paddingLeft: 22,
  },
  quoteCardLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 10,
    includeFontPadding: false,
  },
  quoteCardText: {
    fontFamily: 'SpaceMono_400Regular_Italic',
    fontSize: 12,
    lineHeight: 20,
    color: T.hi,
    includeFontPadding: false,
  },

  // ── DisclaimerBanner ──
  disclaimerBanner: {
    backgroundColor: T.dark2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: T.border,
    paddingVertical: 18,
  },
  disclaimerInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 14,
  },
  disclaimerTag: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: T.red,
    includeFontPadding: false,
  },
  disclaimerBody: { flex: 1, fontSize: 11, lineHeight: 18 },

  // ── BrandsRow ──
  brandsSection: {
    backgroundColor: T.dark1,
    borderBottomWidth: 1,
    borderColor: T.border,
    paddingVertical: 56,
  },
  brandsLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: T.dim,
    textAlign: 'center',
    marginBottom: 28,
    includeFontPadding: false,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  brandPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  brandPillText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: T.dim,
    includeFontPadding: false,
  },

  // ── CtaBanner ──
  ctaSection: {
    backgroundColor: T.red,
    paddingVertical: 80,
    overflow: 'hidden',
    position: 'relative',
  },
  ctaGhost: {
    position: 'absolute',
    right: -10,
    top: '20%',
    fontFamily: 'Anton_400Regular',
    fontSize: 100,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.07)',
    includeFontPadding: false,
  },
  ctaInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 28,
    position: 'relative',
    zIndex: 1,
  },
  ctaText: { flex: 1, minWidth: 240 },
  ctaEyebrow: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 12,
    includeFontPadding: false,
  },
  ctaHeading: {
    fontSize: 38,
    lineHeight: 40,
    marginBottom: 14,
  },
  ctaBody: { color: 'rgba(255,255,255,0.8)', maxWidth: 440 },
  ctaActions: { gap: 14, alignItems: 'flex-start' },
  ctaBtnMain: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    backgroundColor: T.white,
  },
  ctaBtnMainText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: T.red,
    includeFontPadding: false,
  },
  ctaBtnGhost: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 2,
  },
  ctaBtnGhostText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
    includeFontPadding: false,
  },
});