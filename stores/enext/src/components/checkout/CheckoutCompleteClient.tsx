'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGetOrderByIdQuery } from '@/lib/redux/api/ordersApi';

/**
 * BEHAVIOUR CHANGE from the CRA version: the original read the completed order
 * out of `location.state?.order`, which only exists if you arrived via a client
 * `navigate('/checkout/complete', { state: { order } })` call — refreshing the
 * page or opening the confirmation link in a new tab lost the order entirely and
 * bounced you to `/cart`.
 *
 * This version reads the order id from `?order=<id>` (set by CheckoutReview after
 * `createOrder` succeeds) and fetches it via `ordersApi`, so the confirmation page
 * is a real, shareable, refreshable URL — which also matters for order-confirmation
 * emails linking back to it.
 */
export default function CheckoutCompleteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const { data: orderDetails, isLoading, isError } = useGetOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  });

  useEffect(() => {
    if (!orderId || isError) router.replace('/cart');
  }, [orderId, isError, router]);

  const formatDate = (ds?: string) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !orderDetails) {
    return (
      <div className="co-page">
        <div className="efear-container">
          <div className="co-loading-screen">
            <div className="co-pay-spinner" />
            <span className="co-loading-txt">Loading confirmation...</span>
          </div>
        </div>
      </div>
    );
  }

  const addr = orderDetails.shippingAddress;
  const orderNumber = orderDetails.orderNumber ?? orderDetails._id ?? '—';

  return (
    <>
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link href="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/cart" className="co-crumb-link">Checkout</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Complete</span>
          </nav>
          <span className="co-crumb-title">Order Confirmation</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-complete-hero">
            <div className="co-complete-icon">✓</div>
            <h1 className="co-complete-title">Order Confirmed!</h1>
            <p className="co-complete-sub">Thank you for your purchase — your gear is on its way.</p>

            <div className="co-order-pill">
              <span className="co-order-pill-label">Order #</span>
              <span className="co-order-pill-num">{orderNumber}</span>
            </div>

            {orderDetails.customerEmail && (
              <p className="co-email-note">
                Confirmation sent to <strong>{orderDetails.customerEmail}</strong>
              </p>
            )}
          </div>

          <div className="co-complete-card">
            <div className="co-complete-order-meta">
              <div className="co-complete-meta-item">
                <div className="co-complete-meta-label">Order Number</div>
                <div className="co-complete-meta-val">{orderNumber}</div>
              </div>
              <div className="co-complete-meta-item" style={{ textAlign: 'right' }}>
                <div className="co-complete-meta-label">Order Date</div>
                <div className="co-complete-meta-val">{formatDate(orderDetails.createdAt)}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #222222' }}>
              <div className="co-complete-card-head">
                <h3 className="co-section-title">Items Ordered ({orderDetails.items?.length || 0})</h3>
              </div>
              <div className="co-review-items">
                {orderDetails.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="co-review-item">
                    <img src={item.image || 'assets/images/products/placeholder.png'} alt={item.name} className="co-review-img" />
                    <div>
                      <p className="co-review-name">{item.name}</p>
                      <p className="co-review-meta">${item.price?.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div>
                      <p className="co-review-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {orderDetails.items?.length > 3 && (
                  <div style={{ padding: '.75rem 1.5rem', borderTop: '1px solid #222222' }}>
                    <p className="co-mini-more">+{orderDetails.items.length - 3} more items</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #222222' }}>
              <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                {[
                  { label: 'Subtotal', val: `$${orderDetails.subtotal?.toFixed(2)}` },
                  { label: 'Shipping', val: orderDetails.shipping === 0 ? 'FREE' : `$${orderDetails.shipping?.toFixed(2)}` },
                  { label: 'Tax', val: `$${orderDetails.taxes?.toFixed(2)}` },
                  ...(orderDetails.discount > 0
                    ? [{ label: 'Discount', val: `-$${orderDetails.discount?.toFixed(2)}`, teal: true }]
                    : []),
                ].map(({ label, val, teal }) => (
                  <div key={label} className="co-total-row">
                    <span className="co-total-label">{label}</span>
                    <span className={`co-total-val${teal ? ' teal' : ''}`}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="co-divider" />
              <div className="co-grand-row">
                <span className="co-grand-label">Order Total</span>
                <span className="co-grand-val">${orderDetails.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="co-info-grid" style={{ borderTop: '1px solid #222222', padding: '1.25rem 1.5rem' }}>
              <div className="co-info-block">
                <p className="co-info-eyebrow">📍 Shipping Address</p>
                {addr?.firstName ? (
                  <p className="co-info-line">
                    <strong>
                      {addr.firstName} {addr.lastName}
                    </strong>
                    {addr.line1}
                    {addr.line2 && (
                      <>
                        <br />
                        {addr.line2}
                      </>
                    )}
                    <br />
                    {addr.city}, {addr.state} {addr.zipCode}
                    <br />
                    {addr.country}
                    {addr.phone && (
                      <>
                        <br />
                        {addr.phone}
                      </>
                    )}
                  </p>
                ) : (
                  <p className="co-info-line">No address available</p>
                )}
              </div>
              <div className="co-info-block">
                <p className="co-info-eyebrow">💳 Payment Method</p>
                <p className="co-info-line">
                  <strong>{orderDetails.paymentMethod === 'paypal-payment' ? 'PayPal' : 'Credit Card'}</strong>
                  Payment processed securely
                </p>
                {orderDetails.paymentIntentId && (
                  <p className="co-info-line" style={{ marginTop: '.5rem', fontSize: '.62rem', color: 'rgba(255,255,255,0.22)' }}>
                    TXN: {orderDetails.paymentIntentId}
                  </p>
                )}
                <div className="co-payment-badge" style={{ marginTop: '.75rem' }}>✓ Authorised</div>
              </div>
            </div>

            <div className="co-whats-next">
              <h3 className="co-whats-next-title">What Happens Next?</h3>
              <ul className="co-whats-next-list">
                <li>Your order is being prepared for shipment</li>
                <li>You&apos;ll receive a shipping notification with tracking info</li>
                <li>Estimated delivery: {orderDetails.estimatedDelivery || '3-5 business days'}</li>
                <li>Track your order anytime from your account dashboard</li>
              </ul>
            </div>

            <div className="co-complete-actions">
              <button onClick={() => router.push('/shop')} className="cart-dd-btn-primary" style={{ padding: '.75rem 1.75rem' }}>
                Continue Shopping
              </button>
              <button onClick={() => router.push('/account/orders')} className="cart-dd-btn-ghost" style={{ padding: '.75rem 1.75rem' }}>
                View All Orders
              </button>
              <button onClick={() => window.print()} className="cart-dd-btn-ghost" style={{ padding: '.75rem 1.75rem' }}>
                Print Receipt
              </button>
            </div>

            <div className="co-support-row">
              <a href="mailto:support@efear.com" className="cart-dd-btn-ghost" style={{ padding: '.5rem 1rem', fontSize: '.62rem', textDecoration: 'none' }}>
                ✉ Email Support
              </a>
              <a href="tel:+1234567890" className="cart-dd-btn-ghost" style={{ padding: '.5rem 1rem', fontSize: '.62rem', textDecoration: 'none' }}>
                ☎ Call Us
              </a>
              <button
                onClick={() => router.push(`/account/orders/${orderDetails._id ?? orderNumber}`)}
                className="cart-dd-btn-ghost"
                style={{ padding: '.5rem 1rem', fontSize: '.62rem' }}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
