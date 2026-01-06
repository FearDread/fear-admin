import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartDiscount,
  clearCart,
} from '../../features/cart/slice';
import {
  selectCurrentUser,
} from '../../features/user/slice';
import {
  selectCurrentOrder,
  createOrder,
} from '../../features/orders/slice';
import CheckoutSteps from './components/CheckoutSteps';

function CheckoutReview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const discount = useSelector(selectCartDiscount);
  const currentUser = useSelector(selectCurrentUser);
  const currentOrder = useSelector(selectCurrentOrder);

  // Local state
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Calculate taxes
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const orderTotal = subtotal + shipping + taxes - discount;

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  // Validate order data
  useEffect(() => {
    if (!currentOrder?.shippingAddress?.line1) {
      alert('Missing shipping address. Redirecting to checkout.');
      navigate('/checkout/details');
    } else if (!shipping || shipping === 0) {
      alert('Please select a shipping method.');
      navigate('/checkout/shipping');
    } else if (!currentOrder?.paymentIntentId) {
      alert('Payment not completed. Please complete payment.');
      navigate('/checkout/payment');
    }

  }, [currentOrder, shipping, navigate]);

  // Handle complete order
  const handleCompleteOrder = async () => {
    if (!currentOrder?.paymentIntentId) {
      alert('Payment not completed. Please return to payment.');
      navigate('/checkout/payment');
      return;
    }
    setIsProcessingOrder(true);

    try {
      // Prepare final order data
      const finalOrder = {
        ...currentOrder,
        items: cartItems.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          subtotal: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shipping,
        taxes,
        discount,
        total: orderTotal,
        userId: currentUser._id,
        customerEmail: currentUser.email,
        customerName: `${currentUser.firstName} ${currentUser.lastName}`,
        orderStatus: 'processing',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
      };

      // Create order in backend
      const result = await dispatch(createOrder(finalOrder)).unwrap();
      // Navigate to completion page
      navigate('/checkout/complete', { 
        state: { 
          order: result || finalOrder 
        } 
      });

    } catch (error) {
      console.error('Failed to process order:', error);
      alert(error.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Get addresses
  const shippingAddress = currentOrder?.shippingAddress || {};
  const billingAddress = currentOrder?.billingAddress || shippingAddress;

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Review Order</h3>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="shop-cart">
            <div className="row">
              <div className="col-12 col-xl-8">
                <div className="checkout-review">
                  <CheckoutSteps currentStep="review" />

                  {/* Order Items */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <h5 className="mb-0">Review Your Order</h5>
                      <div className="my-3 border-bottom"></div>

                      {cartItems.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="bx bx-cart-alt display-1 text-muted"></i>
                          <p className="mt-3">Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          {cartItems.map((item, index) => (
                            <React.Fragment key={item.productId}>
                              <div className="row align-items-center g-3">
                                <div className="col-12 col-lg-8">
                                  <div className="d-lg-flex align-items-center gap-3">
                                    <div className="cart-img text-center text-lg-start">
                                      <img
                                        src={item.image || 'assets/images/products/placeholder.png'}
                                        width="130"
                                        alt={item.name || item.title}
                                      />
                                    </div>
                                    <div className="cart-detail text-center text-lg-start">
                                      <h6 className="mb-2">{item.name || item.title}</h6>
                                      {item.size && (
                                        <p className="mb-0">Size: <span>{item.size}</span></p>
                                      )}
                                      {item.color && (
                                        <p className="mb-2">Color: <span>{item.color}</span></p>
                                      )}
                                      <p className="mb-0">Quantity: {item.quantity}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                  <div className="text-center text-lg-end">
                                    <h5 className="mb-0">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </h5>
                                    <small className="text-muted">
                                      ${item.price.toFixed(2)} each
                                    </small>
                                  </div>
                                </div>
                              </div>
                              {index < cartItems.length - 1 && (
                                <div className="my-4 border-top"></div>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Shipping and Payment Info */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="shipping-address">
                            <h5 className="mb-3">Shipping Address</h5>
                            {shippingAddress.firstName ? (
                              <>
                                <p className="mb-1">
                                  <strong>{shippingAddress.firstName} {shippingAddress.lastName}</strong>
                                </p>
                                <p className="mb-1">{shippingAddress.line1}</p>
                                {shippingAddress.line2 && (
                                  <p className="mb-1">{shippingAddress.line2}</p>
                                )}
                                <p className="mb-1">
                                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                </p>
                                <p className="mb-1">{shippingAddress.country}</p>
                                {shippingAddress.phone && (
                                  <p className="mb-1">
                                    <i className="bx bx-phone me-1"></i>
                                    {shippingAddress.phone}
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bx bx-error-circle me-2"></i>
                                No shipping address found
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="payment-info">
                            <h5 className="mb-3">Payment Method</h5>
                            <div className="d-flex align-items-center mb-3">
                              <i className="bx bx-credit-card display-6 me-3 text-primary"></i>
                              <div>
                                <p className="mb-0">Credit Card</p>
                                <small className="text-muted">
                                  Payment completed securely
                                </small>
                              </div>
                            </div>
                            {currentOrder?.paymentIntentId && (
                              <div className="alert alert-success">
                                <i className="bx bx-check-circle me-2"></i>
                                Payment authorized
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <h5 className="mb-3">Shipping Method</h5>
                      <div className="d-flex align-items-center">
                        <i className="bx bx-package display-6 me-3 text-primary"></i>
                        <div>
                          <p className="mb-0">
                            {currentOrder?.shippingMethod || 'Standard Shipping'}
                          </p>
                          <small className="text-muted">
                            Estimated delivery: 2-5 business days
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-grid">
                            <button
                              onClick={() => navigate('/checkout/payment')}
                              className="btn btn-light btn-ecomm"
                              disabled={isProcessingOrder}
                            >
                              <i className="bx bx-chevron-left"></i>Back to Payment
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-grid">
                            <button
                              onClick={handleCompleteOrder}
                              className="btn btn-white btn-ecomm"
                              disabled={isProcessingOrder || cartItems.length === 0}
                            >
                              {isProcessingOrder ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Processing...
                                </>
                              ) : (
                                <>Complete Order<i className="bx bx-chevron-right"></i></>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Order Summary */}
              <div className="col-12 col-xl-4">
                <div className="order-summary">
                  <div className="card rounded-0">
                    <div className="card-body">
                      <h5 className="mb-3">Order Summary</h5>
                      
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>
                          {shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Taxes (7%):</span>
                        <span>${taxes.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Discount:</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="my-3 border-top"></div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <strong>Order Total:</strong>
                        <strong className="text-primary">${orderTotal.toFixed(2)}</strong>
                      </div>

                      <div className="d-grid">
                        <button
                          onClick={handleCompleteOrder}
                          className="btn btn-white btn-ecomm"
                          disabled={isProcessingOrder || cartItems.length === 0}
                        >
                          {isProcessingOrder ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            'Complete Order'
                          )}
                        </button>
                      </div>

                      <div className="alert alert-info mt-3 mb-0">
                        <small>
                          <i className="bx bx-info-circle me-2"></i>
                          By completing this order, you agree to our terms and conditions.
                        </small>
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

export default CheckoutReview;