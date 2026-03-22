import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { clearCart } from '../../features/cart/slice';
import { selectCurrentUser } from '../../features/user/slice';
import { clearCurrentOrder } from '../../features/orders/slice';

function CheckoutComplete() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const orderData   = location.state?.order;
  const currentUser = useSelector(selectCurrentUser);

  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const generateOrderNumber = () => {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${ts}${rnd}`;
  };

  useEffect(() => {
    if (!orderData) { navigate('/cart'); return; }
    setOrderDetails(orderData);
    setOrderNumber(orderData.orderNumber || generateOrderNumber());
    dispatch(clearCart());
    dispatch(clearCurrentOrder());
  }, [orderData, currentUser, dispatch, navigate]);

  const formatDate = (ds) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // Loading state
  if (!orderDetails) {
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

  const addr = orderDetails.shippingAddress || {};

  return (
    <>
      {/* Breadcrumb */}
      <div className="co-crumb-bar">
        <div className="efear-container co-crumb-nav">
          <nav className="co-crumb-trail">
            <Link to="/" className="co-crumb-link">Home</Link>
            <span className="co-crumb-sep">›</span>
            <Link to="/cart" className="co-crumb-link">Checkout</Link>
            <span className="co-crumb-sep">›</span>
            <span className="co-crumb-current">Complete</span>
          </nav>
          <span className="co-crumb-title">Order Confirmation</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">

          {/* ── Success hero ── */}
          <div className="co-complete-hero">
            <div className="co-complete-icon">✓</div>
            <h1 className="co-complete-title">Order Confirmed!</h1>
            <p className="co-complete-sub">Thank you for your purchase — your gear is on its way.</p>

            <div className="co-order-pill">
              <span className="co-order-pill-label">Order #</span>
              <span className="co-order-pill-num">{orderNumber}</span>
            </div>

            {(orderDetails.customerEmail || currentUser?.email) && (
              <p className="co-email-note">
                Confirmation sent to <strong>{orderDetails.customerEmail || currentUser?.email}</strong>
              </p>
            )}
          </div>

          {/* ── Summary card ── */}
          <div className="co-complete-card">

            {/* Order meta row */}
            <div className="co-complete-order-meta">
              <div className="co-complete-meta-item">
                <div className="co-complete-meta-label">Order Number</div>
                <div className="co-complete-meta-val">{orderNumber}</div>
              </div>
              <div className="co-complete-meta-item" style={{ textAlign: 'right' }}>
                <div className="co-complete-meta-label">Order Date</div>
                <div className="co-complete-meta-val">{formatDate(orderDetails.createdAt || orderDetails.orderDate)}</div>
              </div>
            </div>

            {/* Items */}
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

            {/* Totals */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #222222' }}>
              <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                {[
                  { label: 'Subtotal', val: `$${orderDetails.subtotal?.toFixed(2)}` },
                  { label: 'Shipping', val: orderDetails.shipping === 0 ? 'FREE' : `$${orderDetails.shipping?.toFixed(2)}` },
                  { label: 'Tax',      val: `$${orderDetails.taxes?.toFixed(2)}` },
                  ...(orderDetails.discount > 0 ? [{ label: 'Discount', val: `-$${orderDetails.discount?.toFixed(2)}`, teal: true }] : []),
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

            {/* Shipping + Payment info */}
            <div className="co-info-grid" style={{ borderTop: '1px solid #222222', padding: '1.25rem 1.5rem' }}>
              <div className="co-info-block">
                <p className="co-info-eyebrow">📍 Shipping Address</p>
                {addr.firstName ? (
                  <p className="co-info-line">
                    <strong>{addr.firstName} {addr.lastName}</strong>
                    {addr.line1}
                    {addr.line2 && <><br />{addr.line2}</>}
                    <br />{addr.city}, {addr.state} {addr.zipCode}
                    <br />{addr.country}
                    {addr.phone && <><br />{addr.phone}</>}
                  </p>
                ) : (
                  <p className="co-info-line">No address available</p>
                )}
              </div>
              <div className="co-info-block">
                <p className="co-info-eyebrow">💳 Payment Method</p>
                <p className="co-info-line"><strong>Credit Card</strong>Payment processed securely</p>
                {orderDetails.paymentIntentId && (
                  <p className="co-info-line" style={{ marginTop: '.5rem', fontSize: '.62rem', color: 'rgba(255,255,255,0.22)' }}>
                    TXN: {orderDetails.paymentIntentId}
                  </p>
                )}
                <div className="co-payment-badge" style={{ marginTop: '.75rem' }}>✓ Authorised</div>
              </div>
            </div>

            {/* What's next */}
            <div className="co-whats-next">
              <h3 className="co-whats-next-title">What Happens Next?</h3>
              <ul className="co-whats-next-list">
                <li>Your order is being prepared for shipment</li>
                <li>You'll receive a shipping notification with tracking info</li>
                <li>Estimated delivery: {orderDetails.estimatedDelivery || '3-5 business days'}</li>
                <li>Track your order anytime from your account dashboard</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="co-complete-actions">
              <button onClick={() => navigate('/shop')} className="cart-dd-btn-primary" style={{ padding: '.75rem 1.75rem' }}>
                Continue Shopping
              </button>
              <button onClick={() => navigate('/account/orders')} className="cart-dd-btn-ghost" style={{ padding: '.75rem 1.75rem' }}>
                View All Orders
              </button>
              <button onClick={() => window.print()} className="cart-dd-btn-ghost" style={{ padding: '.75rem 1.75rem' }}>
                Print Receipt
              </button>
            </div>

            {/* Support */}
            <div className="co-support-row">
              <a href="mailto:support@efear.com" className="cart-dd-btn-ghost" style={{ padding: '.5rem 1rem', fontSize: '.62rem', textDecoration: 'none' }}>✉ Email Support</a>
              <a href="tel:+1234567890"           className="cart-dd-btn-ghost" style={{ padding: '.5rem 1rem', fontSize: '.62rem', textDecoration: 'none' }}>☎ Call Us</a>
              <button onClick={() => navigate(`/account/orders/${orderNumber}`)} className="cart-dd-btn-ghost" style={{ padding: '.5rem 1rem', fontSize: '.62rem' }}>Track Order</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutComplete;