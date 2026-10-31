/**
 * Server-side data access for SEO surfaces (sitemap, metadata, JSON-LD).
 *
 * Per project convention these go through RTK Query using a throwaway
 * `makeStore()` per call — no raw fetch. React `cache()` de-dupes calls
 * within one request, so `generateMetadata` and the page body share one
 * network round-trip.
 *
 * All helpers swallow errors and return null/[] so a backend hiccup degrades
 * the sitemap/metadata instead of failing the build or the request.
 */
import { cache } from 'react';
import { makeStore } from '@/lib/redux/store';
import { productsApi } from '@/lib/redux/api/productsApi';
import { blogApi } from '@/lib/redux/api/blogApi';
import type { Product } from '@/types/product';
import type { BlogPost } from '@/lib/redux/api/blogApi';

export const getAllProductsServer = cache(async (): Promise<Product[]> => {
  const store = makeStore();
  try {
    return await store.dispatch(productsApi.endpoints.getAllProducts.initiate(undefined)).unwrap();
  } catch {
    return [];
  }
});

export const getProductServer = cache(async (id: string): Promise<Product | null> => {
  const store = makeStore();
  try {
    return await store.dispatch(productsApi.endpoints.getProductById.initiate(id)).unwrap();
  } catch {
    return null;
  }
});

export const getBlogPostsServer = cache(async (): Promise<BlogPost[]> => {
  const store = makeStore();
  try {
    return await store.dispatch(blogApi.endpoints.getBlogPosts.initiate(undefined)).unwrap();
  } catch {
    return [];
  }
});

export const getBlogPostServer = cache(async (id: string): Promise<BlogPost | null> => {
  const store = makeStore();
  try {
    return await store.dispatch(blogApi.endpoints.getBlogPostById.initiate(id)).unwrap();
  } catch {
    return null;
  }
});
