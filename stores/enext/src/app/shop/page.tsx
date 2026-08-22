import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop | eFear',
  description: 'Browse comics, e-books, and collectibles at eFear.',
};

// SSR + 60s ISR per the project's rendering strategy for shop/product pages.
// NOTE: the initial product/category/brand fetch still happens client-side
// inside ShopClient via RTK Query today — wiring this page to prefetch and
// hydrate that data server-side is the follow-up step called out in the
// project roadmap, not part of this conversion pass.
export const revalidate = 60;

export default function ShopPage() {
  return <ShopClient />;
}