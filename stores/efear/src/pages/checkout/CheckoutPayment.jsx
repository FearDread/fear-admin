import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
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
import StripePayment from "./components/StripePayment";
import CheckoutSteps from "./components/CheckoutSteps";
import { createPaymentIntent } from "../../features/payments/slice";

export const CheckoutPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const discount = useSelector(selectCartDiscount);
  const currentUser = useSelector(selectCurrentUser);
  const currentOrder = useSelector(selectCurrentOrder);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Local state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [discountCode, setDiscountCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  // Calculate taxes and final total
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const orderTotal = subtotal + shipping + taxes - discount;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout/payment' } });
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  // Create payment intent when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      if (paymentMethod === 'card' && orderTotal > 0 && !clientSecret) {
        try {
          const paymentData = {
            amount: Math.round(orderTotal * 100), // Convert to cents
            currency: 'usd',
            metadata: {
              userId: currentUser?._id,
              orderId: currentOrder?._id || 'pending',
            },
            currentUser
          };

          const result = await dispatch(createPaymentIntent(paymentData)).unwrap();
          console.log('pay intent init result = ', result);
          if (result.client_secret) {
            setClientSecret(result.client_secret);
            setPaymentIntentId(result.id);
          }
        } catch (error) {
          console.error('Failed to create payment intent:', error);
        }
      }
    };

    initializePayment();
  }, [paymentMethod, orderTotal, dispatch, currentUser, currentOrder, clientSecret]);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code');
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
      alert(`Discount applied! You saved $${discountAmount.toFixed(2)}`);
      setDiscountCode('');
      // Reset client secret to create new payment intent with updated amount
      setClientSecret('');
    } else {
      alert('Invalid discount code');
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsProcessing(true);
    
    try {
      // Generate order number
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      const orderNumber = `ORD-${timestamp}-${random}`;

      // Update order with payment details
      const updatedOrder = {
        ...currentOrder,
        orderNumber,
        userId: currentUser._id,
        items: cartItems,
        subtotal,
        shipping,
        taxes,
        discount,
        total: orderTotal,
        paymentMethod: 'card',
        paymentIntentId: paymentResult.paymentIntent?.id || paymentIntentId,
        paymentStatus: 'completed',
        orderStatus: 'confirmed',
        orderDate: new Date().toISOString(),
      };

      // Save updated order to Redux
      dispatch(updateCurrentOrder(updatedOrder));

      // Navigate to review page
      navigate('/checkout/review');
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setIsProcessing(false);
    alert(`Payment failed: ${error.message || 'Please try again'}`);
  };

  const handleBackToShipping = () => {
    navigate('/checkout/shipping');
  };

  const handlePayPalPayment = () => {
    alert('PayPal integration coming soon!');
  };

  const handleBankPayment = () => {
    alert('Net Banking integration coming soon!');
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                  { label: 'Payment', path: '/checkout/payment', icon: 'bx bx-shopping-cart', isActive: true }
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
                <div className="checkout-payment">
                  <CheckoutSteps currentStep="payment" />

                  <div className="card rounded-0 shadow-none">
                    <div className="card-header border-bottom">
                      <h2 className="h5 my-2">Choose Payment Method</h2>
                    </div>
                    <div className="card-body">
                      <ul className="nav nav-pills mb-3 border p-3" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${paymentMethod === 'card' ? 'active' : ''} rounded-0`}
                            onClick={() => setPaymentMethod('card')}
                            type="button"
                          >
                            <div className="d-flex align-items-center">
                              <div className="tab-icon"><i className='bx bx-credit-card font-18 me-1'></i></div>
                              <div className="tab-title">Credit Card</div>
                            </div>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${paymentMethod === 'paypal-payment' ? 'active' : ''} rounded-0`}
                            onClick={() => setPaymentMethod('paypal-payment')}
                            type="button"
                          >
                            <div className="d-flex align-items-center">
                              <div className="tab-icon"><i className='bx bxl-paypal font-18 me-1'></i></div>
                              <div className="tab-title">PayPal</div>
                            </div>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${paymentMethod === 'net-banking' ? 'active' : ''} rounded-0`}
                            onClick={() => setPaymentMethod('net-banking')}
                            type="button"
                          >
                            <div className="d-flex align-items-center">
                              <div className="tab-icon"><i className='bx bx-mobile font-18 me-1'></i></div>
                              <div className="tab-title">Net Banking</div>
                            </div>
                          </button>
                        </li>
                      </ul>

                      {/* Credit Card Form with Stripe */}
                      {paymentMethod === 'card' && (
                        <div className="p-3 border">
                          {clientSecret ? (
                            <StripePayment 
                              clientSecret={clientSecret}
                              amount={orderTotal}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                            />
                          ) : (
                            <div className="text-center py-3">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading payment...</span>
                              </div>
                              <p className="mt-2 text-muted">Initializing secure payment...</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PayPal Form */}
                      {paymentMethod === 'paypal-payment' && (
                        <div className="p-3 border">
                          <div className="mb-3">
                            <p className="text-muted">
                              <i className="bx bx-info-circle me-2"></i>
                              PayPal integration coming soon
                            </p>
                          </div>
                          <div className="d-grid">
                            <button
                              onClick={handlePayPalPayment}
                              className="btn btn-light rounded-0"
                              disabled
                            >
                              <i className='bx bxl-paypal me-2'></i>Continue with PayPal
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Net Banking Form */}
                      {paymentMethod === 'net-banking' && (
                        <div className="p-3 border">
                          <div className="mb-3">
                            <p className="text-muted">
                              <i className="bx bx-info-circle me-2"></i>
                              Net Banking integration coming soon
                            </p>
                          </div>
                          <div className="d-grid">
                            <button
                              onClick={handleBankPayment}
                              className="btn btn-light rounded-0"
                              disabled
                            >
                              <i className='bx bx-building me-2'></i>Continue with Net Banking
                            </button>
                          </div>
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
                              onClick={handleBackToShipping}
                              className="btn btn-light btn-ecomm"
                              disabled={isProcessing}
                            >
                              <i className="bx bx-chevron-left"></i>Back to Shipping
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
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
                            />
                            <button
                              className="btn btn-light btn-ecomm"
                              type="button"
                              onClick={handleApplyDiscount}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5">Order Summary ({cartItems.length} items)</p>
                          <div className="my-3 border-top"></div>

                          {cartItems.slice(0, 3).map((item, index) => (
                            <React.Fragment key={item.productId}>
                              {index > 0 && <div className="my-3 border-top"></div>}
                              <div className="d-flex align-items-center">
                                <Link to={`/product/${item.productId}`} className="d-block flex-shrink-0">
                                  <img
                                    src={item.image || 'assets/images/products/placeholder.png'}
                                    width="75"
                                    alt={item.name}
                                  />
                                </Link>
                                <div className="ps-2">
                                  <h6 className="mb-1">
                                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                                  </h6>
                                  <div className="widget-product-meta">
                                    <span className="me-2">${item.price.toFixed(2)}</span>
                                    <span>x {item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                          {cartItems.length > 3 && (
                            <p className="text-muted small mt-2">
                              +{cartItems.length - 3} more items
                            </p>
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
                            Shipping: <span className="float-end">
                              {shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}
                            </span>
                          </p>
                          <p className="mb-2">
                            Taxes: <span className="float-end">${taxes.toFixed(2)}</span>
                          </p>
                          <p className="mb-0">
                            Discount: <span className="float-end">
                              {discount > 0 ? `-$${discount.toFixed(2)}` : '--'}
                            </span>
                          </p>
                          <div className="my-3 border-top"></div>
                          <h5 className="mb-0">
                            Order Total: <span className="float-end">${orderTotal.toFixed(2)}</span>
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

export default CheckoutPayment;