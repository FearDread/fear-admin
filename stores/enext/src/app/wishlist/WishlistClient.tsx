'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsAuthenticated, selectIsAuthHydrating } from '@/lib/redux/slices/authSlice';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
  type WishlistItem,
} from '@/lib/redux/api/wishlistApi';
import Toast, { type ToastType } from '@/components/common/Toast';
import ProductCarousel from '@/components/products/ProductCarousel';
import { wishlistStyles } from '@/components/wishlist/styles';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export default function WishlistClient() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrating = useAppSelector(selectIsAuthHydrating);

  const {
    data: items = [],
    isLoading,
    isError,
    refetch,
  } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();

  const [pending, setPending] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType) =>
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const setBusy = (id: string, busy: boolean) =>
    setPending((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  // Single guard — wait for session hydration before deciding.
  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      const params = new URLSearchParams({
        from: '/wishlist',
        message: 'Please login to view your wishlist',
      });
      router.replace(`/login?${params.toString()}`);
    }
  }, [isHydrating, isAuthenticated, router]);

  const handleRemove = async (item: WishlistItem) => {
    setBusy(item.id, true);
    try {
      await removeFromWishlist(item.id).unwrap();
      addToast('Removed from wishlist', 'info');
    } catch {
      addToast('Could not remove item. Please try again.', 'error');
    } finally {
      setBusy(item.id, false);
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    setBusy(item.id, true);
    try {
      await moveToCart({ id: item.id, productId: item.productId }).unwrap();
      addToast('Moved to cart!', 'success');
    } catch {
      addToast('Could not move item to cart.', 'error');
    } finally {
      setBusy(item.id, false);
    }
  };

  if (isHydrating || !isAuthenticated) {
    return (
      <>
        <style>{wishlistStyles}</style>
        <div className="wl-state">
          <div className="wl-spinner" />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{wishlistStyles}</style>

      <div className="wl-page">
        <section className="wl-hero">
          <div className="wl-hero-stripe" />
          <span className="wl-hero-ghost" aria-hidden="true">WISHLIST</span>
          <div className="wl-hero-inner">
            <nav className="wl-breadcrumb" aria-label="breadcrumb">
              <Link href="/" className="wl-bc-link">Home</Link>
              <span className="wl-bc-sep">✦</span>
              <span className="wl-bc-current">Wishlist</span>
            </nav>
            <span className="wl-eyebrow">Saved for later</span>
            <h1 className="wl-title">
              My <span>Wishlist</span>
            </h1>
            {!isLoading && !isError && (
              <p className="wl-count">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        </section>

        <div className="wl-body">
          {isLoading && (
            <div className="wl-state">
              <div className="wl-spinner" />
              <span className="wl-state-label">Loading wishlist…</span>
            </div>
          )}

          {isError && (
            <div className="wl-state">
              <h2 className="wl-state-title">We couldn&apos;t load your wishlist</h2>
              <button className="wl-btn-primary" onClick={() => refetch()}>
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="wl-state">
              <span className="wl-empty-icon">♡</span>
              <h2 className="wl-state-title">Nothing saved yet</h2>
              <p className="wl-state-label">
                Tap the heart on any comic, manga, or collectible to save it here.
              </p>
              <Link href="/shop" className="wl-btn-primary">
                Browse the Shop
              </Link>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <ul className="wl-grid">
              {items.map((item) => {
                const busy = pending.has(item.id) || item.id.startsWith('temp-');
                const hasDiscount = !!item.originalPrice && item.originalPrice > item.price;
                return (
                  <li key={item.id} className="wl-card">
                    <Link href={`/product/${item.productId}`} className="wl-card-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || '/assets/images/products/placeholder.png'}
                        alt={item.title}
                        width={240}
                        height={320}
                        loading="lazy"
                        className="wl-card-img"
                      />
                    </Link>

                    <div className="wl-card-body">
                      {item.category && <span className="wl-card-cat">{item.category}</span>}
                      <Link href={`/product/${item.productId}`} className="wl-card-name">
                        {item.title}
                      </Link>
                      <div className="wl-card-price">
                        {hasDiscount && (
                          <span className="wl-card-price-old">${item.originalPrice!.toFixed(2)}</span>
                        )}
                        <span>${item.price.toFixed(2)}</span>
                      </div>

                      <div className="wl-card-actions">
                        <button
                          className="wl-btn-primary"
                          onClick={() => handleMoveToCart(item)}
                          disabled={busy}
                        >
                          {busy ? '…' : 'Move to Cart'}
                        </button>
                        <button
                          className="wl-btn-ghost"
                          onClick={() => handleRemove(item)}
                          disabled={busy}
                          aria-label={`Remove ${item.title} from wishlist`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <ProductCarousel />

      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </>
  );
}
