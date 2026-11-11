import type { Metadata, Viewport } from 'next';
import { Anton, Space_Mono } from 'next/font/google';
import StoreProvider from '@/lib/redux/StoreProvider';
import SiteLayout from '@/components/layout/SiteLayout';
import JsonLd from '@/components/seo/JsonLd';
import { siteJsonLd } from '@/lib/seo/jsonld';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/seo/site';

import '../assets/css/bootstrap.min.css';
import '../assets/css/app.css';
import '../assets/css/efear.css';
import '../assets/css/owl.carousel.min.css';
import '../assets/css/index.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

// metadataBase makes every relative canonical / og:image in child routes resolve
// to the production origin. Child pages set their own full titles (`X | eFear`),
// so there is deliberately no `title.template` (it would double the suffix).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: '/',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: `${SITE_NAME} logo` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // Set GOOGLE_SITE_VERIFICATION if you verify Search Console via meta tag.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0d0d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceMono.variable}`}>
      <body>
        <JsonLd data={siteJsonLd()} />
        <StoreProvider>
          <SiteLayout>{children}</SiteLayout>
            </StoreProvider>
        <Script
          id="adsbygoogle-init"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7721831965021640"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
