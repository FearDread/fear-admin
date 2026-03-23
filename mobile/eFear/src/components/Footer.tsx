import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme.tzx';

const LINKS = [
  { label: 'Terms',   href: '/(public)/terms'   as const },
  { label: 'Privacy', href: '/(public)/privacy'  as const },
  { label: 'Returns', href: '/(public)/returns'  as const },
  { label: 'FAQ',     href: '/(public)/faq'      as const },
  { label: 'Contact', href: '/(public)/contact'  as const },
];

const TRUST = [
  { icon: '🚚', label: 'Free Shipping',   sub: 'On orders over $75' },
  { icon: '🔒', label: 'Secure Checkout', sub: '256-bit SSL encryption' },
  { icon: '↩️',  label: 'Easy Returns',   sub: '30-day return policy' },
  { icon: '🎧', label: '24/7 Support',    sub: 'We're always here' },
];

export default function Footer() {
  const router = useRouter();
  const year   = new Date().getFullYear();

  return (
    <View style={s.footer}>
      {/* ── Trust bar  →  .trust-bar */}
      <View style={s.trustBar}>
        {TRUST.map((item, i) => (
          <View key={item.label} style={[s.trustItem, i < TRUST.length - 1 && s.trustItemBorder]}>
            <Text style={s.trustIcon}>{item.icon}</Text>
            <View>
              <Text style={s.trustLabel}>{item.label}</Text>
              <Text style={s.trustSub}>{item.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Brand + links */}
      <View style={s.body}>
        <Text style={s.brand}>e<Text style={s.brandAccent}>Fear</Text></Text>
        <Text style={s.tagline}>Premium tactical & streetwear gear.</Text>

        {/* Policy links */}
        <View style={s.links}>
          {LINKS.map((link, i) => (
            <View key={link.href} style={s.linkRow}>
              {i > 0 && <Text style={s.sep}> · </Text>}
              <Pressable onPress={() => router.push(link.href)}>
                <Text style={s.link}>{link.label}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Copyright */}
        <View style={s.copy}>
          <View style={s.redBar} />
          <Text style={s.copyText}>© {year} eFear. All rights reserved.</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    backgroundColor: Colors.dark1,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  // ── Trust bar  →  .trust-bar / .trust-item
  trustBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: '50%',
    flex: 1,
  },
  trustItemBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  trustIcon: { fontSize: 22 },
  trustLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trustSub: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.textDim,
    marginTop: 1,
  },

  // ── Body
  body: {
    padding: 24,
    alignItems: 'center',
  },
  brand: {
    fontFamily: Fonts.display,
    fontSize: 28,
    textTransform: 'uppercase',
    color: Colors.white,
    letterSpacing: 1,
    marginBottom: 6,
  },
  brandAccent: { color: Colors.red },
  tagline: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.textDim,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center' },
  sep: { color: Colors.border },
  link: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingVertical: 4,
  },

  copy: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    width: '100%',
    gap: 8,
  },
  redBar: {
    width: 40,
    height: 2,
    backgroundColor: Colors.red,
    marginBottom: 8,
  },
  copyText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 0.5,
  },
});