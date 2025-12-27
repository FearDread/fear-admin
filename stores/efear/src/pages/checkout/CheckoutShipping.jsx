import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartDiscount,
  setShipping,
  applyDiscount,
} from '../../features/cart/slice';

const CheckoutShipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const currentShipping = useSelector(selectCartShipping);
  const discount = useSelector(selectCartDiscount);

  // Local state
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Shipping methods
  const shippingMethods = [
    { id: 'flat', name: 'Flat Rate', time: '2 days', fee: 10.00 },
    { id: 'international', name: 'International shipping', time: '12 days', fee: 12.00 },
    { id: 'same-day', name: 'Same day delivery', time: '1 day', fee: 22.00 },
    { id: 'expedited', name: 'Expedited shipping', time: '--', fee: 15.00 },
    { id: 'local', name: 'Local Pickup', time: '--', fee: 0.00 },
    { id: 'ups', name: 'UPS Ground', time: '2-5 days', fee: 16.00 },
  ];

  // Set default shipping method on mount
  useEffect(() => {
    if (currentShipping === 0 && shippingMethods.length > 0) {
      const defaultMethod = shippingMethods[0];
      setSelectedShipping(defaultMethod.id);
      dispatch(setShipping(defaultMethod.fee));
    } else if (currentShipping > 0) {
      // Find the shipping method that matches current shipping cost
      const method = shippingMethods.find(m => m.fee === currentShipping);
      if (method) {
        setSelectedShipping(method.id);
      }
    }
  }, []);

  // Handle shipping method selection
  const handleShippingSelect = (method) => {
    setSelectedShipping(method.id);
    dispatch(setShipping(method.fee));
  };

  // Handle discount code application
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);

    // Simulate discount code validation
    // In real app, this would be an API call
    setTimeout(() => {
      const validCodes = {
        'SAVE10': 0.10, // 10% off
        'SAVE20': 0.20, // 20% off
        'FLAT15': 15.00, // $15 flat discount
      };

      const discountValue = validCodes[discountCode.toUpperCase()];

      if (discountValue) {
        let discountAmount;
        if (discountValue < 1) {
          // Percentage discount
          discountAmount = subtotal * discountValue;
        } else {
          // Flat discount
          discountAmount = discountValue;
        }

        dispatch(applyDiscount(discountAmount));
        alert(`Discount code applied! You saved $${discountAmount.toFixed(2)}`);
        setDiscountCode('');
      } else {
        alert('Invalid discount code');
      }

      setIsApplyingDiscount(false);
    }, 500);
  };

  // Navigation handlers
  const handleBackToDetails = () => {
    navigate('/checkout/details');
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping) {
      alert('Please select a shipping method');
      return;
    }
    navigate('/checkout/payment');
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      navigate('/products');
    }
  }, [cartItems, navigate]);

  // Calculate taxes (example: 7% tax)
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Checkout</h3>
            <div className="ms-auto">
              <Breadcrumbs
                items={[
                  { label: 'Checkout', path: '/checkout/details', icon: 'bx bx-check' },
                  { label: 'Shipping', path: '/checkout/shipping', icon: 'bx bx-shopping-cart', isActive: true }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="shop-cart">
            <div className="row">
              <div className="col-12 col-xl-8">
                <div className="checkout-shipping">
                  {/* Progress Steps */}
                  <div className="card bg-transparent rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="steps steps-light">
                        <a className="step-item active" href="#" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
                          <div className="step-progress"><span className="step-count">1</span></div>
                          <div className="step-label"><i className='bx bx-cart'></i>Cart</div>
                        </a>
                        <a className="step-item active" href="#" onClick={(e) => { e.preventDefault(); navigate('/checkout/details'); }}>
                          <div className="step-progress"><span className="step-count">2</span></div>
                          <div className="step-label"><i className='bx bx-user-circle'></i>Details</div>
                        </a>
                        <a className="step-item active current" href="#" onClick={(e) => e.preventDefault()}>
                          <div className="step-progress"><span className="step-count">3</span></div>
                          <div className="step-label"><i className='bx bx-cube'></i>Shipping</div>
                        </a>
                        <a className="step-item" href="#" onClick={(e) => e.preventDefault()}>
                          <div className="step-progress"><span className="step-count">4</span></div>
                          <div className="step-label"><i className='bx bx-credit-card'></i>Payment</div>
                        </a>
                        <a className="step-item" href="#" onClick={(e) => e.preventDefault()}>
                          <div className="step-progress"><span className="step-count">5</span></div>
                          <div className="step-label"><i className='bx bx-check-circle'></i>Review</div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <h2 className="h5 mb-0">Choose Shipping Method</h2>
                      <div className="my-3 border-bottom"></div>
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th>Select</th>
                              <th>Method</th>
                              <th>Time</th>
                              <th>Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shippingMethods.map((method) => (
                              <tr
                                key={method.id}
                                className={selectedShipping === method.id ? 'table-active' : ''}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleShippingSelect(method)}
                              >
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="shippingMethod"
                                      id={`shipping-${method.id}`}
                                      checked={selectedShipping === method.id}
                                      onChange={() => handleShippingSelect(method)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <label
                                    htmlFor={`shipping-${method.id}`}
                                    style={{ cursor: 'pointer', marginBottom: 0 }}
                                  >
                                    {method.name}
                                  </label>
                                </td>
                                <td>{method.time}</td>
                                <td>
                                  <strong>${method.fee.toFixed(2)}</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {selectedShipping && (
                        <div className="alert alert-info mt-3">
                          <i className="bx bx-info-circle me-2"></i>
                          Selected shipping method: <strong>
                            {shippingMethods.find(m => m.id === selectedShipping)?.name}
                          </strong> - $
                          {shippingMethods.find(m => m.id === selectedShipping)?.fee.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-grid">
                            <button
                              onClick={handleBackToDetails}
                              className="btn btn-light btn-ecomm"
                            >
                              <i className="bx bx-chevron-left"></i>Back to Details
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-grid">
                            <button
                              onClick={handleProceedToPayment}
                              className="btn btn-white btn-ecomm"
                              disabled={!selectedShipping}
                            >
                              Proceed to Payment<i className="bx bx-chevron-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-12 col-xl-4">
                <div className="order-summary">
                  <div className="card rounded-0">
                    <div className="card-body">
                      {/* Discount Code */}
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
                              onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                            />
                            <button
                              className="btn btn-light btn-ecomm"
                              type="button"
                              onClick={handleApplyDiscount}
                              disabled={isApplyingDiscount || !discountCode.trim()}
                            >
                              {isApplyingDiscount ? 'Applying...' : 'Apply Discount'}
                            </button>
                          </div>
                          {discount > 0 && (
                            <div className="alert alert-success mt-2 mb-0">
                              <small>
                                <i className="bx bx-check-circle me-1"></i>
                                Discount applied: ${discount.toFixed(2)}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5 text-white">Order summary</p>
                          <div className="my-3 border-top"></div>
                          
                          {cartItems.length === 0 ? (
                            <p className="text-center text-muted">Your cart is empty</p>
                          ) : (
                            <>
                              {cartItems.map((item, index) => (
                                <React.Fragment key={item.productId || index}>
                                  <div className="d-flex align-items-center">
                                    <a
                                      className="d-block flex-shrink-0"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/products/${item.productId}`);
                                      }}
                                    >
                                      <img
                                        src={item.image || 'assets/images/products/01.png'}
                                        width="75"
                                        alt={item.name || item.title}
                                      />
                                    </a>
                                    <div className="ps-2">
                                      <h6 className="mb-1">
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/products/${item.productId}`);
                                          }}
                                        >
                                          {item.name || item.title}
                                        </a>
                                      </h6>
                                      <div className="widget-product-meta">
                                        <span className="me-2">
                                          ${item.price?.toFixed(2) || '0.00'}
                                        </span>
                                        <span>x {item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {index < cartItems.length - 1 && (
                                    <div className="my-3 border-top"></div>
                                  )}
                                </React.Fragment>
                              ))}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Order Totals */}
                      <div className="card rounded-0 border bg-transparent mb-0 shadow-none">
                        <div className="card-body">
                          <p className="mb-2">
                            Subtotal: <span className="float-end">${subtotal.toFixed(2)}</span>
                          </p>
                          <p className="mb-2">
                            Shipping: 
                            <span className="float-end">
                              {currentShipping > 0 ? `$${currentShipping.toFixed(2)}` : '--'}
                            </span>
                          </p>
                          <p className="mb-2">
                            Taxes (7%): <span className="float-end">${taxes.toFixed(2)}</span>
                          </p>
                          <p className="mb-0">
                            Discount: 
                            <span className="float-end text-success">
                              {discount > 0 ? `-$${discount.toFixed(2)}` : '--'}
                            </span>
                          </p>
                          <div className="my-3 border-top"></div>
                          <h5 className="mb-0">
                            Order Total: 
                            <span className="float-end">
                              ${(total + taxes).toFixed(2)}
                            </span>
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
};

export default CheckoutShipping;