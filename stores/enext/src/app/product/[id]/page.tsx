// app/product/[id]/page.tsx
//
// Folder routing note:
//   The folder name `[id]` is what makes this a DYNAMIC route segment.
//   Next.js App Router maps folders -> URL segments, and a file named
//   `page.tsx` inside a folder is what makes that segment renderable.
//
// This file is a SERVER component (no 'use client'). It:
//   1. Fetches the product on the server for SEO metadata + first paint
//   2. Returns notFound() -> renders the sibling not-found.tsx (or default 404)
//   3. Emits Product JSON-LD structured data for rich results in Google Search
//   4. Hands the fetched product to the client component as `initialProduct`
//      so the client query has data to render immediately instead of
//      flashing a loading state (see ProductDetailsClient.tsx).

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { makeStore } from '@/lib/redux/store';
import { type Product } from '@/types/product';
import { productsApi } from '@/lib/redux/api/productsApi';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';

// ISR: page is regenerated in the background at most once every 60s,
// matching the SSR + 60s ISR strategy used across product/shop pages.
export const revalidate = 60;

interface ProductPageProps {
    // Next.js 15: dynamic route params are async and must be awaited.
    params: Promise<{ id: string }>;
}

// Server-side data fetch — dispatches the RTK Query thunk directly against
// a throwaway store, NOT the `useGetProductByIdQuery` hook. Hooks require a
// mounted React render tree with a Provider; Server Components have neither,
// so calling the hook here either throws outright or fails in a way RTK
// Query reports as an opaque "unhandled error" rather than a typed result.
async function getProduct(id: string): Promise<Product | null> {
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
        // Product pages are the money pages — make sure nothing upstream
        // (auth-gated defaults, staging leftovers, etc.) accidentally noindexes them.
        robots: { index: true, follow: true },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const price = product.salePrice ?? product.price;

    // Product structured data — drives Google's rich results (price,
    // availability, rating stars) directly in search listings, which matters
    // more for click-through/sales than ranking alone.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.shortDescription ?? product.description ?? undefined,
        image: product.images?.map((img) => img.url) ?? undefined,
        sku: product.sku ?? product._id,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        offers: {
            '@type': 'Offer',
            url: `https://efear.store/product/${id}`,
            priceCurrency: 'USD',
            price: price?.toFixed(2),
            availability:
                (product.quantity ?? 0) > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
        },
        ...(product.rating
            ? {
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: product.rating,
                    reviewCount: product.reviewCount ?? 1,
                },
            }
            : {}),
    };

    return (
        <>
            <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailsClient id={id} initialProduct={product} />
        </>
    );
}