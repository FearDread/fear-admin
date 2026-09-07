/**
 * app/blog/[id]/page.tsx
 *
 * RECONSTRUCTION — merge against the real file, don't overwrite.
 *
 * Thin server component: generateMetadata + ISR only, same split as
 * app/product/[id]/page.tsx. No generateStaticParams here — unlike the
 * legal pages (fixed set of slugs known at build time), blog post ids are
 * open-ended and best left to on-demand ISR at request time.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { makeStore } from '@/lib/redux/store';
import { blogApi } from '@/lib/redux/api/blogApi';
import BlogPostClient from './BlogPostClient';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const store = makeStore();
    const { data: post } = await store.dispatch(blogApi.endpoints.getBlogPostById.initiate(id));

    if (!post) {
        return { title: 'Post Not Found | eFear' };
    }

    const description = (post.excerpt || post.content || '').replace(/<[^>]+>/g, '').slice(0, 155);

    return {
        title: `${post.title} | eFear Blog`,
        description,
        alternates: { canonical: `https://efear.store/blog/${id}` },
        openGraph: {
            title: post.title,
            description,
            url: `https://efear.store/blog/${id}`,
            type: 'article',
            images: post.images?.[0]?.url ? [post.images[0].url] : undefined,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { id } = await params;
    const store = makeStore();

    const [postResult, postsResult] = await Promise.all([
        store.dispatch(blogApi.endpoints.getBlogPostById.initiate(id)),
        store.dispatch(blogApi.endpoints.getBlogPosts.initiate(undefined)),
    ]);

    if (!postResult.data) {
        notFound();
    }

    return (
        <BlogPostClient
            id={id}
            initialPost={postResult.data}
            initialPosts={postsResult.data ?? []}
        />
    );
}