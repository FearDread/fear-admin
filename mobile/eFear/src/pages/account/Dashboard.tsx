import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../features/store';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Fonts } from '../../constants/theme';

type Tile = { icon: string; accent: string; label: string; sub: string; onPress: () => void };

export default function Dashboard() {
  const nav  = useNavigation();
  const { user, signOut } = useAuth();
  const orderCount = useSelector((s: RootState) => s.orders?.items?.length ?? 0);

  const tiles: Tile[] = [
    { icon: '📦', accent: Colors.red,  label: 'My Orders',       sub: `${orderCount} order${orderCount !== 1 ? 's' : ''}`,  onPress: nav.toOrders },
    { icon: '👤', accent: Colors.teal, label: 'Account Details',  sub: 'Name, email & password',  onPress: nav.toAccountDetails },
    { icon: '📍', accent: Colors.red,  label: 'Addresses',        sub: 'Saved delivery addresses', onPress: nav.toAddresses },
    { icon: '💳', accent: Colors.teal, label: 'Payment Methods',  sub: 'Cards & wallets',          onPress: nav.toPaymentMethods },
    { icon: '❤️', accent: Colors.red,  label: 'Wishlist',         sub: 'Saved products',           onPress: nav.toWishlist },
    { icon: '🛒', accent: Colors.teal, label: 'Continue Shopping',sub: 'Browse the store',         onPress: nav.toShop },
  ];

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.page}>

      {/* ── Banner  →  hero-style dark panel with red accent */}
      <View style={s.banner}>
        <View style={s.bannerStripe} />
        {/* Eyebrow  →  .fp-eyebrow */}
        <Text style={s.eyebrow}>— MEMBER PORTAL</Text>
        <Text style={s.bannerTitle}>
          Hey,{'\n'}<Text style={s.red}>{user?.firstName ?? 'Soldier'}</Text>
        </Text>
        <Text style={s.bannerSub}>What are we doing today?</Text>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statVal}>{orderCount}</Text>
            <Text style={s.statLbl}>Orders</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statVal}>—</Text>
            <Text style={s.statLbl}>Points</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statVal}>VIP</Text>
            <Text style={s.statLbl}>Status</Text>
          </View>
        </View>
      </View>

      {/* ── Marquee-style section label */}
      <View style={s.sectionHead}>
        <View style={s.sectionLine} />
        <Text style={s.sectionLabel}>QUICK ACCESS</Text>
        <View style={s.sectionLine} />
      </View>

      {/* ── Tile grid  →  .bs-grid feel */}
      <View style={s.grid}>
        {tiles.map(tile => (
          <Pressable
            key={tile.label}
            style={({ pressed }) => [s.tile, { borderTopColor: tile.accent }, pressed && s.tilePressed]}
            onPress={tile.onPress}
          >
            {/* Glow bar  →  .bs-col-glow-bar */}
            <View style={[s.tileGlowBar, { backgroundColor: tile.accent }]} />
            <Text style={s.tileIcon}>{tile.icon}</Text>
            <Text style={s.tileLabel}>{tile.label}</Text>
            <Text style={s.tileSub}>{tile.sub}</Text>
            {/* Arrow */}
            <Text style={[s.tileArrow, { color: tile.accent }]}>›</Text>
          </Pressable>
        ))}
      </View>

      {/* ── Sign out */}
      <Pressable style={s.signOutBtn} onPress={signOut}>
        <View style={s.signOutInner}>
          <Text style={s.signOutText}>SIGN OUT</Text>
          <Text style={s.signOutArrow}>→</Text>
        </View>
      </Pressable>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.dark0 },
  page:   { paddingBottom: 48 },

  // ── Banner
  banner: {
    backgroundColor: Colors.dark1,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.red },
  eyebrow:      { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.red, marginBottom: 8 },
  bannerTitle:  { fontFamily: Fonts.display, fontSize: 40, textTransform: 'uppercase', color: Colors.white, lineHeight: 42, marginBottom: 6 },
  red:          { color: Colors.red },
  bannerSub:    { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textMid, marginBottom: 20 },

  statsRow:    { flexDirection: 'row', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  statItem:    { flex: 1, alignItems: 'center' },
  statVal:     { fontFamily: Fonts.display, fontSize: 22, color: Colors.red, letterSpacing: 0.5 },
  statLbl:     { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  // ── Section label
  sectionHead:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 16 },
  sectionLine:  { flex: 1, height: 1, backgroundColor: Colors.border },
  sectionLabel: { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: Colors.textDim },

  // ── Tile grid  →  .bs-col / .bs-grid
  grid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  tile: {
    width: '47.5%',
    backgroundColor: Colors.dark1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 2,      // coloured per accent
    padding: 16,
    position: 'relative',
  },
  tilePressed:  { backgroundColor: Colors.dark2 },
  tileGlowBar:  { position: 'absolute', top: 0, left: 0, right: 0, height: 0 }, // shown via border
  tileIcon:     { fontSize: 26, marginBottom: 10 },
  tileLabel:    { fontFamily: Fonts.display, fontSize: 13, textTransform: 'uppercase', color: Colors.white, marginBottom: 4, letterSpacing: 0.5 },
  tileSub:      { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim, lineHeight: 14 },
  tileArrow:    { position: 'absolute', bottom: 12, right: 14, fontSize: 18 },

  // ── Sign out
  signOutBtn:   { marginHorizontal: 16, marginTop: 24, borderWidth: 1, borderColor: Colors.red, backgroundColor: Colors.redFaded },
  signOutInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  signOutText:  { fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: Colors.red },
  signOutArrow: { color: Colors.red, fontSize: 16 },
});