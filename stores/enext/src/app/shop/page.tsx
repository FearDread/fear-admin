import type { Metadata } from 'next';
import ShopClient from './ShopClient';
import JsonLd from '@/components/seo/JsonLd';
import { getAllProductsServer } from '@/lib/seo/data';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/jsonld';

// `?search=`, `?category=`, `?cat=` variants all canonicalize to /shop so
// filter/search URLs don't dilute ranking or burn crawl budget. (Reading
// searchParams here would force dynamic rendering and kill the ISR window.)
export const metadata: Metadata = {
  title: 'Shop Comics, E-Books & Collectibles | eFear',
  description:
    'Browse comics, manga, e-books, trading cards, and collectibles at eFear. Near mint condition, free shipping over $49, 30-day returns.',
  alternates: { canonical: '/shop' },
  openGraph: {
    type: 'website',
    title: 'Shop Comics, E-Books & Collectibles | eFear',
    description: 'Browse comics, manga, e-books, trading cards, and collectibles at eFear.',
    url: '/shop',
  },
};

export const revalidate = 60;

export default async function ShopPage() {
  // Server-prefetched so the first HTML response contains real product links
  // for crawlers (the client component otherwise renders a loading screen on
  // the server). Passed to ShopClient as `initialProducts` — see MERGE_NOTES.md.
  const products = await getAllProductsServer();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
          ]),
          itemListJsonLd(
            products.slice(0, 24).map((p) => ({
              name: p.title ?? p.name ?? 'Product',
              path: `/product/${p._id ?? p.id}`,
              image: p.images?.[0]?.url,
            })),
          ),
        ]}
      />
      <ShopClient initialProducts={products} />
    </>
  );
}
