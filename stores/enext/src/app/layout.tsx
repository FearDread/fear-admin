import type { Metadata } from 'next';
import { Anton, Space_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import StoreProvider from '@/lib/redux/StoreProvider';
import SiteLayout from '@/components/layout/SiteLayout';

import '../assets/css/bootstrap.min.css';
import '../assets/css/app.css';
import '../assets/css/efear.css';
import '../assets/css/owl.carousel.min.css';
import '../assets/css/index.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // G-41NR3BS7VD

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
    metadataBase: new URL('https://efear.store'),
    title: {
        default: 'eFear | Comics, E-Books & Collectibles',
        template: '%s | eFear',
    },
    description:
        'Shop bagged-and-boarded comics, e-books, manga, and trading cards at eFear.',
};

export default function RootLayout({ children, } : { children: React.ReactNode; }) {
    console.log('GA ID = ', GA_ID);
    return (
        <html lang= "en" className = {`${anton.variable} ${spaceMono.variable}`
}>
    <body>
    <StoreProvider>
    <SiteLayout>{ children } </SiteLayout>
    </StoreProvider>
{
    GA_ID && process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={ GA_ID } />
        )
}
</body>
    </html>
  );
}