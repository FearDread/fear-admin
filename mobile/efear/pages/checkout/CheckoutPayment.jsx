import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartShipping,
  selectCartDiscount,
  applyDiscount,
} from '../../features/cart/slice';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../features/user/slice';
import {
  selectCurrentOrder,
  updateCurrentOrder,
} from '../../features/orders/slice';
import StripePayment from './components/StripePayment';
import PayPalCardPayment from './components/PayPalPayment';
import CheckoutSteps from './components/CheckoutSteps';
import { createPaymentIntent } from '../../features/payments/slice';

export const CheckoutPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems       = useSelector(selectCartItems);
  const subtotal        = useSelector(selectCartSubtotal);
  const shipping        = useSelector(selectCartShipping);
  const discount        = useSelector(selectCartDiscount);
  const currentUser     = useSelector(selectCurrentUser);
  const currentOrder    = useSelector(selectCurrentOrder);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [paymentMethod, setPaymentMethod]   = useState('card');
  const [discountCode, setDiscountCode]     = useState('');
  const [isProcessing, setIsProcessing]     = useState(false);
  const [clientSecret, setClientSecret]     = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  const taxRate    = 0.07;
  const taxes      = subtotal * taxRate;
  const orderTotal = subtotal + shipping + taxes - discount;

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { state: { from: '/checkout/payment' } });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');
  }, [cartItems.length, navigate]);

  useEffect(() => {
    if (paymentMethod === 'card' && orderTotal > 0 && !clientSecret) {
      dispatch(createPaymentIntent({
        amount: Math.round(orderTotal * 100),
        currency: 'usd',
        metadata: { userId: currentUser?._id, orderId: currentOrder?._id || 'pending' },
        currentUser,
      }))
        .unwrap()
        .then(result => {
          if (result.client_secret) {
            setClientSecret(result.client_secret);
            setPaymentIntentId(result.id);
          }
        })
        .catch(err => console.error('Payment intent error:', err));
    }
  }, [paymentMethod, orderTotal, dispatch, currentUser, currentOrder, clientSecret]);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    const validCodes = { 'SAVE10': 10, 'SAVE20': 20, 'WELCOME15': 15, 'FIRST25': 25 };
    const pct = validCodes[discountCode.toUpperCase()];
    if (pct) {
      dispatch(applyDiscount((subtotal * pct) / 100));
      setDiscountCode('');
      setClientSecret('');
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsProcessing(true);
    try {
      const ts = Date.now().toString(36).toUpperCase();
      const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
      const orderNumber = `ORD-${ts}-${rnd}`;
      dispatch(updateCurrentOrder({
        ...currentOrder, orderNumber,
        userId: currentUser._id, items: cartItems,
        subtotal, shipping, taxes, discount, total: orderTotal,
        paymentMethod: 'card',
        paymentIntentId: paymentResult.paymentIntent?.id || paymentIntentId,
        paymentStatus: 'completed', orderStatus: 'confirmed',
        orderDate: new Date().toISOString(),
      }));
      navigate('/checkout/review');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (err) => {
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

  const tabs = [
    { id: 'card',          label: 'Credit Card', icon: '💳' },
    { id: 'paypal-payment', label: 'PayPal',      icon: '🅿' },
    { id: 'net-banking',   label: 'Net Banking',  icon: '🏦' },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link to="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link to="/checkout/details" className="co-crumb-link">Details</Link>
            <span className="co-crumb-sep">›</span>
            <Link to="/checkout/shipping" className="co-crumb-link">Shipping</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Payment</span>
          </nav>
          <span className="co-crumb-title">Payment</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-layout">

            {/* ── Left column ── */}
            <div>
              <CheckoutSteps currentStep="payment" />

              <div className="co-panel">
                <div className="co-panel-head">
                  <h2 className="co-section-title">Choose Payment Method</h2>
                </div>

                {/* Tabs */}
                <div className="co-pay-tabs">
                  {tabs.map(tab => (
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

                {/* Card */}
                {paymentMethod === 'card' && (
                  <div className="co-pay-body">
                    {clientSecret ? (
                      <StripePayment
                        clientSecret={clientSecret}
                        amount={orderTotal}
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

                {/* PayPal */}
                {paymentMethod === 'paypal-payment' && (
                  <div className="co-pay-body">
                    <PayPalCardPayment order={currentOrder} amount={orderTotal} onSuccess={() => {}} onError={() => {}} />
                    <p className="co-pay-coming-soon">PayPal integration coming soon</p>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'net-banking' && (
                  <div className="co-pay-body">
                    <p className="co-pay-coming-soon">Net Banking integration coming soon</p>
                  </div>
                )}

                <div className="co-nav-btns single">
                  <button onClick={() => navigate('/checkout/shipping')} disabled={isProcessing} className="cart-dd-btn-ghost" style={{ padding: '.65rem' }}>← Back to Shipping</button>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="co-sidebar">
              {/* Discount */}
              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Discount Code</p>
                <div className="co-discount-row">
                  <input type="text" className="auth-input" style={{ flex: 1 }} placeholder="Enter code" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
                  <button onClick={handleApplyDiscount} className="cart-dd-btn-primary" style={{ padding: '.72rem 1rem', whiteSpace: 'nowrap' }}>Apply</button>
                </div>
              </div>

              {/* Items */}
              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Order Items ({cartItems.length})</p>
                <div className="co-divider" style={{ margin: '0 0 .75rem' }} />
                <div className="co-mini-items">
                  {cartItems.slice(0, 3).map(item => (
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

              {/* Totals */}
              <div className="co-sidebar-panel accent-top">
                <p className="co-sidebar-title">Order Total</p>
                <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                  {[
                    { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', val: shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE' },
                    { label: 'Tax',      val: `$${taxes.toFixed(2)}` },
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

export default CheckoutPayment;