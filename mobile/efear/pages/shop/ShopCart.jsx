import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartDiscount,
  removeItem,
  updateQuantity,
  clearCart,
  applyDiscount,
  setShipping
} from '../../features/cart/slice';
import {
  selectIsAuthenticated,
  selectCurrentUser
} from '../../features/user/slice';

export const ShopCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const discount = useSelector(selectCartDiscount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  // Local state
  const [discountCode, setDiscountCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountMsg, setDiscountMsg] = useState(null);
  const [shippingMsg, setShippingMsg] = useState(null);

  // Calculate taxes (7% tax rate)
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: parseInt(newQuantity) }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountMsg({ type: 'error', text: 'Please enter a discount code.' });
      return;
    }
    setIsApplyingDiscount(true);
    setDiscountMsg(null);

    setTimeout(() => {
      const validCodes = { 'SAVE10': 10, 'SAVE20': 20, 'WELCOME15': 15 };
      const discountPercentage = validCodes[discountCode.toUpperCase()];

      if (discountPercentage) {
        const discountAmount = (subtotal * discountPercentage) / 100;
        dispatch(applyDiscount(discountAmount));
        setDiscountMsg({ type: 'success', text: `Code applied — you saved $${discountAmount.toFixed(2)}!` });
      } else {
        setDiscountMsg({ type: 'error', text: 'Invalid discount code.' });
      }
      setIsApplyingDiscount(false);
    }, 500);
  };

  const handleEstimateShipping = () => {
    if (!zipCode.trim()) {
      setShippingMsg({ type: 'error', text: 'Please enter a zip code.' });
      return;
    }
    const shippingCost = country === 'United States' ? 10.00 : 25.00;
    dispatch(setShipping(shippingCost));
    setShippingMsg({ type: 'success', text: `Estimated shipping: $${shippingCost.toFixed(2)}` });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <>
        {/* Breadcrumb */}
        <div style={{ background: '#111111', borderBottom: '1px solid #222222', padding: '1rem 0' }}>
          <div className="efear-container">
            <nav className="ct-breadcrumb">
              <a href="/" className="ct-bc-link">Home</a>
              <span className="ct-bc-sep">›</span>
              <a href="/shop" className="ct-bc-link">Shop</a>
              <span className="ct-bc-sep">›</span>
              <span className="ct-bc-current">Cart</span>
            </nav>
          </div>
        </div>

        {/* Empty state */}
        <section style={{ padding: '5rem 0' }}>
          <div className="efear-container">
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h2 className="empty-title">Your Cart Is Empty</h2>
              <p className="empty-body">Add some gear to get started.</p>
              <button
                onClick={handleContinueShopping}
                className="btn-apply-price"
                style={{ padding: '.85rem 2.5rem', fontSize: '.8rem', letterSpacing: '.12em' }}
              >
                Start Shopping →
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Cart with items ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: '#111111', borderBottom: '1px solid #222222', padding: '1rem 0' }}>
        <div className="efear-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <nav className="ct-breadcrumb" style={{ marginBottom: 0 }}>
              <a href="/" className="ct-bc-link">Home</a>
              <span className="ct-bc-sep">›</span>
              <a href="/shop" className="ct-bc-link">Shop</a>
              <span className="ct-bc-sep">›</span>
              <span className="ct-bc-current">Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            </nav>
            <button
              onClick={handleClearCart}
              style={{
                background: 'none',
                border: '1px solid #222222',
                color: 'rgba(255,255,255,0.32)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '.65rem',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                padding: '.4rem .85rem',
                cursor: 'pointer',
                transition: 'border-color .2s, color .2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#b30e1c'; e.target.style.color = '#b30e1c'; }}
              onMouseLeave={e => { e.target.style.borderColor = '#222222'; e.target.style.color = 'rgba(255,255,255,0.32)'; }}
            >
              ✕ Clear Cart
            </button>
          </div>
        </div>
      </div>

      <section style={{ padding: '3rem 0' }}>
        <div className="efear-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '2rem', alignItems: 'start' }}
              className="sc-layout">

              {/* ── Cart Items ── */}
              <div className="shop-sidebar" style={{ position: 'static' }}>

                {/* Column headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 100px 48px',
                  gap: '1rem',
                  padding: '0.85rem 1.5rem',
                  borderBottom: '1px solid #222222',
                  background: '#0d0d0d',
                }}>
                  {['Product', 'Qty', 'Price', ''].map((h, i) => (
                    <span key={i} style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '.62rem',
                      letterSpacing: '.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.32)',
                    }}>{h}</span>
                  ))}
                </div>

                {/* Items */}
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.productId}>
                    {index > 0 && <div style={{ borderTop: '1px solid #222222' }} />}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 100px 48px',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '1.25rem 1.5rem',
                    }}>
                      {/* Product info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 80,
                          height: 80,
                          flexShrink: 0,
                          background: '#1a1a1a',
                          border: '1px solid #222222',
                          overflow: 'hidden',
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
                        }}>
                          <img
                            src={item.image || 'assets/images/products/placeholder.png'}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p style={{
                            fontFamily: "'Anton', 'Impact', sans-serif",
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.92)',
                            margin: '0 0 .3rem',
                          }}>
                            {item.name}
                          </p>
                          {item.size && (
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '.65rem', color: 'rgba(255,255,255,0.32)', marginRight: '.75rem' }}>
                              SIZE: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '.65rem', color: 'rgba(255,255,255,0.32)' }}>
                              COLOR: {item.color}
                            </span>
                          )}
                          <Link
                            to="/account/wishlist"
                            style={{
                              display: 'inline-block',
                              marginTop: '.5rem',
                              fontFamily: "'Space Mono', monospace",
                              fontSize: '.62rem',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                              color: 'rgba(255,255,255,0.32)',
                              textDecoration: 'none',
                              borderBottom: '1px solid #222222',
                            }}
                          >
                            ♡ Save
                          </Link>
                        </div>
                      </div>

                      {/* Qty */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{
                            width: 28, height: 28, background: '#1a1a1a', border: '1px solid #222222',
                            color: 'rgba(255,255,255,0.58)', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '.9rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: item.quantity <= 1 ? .3 : 1,
                          }}
                        >−</button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          style={{
                            width: 40, textAlign: 'center', background: '#1a1a1a', border: '1px solid #222222',
                            color: 'rgba(255,255,255,0.92)', fontFamily: "'Space Mono', monospace", fontSize: '.78rem',
                            padding: '.35rem 0', outline: 'none',
                          }}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          style={{
                            width: 28, height: 28, background: '#1a1a1a', border: '1px solid #222222',
                            color: 'rgba(255,255,255,0.58)', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '.9rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >+</button>
                      </div>

                      {/* Price */}
                      <p style={{
                        fontFamily: "'Anton', 'Impact', sans-serif",
                        fontSize: '1.1rem',
                        color: '#b30e1c',
                        margin: 0,
                        letterSpacing: '.02em',
                      }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        title="Remove item"
                        style={{
                          width: 36, height: 36, background: 'transparent', border: '1px solid #222222',
                          color: 'rgba(255,255,255,0.32)', fontSize: '1rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'border-color .2s, color .2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#b30e1c'; e.currentTarget.style.color = '#b30e1c'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.color = 'rgba(255,255,255,0.32)'; }}
                      >
                        ✕
                      </button>
                    </div>
                  </React.Fragment>
                ))}

                {/* Continue shopping */}
                <div style={{ borderTop: '1px solid #222222', padding: '1.25rem 1.5rem' }}>
                  <button
                    onClick={handleContinueShopping}
                    className="btn-clear"
                    style={{ width: 'auto', padding: '.65rem 1.5rem' }}
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>

              {/* ── Sidebar / Order Summary ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Discount Code */}
                <div className="shop-sidebar" style={{ position: 'static' }}>
                  <div className="sidebar-section">
                    <h3 className="sidebar-heading">Discount Code</h3>
                    {discountMsg && (
                      <div className={`auth-alert ${discountMsg.type}`} style={{ marginBottom: '1rem' }}>
                        <span className="auth-alert-icon">{discountMsg.type === 'success' ? '✓' : '⚠'}</span>
                        {discountMsg.text}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <input
                        type="text"
                        className="price-input"
                        placeholder="Enter code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={isApplyingDiscount}
                        style={{ flex: 1 }}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={isApplyingDiscount}
                        className="btn-apply-price"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {isApplyingDiscount ? '...' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shipping Estimator */}
                <div className="shop-sidebar" style={{ position: 'static' }}>
                  <div className="sidebar-section">
                    <h3 className="sidebar-heading">Estimate Shipping</h3>
                    {shippingMsg && (
                      <div className={`auth-alert ${shippingMsg.type}`} style={{ marginBottom: '1rem' }}>
                        <span className="auth-alert-icon">{shippingMsg.type === 'success' ? '✓' : '⚠'}</span>
                        {shippingMsg.text}
                      </div>
                    )}

                    <div className="auth-field">
                      <label className="auth-label">Country</label>
                      <select
                        className="auth-select"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="United States">United States</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">State / Province</label>
                      <select
                        className="auth-select"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="California">California</option>
                        <option value="Texas">Texas</option>
                        <option value="New York">New York</option>
                      </select>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">Zip / Postal Code</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="e.g. 90210"
                      />
                    </div>

                    <button
                      onClick={handleEstimateShipping}
                      className="btn-clear"
                      style={{ width: '100%' }}
                    >
                      Estimate Shipping
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="shop-sidebar" style={{ position: 'static' }}>
                  <div className="sidebar-section">
                    <h3 className="sidebar-heading">Order Summary</h3>

                    {[
                      { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                      { label: 'Shipping', value: shipping > 0 ? `$${shipping.toFixed(2)}` : '—' },
                      { label: 'Taxes (7%)', value: `$${taxes.toFixed(2)}` },
                      { label: 'Discount', value: discount > 0 ? `-$${discount.toFixed(2)}` : '—', accent: discount > 0 },
                    ].map(({ label, value, accent }) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '.55rem 0',
                        borderBottom: '1px solid #1a1a1a',
                      }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
                          {label}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '.78rem', color: accent ? '#2a9d8f' : 'rgba(255,255,255,0.92)' }}>
                          {value}
                        </span>
                      </div>
                    ))}

                    {/* Total */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem 0 0',
                    }}>
                      <span style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: '1rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', letterSpacing: '.05em' }}>
                        Order Total
                      </span>
                      <span style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: '1.5rem', color: '#b30e1c', letterSpacing: '.02em' }}>
                        ${(total + taxes).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #222222' }}>
                    <button
                      onClick={handleCheckout}
                      className="auth-submit"
                      style={{ marginTop: 0 }}
                    >
                      {isAuthenticated ? 'Proceed to Checkout →' : 'Login to Checkout →'}
                    </button>
                    {!isAuthenticated && (
                      <p style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '.62rem',
                        color: 'rgba(255,255,255,0.32)',
                        textAlign: 'center',
                        marginTop: '.75rem',
                        marginBottom: 0,
                      }}>
                        Login required to complete checkout
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          .sc-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .sc-layout > div:first-child > div[style*="grid-template-columns: 1fr 120px"] {
            grid-template-columns: 1fr 80px 80px 36px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ShopCart;