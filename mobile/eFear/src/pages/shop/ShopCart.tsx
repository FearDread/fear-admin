import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  TextInput, Image, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartItemCount, selectCartSubtotal,
  selectCartTotal, selectCartShipping, selectCartDiscount,
  removeItem, updateQuantity, clearCart, applyDiscount, setShipping,
} from '../../features/cart/slice';
import { selectIsAuthenticated } from '../../features/user/slice';
import type { AppDispatch } from '../../features/store';
import { Colors, Fonts } from '../../constants/theme';

// ── Inline message banner ───────────────────────────────────────────────────
function Msg({ msg }: { msg: { type: 'success'|'error'; text: string } }) {
  const teal = msg.type === 'success';
  return (
    <View style={[m.bar, { borderColor: teal ? Colors.tealBorder : Colors.redBorder, backgroundColor: teal ? Colors.tealFaded : Colors.redFaded }]}>
      <Text style={{ color: teal ? Colors.teal : Colors.red, marginRight: 6, fontSize: 12 }}>
        {teal ? '✓' : '⚠'}
      </Text>
      <Text style={[m.text, { color: teal ? Colors.teal : Colors.red }]}>{msg.text}</Text>
    </View>
  );
}
const m = StyleSheet.create({
  bar:  { flexDirection: 'row', alignItems: 'flex-start', padding: 10, borderWidth: 1, marginBottom: 12 },
  text: { fontFamily: Fonts.mono, fontSize: 11, flex: 1, lineHeight: 16 },
});

// ── Qty stepper ─────────────────────────────────────────────────────────────
function QtyStepper({ value, onDec, onInc, onSet }: { value: number; onDec: () => void; onInc: () => void; onSet: (v: number) => void }) {
  return (
    <View style={q.row}>
      <Pressable style={[q.btn, value <= 1 && q.btnDis]} onPress={onDec} disabled={value <= 1}>
        <Text style={q.btnText}>−</Text>
      </Pressable>
      <TextInput
        style={q.input}
        value={String(value)}
        onChangeText={v => { const n = parseInt(v); if (n >= 1) onSet(n); }}
        keyboardType="numeric"
        maxLength={3}
        selectTextOnFocus
      />
      <Pressable style={q.btn} onPress={onInc}>
        <Text style={q.btnText}>+</Text>
      </Pressable>
    </View>
  );
}
const q = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  btn:    { width: 28, height: 28, backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  btnDis: { opacity: 0.3 },
  btnText:{ fontFamily: Fonts.mono, fontSize: 16, color: Colors.textMid, lineHeight: 20 },
  input:  { width: 38, height: 28, textAlign: 'center', backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border, color: Colors.textHi, fontFamily: Fonts.mono, fontSize: 13 },
});

// ══════════════════════════════════════════════════════════════════════════
export const ShopCart = () => {
  const router   = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const cartItems  = useSelector(selectCartItems);
  const itemCount  = useSelector(selectCartItemCount);
  const subtotal   = useSelector(selectCartSubtotal);
  const total      = useSelector(selectCartTotal);
  const shipping   = useSelector(selectCartShipping);
  const discount   = useSelector(selectCartDiscount);
  const isAuth     = useSelector(selectIsAuthenticated);

  const [discountCode,      setDiscountCode]      = useState('');
  const [country,           setCountry]           = useState('United States');
  const [zipCode,           setZipCode]           = useState('');
  const [applyingDiscount,  setApplyingDiscount]  = useState(false);
  const [discountMsg,       setDiscountMsg]       = useState<{type:'success'|'error';text:string}|null>(null);
  const [shippingMsg,       setShippingMsg]       = useState<{type:'success'|'error';text:string}|null>(null);

  const taxes = subtotal * 0.07;
  const grand = total + taxes;

  function handleQty(productId: string, qty: number) {
    if (qty >= 1) dispatch(updateQuantity({ productId, quantity: qty }));
  }

  function handleRemove(productId: string) {
    Alert.alert('Remove item', 'Remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeItem(productId)) },
    ]);
  }

  function handleClearCart() {
    Alert.alert('Clear cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart()) },
    ]);
  }

  function handleApplyDiscount() {
    if (!discountCode.trim()) { setDiscountMsg({ type: 'error', text: 'Please enter a discount code.' }); return; }
    setApplyingDiscount(true);
    setTimeout(() => {
      const codes: Record<string, number> = { SAVE10: 10, SAVE20: 20, WELCOME15: 15 };
      const pct = codes[discountCode.toUpperCase()];
      if (pct) {
        const amt = (subtotal * pct) / 100;
        dispatch(applyDiscount(amt));
        setDiscountMsg({ type: 'success', text: `Code applied — saved $${amt.toFixed(2)}!` });
      } else {
        setDiscountMsg({ type: 'error', text: 'Invalid discount code.' });
      }
      setApplyingDiscount(false);
    }, 500);
  }

  function handleEstimateShipping() {
    if (!zipCode.trim()) { setShippingMsg({ type: 'error', text: 'Please enter a zip code.' }); return; }
    const cost = country === 'United States' ? 10 : 25;
    dispatch(setShipping(cost));
    setShippingMsg({ type: 'success', text: `Estimated shipping: $${cost.toFixed(2)}` });
  }

  function handleCheckout() {
    if (!isAuth) { router.push('/(auth)/login'); return; }
    router.push('/(protected)/checkout');
  }

  // ── Empty cart ─────────────────────────────────────────────────────────
  if (!cartItems.length) {
    return (
      <View style={s.page}>
        <View style={s.crumb}>
          <Text style={s.crumbLink} onPress={() => router.push('/(public)')}>Home</Text>
          <Text style={s.crumbSep}> › </Text>
          <Text style={s.crumbLink} onPress={() => router.push('/(public)/shop')}>Shop</Text>
          <Text style={s.crumbSep}> › </Text>
          <Text style={s.crumbCurrent}>Cart</Text>
        </View>
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🛒</Text>
          <Text style={s.emptyTitle}>YOUR CART IS EMPTY</Text>
          <Text style={s.emptyBody}>Add some gear to get started.</Text>
          <Pressable style={s.emptyBtn} onPress={() => router.push('/(public)/shop')}>
            <Text style={s.emptyBtnText}>START SHOPPING →</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Cart with items ────────────────────────────────────────────────────
  return (
    <ScrollView style={s.page} contentContainerStyle={{ paddingBottom: 48 }}>
      {/* ── Breadcrumb  →  .co-crumb-bar */}
      <View style={s.crumb}>
        <Text style={s.crumbLink} onPress={() => router.push('/(public)')}>Home</Text>
        <Text style={s.crumbSep}> › </Text>
        <Text style={s.crumbLink} onPress={() => router.push('/(public)/shop')}>Shop</Text>
        <Text style={s.crumbSep}> › </Text>
        <Text style={s.crumbCurrent}>Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</Text>
        <Pressable style={s.clearCartBtn} onPress={handleClearCart}>
          <Text style={s.clearCartText}>✕ CLEAR</Text>
        </Pressable>
      </View>

      {/* ── Cart items panel  →  .shop-sidebar */}
      <View style={s.panel}>
        {/* Column headers */}
        <View style={s.colHeaders}>
          {['Product', 'Qty', 'Price', ''].map((h, i) => (
            <Text key={i} style={[s.colHeader, i === 1 && { width: 90 }, i === 2 && { width: 80 }, i === 3 && { width: 36 }]}>
              {h}
            </Text>
          ))}
        </View>

        {/* Items */}
        {cartItems.map((item: any, idx: number) => (
          <View key={item.productId} style={[s.cartRow, idx > 0 && s.cartRowBorder]}>
            {/* Product info */}
            <View style={s.productCell}>
              <View style={s.imgBox}>
                {item.image
                  ? <Image source={{ uri: item.image }} style={s.img} resizeMode="cover" />
                  : <Text style={s.imgPlaceholder}>📦</Text>
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.itemTitle} numberOfLines={2}>{item.title ?? item.name}</Text>
                {item.size  && <Text style={s.itemMeta}>SIZE: {item.size}</Text>}
                {item.color && <Text style={s.itemMeta}>COLOR: {item.color}</Text>}
                <Pressable onPress={() => router.push('/(public)/wishlist')}>
                  <Text style={s.saveLink}>♡  SAVE FOR LATER</Text>
                </Pressable>
              </View>
            </View>

            {/* Qty stepper */}
            <QtyStepper
              value={item.quantity}
              onDec={() => handleQty(item.productId, item.quantity - 1)}
              onInc={() => handleQty(item.productId, item.quantity + 1)}
              onSet={v  => handleQty(item.productId, v)}
            />

            {/* Line price  →  .co-review-price */}
            <Text style={s.linePrice}>${(item.price * item.quantity).toFixed(2)}</Text>

            {/* Remove */}
            <Pressable style={s.removeBtn} onPress={() => handleRemove(item.productId)}>
              <Text style={s.removeBtnText}>✕</Text>
            </Pressable>
          </View>
        ))}

        {/* Continue shopping */}
        <View style={s.continueShopping}>
          <Pressable style={s.continueBtn} onPress={() => router.push('/(public)/shop')}>
            <Text style={s.continueBtnText}>← CONTINUE SHOPPING</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Discount code  →  .sidebar-section */}
      <View style={s.sidePanel}>
        <Text style={s.sidePanelTitle}>DISCOUNT CODE</Text>
        {discountMsg && <Msg msg={discountMsg} />}
        <View style={s.discountRow}>
          <TextInput
            style={[s.codeInput, { flex: 1 }]}
            placeholder="Enter code"
            placeholderTextColor={Colors.textDim}
            value={discountCode}
            onChangeText={setDiscountCode}
            autoCapitalize="characters"
          />
          <Pressable style={[s.applyBtn, applyingDiscount && { opacity: 0.6 }]} onPress={handleApplyDiscount} disabled={applyingDiscount}>
            {applyingDiscount
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={s.applyBtnText}>APPLY</Text>
            }
          </Pressable>
        </View>
      </View>

      {/* ── Shipping estimator */}
      <View style={s.sidePanel}>
        <Text style={s.sidePanelTitle}>ESTIMATE SHIPPING</Text>
        {shippingMsg && <Msg msg={shippingMsg} />}

        {/* Country picker (simple row) */}
        {['United States', 'Australia', 'Canada', 'India'].map(c => (
          <Pressable key={c} style={s.radioRow} onPress={() => setCountry(c)}>
            <View style={[s.radio, country === c && s.radioActive]}>
              {country === c && <View style={s.radioDot} />}
            </View>
            <Text style={s.radioLabel}>{c}</Text>
          </Pressable>
        ))}

        <View style={{ marginTop: 10 }}>
          <Text style={s.inputLabel}>ZIP / POSTAL CODE</Text>
          <TextInput
            style={s.codeInput}
            placeholder="e.g. 90210"
            placeholderTextColor={Colors.textDim}
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
          />
        </View>
        <Pressable style={[s.ghostBtn, { marginTop: 10 }]} onPress={handleEstimateShipping}>
          <Text style={s.ghostBtnText}>ESTIMATE SHIPPING</Text>
        </Pressable>
      </View>

      {/* ── Order summary  →  .co-sidebar-panel.accent-top */}
      <View style={[s.sidePanel, s.summaryPanel]}>
        <Text style={s.sidePanelTitle}>ORDER SUMMARY</Text>

        {[
          { label: 'Subtotal',    val: `$${subtotal.toFixed(2)}`,  accent: false },
          { label: 'Shipping',    val: shipping > 0 ? `$${shipping.toFixed(2)}` : '—', accent: false },
          { label: 'Taxes (7%)', val: `$${taxes.toFixed(2)}`,    accent: false },
          { label: 'Discount',   val: discount > 0 ? `-$${discount.toFixed(2)}` : '—', accent: discount > 0 },
        ].map(({ label, val, accent }) => (
          <View key={label} style={s.totalRow}>
            <Text style={s.totalLabel}>{label}</Text>
            <Text style={[s.totalVal, accent && s.totalValTeal]}>{val}</Text>
          </View>
        ))}

        <View style={s.grandDivider} />
        <View style={s.grandRow}>
          <Text style={s.grandLabel}>ORDER TOTAL</Text>
          <Text style={s.grandVal}>${grand.toFixed(2)}</Text>
        </View>

        {/* Checkout button  →  .auth-submit */}
        <Pressable style={s.checkoutBtn} onPress={handleCheckout}>
          <Text style={s.checkoutBtnText}>
            {isAuth ? 'PROCEED TO CHECKOUT →' : 'LOGIN TO CHECKOUT →'}
          </Text>
        </Pressable>

        {!isAuth && (
          <Text style={s.loginNote}>Login required to complete checkout</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ShopCart;

// ── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.dark0 },

  // .co-crumb-bar
  crumb: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    padding: 14,
    backgroundColor: Colors.dark1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  crumbLink:    { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },
  crumbSep:     { color: Colors.red },
  crumbCurrent: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.red },
  clearCartBtn: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  clearCartText:{ fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },

  // ── Empty
  empty:      { alignItems: 'center', padding: 56 },
  emptyIcon:  { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontFamily: Fonts.display, fontSize: 22, textTransform: 'uppercase', color: Colors.textHi, marginBottom: 8 },
  emptyBody:  { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textDim, marginBottom: 24 },
  emptyBtn:   { backgroundColor: Colors.red, paddingHorizontal: 28, paddingVertical: 14 },
  emptyBtnText:{ fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },

  // ── Cart panel  →  .shop-sidebar
  panel: {
    margin: 12,
    backgroundColor: Colors.dark1,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Column headers
  colHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.dark0,
    gap: 8,
  },
  colHeader: { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: Colors.textDim, flex: 1 },

  // Cart row
  cartRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  cartRowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },

  // Product cell
  productCell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  imgBox:      { width: 70, height: 70, backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  img:         { width: '100%', height: '100%' },
  imgPlaceholder: { fontSize: 28 },

  // Item text
  itemTitle: { fontFamily: Fonts.display, fontSize: 13, textTransform: 'uppercase', color: Colors.textHi, marginBottom: 4, letterSpacing: 0.3, lineHeight: 16 },
  itemMeta:  { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim, letterSpacing: 0.5, marginBottom: 1 },
  saveLink:  { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: Colors.textDim, marginTop: 6, borderBottomWidth: 1, borderBottomColor: Colors.border, alignSelf: 'flex-start' },

  // Price  →  .co-review-price
  linePrice: { fontFamily: Fonts.display, fontSize: 16, color: Colors.red, width: 76, textAlign: 'right', letterSpacing: 0.3 },

  // Remove
  removeBtn:     { width: 34, height: 34, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: Colors.textDim, fontSize: 13 },

  // Continue shopping
  continueShopping: { padding: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  continueBtn:      { alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 9 },
  continueBtnText:  { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },

  // ── Side panels  →  .shop-sidebar / .sidebar-section
  sidePanel: {
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.dark1,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  summaryPanel: { borderTopWidth: 2, borderTopColor: Colors.red },
  sidePanelTitle: { fontFamily: Fonts.display, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: Colors.textHi, marginBottom: 12 },

  // Discount row
  discountRow: { flexDirection: 'row', gap: 8 },
  codeInput:   { backgroundColor: Colors.dark2, borderWidth: 1, borderColor: Colors.border, color: Colors.textHi, paddingHorizontal: 12, paddingVertical: 10, fontFamily: Fonts.mono, fontSize: 12 },
  applyBtn:    { backgroundColor: Colors.red, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  applyBtnText:{ fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },

  // Shipping radio
  radioRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  radio:      { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.dark3, alignItems: 'center', justifyContent: 'center' },
  radioActive:{ borderColor: Colors.red },
  radioDot:   { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.red },
  radioLabel: { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textMid },

  inputLabel: { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: Colors.red, marginBottom: 6 },
  ghostBtn:   { borderWidth: 1, borderColor: Colors.border, padding: 10, alignItems: 'center' },
  ghostBtnText: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.textDim },

  // Totals
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.dark3 },
  totalLabel:   { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },
  totalVal:     { fontFamily: Fonts.mono, fontSize: 13, color: Colors.textHi },
  totalValTeal: { color: Colors.teal },
  grandDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  grandRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  grandLabel:   { fontFamily: Fonts.display, fontSize: 14, textTransform: 'uppercase', color: Colors.textHi, letterSpacing: 1 },
  grandVal:     { fontFamily: Fonts.display, fontSize: 24, color: Colors.red, letterSpacing: 0.5 },

  // Checkout  →  .auth-submit
  checkoutBtn:     { backgroundColor: Colors.red, padding: 15, alignItems: 'center' },
  checkoutBtnText: { fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },
  loginNote:       { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim, textAlign: 'center', marginTop: 10 },
});