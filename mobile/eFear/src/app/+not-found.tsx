import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={s.page}>
      <View style={s.stripe} />
      <Text style={s.ghost} aria-hidden>404</Text>

      <View style={s.content}>
        <Text style={s.eyebrow}>— NAVIGATION ERROR</Text>
        <Text style={s.heading}>PAGE{'\n'}<Text style={s.red}>NOT{'\n'}FOUND</Text></Text>
        <Text style={s.body}>
          The route you're looking for doesn't exist or has been moved.
          Check the URL or head back to base.
        </Text>

        <View style={s.btns}>
          <Pressable style={s.btnPrimary} onPress={() => router.replace('/(public)')}>
            <Text style={s.btnPrimaryText}>← GO HOME</Text>
          </Pressable>
          <Pressable style={s.btnGhost} onPress={() => router.back()}>
            <Text style={s.btnGhostText}>GO BACK</Text>
          </Pressable>
        </View>

        <View style={s.quickLinks}>
          {(['Shop', 'Contact', 'FAQ'] as const).map((label) => (
            <Pressable key={label} style={s.quickLink}
              onPress={() => router.push(`/(public)/${label.toLowerCase()}` as any)}>
              <Text style={s.quickLinkText}>{label} ›</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page:    { flex: 1, backgroundColor: Colors.dark0, justifyContent: 'center', padding: 28, overflow: 'hidden' },
  stripe:  { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.red },
  ghost:   { position: 'absolute', right: -16, bottom: '10%', fontFamily: Fonts.display, fontSize: 180, color: 'rgba(255,255,255,0.022)', lineHeight: 180 },
  content: { position: 'relative', zIndex: 1 },
  eyebrow: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.red, marginBottom: 12 },
  heading: { fontFamily: Fonts.display, fontSize: 64, textTransform: 'uppercase', color: Colors.white, lineHeight: 60, marginBottom: 16 },
  red:     { color: Colors.red },
  body:    { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textMid, lineHeight: 20, marginBottom: 28, maxWidth: 340 },

  btns:           { flexDirection: 'row', gap: 12, marginBottom: 28 },
  btnPrimary:     { flex: 1.5, backgroundColor: Colors.red, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText: { fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },
  btnGhost:       { flex: 1, borderWidth: 1, borderColor: Colors.border, paddingVertical: 14, alignItems: 'center' },
  btnGhostText:   { fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },

  quickLinks:    { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 16 },
  quickLink:     { flex: 1, paddingVertical: 8, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
  quickLinkText: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },
});