import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

// Token URLs are secrets: never index, and don't leak the URL via Referer
// to third-party scripts (AdSense, PayPal, etc.) loaded by the layout.
export const metadata: Metadata = {
  title: 'Reset Password | eFear',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
