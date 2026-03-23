import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../features/store';
// import { loginThunk } from '../../features/auth/authSlice';
import { useNavigation } from '../../hooks/useNavigation';
import { Colors, Fonts } from '../../constants/theme.tzx';

// Feature bullets shown in the left panel  →  .auth-feature
const FEATURES = [
  { icon: '🔒', accent: Colors.red,  title: 'Secure Account',  desc: 'Your data is encrypted end-to-end.' },
  { icon: '📦', accent: Colors.teal, title: 'Order Tracking',  desc: 'Real-time updates on every shipment.' },
  { icon: '❤️', accent: Colors.red,  title: 'Wishlist & Saves', desc: 'Keep your favourite gear in one place.' },
];

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const nav      = useNavigation();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    try {
      // await dispatch(loginThunk({ email, password })).unwrap();
      nav.toDashboard();
    } catch (err: any) {
      setError(err?.message ?? 'Login failed. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">

        {/* ── LEFT PANEL  →  .auth-left ───────────────────── */}
        <View style={s.leftPanel}>
          {/* Red stripe  →  .auth-left-stripe */}
          <View style={s.leftStripe} />

          {/* Logo */}
          <Pressable onPress={() => nav.toHome()}>
            <Text style={s.leftLogo}>e<Text style={s.accentRed}>Fear</Text></Text>
          </Pressable>

          {/* Heading  →  .auth-left-heading */}
          <Text style={s.leftHeading}>Welcome{'\n'}<Text style={s.accentRed}>Back</Text></Text>
          <Text style={s.leftSub}>Sign in to access your orders, wishlist, and exclusive drops.</Text>

          {/* Feature tiles  →  .auth-feature */}
          {FEATURES.map(f => (
            <View key={f.title} style={[s.feature, { borderLeftColor: f.accent }]}>
              <Text style={s.featureIcon}>{f.icon}</Text>
              <View style={s.featureText}>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}

          {/* Stats footer  →  .auth-stat-row */}
          <View style={s.statsRow}>
            <View>
              <Text style={s.statVal}>50K+</Text>
              <Text style={s.statLbl}>Members</Text>
            </View>
            <View>
              <Text style={s.statVal}>4.9★</Text>
              <Text style={s.statLbl}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* ── RIGHT PANEL (form)  →  .auth-right ─────────── */}
        <View style={s.rightPanel}>
          {/* Eyebrow  →  .auth-form-eyebrow */}
          <Text style={s.eyebrow}>— MEMBER ACCESS</Text>

          {/* Title  →  .auth-form-title */}
          <Text style={s.formTitle}>Sign <Text style={s.accentRed}>In</Text></Text>
          <Text style={s.formSub}>
            No account?{' '}
            <Link href="/(auth)/register"><Text style={s.formSubLink}>Register here</Text></Link>
          </Text>

          {/* Error alert  →  .auth-alert.error */}
          {error && (
            <View style={s.alertError}>
              <Text style={s.alertIcon}>⚠</Text>
              <Text style={s.alertText}>{error}</Text>
            </View>
          )}

          {/* Email  →  .auth-label / .auth-input */}
          <View style={s.field}>
            <Text style={s.label}>EMAIL ADDRESS <Text style={s.labelReq}>*</Text></Text>
            <TextInput
              style={s.input}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textDim}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
          </View>

          {/* Password  →  .auth-pw-wrap */}
          <View style={s.field}>
            <View style={s.labelRow}>
              <Text style={s.label}>PASSWORD <Text style={s.labelReq}>*</Text></Text>
              <Link href="/(auth)/forgot-password">
                <Text style={s.forgotLink}>FORGOT?</Text>
              </Link>
            </View>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textDim}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {/* Submit  →  .btn-hero-primary style */}
          <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.btnText}>SIGN IN</Text>
            }
          </Pressable>

          {/* Divider  →  .auth-divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>OR</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Social placeholder  →  .auth-social-btn */}
          <Pressable style={s.socialBtn}>
            <Text style={s.socialBtnText}>G  CONTINUE WITH GOOGLE</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.dark0 },
  page: {
    flexGrow: 1,
    flexDirection: Platform.OS === 'ios' ? 'row' : 'column',
    minHeight: '100%',
  },

  // ── LEFT PANEL  →  .auth-left
  leftPanel: {
    backgroundColor: Colors.dark1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 28,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    // On larger screens this would be a fixed-width sidebar
    // On mobile it stacks above the form
  },
  leftStripe: {           // .auth-left-stripe
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: Colors.red,
  },
  leftLogo: {
    fontFamily: Fonts.display,
    fontSize: 22,
    textTransform: 'uppercase',
    color: Colors.white,
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  leftHeading: {          // .auth-left-heading
    fontFamily: Fonts.display,
    fontSize: 36,
    textTransform: 'uppercase',
    lineHeight: 38,
    color: Colors.white,
    marginBottom: 10,
  },
  leftSub: {              // .auth-left-sub
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.textMid,
    lineHeight: 18,
    marginBottom: 20,
  },

  // ── Feature tile  →  .auth-feature
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.dark2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  featureIcon:  { fontSize: 18, marginTop: 2 },
  featureText:  { flex: 1 },
  featureTitle: {
    fontFamily: Fonts.display,
    fontSize: 13,
    textTransform: 'uppercase',
    color: Colors.white,
    marginBottom: 2,
  },
  featureDesc: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.textDim,
    lineHeight: 14,
  },

  // ── Stats  →  .auth-stat-row
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statVal: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.red,
    lineHeight: 24,
  },
  statLbl: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textDim,
  },

  // ── RIGHT PANEL  →  .auth-right
  rightPanel: {
    flex: 1,
    backgroundColor: Colors.dark0,
    padding: 28,
    paddingTop: 24,
  },
  eyebrow: {              // .auth-form-eyebrow
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.red,
    marginBottom: 8,
  },
  formTitle: {            // .auth-form-title
    fontFamily: Fonts.display,
    fontSize: 36,
    textTransform: 'uppercase',
    color: Colors.white,
    marginBottom: 6,
  },
  formSub: {              // .auth-form-sub
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.textMid,
    marginBottom: 20,
  },
  formSubLink: { color: Colors.red, textDecorationLine: 'underline' },
  accentRed: { color: Colors.red },

  // ── Alert  →  .auth-alert.error
  alertError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.redBorder,
    backgroundColor: Colors.redFaded,
    marginBottom: 16,
  },
  alertIcon: { color: Colors.red, fontSize: 14, marginTop: 1 },
  alertText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.red, flex: 1, lineHeight: 16 },

  // ── Form field  →  .auth-field / .auth-label / .auth-input
  field: { marginBottom: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.red,
    marginBottom: 6,
  },
  labelReq: { color: Colors.textDim },
  forgotLink: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textDim,
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: Colors.dark2,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textHi,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontFamily: Fonts.mono,
    fontSize: 13,
    borderRadius: 0,
  },

  // ── Submit  →  .btn-hero-primary
  btn: {
    backgroundColor: Colors.red,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 0,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.white,
  },

  // ── Divider  →  .auth-divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textDim,
  },

  // ── Social  →  .auth-social-btn
  socialBtn: {
    backgroundColor: Colors.dark2,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 0,
  },
  socialBtnText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMid,
  },
});