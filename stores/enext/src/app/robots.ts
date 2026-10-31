import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

/**
 * Disallow only areas that are private AND never worth crawling.
 * Do NOT disallow /forgot-password or /reset-password/* — they are
 * `noindex` via metadata, and a crawler blocked by robots.txt can't read
 * that directive (the URL could still surface, bare, in results).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/cart', '/fear/api/', '/unauthorized'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
