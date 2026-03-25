import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

interface CoFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

/**
 * CoField — eFear styled checkout form input  →  .auth-label / .auth-input / .auth-field-error
 * Drop in anywhere inside checkout panels.
 */
export default function CoField({ label, error, style, ...rest }: CoFieldProps) {
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label.toUpperCase()}</Text>
      <TextInput
        style={[s.input, error ? s.inputError : null, style]}
        placeholderTextColor={Colors.textDim}
        {...rest}
      />
      {error && (
        <View style={s.errorRow}>
          <Text style={s.errorText}>⚠ {error}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:       { marginBottom: 14 },
  label: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.red,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.dark2,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textHi,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: Fonts.mono,
    fontSize: 13,
    borderRadius: 0,
  },
  inputError: { borderColor: 'rgba(179,14,28,0.6)' },
  errorRow:   { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  errorText:  { fontFamily: Fonts.mono, fontSize: 10, color: Colors.red },
});