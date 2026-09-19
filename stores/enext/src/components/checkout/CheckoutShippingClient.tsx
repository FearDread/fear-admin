'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useGetCartQuery } from '@/lib/redux/api/cartApi';
import { selectCheckout, setShippingMethod, applyDiscount } from '@/lib/redux/slices/checkoutSlice';
import { useCheckoutTotals } from '@/lib/checkout/totals';
import { SHIPPING_METHODS } from '@/types/checkout';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';

const SHIPPING_DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FLAT15: 15,
  WELCOME: 0.15,
};

export default function CheckoutShippingClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: cart } = useGetCartQuery();
  const cartItems = cart?.items ?? [];

  const draft = useAppSelector(selectCheckout);

  const [selectedShipping, setSelectedShipping] = useState<string | null>(draft.shippingMethodId);
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Default to the first shipping method (or whatever was already chosen) once,
  // on mount — same one-shot behaviour as the CRA version.
  useEffect(() => {
    const defaultMethod =
      SHIPPING_METHODS.find((m) => m.id === draft.shippingMethodId) ?? SHIPPING_METHODS[0];
    setSelectedShipping(defaultMethod.id);
    dispatch(
      setShippingMethod({
        id: defaultMethod.id,
        cost: defaultMethod.fee,
        estimatedDelivery: defaultMethod.time,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draft.shippingAddress?.line1) router.replace('/checkout/details');
  }, [draft.shippingAddress, router]);

  useEffect(() => {
    if (cart && cartItems.length === 0) router.replace('/shop');
  }, [cart, cartItems.length, router]);

  const handleShippingSelect = (methodId: string) => {
    const method = SHIPPING_METHODS.find((m) => m.id === methodId);
    if (!method) return;
    setSelectedShipping(method.id);
    dispatch(setShippingMethod({ id: method.id, cost: method.fee, estimatedDelivery: method.time }));
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim() || isApplyingDiscount) return;
    setIsApplyingDiscount(true);
    // Preserves the CRA version's artificial delay to simulate a discount-validation call.
    setTimeout(() => {
      const val = SHIPPING_DISCOUNT_CODES[discountCode.toUpperCase()];
      if (val) {
        const amount = val < 1 ? subtotal * val : val;
        dispatch(applyDiscount({ code: discountCode.toUpperCase(), amount }));
      }
      setDiscountCode('');
      setIsApplyingDiscount(false);
    }, 500);
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping) return;
    router.push('/checkout/payment');
  };

  const { subtotal, taxes, discount, shipping, total } = useCheckoutTotals({
    items: cartItems,
    shippingCost: draft.shippingCost,
    discount: draft.discount,
  });

  const selectedMethod = SHIPPING_METHODS.find((m) => m.id === selectedShipping);

  return (
    <>
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link href="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/cart" className="co-crumb-link">Cart</Link>
            <span className="co-crumb-sep">›</span>
            <Link href="/checkout/details" className="co-crumb-link">Details</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Shipping</span>
          </nav>
          <span className="co-crumb-title">Shipping</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-layout">
            <div>
              <CheckoutSteps currentStep="shipping" />

              {draft.shippingAddress && (
                <div className="co-addr-summary">
                  <div>
                    <p className="co-addr-eyebrow">Shipping To</p>
                    <p className="co-addr-name">
                      {draft.shippingAddress.firstName} {draft.shippingAddress.lastName}
                    </p>
                    <p className="co-addr-line">
                      {draft.shippingAddress.line1}
                      {draft.shippingAddress.line2 ? `, ${draft.shippingAddress.line2}` : ''}
                    </p>
                    <p className="co-addr-line">
                      {draft.shippingAddress.city}, {draft.shippingAddress.state} {draft.shippingAddress.zipCode}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/checkout/details')}
                    className="cart-dd-btn-ghost"
                    style={{ padding: '.4rem .85rem', fontSize: '.62rem', whiteSpace: 'nowrap' }}
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="co-panel">
                <div className="co-panel-head">
                  <h2 className="co-section-title">Choose Shipping Method</h2>
                </div>
                <div className="co-panel-body">
                  <div className="co-ship-list">
                    {SHIPPING_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className={`co-ship-card${selectedShipping === method.id ? ' active' : ''}`}
                        onClick={() => handleShippingSelect(method.id)}
                      >
                        <div className="co-ship-radio" />
                        <div className="co-ship-info">
                          <p className="co-ship-name">{method.name}</p>
                          <p className="co-ship-desc">{method.description}</p>
                          <p className="co-ship-time">⏱ {method.time}</p>
                        </div>
                        <div className={`co-ship-price${method.fee === 0 ? ' free' : ' paid'}`}>
                          {method.fee === 0 ? 'FREE' : `$${method.fee.toFixed(2)}`}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedMethod && (
                    <div className="co-ship-selected-note">
                      ✓ {selectedMethod.name} — {selectedMethod.fee === 0 ? 'FREE' : `$${selectedMethod.fee.toFixed(2)}`}
                    </div>
                  )}
                </div>

                <div className="co-nav-btns">
                  <button onClick={() => router.push('/checkout/details')} className="cart-dd-btn-ghost" style={{ padding: '.65rem' }}>
                    ← Back to Details
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="cart-dd-btn-primary"
                    disabled={!selectedShipping}
                    style={{ padding: '.65rem' }}
                  >
                    Proceed to Payment →
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
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || !discountCode.trim()}
                    className="cart-dd-btn-primary"
                    style={{ padding: '.72rem 1rem', whiteSpace: 'nowrap' }}
                  >
                    {isApplyingDiscount ? '...' : 'Apply'}
                  </button>
                </div>
                {discount > 0 && (
                  <p
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: '.65rem',
                      color: '#2a9d8f',
                      marginTop: '.5rem',
                      letterSpacing: '.08em',
                    }}
                  >
                    ✓ Discount: ${discount.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Order Items</p>
                <div className="co-divider" style={{ margin: '0 0 .75rem' }} />
                <div className="co-mini-items">
                  {cartItems.slice(0, 2).map((item) => (
                    <div key={item.productId} className="co-mini-item">
                      <img src={item.image || 'assets/images/products/01.png'} alt={item.name} className="co-mini-img" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="co-mini-name">{item.name}</p>
                        <p className="co-mini-meta">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 2 && <p className="co-mini-more">+{cartItems.length - 2} more items</p>}
                </div>
              </div>

              <div className="co-sidebar-panel accent-top">
                <p className="co-sidebar-title">Order Total</p>
                <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                  {[
                    { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', val: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` },
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
