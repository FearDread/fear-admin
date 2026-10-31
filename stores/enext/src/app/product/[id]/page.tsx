// app/product/[id]/page.tsx
//
// Server component: fetches the product once per request (React cache() inside
// getProductServer de-dupes generateMetadata + page body), emits full SEO
// metadata + Product/Breadcrumb JSON-LD, and hands `initialProduct` to the
// client component so the first HTML paint already contains the product.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';
import JsonLd from '@/components/seo/JsonLd';
import { getProductServer } from '@/lib/seo/data';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl, toDescription } from '@/lib/seo/site';

// SSR + 60s ISR, matching the shop/blog strategy.
export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductServer(id);

  if (!product) {
    // Missing products 404 from the page body; keep them out of the index regardless.
    return { title: 'Product Not Found | eFear', robots: { index: false, follow: false } };
  }

  const title = `${product.title} | eFear`;
  const description =
    toDescription(product.shortDescription ?? product.description) ??
    `Buy ${product.title} at eFear. Near mint condition, free shipping over $49, 30-day returns.`;
  const image = product.images?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      type: 'website', // `og:type=product` is not in Next's typed union; JSON-LD carries product semantics
      title: product.title,
      description,
      url: `/product/${id}`,
      images: image ? [{ url: absoluteUrl(image), alt: product.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductServer(id);

  if (!product) notFound();

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product, id),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
            { name: product.title ?? 'Product', path: `/product/${id}` },
          ]),
        ]}
      />
      <ProductDetailsClient id={id} initialProduct={product} />
    </>
  );
}
