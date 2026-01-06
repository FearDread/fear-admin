import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from "../../components/common/Breadcrumbs";
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
import CheckoutSteps from "./components/CheckoutSteps";

export const CheckoutDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const existingOrder = useSelector(selectCurrentOrder);
  
  // Local state for form
  const [shippingAddress, setShippingAddress] = useState({
    userId: currentUser?._id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    line1: '',
    line2: '',
  });
  
  const [billingAddress, setBillingAddress] = useState({
    userId: currentUser?._id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    line1: '',
    line2: '',
  });
  
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout/details');
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Load existing order data or user data
  useEffect(() => {
    if (existingOrder?.shippingAddress) {
      // Load from existing order
      setShippingAddress(existingOrder.shippingAddress);
      if (existingOrder.billingAddress) {
        setBillingAddress(existingOrder.billingAddress);
        setSameAsShipping(false);
      }
    } else if (currentUser) {
      // Load from user profile
      setShippingAddress(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      }));
    }
  }, [currentUser, existingOrder]);
  
  const handleShippingChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleBillingChange = (field, value) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    const validCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME15': 15,
      'FIRST25': 25,
    };
    
    const discountPercentage = validCodes[discountCode.toUpperCase()];
    
    if (discountPercentage) {
      const discountAmount = (subtotal * discountPercentage) / 100;
      dispatch(applyDiscount(discountAmount));
      setDiscountError('');
      alert(`Discount applied! You saved $${discountAmount.toFixed(2)}`);
      setDiscountCode('');
    } else {
      setDiscountError('Invalid discount code');
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'line1', 'city', 'state', 'zipCode'];
    
    requiredFields.forEach(field => {
      if (!shippingAddress[field] || !shippingAddress[field].trim()) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
      }
    });
    
    // Email validation
    if (shippingAddress.email && !/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (shippingAddress.phone && !/^\d{10,}$/.test(shippingAddress.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleProceedToShipping = () => {
    // Validate form
    if (!validateForm()) {
      alert('Please fill in all required fields correctly');
      return;
    }
    
    // Create order object with address details
    const orderData = {
      ...existingOrder,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      items: cartItems,
      subtotal,
      discount,
      total,
      orderStatus: 'pending',
      step: 'shipping',
      updatedAt: new Date().toISOString(),
    };
    
    // Save to order slice
    dispatch(setCurrentOrder(orderData));
    
    // Navigate to shipping step
    navigate('/checkout/shipping');
  };
  
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
  // Calculate taxes
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const finalTotal = subtotal + taxes - (discount || 0);
  
  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Checkout</h3>
            <div className="ms-auto">
              <Breadcrumbs />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-4">
        <div className="container">
          <div className="shop-cart">
            <div className="row">
              <div className="col-12 col-xl-8">
                <div className="checkout-details">
                  <CheckoutSteps currentStep="details" />
                  
                  {currentUser && (
                    <div className="card rounded-0">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div>
                            <img 
                              src={currentUser.avatar || "assets/images/avatars/avatar-1.png"} 
                              width="90" 
                              alt="" 
                              className="rounded-circle p-1 border" 
                            />
                          </div>
                          <div className="ms-2">
                            <h6 className="mb-0">{`${currentUser.firstName || ''} ${currentUser.lastName || ''}`}</h6>
                            <p className="mb-0">{currentUser.email}</p>
                          </div>
                          <div className="ms-auto">
                            <button 
                              onClick={() => navigate('/profile')} 
                              className="btn btn-light btn-ecomm"
                            >
                              <i className='bx bx-edit'></i> Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="card rounded-0">
                    <div className="card-body">
                      <div className="border p-3">
                        <h2 className="h5 mb-0">Shipping Address</h2>
                        <div className="my-3 border-bottom"></div>
                        <div className="form-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">First Name *</label>
                              <input 
                                type="text" 
                                className={`form-control rounded-0 ${validationErrors.firstName ? 'is-invalid' : ''}`}
                                value={shippingAddress.firstName}
                                onChange={(e) => handleShippingChange('firstName', e.target.value)}
                              />
                              {validationErrors.firstName && (
                                <div className="invalid-feedback">{validationErrors.firstName}</div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Last Name *</label>
                              <input 
                                type="text" 
                                className={`form-control rounded-0 ${validationErrors.lastName ? 'is-invalid' : ''}`}
                                value={shippingAddress.lastName}
                                onChange={(e) => handleShippingChange('lastName', e.target.value)}
                              />
                              {validationErrors.lastName && (
                                <div className="invalid-feedback">{validationErrors.lastName}</div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">E-mail *</label>
                              <input 
                                type="email" 
                                className={`form-control rounded-0 ${validationErrors.email ? 'is-invalid' : ''}`}
                                value={shippingAddress.email}
                                onChange={(e) => handleShippingChange('email', e.target.value)}
                              />
                              {validationErrors.email && (
                                <div className="invalid-feedback">{validationErrors.email}</div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Phone Number *</label>
                              <input 
                                type="tel" 
                                className={`form-control rounded-0 ${validationErrors.phone ? 'is-invalid' : ''}`}
                                value={shippingAddress.phone}
                                onChange={(e) => handleShippingChange('phone', e.target.value)}
                                placeholder="(555) 123-4567"
                              />
                              {validationErrors.phone && (
                                <div className="invalid-feedback">{validationErrors.phone}</div>
                              )}
                            </div>
                            <div className="col-md-12">
                              <label className="form-label">Address Line 1 *</label>
                              <input 
                                type="text" 
                                className={`form-control rounded-0 ${validationErrors.line1 ? 'is-invalid' : ''}`}
                                value={shippingAddress.line1}
                                onChange={(e) => handleShippingChange('line1', e.target.value)}
                                placeholder="Street address, P.O. box"
                              />
                              {validationErrors.line1 && (
                                <div className="invalid-feedback">{validationErrors.line1}</div>
                              )}
                            </div>
                            <div className="col-md-12">
                              <label className="form-label">Address Line 2</label>
                              <input 
                                type="text" 
                                className="form-control rounded-0"
                                value={shippingAddress.line2}
                                onChange={(e) => handleShippingChange('line2', e.target.value)}
                                placeholder="Apartment, suite, unit, building, floor, etc."
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">City *</label>
                              <input 
                                type="text" 
                                className={`form-control rounded-0 ${validationErrors.city ? 'is-invalid' : ''}`}
                                value={shippingAddress.city}
                                onChange={(e) => handleShippingChange('city', e.target.value)}
                              />
                              {validationErrors.city && (
                                <div className="invalid-feedback">{validationErrors.city}</div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">State/Province *</label>
                              <select 
                                className={`form-select rounded-0 ${validationErrors.state ? 'is-invalid' : ''}`}
                                value={shippingAddress.state}
                                onChange={(e) => handleShippingChange('state', e.target.value)}
                              >
                                <option value="">Select State</option>
                                <option value="CA">California</option>
                                <option value="TX">Texas</option>
                                <option value="NY">New York</option>
                                <option value="FL">Florida</option>
                                <option value="IL">Illinois</option>
                                <option value="PA">Pennsylvania</option>
                              </select>
                              {validationErrors.state && (
                                <div className="invalid-feedback">{validationErrors.state}</div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Zip/Postal Code *</label>
                              <input 
                                type="text" 
                                className={`form-control rounded-0 ${validationErrors.zipCode ? 'is-invalid' : ''}`}
                                value={shippingAddress.zipCode}
                                onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                                placeholder="12345"
                              />
                              {validationErrors.zipCode && (
                                <div className="invalid-feedback">{validationErrors.zipCode}</div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Country *</label>
                              <select 
                                className="form-select rounded-0"
                                value={shippingAddress.country}
                                onChange={(e) => handleShippingChange('country', e.target.value)}
                              >
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                              </select>
                            </div>
                            
                            <div className="col-md-12">
                              <h6 className="mb-0 h5">Billing Address</h6>
                              <div className="my-3 border-bottom"></div>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="gridCheck" 
                                  checked={sameAsShipping}
                                  onChange={(e) => setSameAsShipping(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="gridCheck">
                                  Same as shipping address
                                </label>
                              </div>
                            </div>
                            
                            <div className="col-md-6">
                              <div className="d-grid">
                                <button 
                                  type="button"
                                  onClick={handleBackToCart}
                                  className="btn btn-light btn-ecomm"
                                >
                                  <i className='bx bx-chevron-left'></i>Back to Cart
                                </button>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-grid">
                                <button 
                                  type="button"
                                  onClick={handleProceedToShipping}
                                  className="btn btn-white btn-ecomm"
                                >
                                  Proceed to Shipping<i className='bx bx-chevron-right'></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-xl-4">
                <div className="order-summary">
                  <div className="card rounded-0">
                    <div className="card-body">
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5">Apply Discount Code</p>
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control rounded-0" 
                              placeholder="Enter discount code"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button 
                              className="btn btn-light btn-ecomm" 
                              type="button"
                              onClick={handleApplyDiscount}
                            >
                              Apply
                            </button>
                          </div>
                          {discountError && (
                            <small className="text-danger mt-2 d-block">{discountError}</small>
                          )}
                          {discount > 0 && (
                            <small className="text-success mt-2 d-block">
                              <i className="bx bx-check-circle me-1"></i>
                              Discount applied: ${discount.toFixed(2)}
                            </small>
                          )}
                        </div>
                      </div>
                      
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5">Order Summary</p>
                          <div className="my-3 border-top"></div>
                          
                          <p className="mb-2">
                            Items ({cartItems.length}): 
                            <span className="float-end">${subtotal.toFixed(2)}</span>
                          </p>
                          
                          {cartItems.slice(0, 3).map((item, index) => (
                            <div key={item.productId} className="mb-2">
                              <small className="text-muted">
                                {item.name} (x{item.quantity})
                              </small>
                            </div>
                          ))}
                          {cartItems.length > 3 && (
                            <small className="text-muted">
                              +{cartItems.length - 3} more items
                            </small>
                          )}
                        </div>
                      </div>
                      
                      <div className="card rounded-0 border bg-transparent mb-0 shadow-none">
                        <div className="card-body">
                          <p className="mb-2">
                            Subtotal: <span className="float-end">${subtotal.toFixed(2)}</span>
                          </p>
                          <p className="mb-2">
                            Shipping: <span className="float-end">Calculated at next step</span>
                          </p>
                          <p className="mb-2">
                            Taxes (7%): <span className="float-end">${taxes.toFixed(2)}</span>
                          </p>
                          {discount > 0 && (
                            <p className="mb-0 text-success">
                              Discount: <span className="float-end">-${discount.toFixed(2)}</span>
                            </p>
                          )}
                          <div className="my-3 border-top"></div>
                          <h5 className="mb-0">
                            Estimated Total: <span className="float-end">${finalTotal.toFixed(2)}</span>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CheckoutDetails;