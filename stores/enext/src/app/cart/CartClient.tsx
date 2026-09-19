'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useLazyGetShippingEstimateQuery,
} from '@/lib/redux/api/cartApi';

const PLACEHOLDER_IMAGE = '/assets/images/products/placeholder.png';

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia'];

const formatEta = (days: number) => (days === 1 ? 'next day' : `up to ${days} days`);

/**
 * The cart endpoints reject with the FEAR envelope ({ success: false, message }),
 * e.g. "Only 3 in stock" or "This coupon has expired". RTK Query surfaces that
 * as `error.data.message`, so show the server's wording instead of a generic one.
 */
const getErrorMessage = (err: unknown, fallback: string) =>
  (err as { data?: { message?: string } } | undefined)?.data?.message ?? fallback;

export default function CartClient() {
  // Coupon / shipping-estimate inputs are pure local UI state — not persisted
  // anywhere until submit, so they stay in useState rather than the cache or a slice.
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);

  const { data: cart, isLoading, isFetching, isError, refetch } = useGetCartQuery();

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemovingCoupon }] = useRemoveCouponMutation();
  const [
    estimateShipping,
    { data: shippingOptions, error: shippingError, isFetching: isEstimating },
  ] = useLazyGetShippingEstimateQuery();

  const handleQuantityChange = async (itemId: string, nextQuantity: number) => {
    if (nextQuantity < 1) return;
    setCartError(null);
    try {
      await updateCartItem({ itemId, quantity: nextQuantity }).unwrap();
    } catch (err) {
      // e.g. 409 "Only N in stock". The optimistic quantity is rolled back by
      // cartApi; refetch so a server-side prune/clamp shows up too.
      setCartError(getErrorMessage(err, "We couldn't update that item. Please try again."));
      refetch();
    }
  };

  const handleRemove = async (itemId: string) => {
    setCartError(null);
    try {
      await removeCartItem(itemId).unwrap();
    } catch (err) {
      setCartError(getErrorMessage(err, "We couldn't remove that item. Please try again."));
      refetch();
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Remove everything from your cart?')) return;
    setCartError(null);
    try {
      await clearCart().unwrap();
    } catch (err) {
      setCartError(getErrorMessage(err, "We couldn't clear your cart. Please try again."));
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError(null);
    try {
      await applyCoupon({ code: couponCode.trim() }).unwrap();
      setCouponCode('');
    } catch (err) {
      setCouponError(getErrorMessage(err, 'That coupon code is invalid or expired.'));
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError(null);
    try {
      await removeCoupon().unwrap();
    } catch (err) {
      setCouponError(getErrorMessage(err, "We couldn't remove that coupon. Please try again."));
    }
  };

  const handleEstimateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode.trim()) return;
    // `true` = reuse the cached answer if the same ZIP/country was already asked.
    estimateShipping({ postalCode: postalCode.trim(), country }, true);
  };

  // ── Loading state ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '40vh' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────
  if (isError || !cart) {
    return (
      <div className="container py-5 text-center">
        <h1 className="fs-3 mb-3">We couldn&apos;t load your cart</h1>
        <p className="text-muted mb-4">
          Something went wrong fetching your cart. Please try again.
        </p>
        <button className="btn btn-primary" onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────
  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="fs-3 mb-3">Your cart is empty</h1>
        <p className="text-muted mb-4">
          Looks like you haven&apos;t added any comics, manga, or collectibles yet.
        </p>
        <Link href="/shop" className="btn btn-primary">
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-3 mb-0">Your Cart ({cart.itemCount})</h1>
        <button
          className="btn btn-link text-danger p-0"
          onClick={handleClearCart}
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Clear Cart'}
        </button>
      </div>

      <div className="row g-4">
        {/* ── Cart items ──────────────────────────────────────────────── */}
        <div className="col-lg-8">
          {cartError && (
            <div
              className="alert alert-danger d-flex justify-content-between align-items-start"
              role="alert"
            >
              <span>{cartError}</span>
              <button
                type="button"
                className="btn-close"
                aria-label="Dismiss"
                onClick={() => setCartError(null)}
              />
            </div>
          )}

          <ul className="list-unstyled d-flex flex-column gap-3">
            {cart.items.map((item) => (
              <li key={item.id} className="d-flex gap-3 border rounded p-3">
                <div
                  className="flex-shrink-0"
                  style={{ width: 88, height: 88, position: 'relative' }}
                >
                  <Image
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    fill
                    sizes="88px"
                    className="rounded object-fit-cover"
                  />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Link
                        href={`/product/${item.productId}`}
                        className="fw-semibold text-decoration-none"
                      >
                        {item.name}
                      </Link>
                      {item.variant && <p className="text-muted small mb-1">{item.variant}</p>}
                      <p className="text-muted small mb-0">${item.price.toFixed(2)} each</p>
                    </div>
                    <p className="fw-semibold mb-0">${item.lineTotal.toFixed(2)}</p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <div className="input-group input-group-sm" style={{ width: 120 }}>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isFetching || item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="form-control text-center">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isFetching}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-link text-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                      disabled={isFetching}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Order summary ───────────────────────────────────────────── */}
        <div className="col-lg-4">
          <div className="border rounded p-4">
            <h2 className="fs-5 mb-3">Order Summary</h2>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>

            {cart.discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount{cart.coupon ? ` (${cart.coupon.code})` : ''}</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between fw-semibold mb-1">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <p className="text-muted small mb-3">Shipping and tax are calculated at checkout.</p>

            {/* ── Coupon ──────────────────────────────────────────────── */}
            {cart.coupon ? (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center bg-light rounded p-2">
                  <span className="small">
                    Coupon <strong>{cart.coupon.code}</strong> applied
                  </span>
                  <button
                    className="btn btn-link btn-sm text-danger p-0"
                    onClick={handleRemoveCoupon}
                    disabled={isRemovingCoupon}
                  >
                    Remove
                  </button>
                </div>
                {couponError && <p className="text-danger small mt-1 mb-0">{couponError}</p>}
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="mb-3">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplyingCoupon}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="submit"
                    disabled={isApplyingCoupon || !couponCode.trim()}
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-danger small mt-1 mb-0">{couponError}</p>}
              </form>
            )}

            {/* ── Shipping estimate (GET /cart/shipping-estimate) ─────── */}
            <form onSubmit={handleEstimateShipping} className="mb-3">
              <label className="form-label small text-muted mb-1" htmlFor="cart-ship-zip">
                Estimate shipping
              </label>
              <select
                className="form-select form-select-sm mb-2"
                aria-label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isEstimating}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="input-group input-group-sm">
                <input
                  id="cart-ship-zip"
                  type="text"
                  className="form-control"
                  placeholder="ZIP / postal code"
                  autoComplete="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={isEstimating}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="submit"
                  disabled={isEstimating || !postalCode.trim()}
                >
                  {isEstimating ? 'Checking...' : 'Estimate'}
                </button>
              </div>

              {shippingError && (
                <p className="text-danger small mt-1 mb-0">
                  {getErrorMessage(
                    shippingError,
                    "We couldn't estimate shipping for that address.",
                  )}
                </p>
              )}

              {!shippingError && shippingOptions && (
                <ul className="list-unstyled small mt-2 mb-0">
                  {shippingOptions.map((option) => (
                    <li key={option.method} className="d-flex justify-content-between">
                      <span>
                        {option.method}{' '}
                        <span className="text-muted">· {formatEta(option.estimatedDays)}</span>
                      </span>
                      <span>{option.cost === 0 ? 'FREE' : `$${option.cost.toFixed(2)}`}</span>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            {/* Disabled mid-mutation so checkout never starts from stale totals. */}
            <Link
              href="/checkout/details"
              className={`btn btn-primary w-100${isFetching ? ' disabled' : ''}`}
              aria-disabled={isFetching}
              tabIndex={isFetching ? -1 : undefined}
            >
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="btn btn-link w-100 mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
