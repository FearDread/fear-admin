import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  clearCart,
} from "../../features/cart/slice";
import {
  selectCurrentUser,
} from '../../features/user/slice';
import {
  clearCurrentOrder,
} from '../../features/orders/slice';

function CheckoutComplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from navigation state
  const orderData = location.state?.order;

  // Redux selectors
  const currentUser = useSelector(selectCurrentUser);

  // Local state
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  // Process order on mount
  useEffect(() => {
    if (!orderData) {
      // Redirect to cart if no order data
      navigate('/cart');
      return;
    }

    // Set order details
    setOrderDetails(orderData);
    setOrderNumber(orderData.orderNumber || generateOrderNumber());

    // Clear current order from Redux
    dispatch(clearCart());
    dispatch(clearCurrentOrder());

    // Send confirmation email (mock)
    console.log('Order confirmation email sent to:', currentUser?.email);
  }, [orderData, currentUser, dispatch, navigate]);

  // Generate order number if not provided
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}${random}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    navigate('/shop');
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
  if (!orderDetails) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading order confirmation...</h4>
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
          <div className="card py-4 mt-3 border-0 shadow-lg">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="success-checkmark mx-auto mb-4" style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  backgroundColor: '#28a745',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="bx bx-check text-white" style={{ fontSize: '60px' }}></i>
                </div>
                <h2 className="h3 mb-3 text-success">Order Placed Successfully!</h2>
                <p className="lead mb-0">Thank you for your purchase</p>
              </div>

              <div className="order-confirmation-details mb-4">
                <div className="alert alert-info mx-auto" style={{ maxWidth: '600px' }}>
                  <h5 className="mb-3">
                    <i className="bx bx-receipt me-2"></i>
                    Order Number: <strong className="text-primary">{orderNumber}</strong>
                  </h5>
                  <p className="mb-2">
                    Your order has been confirmed and will be processed shortly.
                  </p>
                  <p className="mb-0">
                    A confirmation email has been sent to{' '}
                    <strong>{orderDetails.customerEmail || currentUser?.email}</strong>
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Order Summary</h5>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-6 text-start">
                          <p className="mb-1 text-muted">Order Number</p>
                          <strong>{orderNumber}</strong>
                        </div>
                        <div className="col-6 text-end">
                          <p className="mb-1 text-muted">Order Date</p>
                          <strong>{formatDate(orderDetails.createdAt || orderDetails.orderDate)}</strong>
                        </div>
                      </div>

                      <div className="border-top pt-3 mb-3">
                        <h6 className="mb-3">Items Ordered ({orderDetails.items?.length || 0})</h6>
                        {orderDetails.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                            <img
                              src={item.image || 'assets/images/products/placeholder.png'}
                              alt={item.name}
                              width="80"
                              className="rounded me-3"
                            />
                            <div className="flex-grow-1 text-start">
                              <h6 className="mb-1">{item.name}</h6>
                              <p className="mb-0 text-muted small">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="text-end">
                              <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                          </div>
                        ))}
                        {orderDetails.items?.length > 3 && (
                          <p className="text-muted mb-0">
                            +{orderDetails.items.length - 3} more items
                          </p>
                        )}
                      </div>

                      <div className="border-top pt-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal:</span>
                          <span>${orderDetails.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Shipping:</span>
                          <span>
                            {orderDetails.shipping === 0 
                              ? 'FREE' 
                              : `$${orderDetails.shipping?.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax:</span>
                          <span>${orderDetails.taxes?.toFixed(2)}</span>
                        </div>
                        {orderDetails.discount > 0 && (
                          <div className="d-flex justify-content-between mb-2 text-success">
                            <span>Discount:</span>
                            <span>-${orderDetails.discount?.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-top pt-2 mt-2">
                          <div className="d-flex justify-content-between">
                            <strong className="h5 mb-0">Total:</strong>
                            <strong className="h5 mb-0 text-primary">
                              ${orderDetails.total?.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="bx bx-map me-2"></i>Shipping Address
                          </h6>
                        </div>
                        <div className="card-body text-start">
                          {orderDetails.shippingAddress ? (
                            <address className="mb-0">
                              <strong>
                                {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                              </strong><br />
                              {orderDetails.shippingAddress.line1}<br />
                              {orderDetails.shippingAddress.line2 && (
                                <>{orderDetails.shippingAddress.line2}<br /></>
                              )}
                              {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}<br />
                              {orderDetails.shippingAddress.country}
                              {orderDetails.shippingAddress.phone && (
                                <><br /><i className="bx bx-phone me-1"></i>{orderDetails.shippingAddress.phone}</>
                              )}
                            </address>
                          ) : (
                            <p className="text-muted mb-0">No shipping address available</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="bx bx-credit-card me-2"></i>Payment Method
                          </h6>
                        </div>
                        <div className="card-body text-start">
                          <p className="mb-2">
                            <strong>Credit Card</strong>
                          </p>
                          <p className="mb-0 text-muted small">
                            Payment processed securely
                          </p>
                          {orderDetails.paymentIntentId && (
                            <p className="mb-0 text-muted small mt-2">
                              Transaction ID: {orderDetails.paymentIntentId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Next */}
                  <div className="alert alert-info text-start mb-4">
                    <h6 className="alert-heading">
                      <i className="bx bx-info-circle me-2"></i>What happens next?
                    </h6>
                    <ul className="mb-0 ps-3">
                      <li>Your order is being prepared for shipment</li>
                      <li>You'll receive a shipping notification with tracking information</li>
                      <li>Estimated delivery: {orderDetails.estimatedDelivery || '3-5 business days'}</li>
                      <li>Track your order anytime from your account</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handleContinueShopping}
                    >
                      <i className="bx bx-shopping-bag me-2"></i>
                      Continue Shopping
                    </button>
                    <button
                      className="btn btn-outline-primary btn-lg"
                      onClick={handleViewOrderDetails}
                    >
                      <i className="bx bx-receipt me-2"></i>
                      View All Orders
                    </button>
                  </div>

                  {/* Customer Support */}
                  <div className="mt-5 pt-4 border-top">
                    <h6 className="mb-3">Need Help?</h6>
                    <p className="text-muted mb-3">
                      Our customer support team is here to assist you
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <a 
                        href="mailto:support@example.com" 
                        className="btn btn-outline-secondary"
                      >
                        <i className="bx bx-envelope me-2"></i>
                        Email Support
                      </a>
                      <a 
                        href="tel:+1234567890" 
                        className="btn btn-outline-secondary"
                      >
                        <i className="bx bx-phone me-2"></i>
                        Call Us
                      </a>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => window.print()}
                      >
                        <i className="bx bx-printer me-2"></i>
                        Print Receipt
                      </button>
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

export default CheckoutComplete;