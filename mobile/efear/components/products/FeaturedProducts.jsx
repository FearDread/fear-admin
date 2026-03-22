/**
 * FeaturedProducts.jsx — React Native
 *
 * Web → RN mapping:
 *   scrollRef.scrollTo()         → ScrollView ref.scrollTo()
 *   onMouseDown/Move/Up          → PanResponder (unified with touch)
 *   onTouchStart/Move/End        → PanResponder
 *   setInterval auto-scroll      → same pattern, clearInterval on unmount
 *   container.offsetWidth        → Dimensions.get('window').width
 *   container.scrollWidth        → measured via onContentSizeChange
 *   scrollBehavior: 'smooth'     → ScrollView scrollTo with animated:true
 *   Bootstrap py-4 / btn-light   → StyleSheet with efear tokens
 *   Link to="/shop"              → useNavigation().navigate('Shop')
 *   cursor: 'grab/grabbing'      → no cursor concept in RN
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation }        from '@react-navigation/native';
import { useSelector }          from 'react-redux';
import ProductCard              from './ProductCard';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  red:    '#b30e1c',
  dark0:  '#0d0d0d',
  dark1:  '#111111',
  dark2:  '#141414',
  border: '#222222',
  mid:    'rgba(255,255,255,0.58)',
  hi:     'rgba(255,255,255,0.92)',
  white:  '#ffffff',
};

const SW           = Dimensions.get('window').width;
const AUTO_DELAY   = 3000;
const ITEM_W       = Math.min(SW * 0.72, 260);   // card width in horizontal scroll
const ITEM_GAP     = 10;

export const FeaturedProducts = ({ data }) => {
  const navigation = useNavigation();

  const prodState        = useSelector((state) => state.products.data);
  const productData      = useMemo(() => data || prodState, [data, prodState]);
  const featuredProducts = useMemo(() => productData?.slice(13, 19) || [], [productData]);

  const scrollRef        = useRef(null);
  const autoScrollRef    = useRef(null);
  const scrollXRef       = useRef(0);        // current scroll offset
  const contentWidthRef  = useRef(0);        // total scrollable content width
  const isDragging       = useRef(false);
  const dragStartX       = useRef(0);
  const dragScrollLeft   = useRef(0);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  const scroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    const containerW  = SW - 48;                         // minus horizontal padding
    const scrollAmount = containerW * 0.8;
    const maxScroll   = contentWidthRef.current - containerW;

    let next;
    if (direction === 'left') {
      next = Math.max(0, scrollXRef.current - scrollAmount);
    } else {
      next = scrollXRef.current + scrollAmount;
      if (next >= maxScroll) next = 0;                   // loop
    }

    scrollRef.current.scrollTo({ x: next, animated: true });
    scrollXRef.current = next;
  }, []);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => scroll('right'), AUTO_DELAY);
  }, [scroll]);

  useEffect(() => {
    resetAutoScroll();
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [resetAutoScroll]);

  // ── PanResponder (replaces mouse + touch drag handlers) ──────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        isDragging.current    = true;
        dragStartX.current    = e.nativeEvent.pageX;
        dragScrollLeft.current = scrollXRef.current;
        // pause auto-scroll while dragging
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      },
      onPanResponderMove: (e) => {
        if (!isDragging.current || !scrollRef.current) return;
        const dx   = e.nativeEvent.pageX - dragStartX.current;
        const newX = Math.max(0, dragScrollLeft.current - dx * 1.5);
        scrollRef.current.scrollTo({ x: newX, animated: false });
        scrollXRef.current = newX;
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
        resetAutoScroll();                               // resume auto-scroll
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        resetAutoScroll();
      },
    })
  ).current;

  return (
    <View style={s.section}>
      <View style={s.container}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.heading}>Featured Products</Text>
          <Pressable
            onPress={() => navigation.navigate('Shop')}
            style={({ pressed }) => [s.moreBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.moreBtnText}>More Products →</Text>
          </Pressable>
        </View>

        <View style={s.divider} />

        {/* ── Carousel ── */}
        <View style={s.carouselWrap}>
          {/* Prev button */}
          <Pressable
            style={({ pressed }) => [s.navBtn, s.navBtnPrev, pressed && s.navBtnPressed]}
            onPress={() => { scroll('left'); resetAutoScroll(); }}
            accessibilityLabel="Previous products"
          >
            <Text style={s.navBtnText}>‹</Text>
          </Pressable>

          {/* Scroll container */}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}          // PanResponder handles drag directly
            onContentSizeChange={(w) => { contentWidthRef.current = w; }}
            onScroll={(e) => { scrollXRef.current = e.nativeEvent.contentOffset.x; }}
            scrollEventThrottle={16}
            style={s.scrollView}
            contentContainerStyle={s.scrollContent}
            {...panResponder.panHandlers}
          >
            {featuredProducts.map((product) => (
              <View key={product._id} style={s.itemWrap}>
                <ProductCard {...product} product={product} />
              </View>
            ))}
          </ScrollView>

          {/* Next button */}
          <Pressable
            style={({ pressed }) => [s.navBtn, s.navBtnNext, pressed && s.navBtnPressed]}
            onPress={() => { scroll('right'); resetAutoScroll(); }}
            accessibilityLabel="Next products"
          >
            <Text style={s.navBtnText}>›</Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
};

export default FeaturedProducts;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  section: {
    paddingVertical: 28,
  },
  container: {
    paddingHorizontal: 24,
  },

  // Header
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:    12,
  },
  heading: {
    fontFamily:        'Anton_400Regular',
    fontSize:           18,
    textTransform:     'uppercase',
    color:             T.hi,
    includeFontPadding: false,
  },
  moreBtn: {
    paddingVertical:   6,
    paddingHorizontal: 14,
    borderWidth:        1,
    borderColor:       T.border,
  },
  moreBtnText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
  divider: {
    height:          1,
    backgroundColor: T.border,
    marginBottom:    16,
  },

  // Carousel
  carouselWrap: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    gap:            ITEM_GAP,
    paddingHorizontal: 4,
  },
  itemWrap: {
    width:     ITEM_W,
    flexShrink: 0,
  },

  // Nav buttons
  navBtn: {
    width:           32,
    height:          44,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: T.dark2,
    borderWidth:      1,
    borderColor:     T.border,
    zIndex:           10,
  },
  navBtnPrev: { marginRight: 4 },
  navBtnNext: { marginLeft:  4 },
  navBtnPressed: { borderColor: T.red },
  navBtnText: {
    fontSize:          22,
    color:             T.mid,
    includeFontPadding: false,
  },
});