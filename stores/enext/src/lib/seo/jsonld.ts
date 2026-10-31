import type { Product } from '@/types/product';
import type { BlogPost } from '@/lib/redux/api/blogApi';
import { BUSINESS, DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, toDescription } from './site';

const CONTEXT = 'https://schema.org';

/** Organization + online-store identity + sitewide search box (rendered once in the root layout). */
export function siteJsonLd() {
  return {
    '@context': CONTEXT,
    '@graph': [
      {
        '@type': ['Organization', 'Store'],
        '@id': `${SITE_URL}/#organization`,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE_URL,
        logo: absoluteUrl(DEFAULT_OG_IMAGE),
        image: absoluteUrl(DEFAULT_OG_IMAGE),
        email: BUSINESS.email,
        telephone: BUSINESS.phone,
        description: SITE_DESCRIPTION,
        address: { '@type': 'PostalAddress', ...BUSINESS.address },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: BUSINESS.openingHours.days,
          opens: BUSINESS.openingHours.opens,
          closes: BUSINESS.openingHours.closes,
        },
        ...(BUSINESS.sameAs.length ? { sameAs: BUSINESS.sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?search={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function productJsonLd(product: Product, id: string) {
  const url = absoluteUrl(`/product/${id}`);
  const images = (product.images ?? []).map((i) => absoluteUrl(i.url)).filter(Boolean);
  const price = product.salePrice ?? product.price;
  const inStock = (product.quantity ?? 0) > 0;
  const reviewCount = Number(product.reviewCount ?? 0);
  const rating = Number(product.rating ?? 0);
  const brand = typeof product.brand === 'string' && product.brand ? product.brand : undefined;

  return {
    '@context': CONTEXT,
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title ?? product.name,
    description: toDescription(product.description ?? product.shortDescription, 500),
    image: images.length ? images : undefined,
    sku: product.sku ?? id,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    category: product.category,
    url,
    offers:
      typeof price === 'number'
        ? {
            '@type': 'Offer',
            url,
            priceCurrency: 'USD',
            price: price.toFixed(2),
            availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@id': `${SITE_URL}/#organization` },
          }
        : undefined,
    // Only emit ratings backed by real reviews — fabricated/placeholder
    // aggregateRating violates Google's structured-data policies.
    aggregateRating:
      reviewCount > 0 && rating > 0
        ? { '@type': 'AggregateRating', ratingValue: rating, reviewCount }
        : undefined,
  };
}

export function articleJsonLd(post: BlogPost, id: string) {
  const url = absoluteUrl(`/blog/${id}`);
  const image = post.images?.[0]?.url ?? post.thumbnail;
  const published = post.publishedDate ?? post.createdAt;
  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: toDescription(post.excerpt ?? post.content),
    image: image ? [absoluteUrl(image)] : undefined,
    datePublished: published,
    dateModified: published,
    author: { '@type': 'Person', name: post.authorName ?? post.author ?? 'eFear Team' },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function itemListJsonLd(items: { name: string; path: string; image?: string }[]) {
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(it.path),
      name: it.name,
      image: it.image ? absoluteUrl(it.image) : undefined,
    })),
  };
}

export function contactPageJsonLd() {
  return {
    '@context': CONTEXT,
    '@type': 'ContactPage',
    url: absoluteUrl('/contact'),
    name: `Contact ${SITE_NAME}`,
    about: { '@id': `${SITE_URL}/#organization` },
  };
}
