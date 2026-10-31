import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';
import { getAllProductsServer, getBlogPostsServer } from '@/lib/seo/data';

// Rebuild at most hourly; new products/posts appear in the sitemap within the hour.
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/login', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/register', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/returns', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/shipping', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.1, changeFrequency: 'yearly' },
];

const toDate = (v: unknown): Date | undefined => {
  if (typeof v !== 'string') return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getAllProductsServer(), getBlogPostsServer()]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = products
    .map((p) => ({ id: p._id ?? p.id, p }))
    .filter((x): x is { id: string; p: (typeof products)[number] } => Boolean(x.id))
    .map(({ id, p }) => ({
      url: `${SITE_URL}/product/${id}`,
      lastModified: toDate(p.updatedAt) ?? toDate(p.createdAt) ?? now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: p.images?.[0]?.url
        ? [/^https?:\/\//i.test(p.images[0].url) ? p.images[0].url : `${SITE_URL}${p.images[0].url}`]
        : undefined,
    }));

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((b) => b._id)
    .map((b) => ({
      url: `${SITE_URL}/blog/${b._id}`,
      lastModified: toDate(b.publishedDate) ?? toDate(b.createdAt) ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...productEntries, ...postEntries];
}
