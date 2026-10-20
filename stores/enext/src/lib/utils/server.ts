// lib/utils/server.ts — SERVER ONLY (used by server components / generateMetadata).
//
// Runs RTK Query endpoints against a throwaway store (project convention) and
// wraps them in React `cache()` so generateMetadata + the page body + generateStaticParams
// share ONE request per render instead of firing the API 2-3 times.
import 'server-only';
import { cache } from 'react';
import { makeStore } from '@/lib/redux/store';
import { blogApi, type BlogPost } from '@/lib/redux/api/blogApi';

export const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const getBlogPost = cache(async (id: string): Promise<BlogPost | null> => {
    const store = makeStore();
    const sub = store.dispatch(blogApi.endpoints.getBlogPostById.initiate(id));
    try {
        const { data, error } = await sub;
        if (data) return data;
        const status = error && 'status' in error ? error.status : undefined;
        if (status === 404) return null;
        throw new Error(`[blog] failed to load post "${id}" (status: ${String(status ?? 'unknown')})`);
    } finally {
        sub.unsubscribe(); // release the cache subscription on the throwaway store
    }
});

/** Non-critical (related posts / static params) — degrade to [] instead of failing the page. */
export const getBlogPosts = cache(async (limit = 7): Promise<BlogPost[]> => {
    const store = makeStore();
    const sub = store.dispatch(blogApi.endpoints.getAllBlogPosts.initiate({ sortBy: 'desc', limit }));
    try {
        const { data } = await sub;
        return (data ?? []).slice(0, limit);
    } catch {
        return [];
    } finally {
        sub.unsubscribe();
    }
});