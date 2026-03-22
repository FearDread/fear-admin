import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  applyDiscount,
} from '../../features/cart/slice';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../features/user/slice';
import {
  setCurrentOrder,
  selectCurrentOrder,
} from '../../features/orders/slice';
import CheckoutSteps from './components/CheckoutSteps';

export const CheckoutDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems       = useSelector(selectCartItems);
  const subtotal        = useSelector(selectCartSubtotal);
  const total           = useSelector(selectCartTotal);
  const discount        = useSelector(selectCartDiscount);
  const currentUser     = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const existingOrder   = useSelector(selectCurrentOrder);

  const emptyAddr = {
    userId: currentUser?._id, firstName: '', lastName: '', email: '',
    phone: '', city: '', state: '', zipCode: '', country: 'United States',
    line1: '', line2: '',
  };

  const [shippingAddress, setShippingAddress] = useState(emptyAddr);
  const [billingAddress, setBillingAddress]   = useState(emptyAddr);
  const [sameAsShipping, setSameAsShipping]   = useState(true);
  const [discountCode, setDiscountCode]       = useState('');
  const [discountError, setDiscountError]     = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) navigate('/login?redirect=/checkout/details');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');
  }, [cartItems, navigate]);

  useEffect(() => {
    if (existingOrder?.shippingAddress) {
      setShippingAddress(existingOrder.shippingAddress);
      if (existingOrder.billingAddress) { setBillingAddress(existingOrder.billingAddress); setSameAsShipping(false); }
    } else if (currentUser) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName:  currentUser.lastName  || '',
        email:     currentUser.email     || '',
        phone:     currentUser.phone     || '',
      }));
    }
  }, [currentUser, existingOrder]);

  const handleShippingChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBillingChange = (field, value) => setBillingAddress(prev => ({ ...prev, [field]: value }));

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) { setDiscountError('Please enter a discount code'); return; }
    const validCodes = { 'SAVE10': 10, 'SAVE20': 20, 'WELCOME15': 15, 'FIRST25': 25 };
    const pct = validCodes[discountCode.toUpperCase()];
    if (pct) {
      dispatch(applyDiscount((subtotal * pct) / 100));
      setDiscountError('');
      setDiscountCode('');
    } else {
      setDiscountError('Invalid discount code');
    }
  };

  const validateForm = () => {
    const errors = {};
    ['firstName', 'lastName', 'email', 'phone', 'line1', 'city', 'state', 'zipCode'].forEach(f => {
      if (!shippingAddress[f]?.trim()) errors[f] = `${f.replace(/([A-Z])/g, ' $1').trim()} is required`;
    });
    if (shippingAddress.email && !/\S+@\S+\.\S+/.test(shippingAddress.email)) errors.email = 'Valid email required';
    if (shippingAddress.phone && !/^\d{10,}$/.test(shippingAddress.phone.replace(/\D/g, ''))) errors.phone = 'Valid phone required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToShipping = () => {
    if (!validateForm()) return;
    dispatch(setCurrentOrder({
      ...existingOrder,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      items: cartItems, subtotal, discount, total,
      orderStatus: 'pending', step: 'shipping',
      updatedAt: new Date().toISOString(),
    }));
    navigate('/checkout/shipping');
  };

  const taxRate   = 0.07;
  const taxes     = subtotal * taxRate;
  const finalTotal = subtotal + taxes - (discount || 0);

  const Field = ({ label, id, children, err }) => (
    <div className="auth-field">
      <label className="auth-label">{label} {err && <span style={{ color: '#b30e1c' }}>*</span>}</label>
      {children}
      {err && <div className="auth-field-error">{err}</div>}
    </div>
  );

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
            <span className="co-crumb-current">Checkout</span>
          </nav>
          <span className="co-crumb-title">Details</span>
        </div>
      </div>

      <div className="co-page">
        <div className="efear-container">
          <div className="co-layout">

            {/* ── Left column ── */}
            <div>
              <CheckoutSteps currentStep="details" />

              {/* User bar */}
              {currentUser && (
                <div className="co-user-bar">
                  <img
                    src={currentUser.avatar || 'assets/images/avatars/avatar-1.png'}
                    alt=""
                    className="co-user-avatar"
                  />
                  <div style={{ flex: 1 }}>
                    <p className="co-user-name">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="co-user-email">{currentUser.email}</p>
                  </div>
                  <button onClick={() => navigate('/profile')} className="cart-dd-btn-ghost" style={{ padding: '.45rem .9rem' }}>
                    Edit Profile
                  </button>
                </div>
              )}

              {/* Shipping address form */}
              <div className="co-panel">
                <div className="co-panel-head">
                  <h2 className="co-section-title">Shipping Address</h2>
                </div>
                <div className="co-panel-body">
                  <div className="co-form-grid">
                    <Field label="First Name" err={validationErrors.firstName}>
                      <input type="text" className={`auth-input${validationErrors.firstName ? ' error' : ''}`} value={shippingAddress.firstName} onChange={e => handleShippingChange('firstName', e.target.value)} />
                    </Field>
                    <Field label="Last Name" err={validationErrors.lastName}>
                      <input type="text" className={`auth-input${validationErrors.lastName ? ' error' : ''}`} value={shippingAddress.lastName} onChange={e => handleShippingChange('lastName', e.target.value)} />
                    </Field>
                    <Field label="Email" err={validationErrors.email}>
                      <input type="email" className={`auth-input${validationErrors.email ? ' error' : ''}`} value={shippingAddress.email} onChange={e => handleShippingChange('email', e.target.value)} />
                    </Field>
                    <Field label="Phone" err={validationErrors.phone}>
                      <input type="tel" className={`auth-input${validationErrors.phone ? ' error' : ''}`} value={shippingAddress.phone} onChange={e => handleShippingChange('phone', e.target.value)} placeholder="(555) 123-4567" />
                    </Field>
                    <div className="co-full">
                      <Field label="Address Line 1" err={validationErrors.line1}>
                        <input type="text" className={`auth-input${validationErrors.line1 ? ' error' : ''}`} value={shippingAddress.line1} onChange={e => handleShippingChange('line1', e.target.value)} placeholder="Street address, P.O. box" />
                      </Field>
                    </div>
                    <div className="co-full">
                      <Field label="Address Line 2 (optional)">
                        <input type="text" className="auth-input" value={shippingAddress.line2} onChange={e => handleShippingChange('line2', e.target.value)} placeholder="Apartment, suite, floor, etc." />
                      </Field>
                    </div>
                    <Field label="City" err={validationErrors.city}>
                      <input type="text" className={`auth-input${validationErrors.city ? ' error' : ''}`} value={shippingAddress.city} onChange={e => handleShippingChange('city', e.target.value)} />
                    </Field>
                    <Field label="State / Province" err={validationErrors.state}>
                      <select className={`auth-select${validationErrors.state ? ' error' : ''}`} value={shippingAddress.state} onChange={e => handleShippingChange('state', e.target.value)}>
                        <option value="">Select State</option>
                        {['CA|California','TX|Texas','NY|New York','FL|Florida','IL|Illinois','PA|Pennsylvania'].map(s => {
                          const [v, l] = s.split('|');
                          return <option key={v} value={v}>{l}</option>;
                        })}
                      </select>
                    </Field>
                    <Field label="Zip / Postal Code" err={validationErrors.zipCode}>
                      <input type="text" className={`auth-input${validationErrors.zipCode ? ' error' : ''}`} value={shippingAddress.zipCode} onChange={e => handleShippingChange('zipCode', e.target.value)} placeholder="12345" />
                    </Field>
                    <Field label="Country">
                      <select className="auth-select" value={shippingAddress.country} onChange={e => handleShippingChange('country', e.target.value)}>
                        {['United States','Canada','United Kingdom','Australia'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="co-divider" />

                  {/* Billing toggle */}
                  <p style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '.82rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', margin: '0 0 .75rem' }}>Billing Address</p>
                  <div className="co-billing-toggle" onClick={() => setSameAsShipping(v => !v)}>
                    <div className={`co-billing-check${sameAsShipping ? ' checked' : ''}`} />
                    <span className="co-billing-label">Same as shipping address</span>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="co-nav-btns">
                  <button onClick={() => navigate('/cart')} className="cart-dd-btn-ghost" style={{ padding: '.65rem' }}>← Back to Cart</button>
                  <button onClick={handleProceedToShipping} className="cart-dd-btn-primary" style={{ padding: '.65rem' }}>Proceed to Shipping →</button>
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
                {discountError && <div className="auth-field-error" style={{ marginTop: '.4rem' }}>{discountError}</div>}
                {discount > 0 && (
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', color: '#2a9d8f', marginTop: '.5rem', letterSpacing: '.08em' }}>✓ Discount applied: ${discount.toFixed(2)}</p>
                )}
              </div>

              {/* Order items */}
              <div className="co-sidebar-panel">
                <p className="co-sidebar-title">Order Summary</p>
                <div className="co-divider" style={{ margin: '0 0 .75rem' }} />
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,0.32)', letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 .75rem' }}>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </p>
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
                <p className="co-sidebar-title">Estimate</p>
                <div className="co-totals" style={{ marginBottom: '.85rem' }}>
                  {[
                    { label: 'Subtotal',  val: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping',  val: 'Calculated next step' },
                    { label: 'Tax (7%)',  val: `$${taxes.toFixed(2)}` },
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
                  <span className="co-grand-label">Est. Total</span>
                  <span className="co-grand-val">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutDetails;