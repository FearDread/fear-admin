import type { Metadata } from 'next';
import WishlistClient from './WishlistClient';

// Per-user, auth-gated — never cache, never index.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Wishlist | eFear',
  description: 'Your saved comics, manga, trading cards, and collectibles at eFear.',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
