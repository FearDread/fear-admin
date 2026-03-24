import { useRef, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet,
  Dimensions, Animated, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../features/store';
import ProductCard from './ProductCard';
import { Colors, Fonts } from '../../constants/theme';

const SCREEN_W  = Dimensions.get('window').width;
const CARD_W    = Math.min(SCREEN_W * 0.72, 270);
const AUTO_MS   = 3000;

interface Props { data?: any[] }

// ══════════════════════════════════════════════════════════════════════════
export const FeaturedProducts = ({ data }: Props) => {
  const router     = useRouter();
  const flatRef    = useRef<FlatList>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval>>();
  const progressAnim = useRef(new Animated.Value(0)).current;

  const prodState  = useSelector((s: RootState) => s.products?.data);
  const products   = useMemo(() => data ?? prodState, [data, prodState]);
  const featured   = useMemo(() => products?.slice(13, 19) ?? [], [products]);

  const [activeIdx, setActiveIdx] = useState(0);
  const total = featured.length;

  // ── Progress bar animation  →  .fp-progress-bar
  function runProgress() {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: AUTO_MS,
      useNativeDriver: false,
    }).start();
  }

  // ── Auto-scroll  →  setInterval
  function startTimer() {
    clearInterval(timerRef.current);
    runProgress();
    timerRef.current = setInterval(() => {
      setActiveIdx(i => {
        const next = i >= total - 1 ? 0 : i + 1;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_MS);
  }

  useEffect(() => {
    if (total > 0) startTimer();
    return () => clearInterval(timerRef.current);
  }, [total]);

  useEffect(() => { runProgress(); }, [activeIdx]);

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActiveIdx(idx);
    startTimer();
  }

  function scrollTo(idx: number) {
    flatRef.current?.scrollToIndex({ index: idx, animated: true });
    setActiveIdx(idx);
    startTimer();
  }

  if (!featured.length) return null;

  return (
    <View style={s.section}>
      {/* Halftone overlay  →  .fp-halftone */}
      <View style={s.halftone} pointerEvents="none" />

      <View style={s.inner}>
        {/* ── Header  →  .fp-header */}
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>— HAND-PICKED</Text>
            <Text style={s.title}>
              FEATURED <Text style={s.titleAccent}>GEAR</Text>
            </Text>
          </View>

          {/* Counter  →  .fp-counter */}
          <View style={s.headerRight}>
            <Text style={s.counter}>
              <Text style={s.counterCur}>{String(activeIdx + 1).padStart(2, '0')}</Text>
              <Text style={s.counterSep}> / </Text>
              <Text style={s.counterTot}>{String(total).padStart(2, '0')}</Text>
            </Text>
            <Pressable style={s.viewAllBtn} onPress={() => router.push('/(public)/shop')}>
              <Text style={s.viewAllText}>VIEW ALL →</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Stage  →  .fp-stage-wrap */}
        <View style={s.stageWrap}>
          {/* Glow pool  →  .fp-glow-pool */}
          <View style={s.glowPool} pointerEvents="none" />

          {/* Prev nav  →  .fp-nav.fp-nav--prev */}
          {activeIdx > 0 && (
            <Pressable style={[s.nav, s.navPrev]} onPress={() => scrollTo(activeIdx - 1)}>
              <Text style={s.navText}>‹</Text>
            </Pressable>
          )}

          <FlatList
            ref={flatRef}
            data={featured}
            keyExtractor={i => i._id ?? i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_W + 12}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 48, gap: 12 }}
            onMomentumScrollEnd={handleScrollEnd}
            renderItem={({ item, index }) => (
              <View style={[
                s.cardWrap,
                index === activeIdx && s.cardWrapActive,
              ]}>
                {/* Featured badge  →  .fp-active-badge */}
                {index === activeIdx && (
                  <View style={s.activeBadge}>
                    <Text style={s.activeBadgeText}>★ FEATURED</Text>
                  </View>
                )}
                <ProductCard {...item} />
              </View>
            )}
          />

          {/* Next nav  →  .fp-nav.fp-nav--next */}
          {activeIdx < total - 1 && (
            <Pressable style={[s.nav, s.navNext]} onPress={() => scrollTo(activeIdx + 1)}>
              <Text style={s.navText}>›</Text>
            </Pressable>
          )}
        </View>

        {/* ── Footer  →  .fp-footer */}
        <View style={s.footer}>
          {/* Dot strip  →  .fp-dots */}
          <View style={s.dots}>
            {featured.map((_, i) => (
              <Pressable key={i} onPress={() => scrollTo(i)}>
                <View style={[s.dot, i === activeIdx && s.dotActive]} />
              </Pressable>
            ))}
          </View>

          {/* Progress bar  →  .fp-progress-track / .fp-progress-bar */}
          <View style={s.progressTrack}>
            <Animated.View
              style={[
                s.progressBar,
                { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeaturedProducts;

// ── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // .fp-section
  section: {
    backgroundColor: Colors.dark0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingTop: 40,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },

  // .fp-halftone
  halftone: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    backgroundColor: Colors.white,
  },

  inner: { position: 'relative', zIndex: 1 },

  // .fp-header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  eyebrow: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.red, marginBottom: 6 },
  title:   { fontFamily: Fonts.display, fontSize: 28, textTransform: 'uppercase', color: Colors.white, lineHeight: 30 },
  titleAccent: { color: Colors.red },

  // .fp-header-right
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  // .fp-counter
  counter:    { fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 1 },
  counterCur: { color: Colors.white, fontSize: 16, fontFamily: Fonts.mono },
  counterSep: { color: 'rgba(255,255,255,0.25)' },
  counterTot: { color: Colors.textDim },

  // .fp-view-all
  viewAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  viewAllText: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textMid },

  // .fp-stage-wrap
  stageWrap: { position: 'relative' },

  // .fp-glow-pool
  glowPool: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: 300,
    height: 80,
    backgroundColor: Colors.red,
    opacity: 0.18,
    borderRadius: 150,
    transform: [{ scaleY: 0.4 }],
    zIndex: 0,
  },

  // .fp-card-wrap
  cardWrap: { width: CARD_W, opacity: 0.65, transform: [{ scale: 0.94 }] },
  cardWrapActive: { opacity: 1, transform: [{ scale: 1 }] },

  // .fp-active-badge
  activeBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: Colors.red,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 10,
  },
  activeBadgeText: { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },

  // .fp-nav
  nav: {
    position: 'absolute',
    top: '40%',
    zIndex: 20,
    width: 44,
    height: 44,
    backgroundColor: Colors.dark2,
    borderWidth: 1,
    borderColor: Colors.borderHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navPrev: { left: 0 },
  navNext: { right: 0 },
  navText: { color: Colors.textMid, fontSize: 22 },

  // .fp-footer
  footer: { alignItems: 'center', gap: 12, marginTop: 20, paddingHorizontal: 20 },

  // .fp-dots
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  dotActive: { width: 22, borderRadius: 3, backgroundColor: Colors.red, height: 6 },

  // .fp-progress-track / .fp-progress-bar
  progressTrack: { width: 200, height: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  progressBar:   { height: '100%', backgroundColor: Colors.red, borderRadius: 2 },
});