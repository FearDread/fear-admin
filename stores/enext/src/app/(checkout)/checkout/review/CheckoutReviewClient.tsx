'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { useGetCartQuery } from '@/features/api/cartApi';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useCreateOrderMutation } from '@/features/api/ordersApi';
import { selectCheckout, resetCheckout } from '@/features/checkout/checkoutSlice';
import { useCheckoutTotals } from '@/lib/useCheckoutTotals';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';

export default function CheckoutReviewClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: cart } = useGetCartQuery();
  const cartItems = cart?.items ?? [];

  const currentUser = useAppSelector(selectCurrentUser);
  const draft = useAppSelector(selectCheckout);

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const { subtotal, taxes, discount, shipping, total } = useCheckoutTotals({
    items: cartItems,
    shippingCost: draft.shippingCost,
    discount: draft.discount,
  });

  useEffect(() => {
    if (cart && cartItems.length === 0) router.replace('/shop');
  }, [cart, cartItems.length, router]);

  useEffect(() => {
    if (!draft.shippingAddress?.line1) {
      router.replace('/checkout/details');
      return;
    }
    if (!draft.paymentIntentId && draft.paymentMethod !== 'paypal-payment') {
      router.replace('/checkout/payment');
    }
  }, [draft.shippingAddress, draft.paymentIntentId, draft.paymentMethod, router]);

  const handleCompleteOrder = async () => {
    if (!draft.paymentIntentId && draft.paymentMethod !== 'paypal-payment') {
      router.replace('/checkout/payment');
      return;
    }
    if (!currentUser) return;

    setIsProcessingOrder(true);
    try {
      const finalOrder = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: draft.shippingAddress ?? undefined,
        billingAddress: draft.billingAddress ?? undefined,
        shippingMethodId: draft.shippingMethodId ?? undefined,
        shippingMethod:
          draft.shippingMethodId === 'standard'
            ? 'Standard Shipping'
            : draft.shippingMethodId ?? undefined,
        estimatedDelivery: draft.estimatedDelivery ?? undefined,
        subtotal,
        shipping,
        taxes,
        discount,
        total,
        userId: currentUser._id,
        customerEmail: currentUser.email,
        customerName: `${currentUser.firstName} ${currentUser.lastName}`,
        paymentMethod: draft.paymentMethod ?? undefined,
        paymentIntentId: draft.paymentIntentId ?? undefined,
        orderStatus: 'processing' as const,
        paymentStatus: 'completed' as const,
      };

      const createdOrder = await createOrder(finalOrder).unwrap();
      dispatch(resetCheckout());
      router.push(`/checkout/complete?order=${createdOrder._id ?? createdOrder.orderNumber}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const shippingAddress = draft.shippingAddress;
  const billingAddress = draft.billingAddress ?? shippingAddress;

  return (
    <>
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link href="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/checkout/details" className="co-crumb-link">Details</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/checkout/payment" className="co-crumb-link">Payment</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Review</span>
          </nav>
          <span className="co-crumb-title">Review Order</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-layout">
            <div>
              <CheckoutSteps currentStep="review" />

              <div className="co-panel">
                <div className="co-panel-head">
                  <h2 className="co-section-title">Review Your Order</h2>
                </div>
                <div className="co-review-items">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="co-review-item">
                      <img src={item.image || 'assets/images/products/placeholder.png'} alt={item.name} className="co-review-img" />
                      <div>
                        <p className="co-review-name">{item.name}</p>
                        {item.size && <p className="co-review-meta">Size: {item.size}</p>}
                        {item.color && <p className="co-review-meta">Color: {item.color}</p>}
                        <p className="co-review-qty">Qty: {item.quantity}</p>
                      </div>
                      <div>
                        <p className="co-review-price">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="co-review-unit">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="co-panel" style={{ marginTop: '1rem' }}>
                <div className="co-panel-head">
                  <h2 className="co-section-title">Shipping &amp; Payment</h2>
                </div>
                <div className="co-info-grid">
                  <div className="co-info-block">
                    <p className="co-info-eyebrow">Shipping Address</p>
                    {shippingAddress?.firstName ? (
                      <p className="co-info-line">
                        <strong>
                          {shippingAddress.firstName} {shippingAddress.lastName}
                        </strong>
                        {shippingAddress.line1}
                        {shippingAddress.line2 && (
                          <>
                            <br />
                            {shippingAddress.line2}
                          </>
                        )}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                        <br />
                        {shippingAddress.country}
                        {shippingAddress.phone && (
                          <>
                            <br />
                            {shippingAddress.phone}
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="co-info-line" style={{ color: '#b30e1c' }}>⚠ No address on file</p>
                    )}
                  </div>
                  <div className="co-info-block">
                    <p className="co-info-eyebrow">Payment Method</p>
                    <p className="co-info-line">
                      <strong>{draft.paymentMethod === 'paypal-payment' ? 'PayPal' : 'Credit Card'}</strong>
                      Payment processed securely
                    </p>
                    {draft.paymentIntentId && <div className="co-payment-badge">✓ Payment Authorised</div>}
                  </div>
                </div>
              </div>

              <div className="co-panel" style={{ marginTop: '1rem' }}>
                <div className="co-panel-head">
                  <h2 className="co-section-title">Shipping Method</h2>
                </div>
                <div className="co-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>📦</span>
                  <div>
                    <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.78rem', color: 'rgba(255,255,255,0.92)', margin: '0 0 .2rem' }}>
                      {draft.shippingMethodId ? draft.shippingMethodId : 'Standard Shipping'}
                    </p>
                    <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,0.32)', margin: 0, letterSpacing: '.08em' }}>
                      Est. delivery: {draft.estimatedDelivery || '2-5 business days'}
                    </p>
                  </div>
                </div>
                <div className="co-nav-btns">
                  <button onClick={() => router.push('/checkout/payment')} disabled={isProcessingOrder} className="cart-dd-btn-ghost" style={{ padding: '.65rem' }}>
                    ← Back to Payment
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isProcessingOrder || cartItems.length === 0}
                    className="cart-dd-btn-primary"
                    style={{ padding: '.65rem' }}
                  >
                    {isProcessingOrder ? (
                      <>
                        <span className="co-pay-spinner" style={{ width: '14px', height: '14px', marginRight: '.5rem', display: 'inline-block' }} />
                        Processing...
                      </>
                    ) : (
                      'Complete Order →'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="co-sidebar">
              <div className="co-sidebar-panel accent-top">
                <p className="co-sidebar-title">Order Summary</p>
                <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                  {[
                    { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', val: shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE' },
                    { label: 'Tax (7%)', val: `$${taxes.toFixed(2)}` },
                    ...(discount > 0 ? [{ label: 'Discount', val: `-$${discount.toFixed(2)}`, teal: true }] : []),
                  ].map(({ label, val, teal }) => (
                    <div key={label} className="co-total-row">
                      <span className="co-total-label">{label}</span>
                      <span className={`co-total-val${teal ? ' teal' : ''}`}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="co-divider" />
                <div className="co-grand-row" style={{ marginBottom: '1.25rem' }}>
                  <span className="co-grand-label">Order Total</span>
                  <span className="co-grand-val">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessingOrder || cartItems.length === 0}
                  className="auth-submit"
                  style={{ marginTop: 0 }}
                >
                  {isProcessingOrder ? 'Processing...' : 'Complete Order →'}
                </button>
                <p className="co-terms-note">By completing this order you agree to our terms and conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
