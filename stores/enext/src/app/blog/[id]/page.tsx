/**
 * app/blog/[id]/page.tsx
 *
 * Thin server component: metadata + JSON-LD + ISR. Data comes from RTK Query via
 * lib/blog/server.ts (cached per request). All interactivity lives in BlogPostClient.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts, stripHtml } from '@/lib/utils/server';
import { SITE_URL, SITE_NAME, absoluteUrl } from '@/lib/utils/site';
import BlogPostClient from './BlogPostClient';

export const revalidate = 60;
export const dynamicParams = true; // posts not pre-built below are rendered on demand, then cached (ISR)

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-build the most recent posts at build time; everything else is on-demand ISR.
// getBlogPosts() returns [] if the API is unreachable, so a backend outage never fails `next build`.
export async function generateStaticParams() {
  const posts = await getBlogPosts(50);
  return posts.map((p) => ({ id: p._id ?? p.id })).filter((p): p is { id: string } => Boolean(p.id));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    return { title: `Post Not Found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  const description = stripHtml(post.excerpt || post.content).slice(0, 155);
  const url = `${SITE_URL}/blog/${id}`;
  const image = post.images?.[0]?.url ? absoluteUrl(post.images[0].url) : undefined;
  const published = post.publishedDate || post.createdAt;

  return {
    title: `${post.title} | ${SITE_NAME} Blog`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: published,
      authors: [post.author || post.authorName || SITE_NAME],
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, posts] = await Promise.all([getBlogPost(id), getBlogPosts(7)]);

  if (!post) notFound();

  const url = `${SITE_URL}/blog/${id}`;
  const image = post.images?.[0]?.url ? absoluteUrl(post.images[0].url) : undefined;
  const published = post.publishedDate || post.createdAt;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: stripHtml(post.excerpt || post.content).slice(0, 155),
      image: image ? [image] : undefined,
      datePublished: published,
      dateModified: post.updatedAt || published,
      author: { '@type': 'Person', name: post.author || post.authorName || SITE_NAME },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/images/fear/efear-logo.png') },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // `<` escaped so post content can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogPostClient id={id} initialPost={post} initialPosts={posts} />
    </>
  );
}
