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
import {
  SpaceMono_400Regular,
  SpaceMono_400Regular_Italic,
} from '@expo-google-fonts/space-mono';
import { useNavigation } from '@react-navigation/native';
import { T, aboutStyles as s } from "../styles";

const { width: SW } = Dimensions.get('window');
const GUTTER    = 24;
const COL2_GAP  = 14;
const CARD_HALF = (SW - GUTTER * 2 - COL2_GAP) / 2;
const CARD_3RD  = (SW - GUTTER * 2 - COL2_GAP * 2) / 3;

/** Anton display heading */
const HDisplay = ({ style, children }) => (
  <Text style={[s.textDisplay, style]}>{children}</Text>
);

/** Space Mono eyebrow label */
const Eyebrow = ({ style, children }) => (
  <Text style={[s.eyebrow, style]}>{children}</Text>
);

/** Space Mono body paragraph */
const Body = ({ style, children }) => (
  <Text style={[s.bodyText, style]}>{children}</Text>
);

/** Pressable navigation link button (primary white-on-red) */
const BtnPrimary = ({ label, screen, params, style }) => {
  const nav = useNavigation();
  return (
    <Pressable
      onPress={() => nav.navigate(screen, params)}
      style={({ pressed }) => [s.btnPrimary, pressed && { opacity: 0.85 }, style]}
    >
      <Text style={s.btnPrimaryText}>{label}</Text>
    </Pressable>
  );
};

/** Underline ghost link */
const BtnGhost = ({ label, screen, params, style }) => {
  const nav = useNavigation();
  return (
    <Pressable
      onPress={() => nav.navigate(screen, params)}
      style={({ pressed }) => [s.btnGhost, pressed && { opacity: 0.6 }, style]}
    >
      <Text style={s.btnGhostText}>{label}</Text>
    </Pressable>
  );
};

// ─── MarqueeBand ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'Marvel','DC Comics','Dark Horse','Image Comics','IDW',
  'Boom! Studios','Pokémon','Vertigo','Valiant','Dynamite','Fantagraphics',
];

const MarqueeBand = () => {
  const translateX  = useRef(new Animated.Value(0)).current;
  const trackWidth  = useRef(0);

  const startAnim = (w) => {
    translateX.setValue(0);
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -w / 2,
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
          if (w !== trackWidth.current) { trackWidth.current = w; startAnim(w); }
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

// ─── PageHero ────────────────────────────────────────────────────────────────
const PageHero = () => {
  const nav = useNavigation();
  return (
    <View style={s.heroSection}>
      {/* Left red accent bar */}
      <View style={s.heroAccentBar} />

      {/* Ghost decorative word — opacity trick only works at large size */}
      <Text style={s.heroGhostWord}>ABOUT US</Text>

      <View style={s.container}>
        {/* Breadcrumb */}
        <View style={s.breadcrumb}>
          <Pressable onPress={() => nav.navigate('Home')}>
            <Text style={s.breadcrumbLink}>Home</Text>
          </Pressable>
          <Text style={s.breadcrumbSep}>✦</Text>
          <Text style={s.breadcrumbCurrent}>About Us</Text>
        </View>

        <Eyebrow style={s.mb12}>Est. in a code-violating basement</Eyebrow>

        {/*
          WebkitTextStroke (outline text) is not natively supported in RN.
          Options:
            A) react-native-svg <SvgText> with stroke + fill
            B) @shopify/react-native-skia <Text> with paint
          For now: white heading + red "Us." sub-word as colour accent.
        */}
        <HDisplay style={s.heroTitle}>
          {'ABOUT\n'}
          <Text style={s.heroTitleRed}>US.</Text>
        </HDisplay>

        <Body style={s.heroBody}>
          We sell comics, e-books, and collectibles because someone told us it was a terrible idea.
          Spoiler: they were right. We did it anyway.
        </Body>

        <View style={s.heroButtons}>
          <BtnPrimary label="Shop Now" screen="Shop" />
          {/* "Our Story ↓" scrolls down on web; in RN pass a ref or use a Tab  */}
          <BtnGhost label="Our Story ↓" screen="About" />
        </View>
      </View>
    </View>
  );
};

// ─── OriginStory ─────────────────────────────────────────────────────────────
const OriginStory = () => {
  const nav = useNavigation();
  return (
    <View style={s.originSection}>
      <View style={s.container}>

        {/* Image card */}
        <View style={s.originImgWrap}>
          <Image
            source={require('../assets/images/about/01.png')}
            style={s.originImg}
            resizeMode="cover"
          />
          {/*
            Gradient overlay: replace this View with:
            import { LinearGradient } from 'expo-linear-gradient';
            <LinearGradient colors={['transparent','rgba(230,57,70,0.85)']}
              style={s.originImgOverlay} start={{x:0,y:0}} end={{x:0,y:1}} />
          */}
          <View style={s.originImgOverlay}>
            <Text style={s.originImgCaption}>
              Tragically Less Interesting Than Batman's
            </Text>
          </View>

          {/* Floating badge (replaces clip-path version) */}
          <View style={s.originBadge}>
            <Text style={s.originBadgeValue}>1000+</Text>
            <Text style={s.originBadgeLabel}>Titles In Stock</Text>
          </View>
        </View>

        {/* Text side */}
        <View style={s.originTextSide}>
          <Eyebrow style={s.mb12}>Chapter One</Eyebrow>
          <HDisplay style={s.sectionTitle}>
            {'Welcome to\nthe Void\n'}
            <Text style={{ color: T.red }}>{'(With Better\nGraphics)'}</Text>
          </HDisplay>

          <Body>
            We started this business because someone once told us{' '}
            <Text style={s.em}>"following your dreams doesn't pay the bills."</Text>
            {' '}Well, joke's on them — we're still broke, but now we get to read comics while doing it.
          </Body>
          <Body style={s.mt14}>
            Founded in a dimly lit basement that may or may not have violated several building codes,
            our shop emerged from a simple question:{' '}
            <Text style={s.em}>"What if we could lose money doing something we actually enjoy?"</Text>
            {' '}Turns out, we could. We really, really could.
          </Body>
          <Body style={s.mt14}>
            After years of hoarding graphic novels and e-books like a literary dragon with questionable
            taste, we realized our collection had become large enough to either start a business or seek
            professional help. We chose the path with fewer feelings.
          </Body>

          {/* Pull quote */}
          <View style={s.pullQuote}>
            <Text style={s.pullQuoteText}>
              "We sell comics and e-books. Revolutionary, we know.{'\n'}
              Someone should write a comic about it.{'\n'}
              (Please don't.)"
            </Text>
          </View>

          <BtnPrimary label="Start Shopping" screen="Shop" style={s.mt20} />
        </View>
      </View>
    </View>
  );
};

// ─── StatsRow ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: '1000+', label: 'Comics In Stock',    note: 'And counting' },
  { value: 'NM',    label: 'Quality Standard',   note: 'Near Mint only' },
  { value: '24/7',  label: 'Support Available',  note: "We also can't sleep" },
  { value: '30',    label: 'Day Return Window',   note: 'No questions asked' },
];

const StatsRow = () => (
  <View style={s.statsSection}>
    <View style={s.statsGrid}>
      {STATS.map((stat, i) => (
        <View
          key={stat.label}
          style={[s.statCell, i < STATS.length - 1 && s.statCellBorder]}
        >
          <Text style={s.statValue}>{stat.value}</Text>
          <Text style={s.statLabel}>{stat.label}</Text>
          <Text style={s.statNote}>{stat.note}</Text>
        </View>
      ))}
    </View>
  </View>
);

// ─── WhatWeOffer ─────────────────────────────────────────────────────────────
const OFFERS = [
  {
    accent: T.red,
    icon: '📦',
    title: 'Comics',
    sub: 'Marvel · DC · Dark Horse · Indie · Manga',
    body: "Our carefully curated selection ranges from mainstream superhero fare to independent titles so obscure even their creators have forgotten about them. We've got everything from capes and tights to existential dread in panel form.",
    detail: 'Every issue bagged, boarded, near-mint.',
    screen: 'Shop', params: { cat: 'comics' },
  },
  {
    accent: T.orange,
    icon: '📚',
    title: 'E-Books',
    sub: 'Cookbooks · Manifestos · Biographies',
    body: "Words that hit harder than a Mjolnir swing. Our e-book selection spans cookbooks you'll bookmark but never use, manifestos that will change your worldview, and graphic novels for when you want pictures with your existential crises.",
    detail: 'Also available on Amazon.',
    screen: 'Shop', params: { cat: 'books' },
  },
  {
    accent: T.teal,
    icon: '🃏',
    title: 'Collectibles',
    sub: 'Pokémon · NFL · NBA · Baseball · Graded',
    body: "Rare cards, graded slabs, pack pulls that will either make your day or haunt your dreams. We carry NFL, NBA, Pokémon, and Baseball. Some of these will appreciate in value. Most will not. We believe in honest uncertainty.",
    detail: 'Limited stock. Move fast.',
    screen: 'Shop', params: { cat: 'cards' },
  },
];

const OfferTile = ({ accent, icon, title, sub, body, detail, screen, params }) => {
  const nav = useNavigation();
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => nav.navigate(screen, params)}
      style={[s.offerTile, pressed && { borderColor: accent }]}
    >
      {/* Left accent bar (replaces ::before pseudo-element) */}
      <View style={[s.offerTileBar, { backgroundColor: accent }]} />

      <View style={s.offerTileTop}>
        <Text style={s.offerTileIcon}>{icon}</Text>
        <Text style={[s.offerTileEyebrow, { color: accent }]}>{sub}</Text>
        <Text style={s.offerTileTitle}>{title}</Text>
      </View>

      <Text style={s.offerTileBody}>{body}</Text>

      <View style={s.offerTileFooter}>
        <Text style={s.offerTileDetail}>{detail}</Text>
        <Text style={[s.offerTileLink, { color: accent }]}>Shop {title} →</Text>
      </View>
    </Pressable>
  );
};

const WhatWeOffer = () => (
  <View style={s.offerSection}>
    <View style={s.container}>
      {/* Header */}
      <View style={s.centerHeader}>
        <Eyebrow>What We Do</Eyebrow>
        <HDisplay style={s.sectionTitle}>
          {'Here\'s What\n'}
          <Text style={{ color: T.red }}>We Offer</Text>
        </HDisplay>
        <Body style={s.centerHeaderSub}>
          Three categories. Zero pretension. One extremely questionable business plan.
        </Body>
      </View>

      {/* Tiles */}
      {OFFERS.map((o) => <OfferTile key={o.title} {...o} />)}
    </View>
  </View>
);

// ─── OurPromise ───────────────────────────────────────────────────────────────
const PROMISES = [
  {
    icon: '🚀', title: 'Fast Shipping',
    body: "Your comics will arrive before the heat death of the universe. Probably. We ship within 24 hours and use carriers that haven't lost a package since last Tuesday.",
  },
  {
    icon: '🧤', title: 'Mint Condition',
    body: 'No coffee stains. Those are our copies. Every item ships bagged, boarded, and inspected. Near Mint or we don\'t ship it.',
  },
  {
    icon: '🔐', title: 'Secure Payment',
    body: "Your credit card info is safer with us than your browser history. Military-grade encryption — because your impulse purchases deserve witness protection.",
  },
  {
    icon: '💬', title: 'Honest Support',
    body: "We respond faster than DC responds to fan criticism. We'll tell you if something is terrible. Then sell it to you anyway, because capitalism.",
  },
];

const PromiseCard = ({ icon, title, body }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[s.promiseCard, pressed && { borderColor: T.red }]}
    >
      <Text style={s.promiseIcon}>{icon}</Text>
      <Text style={s.promiseTitle}>{title}</Text>
      <Body>{body}</Body>
    </Pressable>
  );
};

const OurPromise = () => (
  <View style={s.promiseSection}>
    <View style={s.container}>
      {/* Left header block */}
      <View style={s.promiseHeader}>
        <Eyebrow style={s.mb12}>No Fine Print</Eyebrow>
        <HDisplay style={s.sectionTitle}>
          {'Our\n'}
          <Text style={{ color: T.red }}>Promise</Text>
          {'\nTo You.'}
        </HDisplay>
        <Body style={s.mt14}>
          Listen — you're already here reading this. The hard part is over. At this point you're pot-committed.
          Plus, we need to make rent.
        </Body>
        <Body style={s.mt14}>
          Our landlord has made it very clear that{' '}
          <Text style={s.em}>"exposure"</Text> is not legal tender.
        </Body>
      </View>

      {/* 2×2 promise grid */}
      <View style={s.promiseGrid}>
        {PROMISES.map((p) => <PromiseCard key={p.title} {...p} />)}
      </View>
    </View>
  </View>
);

// ─── WhatMakesUsDifferent ────────────────────────────────────────────────────
const DIFFS = [
  {
    img: require('../assets/images/icons/delivery.png'),
    accent: T.red,
    title: 'Free Shipping',
    body: "We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway.",
  },
  {
    img: require('../assets/images/icons/money-bag.png'),
    accent: T.orange,
    title: '100% Money Back',
    body: "Regret your life choices? Us too. Send it back within 30 days, no judgment. We've seen worse decisions, trust us.",
  },
  {
    img: require('../assets/images/icons/support.png'),
    accent: T.teal,
    title: '24/7 Online Support',
    body: "Can't sleep at 3 AM? Neither can our support team — misery loves company. We're here for your questions and your 3 AM spirals.",
  },
];

const DiffCard = ({ img, accent, title, body }) => {
  const [pressed, setPressed] = useState(false);
  const barScale = useRef(new Animated.Value(0)).current;

  const onIn = () => {
    setPressed(true);
    Animated.timing(barScale, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };
  const onOut = () => {
    setPressed(false);
    Animated.timing(barScale, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={onIn}
      onPressOut={onOut}
      style={[s.diffCard, pressed && { borderColor: 'transparent' }]}
    >
      {/* Circle icon */}
      <View style={[s.diffIconCircle, {
        backgroundColor: accent + '18',
        borderColor: accent + '40',
      }]}>
        <Image source={img} style={s.diffIconImg} resizeMode="contain" />
      </View>

      <Text style={s.diffTitle}>{title}</Text>
      <Body style={{ textAlign: 'center' }}>{body}</Body>

      {/* Bottom accent bar (replaces transform: scaleX CSS transition) */}
      <Animated.View style={[
        s.diffUnderline,
        { backgroundColor: accent, transform: [{ scaleX: barScale }] },
      ]} />
    </Pressable>
  );
};

const WhatMakesUsDifferent = () => (
  <View style={s.diffSection}>
    <View style={s.container}>
      <View style={s.centerHeader}>
        <Eyebrow>The Differentiators</Eyebrow>
        <HDisplay style={s.sectionTitle}>
          {'What Makes\n'}
          <Text style={{ color: T.red }}>Us Different</Text>
        </HDisplay>
      </View>
      <View style={s.diffGrid}>
        {DIFFS.map((d) => <DiffCard key={d.title} {...d} />)}
      </View>
    </View>
  </View>
);

// ─── OurTeam ─────────────────────────────────────────────────────────────────
const MINI_STATS = [
  { icon: '☕', label: 'Fuel Source',   sub: 'Dark roast, no milk' },
  { icon: '📦', label: 'Daily Orders',  sub: 'Packed with love*' },
  { icon: '📖', label: 'Comics Read',   sub: 'Too many to count' },
];

const QUOTES = [
  {
    accent: T.red,
    label: 'On Product Selection',
    quote: "If a book is terrible, we'll tell you. Then sell it to you anyway because capitalism.",
  },
  {
    accent: T.orange,
    label: 'On Shipping Speed',
    quote: "Your comics will arrive before the heat death of the universe. That's a promise and also our SLA.",
  },
  {
    accent: T.teal,
    label: 'On Customer Service',
    quote: "We respond to emails faster than DC responds to fan criticism. That bar is low, but we're proud.",
  },
];

const OurTeam = () => (
  <View style={s.teamSection}>
    <View style={s.container}>
      {/* Text block */}
      <View style={s.teamTextSide}>
        <Eyebrow style={s.mb12}>The Humans Behind This</Eyebrow>
        <HDisplay style={s.sectionTitle}>
          {'Our\n'}
          <Text style={{ color: T.red }}>Team</Text>
        </HDisplay>

        <Body style={s.mt14}>
          We're a small operation, which is a fancy way of saying we can't afford to hire anyone else.
          But what we lack in manpower, we make up for in caffeine addiction and the sinking feeling
          that we should have gotten real jobs.
        </Body>
        <Body style={s.mt14}>
          Every order is packed by a real human who has read at least some of what they're shipping to you.
          We have opinions. Strong ones. About the Knightfall arc, about which Spider-Man run is definitive,
          and about whether the New 52 was a good idea.
        </Body>
        <Body style={[s.mt14, s.em]}>
          (It wasn't. Don't @ us.)
        </Body>

        {/* Mini stats strip */}
        <View style={s.miniStatsRow}>
          {MINI_STATS.map((ms) => (
            <View key={ms.label} style={s.miniStat}>
              <Text style={s.miniStatIcon}>{ms.icon}</Text>
              <Text style={s.miniStatLabel}>{ms.label}</Text>
              <Text style={s.miniStatSub}>{ms.sub}</Text>
            </View>
          ))}
        </View>
        <Body style={s.disclaimer}>*Love not legally guaranteed. Please see returns policy.</Body>
      </View>

      {/* Quote cards */}
      <View style={s.quoteCards}>
        {QUOTES.map((q) => (
          <View key={q.label} style={[s.quoteCard, { borderLeftColor: q.accent }]}>
            <Text style={[s.quoteCardLabel, { color: q.accent }]}>{q.label}</Text>
            <Text style={s.quoteCardText}>"{q.quote}"</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

// ─── DisclaimerBanner ────────────────────────────────────────────────────────
const DisclaimerBanner = () => (
  <View style={s.disclaimerBanner}>
    <View style={[s.container, s.disclaimerInner]}>
      <Text style={s.disclaimerTag}>⚠ Disclaimer</Text>
      <Body style={s.disclaimerBody}>
        No comic book characters were harmed in the making of this website. Our dignity, however,
        didn't make it. Contact us about existential crises: we're available for approximately
        60% of those things.
      </Body>
    </View>
  </View>
);

// ─── BrandsRow ───────────────────────────────────────────────────────────────
const BRANDS = ['Marvel','DC','Dark Horse','Image','IDW','Boom!','Valiant','Dynamite'];

const BrandPill = ({ label }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[s.brandPill, pressed && { borderColor: T.red }]}
    >
      <Text style={[s.brandPillText, pressed && { color: T.white }]}>{label}</Text>
    </Pressable>
  );
};

const BrandsRow = () => (
  <View style={s.brandsSection}>
    <View style={s.container}>
      <Text style={s.brandsLabel}>Publishers &amp; Brands We Carry</Text>
      <View style={s.brandsGrid}>
        {BRANDS.map((b) => <BrandPill key={b} label={b} />)}
      </View>
    </View>
  </View>
);

// ─── CtaBanner ───────────────────────────────────────────────────────────────
const CtaBanner = () => {
  const nav = useNavigation();
  return (
    <View style={s.ctaSection}>
      {/* Ghost decorative word */}
      <Text style={s.ctaGhost}>SHOP NOW</Text>

      <View style={[s.container, s.ctaInner]}>
        {/* Text */}
        <View style={s.ctaText}>
          <Text style={s.ctaEyebrow}>You've read this far.</Text>
          <HDisplay style={s.ctaHeading}>
            {'Your Backissue Box\nIs Embarrassingly Empty.'}
          </HDisplay>
          <Body style={s.ctaBody}>
            Let's fix that. Thousands of comics, e-books, and collectibles.
            All bagged, boarded, and ready to ruin your budget.
          </Body>
        </View>

        {/* Actions */}
        <View style={s.ctaActions}>
          <Pressable
            onPress={() => nav.navigate('Shop')}
            style={({ pressed }) => [s.ctaBtnMain, pressed && { opacity: 0.88 }]}
          >
            <Text style={s.ctaBtnMainText}>Shop Everything</Text>
          </Pressable>
          <Pressable
            onPress={() => nav.navigate('Contact')}
            style={({ pressed }) => [s.ctaBtnGhost, pressed && { opacity: 0.6 }]}
          >
            <Text style={s.ctaBtnGhostText}>Contact Us Instead</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// ─── Root screen ─────────────────────────────────────────────────────────────
const AboutUs = () => {
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    SpaceMono_400Regular,
    SpaceMono_400Regular_Italic,
  });

  if (!fontsLoaded) return null; // replace with your splash / skeleton

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.rootContent}
      showsVerticalScrollIndicator={false}
    >
      <PageHero />
      <MarqueeBand />
      <OriginStory />
      <StatsRow />
      {/* AdSense removed — use react-native-google-mobile-ads BannerAd here */}
      <WhatWeOffer />
      <OurPromise />
      <WhatMakesUsDifferent />
      <OurTeam />
      <DisclaimerBanner />
      <BrandsRow />
      <CtaBanner />
    </ScrollView>
  );
};

export default AboutUs;