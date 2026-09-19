import type { Metadata } from 'next';
import CartClient from './CartClient';

// No `dynamic = 'force-dynamic'` here: nothing user-specific is rendered on the
// server. The cart is fetched client-side through cartApi with the session /
// guest cookie, so the HTML shell is identical for every visitor and can be
// prerendered and cached. force-dynamic only forced a server render per request
// for that empty shell.

export const metadata: Metadata = {
    title: 'Your Cart | eFear',
    description: 'Review the comics, manga, trading cards, and collectibles in your eFear cart before checking out.',
    // A per-visitor cart is thin, duplicate content with nothing for search
    // engines. Keep it out of the index but let crawlers follow its links back
    // into the shop.
    robots: { index: false, follow: true },
};

export default function CartPage() {
    return <CartClient />;
}