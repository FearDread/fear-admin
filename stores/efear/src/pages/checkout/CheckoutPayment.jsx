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
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  selectCurrentOrder,
} from '../../features/orders/slice';
import StripePayment from "./components/StripePayment";
import CheckoutSteps from "./components/CheckoutSteps";
import { createOrder } from "../../features/orders/slice";
import { createPayments, createPaymentIntent } from "../../features/payments/slice";

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
  const [validationErrors, setValidationErrors] = useState({});

  // Credit Card state
  const [creditCardData, setCreditCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  // PayPal state
  const [paypalAccountType, setPaypalAccountType] = useState('domestic');
  const [selectedBank, setSelectedBank] = useState('');
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const orderTotal = total + taxes;

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

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.slice(0, 19); // 16 digits + 3 spaces
    }

    // Limit expiry month/year
    if (name === 'expiryMonth') {
      formattedValue = value.slice(0, 2);
    }
    if (name === 'expiryYear') {
      formattedValue = value.slice(0, 2);
    }
    if (name === 'cvv') {
      formattedValue = value.slice(0, 4);
    }

    setCreditCardData({
      ...creditCardData,
      [name]: formattedValue,
    });

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code');
      return;
    }

    // Example discount codes
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
    } else {
      alert('Invalid discount code');
    }
  };

  const validateCreditCard = () => {
    const errors = {};

    if (!creditCardData.cardName.trim()) {
      errors.cardName = 'Card owner name is required';
    }

    const cardNumberClean = creditCardData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      errors.cardNumber = 'Card number is required';
    } else if (cardNumberClean.length !== 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    } else if (!/^\d+$/.test(cardNumberClean)) {
      errors.cardNumber = 'Card number must contain only digits';
    }

    if (!creditCardData.expiryMonth) {
      errors.expiryMonth = 'Required';
    } else if (parseInt(creditCardData.expiryMonth) < 1 || parseInt(creditCardData.expiryMonth) > 12) {
      errors.expiryMonth = 'Invalid month';
    }

    if (!creditCardData.expiryYear) {
      errors.expiryYear = 'Required';
    }

    if (!creditCardData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (creditCardData.cvv.length < 3) {
      errors.cvv = 'CVV must be 3-4 digits';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayPal = () => {
    if (!paypalAccountType) {
      alert('Please select PayPal account type');
      return false;
    }
    return true;
  };

  const validateNetBanking = () => {
    if (!selectedBank) {
      alert('Please select your bank');
      return false;
    }
    return true;
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    let isValid = false;

    // Validate based on payment method
    switch (paymentMethod) {
      case 'card':
        isValid = validateCreditCard();
        break;
      case 'paypal-payment':
        isValid = validatePayPal();
        break;
      case 'net-banking':
        isValid = validateNetBanking();
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsProcessing(true);
    try {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      const orderNumber = `ORD-${timestamp}-${random}`;
      // Simulate payment processing
      //await new Promise(resolve => setTimeout(resolve, 2000));
      const orderData = {
        orderNumber,
        userId: currentUser._id,
        items: cartItems,
        subtotal: orderTotal,
        shipping,
        taxes,
        discount,
        total: orderTotal,
        paymentMethod,
        paymentDetails: {
          type: 'card',
          card: CardElement,
          billing_details: {
            name: creditCardData.cardName,
            email: currentUser?.email,
          },
        },
        ...currentOrder
      };

      console.log('curent order = ', currentOrder);
      console.log('order data = ', orderData);
      
      const orderResult = await dispatch(createOrder(orderData));
      
      const paymentResult = await dispatch(createPayments(orderData));
      const paymentIntent = await dispatch(createPaymentIntent(orderData));
      
      console.log('order result', orderResult);
      console.log('payment result = ', paymentResult);
      console.log('payment intent (stripe) = ', paymentIntent);

      return;
      // Navigate to review/confirmation page
      navigate('/checkout/review', {
        state: {
          paymentMethod,
          orderTotal
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

    const handlePaymentSuccess = async (e) => {
    e.preventDefault();

    let isValid = false;

    // Validate based on payment method
    switch (paymentMethod) {
      case 'card':
        isValid = validateCreditCard();
        break;
      case 'paypal-payment':
        isValid = validatePayPal();
        break;
      case 'net-banking':
        isValid = validateNetBanking();
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsProcessing(true);
    try {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      const orderNumber = `ORD-${timestamp}-${random}`;
      // Simulate payment processing
      //await new Promise(resolve => setTimeout(resolve, 2000));
      const orderData = {
        orderNumber,
        userId: currentUser._id,
        items: cartItems,
        subtotal: orderTotal,
        shipping,
        taxes,
        discount,
        total: orderTotal,
        paymentMethod,
        paymentDetails: {
          type: 'card',
          card: CardElement,
          billing_details: {
            name: creditCardData.cardName,
            email: currentUser?.email,
          },
        },
        ...currentOrder
      };

      console.log('curent order = ', currentOrder);
      console.log('order data = ', orderData);
      
      const orderResult = await dispatch(createOrder(orderData));
      
      const paymentResult = await dispatch(createPayments(orderData));
      const paymentIntent = await dispatch(createPaymentIntent(orderData));
      
      console.log('order result', orderResult);
      console.log('payment result = ', paymentResult);
      console.log('payment intent (stripe) = ', paymentIntent);

      return;
      // Navigate to review/confirmation page
      navigate('/checkout/review', {
        state: {
          paymentMethod,
          orderTotal
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Error in intent')
  }

  const handleBackToShipping = () => {
    navigate('/checkout/shipping');
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
                  {/* Progress Steps */}

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

                      {/* Credit Card Form */}
                      {paymentMethod === 'card' && (
                        <div className="p-3 border">
                          {/* 
                          <form onSubmit={handleConfirmPayment}>
                            <div className="mb-3">
                              <label className="form-label">Card Owner *</label>
                              <input
                                type="text"
                                name="cardName"
                                className={`form-control rounded-0 ${validationErrors.cardName ? 'is-invalid' : ''}`}
                                placeholder="Card owner name"
                                value={creditCardData.cardName}
                                onChange={handleCreditCardChange}
                                disabled={isProcessing}
                              />
                              {validationErrors.cardName && (
                                <div className="invalid-feedback">{validationErrors.cardName}</div>
                              )}
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Card Number *</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  name="cardNumber"
                                  className={`form-control rounded-0 ${validationErrors.cardNumber ? 'is-invalid' : ''}`}
                                  placeholder="1234 5678 9012 3456"
                                  value={creditCardData.cardNumber}
                                  onChange={handleCreditCardChange}
                                  disabled={isProcessing}
                                />
                                <span className="input-group-text rounded-0">
                                  <img src="assets/images/icons/mastercard.png" width="35" alt="Mastercard" />
                                </span>
                                <span className="input-group-text rounded-0">
                                  <img src="assets/images/icons/visa.png" width="35" alt="Visa" />
                                </span>
                                <span className="input-group-text rounded-0">
                                  <img src="assets/images/icons/american-express.png" width="35" alt="Amex" />
                                </span>
                                {validationErrors.cardNumber && (
                                  <div className="invalid-feedback">{validationErrors.cardNumber}</div>
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12 col-lg-8">
                                <div className="mb-3">
                                  <label className="form-label">Expiration Date *</label>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      name="expiryMonth"
                                      className={`form-control rounded-0 ${validationErrors.expiryMonth ? 'is-invalid' : ''}`}
                                      placeholder="MM"
                                      value={creditCardData.expiryMonth}
                                      onChange={handleCreditCardChange}
                                      disabled={isProcessing}
                                    />
                                    <input
                                      type="text"
                                      name="expiryYear"
                                      className={`form-control rounded-0 ${validationErrors.expiryYear ? 'is-invalid' : ''}`}
                                      placeholder="YY"
                                      value={creditCardData.expiryYear}
                                      onChange={handleCreditCardChange}
                                      disabled={isProcessing}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-lg-4">
                                <div className="mb-3">
                                  <label className="form-label">CVV *</label>
                                  <input
                                    type="text"
                                    name="cvv"
                                    className={`form-control rounded-0 ${validationErrors.cvv ? 'is-invalid' : ''}`}
                                    placeholder="123"
                                    value={creditCardData.cvv}
                                    onChange={handleCreditCardChange}
                                    disabled={isProcessing}
                                  />
                                  {validationErrors.cvv && (
                                    <div className="invalid-feedback">{validationErrors.cvv}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-12">
                                <div className="d-grid">
                                  <button
                                    type="submit"
                                    className="btn btn-white btn-ecomm rounded-0"
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing Payment...
                                      </>
                                    ) : (
                                      'Confirm Payment'
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                          */}
                          <StripePayment 
                            amount={currentOrder.total}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                        </div>
                      )}

                      {/* PayPal Form */}
                      {paymentMethod === 'paypal-payment' && (
                        <div className="p-3 border">
                          <div className="mb-3">
                            <p>Select your PayPal Account type</p>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paypalType"
                                id="domestic"
                                value="domestic"
                                checked={paypalAccountType === 'domestic'}
                                onChange={(e) => setPaypalAccountType(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="domestic">Domestic</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paypalType"
                                id="international"
                                value="international"
                                checked={paypalAccountType === 'international'}
                                onChange={(e) => setPaypalAccountType(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="international">International</label>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-block">
                              <button
                                onClick={handleConfirmPayment}
                                className="btn btn-light rounded-0"
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <i className='bx bxl-paypal me-2'></i>Login to PayPal
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="mb-0 text-muted small">
                              Note: After clicking the button, you will be directed to PayPal's secure gateway.
                              After completing payment, you'll be redirected back to view your order details.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Net Banking Form */}
                      {paymentMethod === 'net-banking' && (
                        <div className="p-3 border">
                          <div className="mb-3">
                            <p>Select your Bank</p>
                            <select
                              className="form-select rounded-0"
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                            >
                              <option value="">--Please Select Your Bank--</option>
                              <option value="chase">Chase Bank</option>
                              <option value="bofa">Bank of America</option>
                              <option value="wells">Wells Fargo</option>
                              <option value="citi">Citibank</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <div className="d-block">
                              <button
                                onClick={handleConfirmPayment}
                                className="btn btn-light rounded-0"
                                disabled={isProcessing || !selectedBank}
                              >
                                {isProcessing ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <i className='bx bx-building me-2'></i>Proceed to Bank
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="mb-0 text-muted small">
                              Note: You will be redirected to your bank's secure portal for authentication and payment.
                            </p>
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

                          {cartItems.map((item, index) => (
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