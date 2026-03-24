import { useState } from 'react';
import {
  View, Text, Image, Pressable, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addItem } from '../../features/cart/slice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/user/slice';
import type { AppDispatch, RootState } from '../../features/store';
import { Colors, Fonts } from '../../constants/theme';

const MAX_COMPARE = 4;
const COMPARE_KEY = 'comparisonProductIds';

// ── Inline toast (replaces web Toast component) ────────────────────────────
function ToastBar({ message, type }: { message: string; type: 'success' | 'error' | 'warning' }) {
  const bg = type === 'success' ? Colors.tealFaded  :
             type === 'error'   ? Colors.redFaded    : 'rgba(244,162,97,0.1)';
  const border = type === 'success' ? Colors.tealBorder :
                 type === 'error'   ? Colors.redBorder   : 'rgba(244,162,97,0.35)';
  const color  = type === 'success' ? Colors.teal  :
                 type === 'error'   ? Colors.red    : Colors.orange;
  return (
    <View style={[t.bar, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[t.text, { color }]}>{type === 'success' ? '✓' : '⚠'}  {message}</Text>
    </View>
  );
}
const t = StyleSheet.create({
  bar:  { padding: 10, borderWidth: 1, marginTop: 6, marginHorizontal: 16 },
  text: { fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 0.5 },
});

// ── Star rating ────────────────────────────────────────────────────────────
function Stars({ rating = 4 }: { rating?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ color: i <= rating ? '#f4c430' : Colors.border, fontSize: 11 }}>★</Text>
      ))}
    </View>
  );
}

// ── Prop type ──────────────────────────────────────────────────────────────
interface Product {
  _id?: string;
  id?: string;
  title?: string;
  images?: { url: string }[];
  image?: string;
  price?: number;
  salePrice?: number;
  rating?: number;
  quantity?: number;
  category?: string;
  categoryId?: string;
  brand?: string;
  viewMode?: 'grid' | 'list';
  [key: string]: any;
}

// ══════════════════════════════════════════════════════════════════════════
export const ProductCard = (product: Product) => {
  const router   = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuth   = useSelector(selectIsAuthenticated);

  const [addingCart,     setAddingCart]     = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const productId    = product._id || product.id || '';
  const productImage = product.images?.[0]?.url ?? product.image ?? undefined;
  const hasDiscount  = !!product.salePrice && product.salePrice < (product.price ?? 0);
  const currentPrice = product.salePrice ?? product.price ?? 0;
  const discountPct  = hasDiscount
    ? Math.round((1 - product.salePrice! / product.price!) * 100) : 0;
  const inStock      = (product.quantity ?? 0) > 0;
  const lowStock     = inStock && (product.quantity ?? 0) < 10;
  const isGrid       = product.viewMode !== 'list';

  const isInWishlist = useSelector((state: RootState) =>
    selectIsInWishlist(state, productId));

  function showToast(message: string, type: 'success'|'error'|'warning' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  // ── Add to cart ──────────────────────────────────────────────────────────
  function handleAddToCart() {
    if (!inStock) return;
    setAddingCart(true);
    dispatch(addItem({
      productId,
      title: product.title ?? '',
      image: product.images?.[0]?.url ?? '',
      price: currentPrice,
      subtotal: currentPrice,
      quantity: 1,
      sku: productId,
    }));
    setTimeout(() => {
      setAddingCart(false);
      showToast('Added to cart!', 'success');
    }, 300);
  }

  // ── Wishlist ─────────────────────────────────────────────────────────────
  function handleWishlist() {
    if (!isAuth) {
      router.push('/(auth)/login');
      return;
    }
    setAddingWishlist(true);
    const item = {
      id: productId, productId,
      title: product.title ?? '',
      subtotal: currentPrice,
      price: currentPrice,
      image: productImage ?? '',
      category: product.category ?? '',
      inStock: product.quantity ?? 0,
      sku: productId,
    };
    if (isInWishlist) { dispatch(removeFromWishlist(productId)); }
    else               { dispatch(addToWishlist(item)); }
    setTimeout(() => {
      setAddingWishlist(false);
      showToast(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 'success');
    }, 300);
  }

  // ── Compare ──────────────────────────────────────────────────────────────
  async function handleCompare() {
    const raw = await AsyncStorage.getItem(COMPARE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (ids.includes(productId)) {
      router.push(`/(public)/product/comparison?products=${ids.join(',')}` as any);
      return;
    }
    if (ids.length >= MAX_COMPARE) {
      showToast(`Max ${MAX_COMPARE} products for comparison.`, 'warning');
      return;
    }
    const updated = [...ids, productId];
    await AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
    router.push(`/(public)/product/comparison?products=${updated.join(',')}` as any);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={[s.card, !isGrid && s.cardList]}>
      {/* ── Image area ── */}
      <Pressable
        onPress={() => router.push(`/(public)/product/${productId}` as any)}
        style={[s.imgWrap, !isGrid && s.imgWrapList]}
      >
        <Image
          source={productImage ? { uri: productImage } : require('../../../assets/images/placeholder.png')}
          style={s.img}
          resizeMode="cover"
        />
        {/* Discount badge  →  .badge bg-danger */}
        {hasDiscount && (
          <View style={s.discountBadge}>
            <Text style={s.discountText}>-{discountPct}%</Text>
          </View>
        )}
        {/* Out of stock badge */}
        {!inStock && (
          <View style={s.oosOverlay}>
            <Text style={s.oosText}>OUT OF STOCK</Text>
          </View>
        )}
        {/* Glow bar at top (eFear accent) */}
        <View style={s.glowBar} />
      </Pressable>

      {/* ── Action icons (wishlist / compare) ── */}
      <View style={s.iconRow}>
        <Pressable style={s.iconBtn} onPress={handleCompare} accessibilityLabel="Compare">
          {addingCart
            ? <ActivityIndicator size="small" color={Colors.textDim} />
            : <Text style={s.iconText}>⇄</Text>
          }
          <Text style={s.iconLabel}>Compare</Text>
        </Pressable>
        <Pressable
          style={[s.iconBtn, isInWishlist && s.iconBtnActive]}
          onPress={handleWishlist}
          disabled={addingWishlist}
          accessibilityLabel={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {addingWishlist
            ? <ActivityIndicator size="small" color={Colors.red} />
            : <Text style={[s.iconText, isInWishlist && { color: Colors.red }]}>
                {isInWishlist ? '♥' : '♡'}
              </Text>
          }
        </Pressable>
      </View>

      {/* ── Body ── */}
      <View style={s.body}>
        {/* Category link */}
        <Pressable onPress={() => router.push(`/(public)/shop?category=${product.categoryId ?? ''}` as any)}>
          <Text style={s.category}>{product.category ?? 'General'}</Text>
        </Pressable>

        {/* Title */}
        <Pressable onPress={() => router.push(`/(public)/product/${productId}` as any)}>
          <Text style={s.title} numberOfLines={2}>{product.title}</Text>
        </Pressable>

        {/* Price + Stars row */}
        <View style={s.priceRow}>
          <View>
            {hasDiscount && (
              <Text style={s.priceStrike}>${product.price?.toFixed(2)}</Text>
            )}
            <Text style={s.price}>${currentPrice.toFixed(2)}</Text>
          </View>
          <Stars rating={product.rating ?? 4} />
        </View>

        {/* Stock status */}
        {inStock && (
          <Text style={[s.stock, lowStock && s.stockLow]}>
            {lowStock ? `Only ${product.quantity} left!` : 'In Stock'}
          </Text>
        )}
      </View>

      {/* ── Add to cart ── */}
      <Pressable
        style={[s.cartBtn, (!inStock || addingCart) && s.cartBtnDisabled]}
        onPress={handleAddToCart}
        disabled={!inStock || addingCart}
      >
        {addingCart
          ? <ActivityIndicator color={Colors.white} size="small" />
          : <Text style={s.cartBtnText}>
              {inStock ? '+ ADD TO CART' : 'OUT OF STOCK'}
            </Text>
        }
      </Pressable>

      {/* Toast */}
      {toast && <ToastBar message={toast.message} type={toast.type} />}
    </View>
  );
};

export default ProductCard;

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // .product-card / .bs-col
  card: {
    backgroundColor: Colors.dark1,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 0,
  },
  cardList: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Image
  imgWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.dark3,
    position: 'relative',
    overflow: 'hidden',
  },
  imgWrapList: { width: 100, aspectRatio: 1 },
  img: { width: '100%', height: '100%' },

  // Glow bar top  →  .bs-col-glow-bar
  glowBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, backgroundColor: Colors.red,
  },

  // Discount badge
  discountBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: Colors.red,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  discountText: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.white, letterSpacing: 0.5 },

  // Out of stock overlay
  oosOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oosText: { fontFamily: Fonts.display, fontSize: 14, color: Colors.textHi, letterSpacing: 2, textTransform: 'uppercase' },

  // Icon action row  →  .hdr-icon-btn
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.dark0,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.dark2,
  },
  iconBtnActive: { borderColor: Colors.red, backgroundColor: Colors.redFaded },
  iconText:  { fontSize: 14, color: Colors.textMid },
  iconLabel: { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: Colors.textDim },

  // Body
  body: { padding: 12, flex: 1 },

  // Category  →  .fp-eyebrow
  category: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.red,
    marginBottom: 4,
  },

  // Title  →  .bs-col-title
  title: {
    fontFamily: Fonts.display,
    fontSize: 15,
    textTransform: 'uppercase',
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  // Price row
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 },
  priceStrike: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim, textDecorationLine: 'line-through' },
  price: { fontFamily: Fonts.display, fontSize: 18, color: Colors.white, letterSpacing: 0.3 },

  // Stock
  stock:    { fontFamily: Fonts.mono, fontSize: 10, color: Colors.teal, letterSpacing: 0.5 },
  stockLow: { color: Colors.orange },

  // Add to cart button  →  .auth-submit
  cartBtn: {
    backgroundColor: Colors.red,
    padding: 12,
    alignItems: 'center',
    margin: 0,
    borderRadius: 0,
  },
  cartBtnDisabled: { opacity: 0.5 },
  cartBtnText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.white,
  },
});