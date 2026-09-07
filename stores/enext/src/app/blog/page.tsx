import type { Metadata } from 'next';
import { makeStore } from '@/lib/redux/store';
import { blogApi, type BlogPost } from '@/lib/redux/api/blogApi';
import { categoriesApi } from '@/lib/redux/api/categoriesApi';
import BlogClient from './BlogClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Blog | eFear',
        description:
            'News, reviews, and deep dives on comics, manga, trading cards, and collectibles from eFear.',
        alternates: { canonical: 'https://efear.store/blog' },
        openGraph: {
            title: 'The eFear Blog',
            description:
                'News, reviews, and deep dives on comics, manga, trading cards, and collectibles.',
            url: 'https://efear.store/blog',
            type: 'website',
        },
    };
}

export default async function BlogPage() {
    // Throwaway store instance for one-shot server-side RTK Query fetches —
    // same pattern as the product detail page. No full store hydration.
    const store = makeStore();

    const [postsResult, categoriesResult] = await Promise.all([
        store.dispatch(blogApi.endpoints.getBlogPosts.initiate(undefined)),
        store.dispatch(categoriesApi.endpoints.getAllCategories.initiate(undefined)),
    ]);

    const initialPosts: BlogPost[] = postsResult.data ?? [];
    const initialCategories = categoriesResult.data ?? [];

    return <BlogClient initialPosts={initialPosts} initialCategories={initialCategories} />;
}