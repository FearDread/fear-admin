import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  createOrder,
  selectOrdersLoading,
  selectOrdersError,
} from '../../features/orders/slice';
import {
  selectCurrentUser,
} from '../../features/user/slice';
import {
  clearCart,
} from '../../features/cart/slice';

function CheckoutComplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from navigation state
  const orderData = location.state?.order;

  // Redux selectors
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  // Local state
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Generate order number
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${timestamp}${random}`;
  };

  // Create order on mount
  useEffect(() => {
    const processOrder = async () => {
      if (!orderData) {
        // Redirect to cart if no order data
        navigate('/cart');
        return;
      }

      setIsCreatingOrder(true);

      try {
        const orderNum = generateOrderNumber();
        setOrderNumber(orderNum);

        const completeOrder = {
          ...orderData,
          orderNumber: orderNum,
          userId: currentUser?._id,
          status: 'confirmed',
          confirmationDate: new Date().toISOString(),
        };

        // Dispatch create order action
        // await dispatch(createOrder(completeOrder)).unwrap();
        
        setOrderDetails(completeOrder);
        
        // Clear cart
        dispatch(clearCart());

        // Send confirmation email (mock)
        console.log('Order confirmation email sent to:', currentUser?.email);

      } catch (error) {
        console.error('Failed to create order:', error);
      } finally {
        setIsCreatingOrder(false);
      }
    };

    processOrder();
  }, [orderData, currentUser, dispatch, navigate]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle navigation
  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleTrackOrder = () => {
    if (orderNumber) {
      navigate(`/account/orders/${orderNumber}`);
    } else {
      navigate('/account/orders');
    }
  };

  const handleViewOrderDetails = () => {
    navigate('/account/orders');
  };

  // Loading state
  if (isCreatingOrder) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Processing...</span>
            </div>
            <h4>Processing your order...</h4>
            <p className="text-muted">Please wait while we confirm your purchase</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !orderDetails) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="bx bx-error-circle display-1 text-danger"></i>
              <h3 className="mt-3">Order Processing Failed</h3>
              <p className="text-muted">{error.message || 'Something went wrong. Please try again.'}</p>
              <button className="btn btn-primary mt-3" onClick={() => navigate('/cart')}>
                Return to Cart
              </button>
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
            <h3 className="breadcrumb-title pe-3">Order Confirmation</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                      <i className="bx bx-home-alt"></i> Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/checkout" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
                      Checkout
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Complete
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          {/* Success Message */}
          <div className="card py-3 mt-sm-3 border-success">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="success-checkmark mx-auto mb-3">
                  <i className="bx bx-check-circle display-1 text-success"></i>
                </div>
                <h2 className="h4 pb-3 text-success">Thank you for your order!</h2>
              </div>

              <div className="order-confirmation-details mb-4">
                <p className="fs-sm mb-2">
                  Your order has been placed and will be processed as soon as possible.
                </p>
                <p className="fs-sm mb-2">
                  Make sure you make note of your order number, which is{' '}
                  <span className="fw-bold text-primary fs-5">{orderNumber}</span>
                </p>
                <p className="fs-sm mb-3">
                  You will be receiving an email shortly with confirmation of your order at{' '}
                  <strong>{currentUser?.email || 'your email address'}</strong>
                </p>
              </div>

              {/* Order Summary */}
              {orderDetails && (
                <div className="card bg-light mx-auto mb-4" style={{ maxWidth: '600px' }}>
                  <div className="card-body">
                    <h5 className="card-title text-start mb-3">Order Summary</h5>
                    <div className="text-start">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Order Number:</span>
                        <strong>{orderNumber}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Order Date:</span>
                        <span>{formatDate(orderDetails.orderDate)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Items:</span>
                        <span>{orderDetails.items?.length || 0} item(s)</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Subtotal:</span>
                        <span>${orderDetails.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Shipping:</span>
                        <span>${orderDetails.shipping?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Tax:</span>
                        <span>${orderDetails.taxes?.toFixed(2)}</span>
                      </div>
                      {orderDetails.discount > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Discount:</span>
                          <span className="text-success">-${orderDetails.discount?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-top pt-2 mt-2">
                        <div className="d-flex justify-content-between">
                          <strong>Total:</strong>
                          <strong className="text-primary">${orderDetails.total?.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information */}
              {orderDetails?.shippingAddress && (
                <div className="card bg-light mx-auto mb-4" style={{ maxWidth: '600px' }}>
                  <div className="card-body">
                    <h5 className="card-title text-start mb-3">Shipping Address</h5>
                    <address className="text-start mb-0">
                      {orderDetails.shippingAddress.name}<br />
                      {orderDetails.shippingAddress.address1}<br />
                      {orderDetails.shippingAddress.address2 && (
                        <>{orderDetails.shippingAddress.address2}<br /></>
                      )}
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}<br />
                      {orderDetails.shippingAddress.country}
                    </address>
                  </div>
                </div>
              )}

              {/* What's Next */}
              <div className="alert alert-info text-start mx-auto mb-4" style={{ maxWidth: '600px' }}>
                <h6 className="alert-heading">
                  <i className="bx bx-info-circle me-2"></i>What happens next?
                </h6>
                <ul className="mb-0 ps-3">
                  <li>You'll receive an order confirmation email shortly</li>
                  <li>We'll send you a shipping notification when your order ships</li>
                  <li>Track your order anytime from your account dashboard</li>
                  <li>Contact customer support if you have any questions</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                <button
                  className="btn btn-light rounded-0 btn-ecomm"
                  onClick={handleContinueShopping}
                >
                  <i className="bx bx-shopping-bag me-2"></i>
                  Continue Shopping
                </button>
                <button
                  className="btn btn-white rounded-0 btn-ecomm"
                  onClick={handleTrackOrder}
                >
                  <i className="bx bx-map me-2"></i>
                  Track Order
                </button>
                <button
                  className="btn btn-outline-primary rounded-0 btn-ecomm"
                  onClick={handleViewOrderDetails}
                >
                  <i className="bx bx-receipt me-2"></i>
                  View Orders
                </button>
              </div>

              {/* Customer Support */}
              <div className="mt-5 pt-4 border-top">
                <p className="text-muted mb-2">
                  <small>Need help? Contact our customer support</small>
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <a href="mailto:support@example.com" className="text-decoration-none">
                    <i className="bx bx-envelope me-1"></i>
                    Email Support
                  </a>
                  <a href="tel:+1234567890" className="text-decoration-none">
                    <i className="bx bx-phone me-1"></i>
                    Call Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Print Receipt Option */}
          <div className="text-center mt-3">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => window.print()}
            >
              <i className="bx bx-printer me-1"></i>
              Print Receipt
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default CheckoutComplete;