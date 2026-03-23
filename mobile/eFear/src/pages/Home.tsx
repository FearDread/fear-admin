/**
 * Home2.jsx — React Native conversion
 *
 * Replaces:
 *   react-router-dom Link     → useNavigation().navigate()
 *   CSS / className           → StyleSheet (efear tokens)
 *   <div> / <section>         → <View>
 *   <p> / <h2> / <span>       → <Text>
 *   <img>                     → <Image>
 *   CSS marquee animation     → Animated loop
 *   Google Fonts import       → useFonts (expo-font)
 *   GoogleAdSense             → removed (no web-ad SDK in RN)
 *   clip-path: polygon()      → not supported — approximated with borders
 *
 * Install deps:
 *   npx expo install expo-font @expo-google-fonts/anton @expo-google-fonts/space-mono
 *   npx expo install @react-navigation/native
 */

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ─── Sub-components (convert separately) ────────────────────────────────────
import HeroSection from '../components/home/ComicHero';
import TrustBar from '../components/home/TrustBar';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryCards from '../components/home/CategoryCards';

// ─── Design tokens (from efear.css :root) ───────────────────────────────────
const T = {
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

const { width: SCREEN_W } = Dimensions.get('window');

// ─── MarqueeBand ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'Marvel','DC Comics','Dark Horse','Image Comics','IDW','Boom! Studios',
  'Pokémon','Vertigo','Valiant','Dynamite','BOOM!','Fantagraphics',
];

const MarqueeBand = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const trackWidth  = useRef(0);

  const startAnimation = (width) => {
    // Animate from 0 to -half (items are doubled so -50% loops seamlessly)
    translateX.setValue(0);
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -width / 2,
        duration: 28000,
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={s.marqueeWrap}>
      <Animated.View
        style={[s.marqueeTrack, { transform: [{ translateX }] }]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w !== trackWidth.current) {
            trackWidth.current = w;
            startAnimation(w);
          }
        }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((label, i) => (
          <View key={i} style={s.marqueeItem}>
            <Text style={s.marqueeText}>{label}</Text>
            <Text style={s.marqueeSep}> ✦ </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

// ─── WhyUs ───────────────────────────────────────────────────────────────────
const WHY_CARDS = [
  {
    icon: '🚚',
    title: 'Free Shipping',
    body: "We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway.",
  },
  {
    icon: '💰',
    title: '100% Money Back',
    body: "Regret your life choices? Us too. Send it back within 30 days. No judgment. We've seen worse.",
  },
  {
    icon: '🏷️',
    title: 'Mint Condition',
    body: 'All comics ship bagged and boarded in Near Mint condition. Those coffee stains? Those are our copies.',
  },
  {
    icon: '💬',
    title: '24/7 Support',
    body: "Can't sleep at 3 AM? Neither can we. Misery loves company. Vent freely.",
  },
];

const WhyUs = () => {
  const navigation = useNavigation();
  return (
    <View style={s.whySection}>
      <View style={s.container}>
        {/* Origin story */}
        <View style={s.whyStory}>
          <Text style={s.whyEyebrow}>Our Origin Story</Text>
          <Text style={s.whyTitle}>
            {'Tragically Less Interesting\nThan Batman\'s'}
          </Text>
          <Text style={s.whyBody}>
            We started this business because someone told us "following your dreams doesn't pay the bills."
            Joke's on them — we're still broke, but now we get to read comics while doing it.
          </Text>
          <Text style={s.whyBody}>
            Founded in a dimly lit basement that may or may not have violated several building codes, our shop
            emerged from a simple question:{' '}
            <Text style={s.whyBodyEm}>"What if we could lose money doing something we actually enjoy?"</Text>
            {' '}Turns out, we could. We really, really could.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('About')}
            style={({ pressed }) => [s.btnTextLink, pressed && { opacity: 0.6 }]}
          >
            <Text style={s.btnTextLinkText}>Read the full story →</Text>
          </Pressable>
        </View>

        {/* Feature grid */}
        <View style={s.whyFeatures}>
          {WHY_CARDS.map((card) => (
            <WhyCard key={card.title} {...card} />
          ))}
        </View>
      </View>
    </View>
  );
};

const WhyCard = ({ icon, title, body }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
      style={[s.whyCard, hovered && s.whyCardHover]}
    >
      <Text style={s.whyIcon}>{icon}</Text>
      <Text style={s.whyCardTitle}>{title}</Text>
      <Text style={s.whyCardBody}>{body}</Text>
    </Pressable>
  );
};

// ─── CtaBanner ───────────────────────────────────────────────────────────────
const CtaBanner = () => {
  const navigation = useNavigation();
  return (
    <View style={s.ctaBanner}>
      <View style={s.container}>
        <View style={s.ctaInner}>
          {/* Text block */}
          <View style={s.ctaText}>
            <Text style={s.ctaHeading}>
              {'Your Backissue Box\nIs Embarrassingly Empty.'}
            </Text>
            <Text style={s.ctaSub}>
              Let's fix that. Thousands of comics, e-books, and collectibles ready to ship today.
            </Text>
          </View>

          {/* Actions */}
          <View style={s.ctaActions}>
            <Pressable
              onPress={() => navigation.navigate('Shop')}
              style={({ pressed }) => [s.btnCtaMain, pressed && { opacity: 0.88 }]}
            >
              <Text style={s.btnCtaMainText}>Shop Everything</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('About')}
              style={({ pressed }) => [s.btnCtaGhost, pressed && { opacity: 0.7 }]}
            >
              <Text style={s.btnCtaGhostText}>Why buy from us?</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── OfferHighlights ─────────────────────────────────────────────────────────
const OFFERS = [
  { image: require('../assets/images/comics/super2.png'), category: 'E-Books',     note: 'Starting at $9',  screen: 'Shop', params: { cat: 'books' } },
  { image: require('../assets/images/comics/super1.png'), category: 'Comics',      note: 'Bagged & Boarded', screen: 'Shop', params: { cat: 'comics' } },
  { image: require('../assets/images/comics/super3.png'), category: 'Collectibles', note: 'Limited Stock',  screen: 'Shop', params: { cat: 'cards' } },
];

const OfferCard = ({ image, category, note, screen, params }) => {
  const navigation = useNavigation();
  const scale      = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.timing(scale, { toValue: 1.05, duration: 300, useNativeDriver: true }).start();
  const onPressOut = () => Animated.timing(scale, { toValue: 1,    duration: 300, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={() => navigation.navigate(screen, params)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={s.offerCard}
    >
      <Animated.Image
        source={image}
        style={[s.offerImg, { transform: [{ scale }] }]}
        resizeMode="cover"
      />
      {/* Gradient overlay simulated with a dark-to-transparent View */}
      <View style={s.offerOverlay} pointerEvents="none">
        <Text style={s.offerNote}>{note}</Text>
        <Text style={s.offerCat}>{category}</Text>
        <Text style={s.offerBtn}>Shop Now →</Text>
      </View>
    </Pressable>
  );
};

const OfferHighlights = () => (
  <View style={s.offersSection}>
    <View style={s.container}>
      <View style={s.offersGrid}>
        {OFFERS.map((o) => (
          <OfferCard key={o.category} {...o} />
        ))}
      </View>
    </View>
  </View>
);

// ─── Home2 (root screen) ─────────────────────────────────────────────────────
const Home2 = () => {

  // Splash / loading guard — swap for your app's splash logic

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.rootContent}
      showsVerticalScrollIndicator={false}
    >
      <HeroSection />
      <TrustBar />
      <CategoryCards />
      <MarqueeBand />
      <WhyUs />
      <FeaturedProducts />
      {/* GoogleAdSense removed — use react-native-google-mobile-ads instead */}
      <CtaBanner />
      <OfferHighlights />
    </ScrollView>
  );
};

export default Home2;

// ─── Styles ──────────────────────────────────────────────────────────────────
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