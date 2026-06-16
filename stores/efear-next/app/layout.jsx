import { Inter } from 'next/font/google';
import Providers from './providers';

import '../assets/css/bootstrap.min.css';
import '../assets/css/owl.carousel.min.css';
import '../assets/css/icons.css';
import '../assets/css/pace.min.css';
import '../assets/css/app.css';
import '../assets/css/index.css';
import '../assets/css/efear.css';

export const metadata = {
  title: {
    default: 'eFear Store',
    template: '%s | eFear Store',
  },
  description: 'eFear — your one-stop shop.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://efear.store'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}