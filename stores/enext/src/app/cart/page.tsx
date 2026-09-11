import type { Metadata } from 'next';
import CartClient from './CartClient';

// Cart is per-session/per-user and mutates constantly — never cache this page.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Your Cart | eFear',
    description: 'Review the comics, manga, trading cards, and collectibles in your eFear cart before checking out.',
};

export default function CartPage() {
    return <CartClient />;
}