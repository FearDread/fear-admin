import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../features/store';
import { useNavigation } from '../../hooks/useNavigation';
import { Colors, Fonts } from '../../constants/theme';

function pwStrength(pw: string): { level: number; label: string; color: string } {
  const len     = pw.length;
  const hasNum  = /\d/.test(pw);
  const hasSym  = /[^A-Za-z0-9]/.test(pw);
  const hasUpp  = /[A-Z]/.test(pw);
  let score = 0;
  if (len >= 8)  score++;
  if (len >= 12) score++;
  if (hasNum)    score++;
  if (hasSym)    score++;
  if (hasUpp)    score++;
  if (score <= 1) return { level: score, label: 'Weak',   color: Colors.red };
  if (score <= 3) return { level: score, label: 'Fair',   color: Colors.orange };
  return             { level: score, label: 'Strong', color: Colors.teal };
}

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const nav      = useNavigation();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [agreed,  setAgreed]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const update = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const pw     = pwStrength(form.password);

  async function handleSubmit() {
    setError(null);
    if (!form.firstName || !form.lastName || !form.email || !form.password)
      return setError('All fields are required.');
    if (form.password !== form.confirm)
      return setError('Passwords do not match.');
    if (!agreed)
      return setError('You must agree to the terms of service.');
    setLoading(true);
    try {
      // await dispatch(registerThunk(form)).unwrap();
      nav.toDashboard();
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">

        {/* ── Page heading */}
        <View style={s.pageHead}>
          <View style={s.headStripe} />
          <Text style={s.eyebrow}>— CREATE ACCOUNT</Text>
          <Text style={s.formTitle}>Join <Text style={s.red}>eFear</Text></Text>
          <Text style={s.formSub}>
            Already a member?{' '}
            <Link href="/(auth)/login"><Text style={s.subLink}>Sign in</Text></Link>
          </Text>
        </View>

        {/* ── Form */}
        <View style={s.form}>
          {error && (
            <View style={s.alertError}>
              <Text style={s.alertIcon}>⚠</Text>
              <Text style={s.alertText}>{error}</Text>
            </View>
          )}

          {/* Name row  →  .auth-field-row */}
          <View style={s.row}>
            <View style={[s.field, s.half]}>
              <Text style={s.label}>FIRST NAME <Text style={s.req}>*</Text></Text>
              <TextInput style={s.input} placeholder="Jane" placeholderTextColor={Colors.textDim}
                value={form.firstName} onChangeText={update('firstName')}
                autoCapitalize="words" textContentType="givenName" />
            </View>
            <View style={[s.field, s.half]}>
              <Text style={s.label}>LAST NAME <Text style={s.req}>*</Text></Text>
              <TextInput style={s.input} placeholder="Doe" placeholderTextColor={Colors.textDim}
                value={form.lastName} onChangeText={update('lastName')}
                autoCapitalize="words" textContentType="familyName" />
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>EMAIL ADDRESS <Text style={s.req}>*</Text></Text>
            <TextInput style={s.input} placeholder="you@example.com" placeholderTextColor={Colors.textDim}
              autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress"
              value={form.email} onChangeText={update('email')} />
          </View>

          <View style={s.field}>
            <Text style={s.label}>PASSWORD <Text style={s.req}>*</Text></Text>
            <TextInput style={s.input} placeholder="Min. 8 characters" placeholderTextColor={Colors.textDim}
              secureTextEntry textContentType="newPassword" value={form.password} onChangeText={update('password')} />
            {/* Password strength  →  .auth-pw-strength */}
            {form.password.length > 0 && (
              <View style={s.pwStrength}>
                <View style={s.pwBars}>
                  {[1,2,3,4,5].map(i => (
                    <View key={i} style={[s.pwBar, { backgroundColor: i <= pw.level ? pw.color : Colors.border }]} />
                  ))}
                </View>
                <Text style={[s.pwLabel, { color: pw.color }]}>{pw.label}</Text>
              </View>
            )}
          </View>

          <View style={s.field}>
            <Text style={s.label}>CONFIRM PASSWORD <Text style={s.req}>*</Text></Text>
            <TextInput style={s.input} placeholder="Repeat password" placeholderTextColor={Colors.textDim}
              secureTextEntry textContentType="newPassword" value={form.confirm} onChangeText={update('confirm')}
              returnKeyType="done" onSubmitEditing={handleSubmit} />
          </View>

          {/* Terms checkbox  →  .auth-check-row */}
          <Pressable style={s.checkRow} onPress={() => setAgreed(v => !v)}>
            <View style={[s.checkbox, agreed && s.checkboxChecked]}>
              {agreed && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={s.checkLabel}>
              I agree to the{' '}
              <Link href="/(public)/terms"><Text style={s.subLink}>Terms of Service</Text></Link>
              {' '}and{' '}
              <Link href="/(public)/privacy"><Text style={s.subLink}>Privacy Policy</Text></Link>
            </Text>
          </Pressable>

          <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.btnText}>CREATE ACCOUNT</Text>
            }
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.dark0 },
  page: { flexGrow: 1 },

  pageHead: {
    backgroundColor: Colors.dark1,
    padding: 28,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  headStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.red },
  eyebrow:   { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.red, marginBottom: 8 },
  formTitle: { fontFamily: Fonts.display, fontSize: 36, textTransform: 'uppercase', color: Colors.white, marginBottom: 6 },
  red:       { color: Colors.red },
  formSub:   { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textMid },
  subLink:   { color: Colors.red, textDecorationLine: 'underline' },

  form:      { padding: 28 },

  alertError: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, borderWidth: 1, borderColor: Colors.redBorder,
    backgroundColor: Colors.redFaded, marginBottom: 16,
  },
  alertIcon: { color: Colors.red, fontSize: 14, marginTop: 1 },
  alertText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.red, flex: 1, lineHeight: 16 },

  row:   { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 14 },
  half:  { flex: 1 },
  label: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.red, marginBottom: 6 },
  req:   { color: Colors.textDim },
  input: {
    backgroundColor: Colors.dark2, borderWidth: 1, borderColor: Colors.border,
    color: Colors.textHi, paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontFamily: Fonts.mono, fontSize: 13, borderRadius: 0,
  },

  pwStrength: { marginTop: 6 },
  pwBars:     { flexDirection: 'row', gap: 3, marginBottom: 4 },
  pwBar:      { flex: 1, height: 3 },
  pwLabel:    { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },

  checkRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  checkbox:        { width: 18, height: 18, backgroundColor: Colors.dark2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  checkboxChecked: { backgroundColor: Colors.red, borderColor: Colors.red },
  checkmark:       { color: Colors.white, fontSize: 11, fontWeight: '700' },
  checkLabel:      { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textMid, flex: 1, lineHeight: 18 },

  btn:         { backgroundColor: Colors.red, paddingVertical: 15, alignItems: 'center', borderRadius: 0 },
  btnDisabled: { opacity: 0.6 },
  btnText:     { fontFamily: Fonts.mono, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },
});