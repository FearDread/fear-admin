import { T } from '@/components/styles';

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const EMPTY_STRENGTH: PasswordStrength = { score: 0, label: '', color: '' };

export function calcStrength(pw: string): PasswordStrength {
  if (!pw) return EMPTY_STRENGTH;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', T.red, T.red, T.orange, T.orange, T.teal];
  return { score: s, label: labels[s], color: colors[s] };
}
