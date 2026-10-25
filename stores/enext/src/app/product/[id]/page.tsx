// app/product/[id]/page.tsx
//
// SERVER component (no 'use client'). It:
//   1. Fetches the product on the server for SEO metadata + first paint
//   2. Returns notFound() for unknown ids
//   3. Emits Product + BreadcrumbList JSON-LD for Google rich results
//   4. Hands the product to the client component as `initialProduct`
//      so the first render is fully populated (crawlable HTML, no loading flash)

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { makeStore } from '@/lib/redux/store';
import { type Product } from '@/types/product';
import { productsApi } from '@/lib/redux/api/productsApi';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';

// ISR: regenerated in the background at most once every 60s.
export const revalidate = 60;

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://efear.shop').replace(/\/$/, '');

interface ProductPageProps {
  // Next.js 15: dynamic route params are async and must be awaited.
  params: Promise<{ id: string }>;
}

// JSON.stringify doesn't escape "<", so a description containing "</script>"
// would end the tag early (XSS / broken markup). \u003c is identical JSON but
// inert in HTML. U+2028/2029 are valid JSON but historically broke JS parsers.
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

// Tolerates both a bare product and the FEAR `{ result, success }` envelope.
// (The real fix is a transformResponse on getProductById — see productsApi.)
function unwrapProduct(payload: unknown): Product | null {
  if (!payload || typeof payload !== 'object') return null;
  const maybe = payload as { result?: unknown };
  const candidate = ('result' in maybe ? maybe.result : payload) as Product | null | undefined;
  return candidate && typeof candidate === 'object' ? candidate : null;
}

// Dispatches the RTK Query thunk against a throwaway store — NOT the
// `useGetProductByIdQuery` hook (hooks need a mounted React tree + Provider).
async function getProduct(id: string): Promise<Product | null> {
  const store = makeStore();
  try {
    const raw = await store.dispatch(productsApi.endpoints.getProductById.initiate(id)).unwrap();
    return unwrapProduct(raw);
  } catch {
    return null;
  }
}

const imageUrls = (product: Product): string[] =>
  ((product.images ?? []) as unknown[])
    .map((img) => {
      if (typeof img === 'string') return img;
      const o = img as { url?: string; secure_url?: string; src?: string } | null;
      return o?.url ?? o?.secure_url ?? o?.src ?? '';
    })
    .filter(Boolean);

const toAbsolute = (url: string) => (url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`);

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    // 404 pages should never be indexed.
    return { title: 'Product Not Found | eFear', robots: { index: false, follow: false } };
  }

  const title = product.title ?? product.name ?? 'Product';
  const description = (product.shortDescription ?? product.description ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160) || undefined;
  const images = imageUrls(product).map((u) => ({ url: toAbsolute(u), alt: title }));

  return {
    title: `${title} | eFear`,
    description,
    alternates: { canonical: `${SITE_URL}/product/${id}` },
    // Product pages are the money pages — be explicit so nothing upstream noindexes them.
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/product/${id}`,
      siteName: 'eFear',
      type: 'website',
      images: images.length ? images : undefined,
    },
    twitter: {
      card: images.length ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images.length ? [images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const title = product.title ?? product.name ?? 'Product';
  const price = product.salePrice ?? product.price;
  const productUrl = `${SITE_URL}/product/${id}`;
  const images = imageUrls(product).map(toAbsolute);
  const stock = product.quantity ?? 0;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: title,
    description: product.shortDescription ?? product.description ?? undefined,
    image: images.length ? images : undefined,
    sku: product.sku ?? product._id,
    url: productUrl,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: price?.toFixed(2),
      itemCondition: 'https://schema.org/NewCondition', // make conditional if you sell used/graded
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'eFear' },
    },
    // Only emit with real reviews — Google penalizes ratings that don't match visible reviews.
    ...(product.rating && (product.reviewCount ?? 0) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
      { '@type': 'ListItem', position: 3, name: title, item: productUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <ProductDetailsClient id={id} initialProduct={product} />
    </>
  );
}
