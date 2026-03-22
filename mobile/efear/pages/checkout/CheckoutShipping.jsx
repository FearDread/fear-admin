import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartShipping,
  selectCartDiscount,
  setShipping,
  applyDiscount,
} from '../../features/cart/slice';
import {
  selectCurrentOrder,
  updateCurrentOrder,
} from '../../features/orders/slice';
import CheckoutSteps from './components/CheckoutSteps';

const CheckoutShipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems      = useSelector(selectCartItems);
  const subtotal       = useSelector(selectCartSubtotal);
  const currentShipping = useSelector(selectCartShipping);
  const discount       = useSelector(selectCartDiscount);
  const currentOrder   = useSelector(selectCurrentOrder);

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [discountCode, setDiscountCode]          = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const shippingMethods = [
    { id: 'standard',      name: 'Standard Shipping',      time: '5-7 days',   fee: 0,     description: 'Free standard shipping' },
    { id: 'express',       name: 'Express Shipping',        time: '2-3 days',   fee: 10.00, description: 'Faster delivery' },
    { id: 'overnight',     name: 'Overnight Delivery',      time: '1 day',      fee: 25.00, description: 'Next day delivery' },
    { id: 'international', name: 'International Shipping',  time: '10-15 days', fee: 35.00, description: 'Worldwide delivery' },
  ];

  useEffect(() => {
    const defaultId = currentOrder?.shippingMethodId || shippingMethods[0].id;
    const method = shippingMethods.find(m => m.id === defaultId) || shippingMethods[0];
    setSelectedShipping(method.id);
    dispatch(setShipping(method.fee));
  }, []);

  useEffect(() => {
    if (!currentOrder?.shippingAddress?.line1) navigate('/checkout/details');
  }, [currentOrder, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/shop');
  }, [cartItems, navigate]);

  const handleShippingSelect = (method) => {
    setSelectedShipping(method.id);
    dispatch(setShipping(method.fee));
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim() || isApplyingDiscount) return;
    setIsApplyingDiscount(true);
    setTimeout(() => {
      const validCodes = { 'SAVE10': 0.10, 'SAVE20': 0.20, 'FLAT15': 15, 'WELCOME': 0.15 };
      const val = validCodes[discountCode.toUpperCase()];
      if (val) dispatch(applyDiscount(val < 1 ? subtotal * val : val));
      setDiscountCode('');
      setIsApplyingDiscount(false);
    }, 500);
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping) return;
    const method = shippingMethods.find(m => m.id === selectedShipping);
    dispatch(updateCurrentOrder({
      ...currentOrder,
      shippingMethodId: selectedShipping,
      shippingMethod:   method?.name,
      shippingCost:     method?.fee || 0,
      estimatedDelivery: method?.time,
      step: 'payment',
      updatedAt: new Date().toISOString(),
    }));
    navigate('/checkout/payment');
  };

  const taxRate    = 0.07;
  const taxes      = subtotal * taxRate;
  const orderTotal = subtotal + currentShipping + taxes - discount;

  const selectedMethod = shippingMethods.find(m => m.id === selectedShipping);

  return (
    <>
      {/* Breadcrumb */}
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link to="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link to="/cart" className="co-crumb-link">Cart</Link>
            <span className="co-crumb-sep">›</span>
            <Link to="/checkout/details" className="co-crumb-link">Details</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Shipping</span>
          </nav>
          <span className="co-crumb-title">Shipping</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-layout">

            {/* ── Left column ── */}
            <div>
              <CheckoutSteps currentStep="shipping" />

              {/* Address summary */}
              {currentOrder?.shippingAddress && (
                <div className="co-addr-summary">
                  <div>
                    <p className="co-addr-eyebrow">Shipping To</p>
                    <p className="co-addr-name">{currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}</p>
                    <p className="co-addr-line">{currentOrder.shippingAddress.line1}{currentOrder.shippingAddress.line2 ? `, ${currentOrder.shippingAddress.line2}` : ''}</p>
                    <p className="co-addr-line">{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}</p>
                  </div>
                  <button onClick={() => navigate('/checkout/details')} className="cart-dd-btn-ghost" style={{ padding: '.4rem .85rem', fontSize: '.62rem', whiteSpace: 'nowrap' }}>Edit</button>
                </div>
              )}

              {/* Shipping methods */}
              <div className="co-panel">
                <div className="co-panel-head">
                  <h2 className="co-section-title">Choose Shipping Method</h2>
                </div>
                <div className="co-panel-body">
                  <div className="co-ship-list">
                    {shippingMethods.map(method => (
                      <div
                        key={method.id}
                        className={`co-ship-card${selectedShipping === method.id ? ' active' : ''}`}
                        onClick={() => handleShippingSelect(method)}
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
                  <button onClick={() => navigate('/checkout/details')} className="cart-dd-btn-ghost" style={{ padding: '.65rem' }}>← Back to Details</button>
                  <button onClick={handleProceedToPayment} className="cart-dd-btn-primary" disabled={!selectedShipping} style={{ padding: '.65rem' }}>Proceed to Payment →</button>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="co-sidebar">
              {/* Discount */}
              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Discount Code</p>
                <div className="co-discount-row">
                  <input type="text" className="auth-input" style={{ flex: 1 }} placeholder="Enter code" value={discountCode} onChange={e => setDiscountCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()} />
                  <button onClick={handleApplyDiscount} disabled={isApplyingDiscount || !discountCode.trim()} className="cart-dd-btn-primary" style={{ padding: '.72rem 1rem', whiteSpace: 'nowrap' }}>
                    {isApplyingDiscount ? '...' : 'Apply'}
                  </button>
                </div>
                {discount > 0 && (
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', color: '#2a9d8f', marginTop: '.5rem', letterSpacing: '.08em' }}>✓ Discount: ${discount.toFixed(2)}</p>
                )}
              </div>

              {/* Items */}
              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Order Items</p>
                <div className="co-divider" style={{ margin: '0 0 .75rem' }} />
                <div className="co-mini-items">
                  {cartItems.slice(0, 2).map(item => (
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

              {/* Totals */}
              <div className="co-sidebar-panel accent-top">
                <p className="co-sidebar-title">Order Total</p>
                <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                  {[
                    { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', val: currentShipping === 0 ? 'FREE' : `$${currentShipping.toFixed(2)}` },
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
                  <span className="co-grand-val">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutShipping;