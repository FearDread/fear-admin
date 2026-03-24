/**
 * ProductCard.jsx — React Native
 *
 * Web → RN mapping:
 *   useNavigate / Link          → useNavigation + Pressable
 *   localStorage (compare IDs)  → AsyncStorage (@react-native-async-storage)
 *   Toast component             → inline animated ToastItem (no extra dep)
 *   ProductQuickView modal      → passed through as-is (convert separately)
 *   Bootstrap .card / .badge    → StyleSheet with efear tokens
 *   renderStars bx icons        → ★ / ☆ Unicode chars (no icon font needed)
 *   spinner-border              → ActivityIndicator
 *   e.preventDefault/stopProp   → Pressable built-in isolation
 *   window.location.pathname    → useRoute().name
 *
 * Install:
 *   npx expo install @react-native-async-storage/async-storage
 *   npx expo install @expo-google-fonts/anton @expo-google-fonts/space-mono
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector }  from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { addItem }                           from '../../features/cart/slice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../features/wishlist/slice';
import { selectIsAuthenticated }             from '../../features/user/slice';
//import ProductQuickView                      from './ProductQuickView';  // convert separately

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  red:     '#b30e1c',
  orange:  '#f4a261',
  teal:    '#2a9d8f',
  dark0:   '#0d0d0d',
  dark1:   '#111111',
  dark2:   '#141414',
  dark3:   '#1a1a1a',
  border:  '#222222',
  dim:     'rgba(255,255,255,0.32)',
  mid:     'rgba(255,255,255,0.58)',
  hi:      'rgba(255,255,255,0.92)',
  white:   '#ffffff',
};

const COMPARE_KEY  = '@efear:compareIds';
const MAX_COMPARE  = 4;
const FALLBACK_IMG = require('../../../assets/images/fear/fear-dark-bg.jpg');

// ─── Toast item ───────────────────────────────────────────────────────────────
const TOAST_COLORS = {
  success: T.teal,
  error:   T.red,
  warning: T.orange,
};

const ToastItem = ({ message, type = 'success', onDone }) => {
  const opac = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opac, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(opac, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  return (
    <Animated.View style={[s.toast, { borderLeftColor: TOAST_COLORS[type], opacity: opac }]}>
      <Text style={s.toastText}>{message}</Text>
    </Animated.View>
  );
};

// ─── ProductCard ──────────────────────────────────────────────────────────────
export const ProductCard = (product) => {
  const navigation = useNavigation();
  const route      = useRoute();
  const dispatch   = useDispatch();

  const [isAddingToCart,     setIsAddingToCart]     = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showQuickView,      setShowQuickView]      = useState(false);
  const [quantity]                                  = useState(1);
  const [toasts,             setToasts]             = useState([]);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const productId       = product._id || product.id;

  const productImage =
    product.images?.length > 0
      ? { uri: product.images[0]?.url }
      : product.image
        ? { uri: product.image }
        : FALLBACK_IMG;

  const hasDiscount      = product.salePrice && product.salePrice < product.price;
  const currentPrice     = product.salePrice || product.price;
  const discountPercent  = hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  const isInWishlist = useSelector((state) => selectIsInWishlist(productId)(state));

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // ── Stars renderer ─────────────────────────────────────────────────────────
  const renderStars = (rating = 4) =>
    Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={[s.star, i < rating && s.starFilled]}>★</Text>
    ));

  // ── Compare (AsyncStorage replaces localStorage) ───────────────────────────
  const getCompareIds = async () => {
    try {
      const raw = await AsyncStorage.getItem(COMPARE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const saveCompareIds = async (ids) => {
    await AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
    return ids;
  };

  const handleCompare = useCallback(async () => {
    const existing = await getCompareIds();
    if (existing.includes(productId)) {
      navigation.navigate('ProductComparison', { products: existing.join(',') });
      return;
    }
    if (existing.length >= MAX_COMPARE) {
      addToast(`Compare up to ${MAX_COMPARE} products. Remove one first.`, 'warning');
      return;
    }
    const updated = await saveCompareIds([...existing, productId]);
    navigation.navigate('ProductComparison', { products: updated.join(',') });
  }, [productId, navigation, addToast]);

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const handleWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login', {
        from: route.name,
        message: 'Please login to add items to your wishlist',
      });
      return;
    }

    setIsAddingToWishlist(true);
    const wishlistItem = {
      id: productId, productId,
      title: product.title,
      subtotal: currentPrice,
      price: currentPrice,
      image: product.images?.[0]?.url || product.image,
      category: product.category,
      inStock: product.quantity,
      sku: productId,
    };

    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(productId));
      } else {
        dispatch(addToWishlist(wishlistItem));
      }
      addToast(
        isInWishlist ? 'Removed from Wishlist!' : 'Added to Wishlist!',
        'success'
      );
    } catch (err) {
      addToast('Failed to update wishlist: ' + err.message, 'error');
    } finally {
      setIsAddingToWishlist(false);
    }
  }, [isAuthenticated, isInWishlist, productId, product, currentPrice, dispatch, navigation, route, addToast]);

  // ── Add to cart ────────────────────────────────────────────────────────────
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const cartItem = {
      productId,
      title:    product.title,
      image:    product.images?.[0]?.url || '',
      price:    product.salePrice || product.price,
      subtotal: product.price,
      quantity,
      sku:      productId,
    };
    setIsAddingToCart(true);
    try {
      dispatch(addItem(cartItem));
      addToast('Added to cart!', 'success');
    } catch (err) {
      addToast('Failed to add to cart: ' + err.message, 'error');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, productId, quantity, dispatch, addToast]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={s.card}>

      {/* ── Image area ── */}
      <View style={s.imageWrap}>
        <Pressable onPress={() => navigation.navigate('ProductDetails', { id: productId })}>
          <Image source={productImage} style={s.image} resizeMode="cover" />
        </Pressable>

        {/* Discount badge */}
        {hasDiscount && (
          <View style={s.discountBadge}>
            <Text style={s.discountBadgeText}>-{discountPercent}%</Text>
          </View>
        )}

        {/* Out-of-stock badge */}
        {!product.quantity && (
          <View style={s.outOfStockBadge}>
            <Text style={s.outOfStockBadgeText}>Out of Stock</Text>
          </View>
        )}

        {/* Action icons row */}
        <View style={s.iconRow}>
          {/* Compare */}
          <Pressable onPress={handleCompare} style={({ pressed }) => [s.iconBtn, pressed && s.iconBtnPressed]}>
            <Text style={s.iconBtnText}>⇄</Text>
            <Text style={s.iconBtnLabel}>Compare</Text>
          </Pressable>

          {/* Wishlist */}
          <Pressable
            onPress={handleWishlist}
            disabled={isAddingToWishlist}
            style={({ pressed }) => [s.iconBtn, pressed && s.iconBtnPressed]}
          >
            {isAddingToWishlist
              ? <ActivityIndicator size="small" color={T.red} />
              : <Text style={[s.iconBtnText, isInWishlist && { color: T.red }]}>
                  {isInWishlist ? '♥' : '♡'}
                </Text>
            }
          </Pressable>
        </View>
      </View>

      {/* ── Info area ── */}
      <View style={s.info}>

        {/* Category */}
        <Pressable onPress={() => navigation.navigate('Shop', { category: product.categoryId || '' })}>
          <Text style={s.category}>{product.category || 'General'}</Text>
        </Pressable>

        {/* Title */}
        <Pressable onPress={() => navigation.navigate('ProductDetails', { id: productId })}>
          <Text style={s.title} numberOfLines={2}>{product.title}</Text>
        </Pressable>

        {/* Price + stars */}
        <View style={s.priceRow}>
          <View>
            {hasDiscount && (
              <Text style={s.priceOriginal}>${product.price?.toFixed(2)}</Text>
            )}
            <Text style={s.priceCurrent}>${currentPrice?.toFixed(2)}</Text>
          </View>
          <View style={s.starsRow}>
            {renderStars(product.rating || 4)}
          </View>
        </View>

        {/* Stock status */}
        {product.quantity > 0 && (
          <Text style={[s.stockText, { color: product.quantity < 10 ? T.orange : T.teal }]}>
            {product.quantity < 10 ? `Only ${product.quantity} left!` : 'In Stock'}
          </Text>
        )}

        {/* Actions */}
        <View style={s.actions}>
          <Pressable
            onPress={handleAddToCart}
            disabled={isAddingToCart || !product.quantity}
            style={({ pressed }) => [
              s.btnCart,
              (!product.quantity || isAddingToCart) && s.btnCartDisabled,
              pressed && { opacity: 0.8 },
            ]}
          >
            {isAddingToCart
              ? <><ActivityIndicator size="small" color={T.dark0} /><Text style={s.btnCartText}> Adding...</Text></>
              : <Text style={s.btnCartText}>{product.quantity ? '+ Add to Cart' : 'Out of Stock'}</Text>
            }
          </Pressable>

          <Pressable
            onPress={() => setShowQuickView(true)}
            style={({ pressed }) => [s.btnQuick, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.btnQuickText}>⊕ Quick View</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Quick View Modal ── */}
      {showQuickView && (
        {/* <ProductQuickView product={product} onClose={() => setShowQuickView(false)} /> */}
      )}

      {/* ── Toast stack ── */}
      <View style={s.toastStack} pointerEvents="none">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            message={t.message}
            type={t.type}
            onDone={() => removeToast(t.id)}
          />
        ))}
      </View>
    </View>
  );
};

export default ProductCard;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Card shell
  card: {
    backgroundColor: T.dark2,
    borderWidth:      1,
    borderColor:      T.border,
    overflow:        'hidden',
  },

  // Image
  imageWrap: {
    position:        'relative',
    aspectRatio:      3 / 4,
    backgroundColor: T.dark0,
  },
  image: {
    width:  '100%',
    height: '100%',
  },

  // Badges on image
  discountBadge: {
    position:        'absolute',
    top:              10,
    left:             10,
    backgroundColor: T.red,
    paddingVertical:  3,
    paddingHorizontal: 8,
  },
  discountBadgeText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:              T.white,
    includeFontPadding: false,
  },
  outOfStockBadge: {
    position:        'absolute',
    top:              10,
    right:            10,
    backgroundColor: T.dark0,
    paddingVertical:  3,
    paddingHorizontal: 8,
    borderWidth:       1,
    borderColor:       T.border,
  },
  outOfStockBadgeText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:              T.mid,
    includeFontPadding: false,
  },

  // Icon action row (compare + wishlist)
  iconRow: {
    position:       'absolute',
    top:             10,
    right:           10,
    flexDirection:  'column',
    gap:             6,
    alignItems:     'flex-end',
  },
  iconBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:              4,
    backgroundColor: 'rgba(13,13,13,0.8)',
    paddingVertical:  4,
    paddingHorizontal: 8,
    borderWidth:      1,
    borderColor:      T.border,
  },
  iconBtnPressed: { opacity: 0.7 },
  iconBtnText: {
    fontSize:          14,
    color:             T.mid,
    includeFontPadding: false,
  },
  iconBtnLabel: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.dim,
    includeFontPadding: false,
  },

  // Info block
  info: {
    padding:  14,
    gap:       6,
  },
  category: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      2.4,
    textTransform:     'uppercase',
    color:             T.red,
    includeFontPadding: false,
  },
  title: {
    fontFamily:        'Anton_400Regular',
    fontSize:           16,
    textTransform:     'uppercase',
    color:             T.hi,
    lineHeight:         18,
    includeFontPadding: false,
  },
  priceRow: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-between',
    marginTop:       4,
  },
  priceOriginal: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    color:             'rgba(255,255,255,0.3)',
    textDecorationLine: 'line-through',
    includeFontPadding: false,
  },
  priceCurrent: {
    fontFamily:        'Anton_400Regular',
    fontSize:           20,
    color:             T.white,
    includeFontPadding: false,
  },
  starsRow: {
    flexDirection: 'row',
    gap:            1,
  },
  star: {
    fontSize:          13,
    color:             T.border,
    includeFontPadding: false,
  },
  starFilled: {
    color: T.orange,
  },
  stockText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.3,
    includeFontPadding: false,
  },

  // Add-to-cart button
  actions: {
    gap:       8,
    marginTop: 6,
  },
  btnCart: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: T.white,
    paddingVertical:  11,
  },
  btnCartDisabled: {
    backgroundColor: T.dark3,
  },
  btnCartText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.dark0,
    includeFontPadding: false,
  },

  // Quick-view button
  btnQuick: {
    alignItems:      'center',
    paddingVertical:  8,
    borderWidth:      1,
    borderColor:      T.border,
  },
  btnQuickText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1.6,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },

  // Toast
  toastStack: {
    position: 'absolute',
    bottom:    12,
    left:      12,
    right:     12,
    gap:        6,
  },
  toast: {
    backgroundColor: T.dark1,
    borderLeftWidth: 3,
    borderWidth:     1,
    borderColor:     T.border,
    paddingVertical:  8,
    paddingHorizontal: 12,
  },
  toastText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    color:             T.hi,
    includeFontPadding: false,
  },
});