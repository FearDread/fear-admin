import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ProductCartItem from "../../components/products/ProductCartItem";
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
} from '../../features/orders/slice';

function CheckoutDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state for form
  const [shippingAddress, setShippingAddress] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    company: '',
    state: '',
    zipCode: '',
    country: 'United States',
    address1: '',
    address2: '',
  });
  
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    state: '',
    zipCode: '',
    country: 'United States',
    address1: '',
    address2: '',
  });
  
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout/details');
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop-cart');
    }
  }, [cartItems, navigate]);
  
  // Update form when user data loads
  useEffect(() => {
    if (currentUser) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: currentUser.firstName || prev.firstName,
        lastName: currentUser.lastName || prev.lastName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
      }));
    }
  }, [currentUser]);
  
  const handleShippingChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBillingChange = (field, value) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    // Mock discount validation - replace with actual API call
    const validCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME': 15,
    };
    
    const discountAmount = validCodes[discountCode.toUpperCase()];
    
    if (discountAmount) {
      dispatch(applyDiscount(discountAmount));
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code');
    }
  };
  
  const handleProceedToShipping = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
     // alert('Please fill in all required fields');
      //return;
    }
    
    // Create initial order object
    const orderData = {
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      items: cartItems,
      subtotal,
      discount,
      total,
      status: 'pending',
      step: 'shipping', // Track checkout step
    };
    
    // Save to order slice
    dispatch(setCurrentOrder(orderData));
    
    // Navigate to shipping step
    navigate('/checkout/shipping');
  };
  
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
  // Calculate taxes (mock calculation - 7%)
  const taxes = subtotal * 0.07;
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
                  <div className="card bg-transparent rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="steps steps-light">
                        <a className="step-item active" href="/cart">
                          <div className="step-progress"><span className="step-count">1</span></div>
                          <div className="step-label"><i className='bx bx-cart'></i>Cart</div>
                        </a>
                        <a className="step-item active current" href="/checkout/details">
                          <div className="step-progress"><span className="step-count">2</span></div>
                          <div className="step-label"><i className='bx bx-user-circle'></i>Details</div>
                        </a>
                        <a className="step-item" href="/checkout/shipping">
                          <div className="step-progress"><span className="step-count">3</span></div>
                          <div className="step-label"><i className='bx bx-cube'></i>Shipping</div>
                        </a>
                        <a className="step-item" href="/checkout/payment">
                          <div className="step-progress"><span className="step-count">4</span></div>
                          <div className="step-label"><i className='bx bx-credit-card'></i>Payment</div>
                        </a>
                        <a className="step-item" href="/checkout/review">
                          <div className="step-progress"><span className="step-count">5</span></div>
                          <div className="step-label"><i className='bx bx-check-circle'></i>Review</div>
                        </a>
                      </div>
                    </div>
                  </div>
                  
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
                          <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="col-md-6">
                              <label className="form-label">First Name *</label>
                              <input 
                                type="text" 
                                className="form-control rounded-0"
                                value={shippingAddress.firstName}
                                onChange={(e) => handleShippingChange('firstName', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Last Name *</label>
                              <input 
                                type="text" 
                                className="form-control rounded-0"
                                value={shippingAddress.lastName}
                                onChange={(e) => handleShippingChange('lastName', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">E-mail id *</label>
                              <input 
                                type="email" 
                                className="form-control rounded-0"
                                value={shippingAddress.email}
                                onChange={(e) => handleShippingChange('email', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Phone Number *</label>
                              <input 
                                type="tel" 
                                className="form-control rounded-0"
                                value={shippingAddress.phone}
                                onChange={(e) => handleShippingChange('phone', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Company</label>
                              <input 
                                type="text" 
                                className="form-control rounded-0"
                                value={shippingAddress.company}
                                onChange={(e) => handleShippingChange('company', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">State/Province *</label>
                              <select 
                                className="form-select rounded-0"
                                value={shippingAddress.state}
                                onChange={(e) => handleShippingChange('state', e.target.value)}
                                required
                              >
                                <option value="">Select State</option>
                                <option value="CA">California</option>
                                <option value="TX">Texas</option>
                                <option value="NY">New York</option>
                                <option value="FL">Florida</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Zip/Postal Code *</label>
                              <input 
                                type="text" 
                                className="form-control rounded-0"
                                value={shippingAddress.zipCode}
                                onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Country *</label>
                              <select 
                                className="form-select rounded-0"
                                value={shippingAddress.country}
                                onChange={(e) => handleShippingChange('country', e.target.value)}
                                required
                              >
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Address 1 *</label>
                              <textarea 
                                className="form-control rounded-0"
                                value={shippingAddress.address1}
                                onChange={(e) => handleShippingChange('address1', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Address 2</label>
                              <textarea 
                                className="form-control rounded-0"
                                value={shippingAddress.address2}
                                onChange={(e) => handleShippingChange('address2', e.target.value)}
                              />
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
                          </form>
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
                          <p className="fs-5 text-white">Apply Discount Code</p>
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
                              Apply Discount
                            </button>
                          </div>
                          {discountError && (
                            <small className="text-danger mt-2 d-block">{discountError}</small>
                          )}
                        </div>
                      </div>
                      
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5 text-white">Order summary</p>
                          <div className="my-3 border-top"></div>
                          
                          {cartItems.map((item) => (
                            <ProductCartItem {...item} />
                          ))}
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
                            Taxes: <span className="float-end">${taxes.toFixed(2)}</span>
                          </p>
                          <p className="mb-0">
                            Discount: <span className="float-end">
                              {discount ? `-$${discount.toFixed(2)}` : '--'}
                            </span>
                          </p>
                          <div className="my-3 border-top"></div>
                          <h5 className="mb-0">
                            Order Total: <span className="float-end">${finalTotal.toFixed(2)}</span>
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