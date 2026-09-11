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
} from '@/lib/redux/api/cartApi';

export default function CartClient() {
    // Coupon input is pure local UI state — not persisted anywhere until submit,
    // so it stays in useState rather than the RTK Query cache or a slice.
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState<string | null>(null);

    const { data: cart, isLoading, isFetching, isError, refetch } = useGetCartQuery();

    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeCartItem] = useRemoveCartItemMutation();
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
    const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
    const [removeCoupon, { isLoading: isRemovingCoupon }] = useRemoveCouponMutation();

    const handleQuantityChange = (itemId: string, nextQuantity: number) => {
        if (nextQuantity < 1) return;
        updateCartItem({ itemId, quantity: nextQuantity });
    };

    const handleRemove = (itemId: string) => {
        removeCartItem(itemId);
    };

    const handleClearCart = () => {
        if (window.confirm('Remove everything from your cart?')) {
            clearCart();
        }
    };

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setCouponError(null);
        try {
            await applyCoupon({ code: couponCode.trim() }).unwrap();
            setCouponCode('');
        } catch {
            setCouponError('That coupon code is invalid or expired.');
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
    };

    // ── Loading state ─────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="container py-5">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
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
                <p className="text-muted mb-4">Something went wrong fetching your cart. Please try again.</p>
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
                <p className="text-muted mb-4">Looks like you haven&apos;t added any comics, manga, or collectibles yet.</p>
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
                    <ul className="list-unstyled d-flex flex-column gap-3">
                        {cart.items.map((item) => (
                            <li key={item.id} className="d-flex gap-3 border rounded p-3">
                                <div className="flex-shrink-0" style={{ width: 88, height: 88, position: 'relative' }}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="88px"
                                        className="rounded object-fit-cover"
                                    />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <Link href={`/product/${item.productId}`} className="fw-semibold text-decoration-none">
                                                {item.name}
                                            </Link>
                                            {item.variant && (
                                                <p className="text-muted small mb-1">{item.variant}</p>
                                            )}
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

                        <div className="d-flex justify-content-between fw-semibold mb-3">
                            <span>Total</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>

                        {/* ── Coupon ──────────────────────────────────────────────── */}
                        {cart.coupon ? (
                            <div className="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-3">
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
                        ) : (
                            <form onSubmit={handleApplyCoupon} className="mb-3">
                                <div className="input-group input-group-sm">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Coupon code"
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

                        <Link href="/checkout" className="btn btn-primary w-100">
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