'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsAuthenticated, selectIsAuthHydrating } from '@/lib/redux/slices/authSlice';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
  type WishlistItem as BaseWishlistItem,
} from '@/lib/redux/api/wishlistApi';
import Toast, { type ToastType } from '@/components/common/Toast';
import ProductCarousel from '@/components/products/ProductCarousel';
import { wishlistStyles } from '@/components/wishlist/styles';

// `category` is rendered below but missing from wishlistApi's interface.
// Add `category?: string` there, then this alias can go.
type WishlistItem = BaseWishlistItem & { category?: string };

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const LOGIN_URL = `/login`;

export default function WishlistClient() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrating = useAppSelector(selectIsAuthHydrating);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();

  const [pending, setPending] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);
  const ready = !isHydrating && isAuthenticated;
  const addToast = (message: string, type: ToastType) =>
    setToasts((prev) => [...prev, { id: ++toastId.current, message, type }]);
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const setBusy = (id: string, busy: boolean) =>
    setPending((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  // Single guard: wait for hydration, then redirect (preserving where the user was going).
  useEffect(() => {
    if (!isHydrating && !isAuthenticated) router.replace(LOGIN_URL);
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
      // Matches wishlistApi.moveToCart's body: { productId, quantity }.
      await moveToCart({ productId: item.productId, quantity: 1 }).unwrap();
      addToast('Moved to cart!', 'success');
    } catch {
      addToast('Could not move item to cart.', 'error');
    } finally {
      setBusy(item.id, false);
    }
  };

  // Still checking the session.
  if (isHydrating) {
    return (
      <>
        <style>{wishlistStyles}</style>
        <div className="wl-state">
          <div className="wl-spinner" />
          <span className="wl-state-label">Checking your session…</span>
        </div>
      </>
    );
  }

  // Hydrated and logged out: redirect is in flight, but never show an endless
  // spinner. Give a manual way out in case navigation stalls.
  if (!isAuthenticated) {
    return (
      <>
        <style>{wishlistStyles}</style>
        <div className="wl-state">
          <h2 className="wl-state-title">Please sign in</h2>
          <Link href={LOGIN_URL} className="wl-btn-primary">
            Go to Login
          </Link>
        </div>
      </>
    );
  }

    const sessionExpired = !isAuthenticated;

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

{
    !ready && (
            <div className="wl-state">
              <h2 className="wl-state-title">
                {sessionExpired
                  ? 'Your session has expired'
                  : 'We couldn\u2019t load your wishlist'}
              </h2>
    {
        !ready ? (
                <Link href={LOGIN_URL} className="wl-btn-primary">
                  Sign in again
                </Link>
              ) : (
                <button className="wl-btn-primary" onClick={() => refetch()}>
                  Try Again
                </button>
              )}
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
              {items.map((item: WishlistItem) => {
                const id = String(item.id ?? item.productId);
                const busy = pending.has(id) || id.startsWith('temp-');
                const hasDiscount = !!item.originalPrice && item.originalPrice > item.price;
                return (
                  <li key={id} className="wl-card">
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
                          onClick={() => handleMoveToCart({ ...item, id })}
                          disabled={busy}
                        >
                          {busy ? '…' : 'Move to Cart'}
                        </button>
                        <button
                          className="wl-btn-ghost"
                          onClick={() => handleRemove({ ...item, id })}
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
