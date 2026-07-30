import type { Metadata } from 'next';
import { Anton, Space_Mono } from 'next/font/google';
import StoreProvider from '@/lib/redux/StoreProvider';
import SiteLayout from '@/components/layout/SiteLayout';

import '../assets/css/bootstrap.min.css';
import '../assets/css/owl.carousel.min.css';
import '../assets/css/icons.css';
import '../assets/css/pace.min.css';
import '../assets/css/app.css';
import '../assets/css/index.css';
import '../assets/css/efear.css';

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

export const metadata: Metadata = {
  title: 'Your Store',
  description: 'Your Store description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceMono.variable}`}>
      <body>
        <StoreProvider>
          <SiteLayout>{children}</SiteLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
