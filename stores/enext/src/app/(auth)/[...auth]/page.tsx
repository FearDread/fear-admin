import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

/**
 * app/(auth)/[...auth]/page.tsx
 *
 * Single dynamic route standing in for what used to be four separate
 * `page.tsx` files (`login/`, `register/`, `forgot-password/`,
 * `reset-password/[token]/`). The first URL segment picks the view; a second
 * segment (only used by `reset-password/:token`) is passed through as a prop.
 *
 *   /login                      → LoginForm
 *   /register                   → RegisterForm
 *   /forgot-password            → ForgotPasswordForm
 *   /reset-password/:token      → ResetPasswordForm
 *   anything else               → notFound()
 *
 * To add a new auth view later: add a branch to `AUTH_VIEWS` below and to
 * `generateMetadata` — no new route folder needed.
 */

type AuthSegments = string[];

interface AuthPageProps {
  // Next.js 15: dynamic route params are async on the server.
  params: Promise<{ auth?: AuthSegments }>;
}

const AUTH_META: Record<string, Metadata> = {
  login: {
    title: 'Sign In | eFear',
    description: 'Sign in to your eFear account to track orders, manage your wishlist, and check out faster.',
  },
  register: {
    title: 'Create Account | eFear',
    description: 'Join eFear for early access to new arrivals, member discounts, order tracking, and wishlists.',
  },
  'forgot-password': {
    title: 'Forgot Password | eFear',
    description: 'Reset your eFear account password.',
  },
  'reset-password': {
    title: 'Reset Password | eFear',
    description: 'Choose a new password for your eFear account.',
  },
};

export async function generateMetadata({ params }: AuthPageProps): Promise<Metadata> {
  const { auth } = await params;
  const [mode] = auth ?? [];
  return AUTH_META[mode ?? ''] ?? { title: 'eFear' };
}

// Pre-render the three static-shaped views; reset-password's token segment
// is inherently dynamic so it isn't (and can't usefully be) listed here.
export function generateStaticParams() {
  return [{ auth: ['login'] }, { auth: ['register'] }, { auth: ['forgot-password'] }];
}

export default async function AuthPage({ params }: AuthPageProps) {
  const { auth } = await params;
  const [mode, token] = auth ?? [];

  switch (mode) {
    case 'login':
      // LoginForm reads `useSearchParams()` (`?from=` / `?message=`), which
      // requires a Suspense boundary in the App Router.
      return (
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      );

    case 'register':
      return <RegisterForm />;

    case 'forgot-password':
      return <ForgotPasswordForm />;

    case 'reset-password':
      if (!token) notFound();
      return <ResetPasswordForm token={token} />;

    default:
      notFound();
  }
}