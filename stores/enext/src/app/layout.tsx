import type { Metadata } from 'next';
import StoreProvider from '@/lib/redux/StoreProvider';
import SiteLayout from '@/components/layout/SiteLayout';

export const metadata: Metadata = {
  title: 'Your Store',
  description: 'Your Store description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <SiteLayout>{children}</SiteLayout>
        </StoreProvider>
      </body>
    </html>
  );
}