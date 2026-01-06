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
import {
  selectCurrentOrder,
  updateCurrentOrder,
} from '../../features/orders/slice';
import CheckoutSteps from "./components/CheckoutSteps";

const CheckoutShipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const currentShipping = useSelector(selectCartShipping);
  const discount = useSelector(selectCartDiscount);
  const currentOrder = useSelector(selectCurrentOrder);

  // Local state
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Shipping methods
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '5-7 days', fee: 0.00, description: 'Free standard shipping' },
    { id: 'express', name: 'Express Shipping', time: '2-3 days', fee: 10.00, description: 'Faster delivery' },
    { id: 'overnight', name: 'Overnight Delivery', time: '1 day', fee: 25.00, description: 'Next day delivery' },
    { id: 'international', name: 'International Shipping', time: '10-15 days', fee: 35.00, description: 'Worldwide delivery' },
  ];

  // Set default or existing shipping method on mount
  useEffect(() => {
    if (currentOrder?.shippingMethodId) {
      // Restore from existing order
      setSelectedShipping(currentOrder.shippingMethodId);
      const method = shippingMethods.find(m => m.id === currentOrder.shippingMethodId);
      if (method) {
        dispatch(setShipping(method.fee));
      }
    } else if (shippingMethods.length > 0) {
      // Set default to first method
      const defaultMethod = shippingMethods[0];
      setSelectedShipping(defaultMethod.id);
      dispatch(setShipping(defaultMethod.fee));
    }
  }, []);

  // Validate that user has completed previous steps
  useEffect(() => {
    if (!currentOrder?.shippingAddress?.line1) {
      alert('Please complete shipping address first');
      navigate('/checkout/details');
    }
  }, [currentOrder, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      navigate('/products');
    }
  }, [cartItems, navigate]);

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

    setTimeout(() => {
      const validCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'FLAT15': 15.00,
        'WELCOME': 0.15,
      };

      const discountValue = validCodes[discountCode.toUpperCase()];

      if (discountValue) {
        let discountAmount;
        if (discountValue < 1) {
          discountAmount = subtotal * discountValue;
        } else {
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

    // Get selected shipping method details
    const shippingMethod = shippingMethods.find(m => m.id === selectedShipping);
    
    // Update order with shipping information
    const updatedOrder = {
      ...currentOrder,
      shippingMethodId: selectedShipping,
      shippingMethod: shippingMethod?.name,
      shippingCost: shippingMethod?.fee || 0,
      estimatedDelivery: shippingMethod?.time,
      step: 'payment',
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateCurrentOrder(updatedOrder));
    navigate('/checkout/payment');
  };

  // Calculate taxes
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const orderTotal = subtotal + currentShipping + taxes - discount;

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
                  <CheckoutSteps currentStep="shipping" />

                  {/* Shipping Address Summary */}
                  {currentOrder?.shippingAddress && (
                    <div className="card rounded-0 shadow-none">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-2">Shipping To:</h6>
                            <p className="mb-1">
                              <strong>
                                {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                              </strong>
                            </p>
                            <p className="mb-1 text-muted">
                              {currentOrder.shippingAddress.line1}
                              {currentOrder.shippingAddress.line2 && `, ${currentOrder.shippingAddress.line2}`}
                            </p>
                            <p className="mb-0 text-muted">
                              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('/checkout/details')}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bx bx-edit me-1"></i>Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Methods */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <h2 className="h5 mb-0">Choose Shipping Method</h2>
                      <div className="my-3 border-bottom"></div>
                      
                      <div className="shipping-methods">
                        {shippingMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`shipping-method-card p-3 mb-3 border rounded ${
                              selectedShipping === method.id ? 'border-primary bg-light' : ''
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleShippingSelect(method)}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="shippingMethod"
                                    id={`shipping-${method.id}`}
                                    checked={selectedShipping === method.id}
                                    onChange={() => handleShippingSelect(method)}
                                  />
                                </div>
                                <div>
                                  <h6 className="mb-1">{method.name}</h6>
                                  <p className="mb-0 text-muted small">{method.description}</p>
                                  <small className="text-muted">
                                    <i className="bx bx-time-five me-1"></i>
                                    Estimated delivery: {method.time}
                                  </small>
                                </div>
                              </div>
                              <div className="text-end">
                                <strong className="text-primary">
                                  {method.fee === 0 ? 'FREE' : `$${method.fee.toFixed(2)}`}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedShipping && (
                        <div className="alert alert-info mt-3">
                          <i className="bx bx-info-circle me-2"></i>
                          Selected: <strong>
                            {shippingMethods.find(m => m.id === selectedShipping)?.name}
                          </strong>
                          {' - '}
                          {shippingMethods.find(m => m.id === selectedShipping)?.fee === 0 
                            ? 'FREE' 
                            : `$${shippingMethods.find(m => m.id === selectedShipping)?.fee.toFixed(2)}`
                          }
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
                          <p className="fs-5">Apply Discount Code</p>
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
                              {isApplyingDiscount ? 'Applying...' : 'Apply'}
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
                          <p className="fs-5">Order Summary</p>
                          <div className="my-3 border-top"></div>
                          
                          <p className="mb-2">
                            Items ({cartItems.length}):
                            <span className="float-end">${subtotal.toFixed(2)}</span>
                          </p>

                          {cartItems.slice(0, 2).map((item) => (
                            <div key={item.productId} className="mb-2">
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image || 'assets/images/products/01.png'}
                                  width="50"
                                  alt={item.name}
                                  className="me-2"
                                />
                                <div className="flex-grow-1">
                                  <small className="d-block">{item.name}</small>
                                  <small className="text-muted">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {cartItems.length > 2 && (
                            <small className="text-muted">
                              +{cartItems.length - 2} more items
                            </small>
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
                              {currentShipping === 0 ? 'FREE' : `$${currentShipping.toFixed(2)}`}
                            </span>
                          </p>
                          <p className="mb-2">
                            Taxes (7%): <span className="float-end">${taxes.toFixed(2)}</span>
                          </p>
                          {discount > 0 && (
                            <p className="mb-0 text-success">
                              Discount: 
                              <span className="float-end">-${discount.toFixed(2)}</span>
                            </p>
                          )}
                          <div className="my-3 border-top"></div>
                          <h5 className="mb-0">
                            Order Total: 
                            <span className="float-end">${orderTotal.toFixed(2)}</span>
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