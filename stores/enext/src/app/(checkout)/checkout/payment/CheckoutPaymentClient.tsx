'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { useGetCartQuery } from '@/features/api/cartApi';
import { selectCurrentUser, selectIsAuthenticated } from '@/features/auth/authSlice';
import { useCreatePaymentIntentMutation } from '@/features/api/paymentsApi';
import { selectCheckout, applyDiscount, setPaymentIntent } from '@/features/checkout/checkoutSlice';
import { useCheckoutTotals } from '@/lib/useCheckoutTotals';
import { DISCOUNT_CODES } from '@/types/checkout';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';
import PayPalPaymentForm from '@/components/checkout/PayPalPaymentForm';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import type { PaymentIntent, StripeError } from '@stripe/stripe-js';

const TABS = [
  { id: 'card', label: 'Credit Card', icon: '💳' },
  { id: 'paypal-payment', label: 'PayPal', icon: '🅿' },
  { id: 'net-banking', label: 'Net Banking', icon: '🏦' },
] as const;

export default function CheckoutPaymentClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: cart } = useGetCartQuery();
  const cartItems = cart?.items ?? [];

  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const draft = useAppSelector(selectCheckout);

  const [paymentMethod, setPaymentMethod] = useState<(typeof TABS)[number]['id']>('card');
  const [discountCode, setDiscountCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const { subtotal, taxes, discount, shipping, total } = useCheckoutTotals({
    items: cartItems,
    shippingCost: draft.shippingCost,
    discount: draft.discount,
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login?redirect=/checkout/payment');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (cart && cartItems.length === 0) router.replace('/cart');
  }, [cart, cartItems.length, router]);

  useEffect(() => {
    if (!draft.shippingMethodId) router.replace('/checkout/shipping');
  }, [draft.shippingMethodId, router]);

  useEffect(() => {
    if (paymentMethod !== 'card' || total <= 0 || clientSecret) return;
    createPaymentIntent({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: { userId: currentUser?._id },
    })
      .unwrap()
      .then((result) => setClientSecret(result.client_secret))
      .catch((err) => console.error('Payment intent error:', err));
  }, [paymentMethod, total, clientSecret, createPaymentIntent, currentUser]);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    const pct = DISCOUNT_CODES[discountCode.toUpperCase()];
    if (pct) {
      dispatch(applyDiscount({ code: discountCode.toUpperCase(), amount: (subtotal * pct) / 100 }));
      setDiscountCode('');
      setClientSecret(''); // total changed → old intent's amount is stale, force a fresh one
    }
  };

  const handlePaymentSuccess = ({ paymentIntent }: { paymentIntent: PaymentIntent }) => {
    dispatch(setPaymentIntent({ paymentMethod: 'card', paymentIntentId: paymentIntent.id }));
    router.push('/checkout/review');
  };

  const handlePaymentError = (err: StripeError | Error | unknown) => {
    console.error('Payment error:', err);
    setIsProcessing(false);
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <div className="co-page">
        <div className="efear-container">
          <div className="co-loading-screen">
            <div className="co-pay-spinner" />
            <span className="co-loading-txt">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link href="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/checkout/details" className="co-crumb-link">Details</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/checkout/shipping" className="co-crumb-link">Shipping</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Payment</span>
          </nav>
          <span className="co-crumb-title">Payment</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-layout">
            <div>
              <CheckoutSteps currentStep="payment" />

              <div className="co-panel">
                <div className="co-panel-head">
                  <h2 className="co-section-title">Choose Payment Method</h2>
                </div>

                <div className="co-pay-tabs">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      className={`co-pay-tab${paymentMethod === tab.id ? ' active' : ''}`}
                      onClick={() => setPaymentMethod(tab.id)}
                      type="button"
                    >
                      <span className="co-pay-tab-icon">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="co-pay-body">
                    {clientSecret ? (
                      <StripePaymentForm
                        clientSecret={clientSecret}
                        amount={total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    ) : (
                      <div className="co-pay-loading">
                        <div className="co-pay-spinner" />
                        <span className="co-pay-loading-txt">Initialising secure payment...</span>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'paypal-payment' && (
                  <div className="co-pay-body">
                    <PayPalPaymentForm
                      order={{ ...draft, subtotal, taxes, discount, shipping, total } as never}
                      amount={total}
                      onSuccess={() => {
                        dispatch(setPaymentIntent({ paymentMethod: 'paypal-payment', paymentIntentId: '' }));
                        router.push('/checkout/review');
                      }}
                      onError={handlePaymentError}
                    />
                    <p className="co-pay-coming-soon">PayPal integration coming soon</p>
                  </div>
                )}

                {paymentMethod === 'net-banking' && (
                  <div className="co-pay-body">
                    <p className="co-pay-coming-soon">Net Banking integration coming soon</p>
                  </div>
                )}

                <div className="co-nav-btns single">
                  <button
                    onClick={() => router.push('/checkout/shipping')}
                    disabled={isProcessing}
                    className="cart-dd-btn-ghost"
                    style={{ padding: '.65rem' }}
                  >
                    ← Back to Shipping
                  </button>
                </div>
              </div>
            </div>

            <div className="co-sidebar">
              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Discount Code</p>
                <div className="co-discount-row">
                  <input
                    type="text"
                    className="auth-input"
                    style={{ flex: 1 }}
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button onClick={handleApplyDiscount} className="cart-dd-btn-primary" style={{ padding: '.72rem 1rem', whiteSpace: 'nowrap' }}>
                    Apply
                  </button>
                </div>
              </div>

              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Order Items ({cartItems.length})</p>
                <div className="co-divider" style={{ margin: '0 0 .75rem' }} />
                <div className="co-mini-items">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.productId} className="co-mini-item">
                      <img src={item.image || 'assets/images/products/placeholder.png'} alt={item.name} className="co-mini-img" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="co-mini-name">{item.name}</p>
                        <p className="co-mini-meta">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && <p className="co-mini-more">+{cartItems.length - 3} more items</p>}
                </div>
              </div>

              <div className="co-sidebar-panel accent-top">
                <p className="co-sidebar-title">Order Total</p>
                <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                  {[
                    { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', val: shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE' },
                    { label: 'Tax', val: `$${taxes.toFixed(2)}` },
                    { label: 'Discount', val: discount > 0 ? `-$${discount.toFixed(2)}` : '—', teal: discount > 0 },
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
                  <span className="co-grand-val">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
