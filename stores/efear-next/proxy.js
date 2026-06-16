import { NextResponse } from 'next/server';

// Routes requiring authentication
const PROTECTED_PREFIXES = [
  '/account',
  '/checkout',
];

// Routes authenticated users should be redirected away from
const AUTH_ONLY_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = Boolean(token);

  // ── Protect private routes ──────────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isProtected && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Bounce authenticated users away from auth pages ─────────────────────
  const isAuthOnly = AUTH_ONLY_PATHS.includes(pathname);

  if (isAuthOnly && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/account/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next/static  (static files)
     *  - _next/image   (image optimization)
     *  - favicon.ico
     *  - public folder files (svg, png, jpg, etc.)
     *
     * Next.js 15 requires this as an array of strings,
     * not a single regex string.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};