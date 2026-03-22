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
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';
import { SpaceMono_400Regular, SpaceMono_400Regular_Italic } from '@expo-google-fonts/space-mono';
import { useNavigation } from '@react-navigation/native';

import HeroSection from '../components/home/ComicHero';
import TrustBar from '../components/home/TrustBar';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryCards from '../components/home/CategoryCards';
import { T, homeStyles as s } from "../styles";

const { width: SCREEN_W } = Dimensions.get('window');

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
const Home = () => {
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    SpaceMono_400Regular,
    SpaceMono_400Regular_Italic,
  });

  // Splash / loading guard — swap for your app's splash logic
  if (!fontsLoaded) return null;

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

export default Home;
