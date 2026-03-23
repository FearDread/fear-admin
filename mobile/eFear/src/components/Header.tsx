import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, FlatList, Platform } from 'react-native';
import { useRouter, usePathname, Link } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { Colors, Fonts } from '../constants/theme.tsx';

const NAV_LINKS = [
  { label: 'Home',       href: '/(public)'            as const },
  { label: 'Shop',       href: '/(public)/shop'       as const },
  { label: 'Blog',       href: '/(public)/blog'       as const },
  { label: 'About',      href: '/(public)/about'      as const },
  { label: 'Contact',    href: '/(public)/contact'    as const },
  { label: 'FAQ',        href: '/(public)/faq'        as const },
];

export default function Header() {
  const router    = useRouter();
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  const cartCount = useSelector((s: RootState) => s.cart?.items?.length  ?? 0);
  const isAuth    = useSelector((s: RootState) => s.auth?.isAuthenticated ?? false);

  return (
    <>
      {/* ── Top utility bar ─────────────────────────────────── */}
      <View style={s.topbar}>
        <Text style={s.topbarBrand}>
          e<Text style={s.topbarAccent}>Fear</Text> — Premium Gear
        </Text>
      </View>

      {/* ── Main header bar ─────────────────────────────────── */}
      <View style={s.main}>
        {/* Logo  →  .hdr-logo-text */}
        <Pressable onPress={() => router.push('/(public)')} style={s.logo}>
          <Text style={s.logoText}>e<Text style={s.logoAccent}>Fear</Text></Text>
        </Pressable>

        {/* Icon cluster  →  .hdr-icons */}
        <View style={s.icons}>
          {/* Wishlist */}
          <Pressable style={s.iconBtn} onPress={() => router.push('/(public)/wishlist')} accessibilityLabel="Wishlist">
            <Text style={s.iconGlyph}>♡</Text>
          </Pressable>

          {/* Cart  →  .hdr-icon-badge */}
          <Pressable style={s.iconBtn} onPress={() => router.push('/(public)/shop/cart')} accessibilityLabel={`Cart – ${cartCount} items`}>
            <Text style={s.iconGlyph}>🛒</Text>
            {cartCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Account */}
          <Pressable
            style={s.iconBtn}
            onPress={() => router.push(isAuth ? '/(protected)/account/dashboard' : '/(auth)/login')}
            accessibilityLabel={isAuth ? 'My account' : 'Sign in'}
          >
            <Text style={s.iconGlyph}>👤</Text>
          </Pressable>

          {/* Hamburger */}
          <Pressable style={[s.iconBtn, s.iconBtnRed]} onPress={() => setOpen(true)} accessibilityLabel="Open menu">
            <Text style={s.iconGlyph}>☰</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Nav bar  →  .hdr-nav ────────────────────────────── */}
      <View style={s.nav}>
        <View style={s.navInner}>
          {NAV_LINKS.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} asChild>
                <Pressable style={[s.navItem, active && s.navItemActive]}>
                  <Text style={[s.navLabel, active && s.navLabelActive]}>{link.label}</Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
        {/* Red underline accent  →  .hdr-nav::after */}
        <View style={s.navAccent} />
      </View>

      {/* ── Drawer modal  →  .hdr-account-dd style ──────────── */}
      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setOpen(false)} />
        <View style={s.drawer}>
          {/* Header */}
          <View style={s.drawerHead}>
            <Text style={s.drawerLogoText}>e<Text style={s.logoAccent}>Fear</Text></Text>
            <Pressable style={s.drawerClose} onPress={() => setOpen(false)}>
              <Text style={s.drawerCloseText}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={NAV_LINKS}
            keyExtractor={i => i.href}
            renderItem={({ item }) => {
              const active = pathname === item.href;
              return (
                <Link href={item.href} asChild>
                  <Pressable style={[s.drawerItem, active && s.drawerItemActive]} onPress={() => setOpen(false)}>
                    <Text style={[s.drawerLabel, active && s.drawerLabelActive]}>{item.label}</Text>
                    <Text style={s.drawerArrow}>›</Text>
                  </Pressable>
                </Link>
              );
            }}
          />

          {/* Auth row at bottom */}
          <View style={s.drawerFoot}>
            {isAuth
              ? (
                <Pressable style={s.btnPrimary} onPress={() => { setOpen(false); router.push('/(protected)/account/dashboard'); }}>
                  <Text style={s.btnPrimaryText}>MY ACCOUNT</Text>
                </Pressable>
              ) : (
                <View style={s.authRow}>
                  <Pressable style={[s.btnPrimary, s.btnGhost]} onPress={() => { setOpen(false); router.push('/(auth)/login'); }}>
                    <Text style={s.btnGhostText}>LOGIN</Text>
                  </Pressable>
                  <Pressable style={s.btnPrimary} onPress={() => { setOpen(false); router.push('/(auth)/register'); }}>
                    <Text style={s.btnPrimaryText}>REGISTER</Text>
                  </Pressable>
                </View>
              )
            }
          </View>
        </View>
      </Modal>
    </>
  );
}

const TOPBAR_H = 30;
const MAIN_H   = Platform.OS === 'ios' ? 56 : 60;
const NAV_H    = 42;

const s = StyleSheet.create({
  // ── Top utility bar  →  .hdr-topbar
  topbar: {
    height: TOPBAR_H,
    backgroundColor: Colors.dark1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topbarBrand: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textDim,
  },
  topbarAccent: { color: Colors.red },

  // ── Main bar  →  .hdr-main
  main: {
    height: MAIN_H,
    backgroundColor: Colors.dark1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  // ── Logo  →  .hdr-logo-text
  logo: {},
  logoText: {
    fontFamily: Fonts.display,
    fontSize: 26,
    textTransform: 'uppercase',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  logoAccent: { color: Colors.red },

  // ── Icon buttons  →  .hdr-icon-btn
  icons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: {
    width: 42,
    height: 42,
    backgroundColor: Colors.dark2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBtnRed: {
    borderColor: Colors.red,
    backgroundColor: Colors.redFaded,
  },
  iconGlyph: { fontSize: 18 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    backgroundColor: Colors.red,
    borderWidth: 2,
    borderColor: Colors.dark1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: { fontFamily: Fonts.mono, fontSize: 9, color: Colors.white },

  // ── Nav bar  →  .hdr-nav
  nav: {
    height: NAV_H,
    backgroundColor: Colors.dark2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
    paddingHorizontal: 8,
  },
  navItem: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  navItemActive: { borderBottomColor: Colors.red },
  navLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textMid,
  },
  navLabelActive: { color: Colors.white },
  navAccent: {          // red 80px underline at left  →  .hdr-nav::after
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 2,
    backgroundColor: Colors.red,
  },

  // ── Drawer  →  .hdr-account-dd / mobile drawer
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },
  drawer: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: '78%',
    maxWidth: 340,
    backgroundColor: Colors.dark1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    borderTopWidth: 2,
    borderTopColor: Colors.red,
  },
  drawerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.dark0,
  },
  drawerLogoText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    textTransform: 'uppercase',
    color: Colors.white,
  },
  drawerClose: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.dark2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseText: { color: Colors.textMid, fontSize: 14 },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drawerItemActive: { backgroundColor: Colors.dark2 },
  drawerLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMid,
  },
  drawerLabelActive: { color: Colors.white },
  drawerArrow: { color: Colors.textDim, fontSize: 16 },

  drawerFoot: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.dark1,
  },
  authRow: { flexDirection: 'row', gap: 10 },

  // ── Shared buttons
  btnPrimary: {
    flex: 1,
    backgroundColor: Colors.red,
    paddingVertical: 12,
    alignItems: 'center',
    // chamfered-corner feel — use borderRadius 0 for angular eFear style
    borderRadius: 0,
  },
  btnPrimaryText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.white,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnGhostText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textMid,
  },
});