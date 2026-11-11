'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  type WishlistInput,
} from '@/lib/redux/api/wishlistApi';

export type WishlistToggleResult = 'added' | 'removed' | 'login';

export function useWishlist() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // All callers share one cached request; guests never hit the endpoint.
  const { data: items = [], isLoading } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const byProductId = useMemo(() => new Map(items.map((i) => [i.productId, i])), [items]);

  const isInWishlist = useCallback((productId: string) => byProductId.has(productId), [byProductId]);

  const toggle = useCallback(
    async (product: WishlistInput): Promise<WishlistToggleResult> => {
      if (!isAuthenticated) {
        const params = new URLSearchParams({
          from: pathname,
          message: 'Please login to add items to your wishlist',
        });
        router.push(`/login?${params.toString()}`);
        return 'login';
      }
      const existing = byProductId.get(product.productId);
      if (existing) {
        await removeFromWishlist(existing.id).unwrap();
        return 'removed';
      }
      await addToWishlist(product).unwrap();
      return 'added';
    },
    [isAuthenticated, pathname, router, byProductId, addToWishlist, removeFromWishlist],
  );

  return { items, count: items.length, isLoading, isInWishlist, toggle };
}
