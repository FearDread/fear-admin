import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

// Utility page with no search value: keep it out of the index but let
// crawlers follow its links (so don't Disallow it in robots.txt — the
// crawler must be able to fetch the page to see this directive).
export const metadata: Metadata = {
  title: 'Forgot Password | eFear',
  description: 'Reset your eFear account password.',
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
