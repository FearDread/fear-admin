// app/product/[id]/page.tsx
//
// Folder routing note:
//   The folder name `[id]` is what makes this a DYNAMIC route segment.
//   Next.js App Router maps folders -> URL segments, and a file named
//   `page.tsx` inside a folder is what makes that segment renderable.
//   So this single file replaces the old React Router entry:
//     { path: "/product/:id", element: <ProductDetails /> }
//   No route needs to be registered anywhere else (App.js/router.js are gone).
//
// This file is a SERVER component (no 'use client'). It:
//   1. Fetches the product on the server for SEO metadata + first paint
//   2. Returns notFound() -> renders the sibling not-found.tsx (or default 404)
//   3. Hands the fetched product to the client component as `initialProduct`
//      so the client query has data to render immediately instead of
//      flashing a loading state (see ProductDetailsClient.tsx).

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { makeStore } from '@/lib/redux/store';
import { productsApi, type Product } from '@/lib/redux/api/productsApi';
import ProductDetailsClient from '../../../components/products/ProductDetailsClient';

// ISR: page is regenerated in the background at most once every 60s,
// matching the SSR + 60s ISR strategy used across product/shop pages.
export const revalidate = 60;

interface ProductPageProps {
  // Next.js 15: dynamic route params are async and must be awaited.
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  // A throwaway store instance per request (via the makeStore factory) —
  // this is the same factory StoreProvider uses on the client, reused here
  // purely to run one RTK Query endpoint on the server.
  const store = makeStore();
  try {
    const product = await store
      .dispatch(productsApi.endpoints.getProductById.initiate(id))
      .unwrap();
    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: 'Product Not Found | eFear' };
  }

  const description =
    product.shortDescription ?? product.description ?? undefined;
  const image = product.images?.[0]?.url;

  return {
    title: `${product.title} | eFear`,
    description,
    openGraph: {
      title: product.title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    alternates: {
      canonical: `/product/${id}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient id={id} initialProduct={product} />;
}