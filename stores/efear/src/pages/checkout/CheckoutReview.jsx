import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartDiscount,
  updateQuantity,
  removeItem,
  applyDiscount,
  clearCart,
} from '../../features/cart/slice';
import {
  selectCurrentUser,
  fetchUser,
} from '../../features/user/slice';
import CheckoutSteps from "./components/CheckoutSteps";

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

  // Local state
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [shippingEstimate, setShippingEstimate] = useState({
    country: 'United States',
    state: 'California',
    zipCode: '',
  });

  // Load user data on mount
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUser());
    }
  }, [dispatch, currentUser]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      navigate('/products');
    }
  }, [cartItems, navigate]);

  // Calculate taxes (7% example)
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      dispatch(removeItem(productId));
    }
  };

  // Handle edit item (navigate to product page)
  const handleEditItem = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Handle discount code
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);

    // Simulate discount code validation
    setTimeout(() => {
      const validCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'FLAT15': 15.00,
        'WELCOME5': 5.00,
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
        alert(`Discount applied! You saved $${discountAmount.toFixed(2)}`);
        setDiscountCode('');
      } else {
        alert('Invalid discount code');
      }

      setIsApplyingDiscount(false);
    }, 500);
  };

  // Handle shipping estimate change
  const handleShippingEstimateChange = (field, value) => {
    setShippingEstimate(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle complete order
  const handleCompleteOrder = async () => {
    // Validate shipping address
    if (!currentUser?.shippingAddress?.address1) {
      alert('Please add a shipping address before completing your order.');
      navigate('/checkout/details');
      return;
    }

    // Validate shipping method
    if (!shipping || shipping === 0) {
      alert('Please select a shipping method.');
      navigate('/checkout/shipping');
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        items: cartItems,
        subtotal,
        shipping,
        taxes,
        discount,
        total: total + taxes,
        shippingAddress: currentUser.shippingAddress,
        billingAddress: currentUser.billingAddress,
        paymentMethod: 'Credit Card', // This should come from payment step
        orderDate: new Date().toISOString(),
        status: 'pending',
      };

      console.log('Order created:', order);
      
      // TODO: Dispatch order creation action
      // await dispatch(createOrder(order)).unwrap();

      // Clear cart after successful order
      dispatch(clearCart());

      // Navigate to completion page
      navigate('/checkout/complete', { state: { order } });
    } catch (error) {
      console.error('Failed to process order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Get shipping address
  const shippingAddress = currentUser?.shippingAddress || {};
  const billingAddress = currentUser?.billingAddress || {};

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Review Order</h3>
            <div className="ms-auto">
            {// breadcrumbs 
            }
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="shop-cart">
            <div className="row">
              <div className="col-12 col-xl-8">
                <div className="checkout-review">
                  {/* Progress Steps */}
                  <CheckoutSteps currentStep="review" />

                  {/* Cart Items Review */}
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
                                <div className="col-12 col-lg-6">
                                  <div className="d-lg-flex align-items-center gap-2">
                                    <div className="cart-img text-center text-lg-start">
                                      <img
                                        src={item.image || 'assets/images/products/placeholder.png'}
                                        width="130"
                                        alt={item.name || item.title}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/products/${item.productId}`)}
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
                                      <h5 className="mb-0">${item.price?.toFixed(2)}</h5>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-lg-3">
                                  <div className="cart-action text-center">
                                    <input
                                      type="number"
                                      className="form-control rounded-0"
                                      value={item.quantity}
                                      min="1"
                                      max="99"
                                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-3">
                                  <div className="text-center">
                                    <div className="d-flex gap-2 justify-content-center justify-content-lg-end">
                                      <button
                                        onClick={() => handleRemoveItem(item.productId)}
                                        className="btn btn-light rounded-0 btn-ecomm"
                                        title="Remove item"
                                      >
                                        <i className='bx bx-x-circle me-0'></i>
                                      </button>
                                      <button
                                        onClick={() => handleEditItem(item.productId)}
                                        className="btn btn-light rounded-0 btn-ecomm"
                                      >
                                        <i className='bx bx-edit'></i> Edit
                                      </button>
                                    </div>
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
                            <h5 className="mb-3">Shipping to:</h5>
                            {shippingAddress.name ? (
                              <>
                                <p className="mb-1">
                                  <span className="text-light">Customer:</span> {shippingAddress.name}
                                </p>
                                <p className="mb-1">
                                  <span className="text-light">Address:</span> {shippingAddress.address1}
                                  {shippingAddress.address2 && `, ${shippingAddress.address2}`}
                                  {shippingAddress.city && `, ${shippingAddress.city}`}
                                  {shippingAddress.state && `, ${shippingAddress.state}`}
                                  {shippingAddress.zipCode && ` ${shippingAddress.zipCode}`}
                                </p>
                                {currentUser?.phone && (
                                  <p className="mb-1">
                                    <span className="text-light">Phone:</span> {currentUser.phone}
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="alert alert-warning">
                                <i className="bx bx-error-circle me-2"></i>
                                No shipping address found. Please add one.
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="payment-mode">
                            <h5 className="mb-3">Payment Mode:</h5>
                            <img
                              src="assets/images/icons/visa.png"
                              width="150"
                              className="p-2 border bg-light rounded"
                              alt="Visa"
                            />
                            <p className="mt-2 text-muted">
                              <small>Payment will be processed securely</small>
                            </p>
                          </div>
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
                <div className="checkout-form p-3 bg-dark-1">
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

                  {/* Shipping Estimate */}
                  <div className="card rounded-0 border bg-transparent shadow-none">
                    <div className="card-body">
                      <p className="fs-5 text-white">Estimate Shipping and Tax</p>
                      <div className="my-3 border-top"></div>
                      <div className="mb-3">
                        <label className="form-label">Country Name</label>
                        <select
                          className="form-select rounded-0"
                          value={shippingEstimate.country}
                          onChange={(e) => handleShippingEstimateChange('country', e.target.value)}
                        >
                          <option value="United States">United States</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">State/Province</label>
                        <select
                          className="form-select rounded-0"
                          value={shippingEstimate.state}
                          onChange={(e) => handleShippingEstimateChange('state', e.target.value)}
                        >
                          <option value="California">California</option>
                          <option value="Texas">Texas</option>
                          <option value="New York">New York</option>
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Zip/Postal Code</label>
                        <input
                          type="text"
                          className="form-control rounded-0"
                          value={shippingEstimate.zipCode}
                          onChange={(e) => handleShippingEstimateChange('zipCode', e.target.value)}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="card rounded-0 border bg-transparent mb-0 shadow-none">
                    <div className="card-body">
                      <p className="mb-2">
                        Subtotal: <span className="float-end">${subtotal.toFixed(2)}</span>
                      </p>
                      <p className="mb-2">
                        Shipping: <span className="float-end">
                          {shipping > 0 ? `$${shipping.toFixed(2)}` : '--'}
                        </span>
                      </p>
                      <p className="mb-2">
                        Taxes (7%): <span className="float-end">${taxes.toFixed(2)}</span>
                      </p>
                      <p className="mb-0">
                        Discount: <span className="float-end text-success">
                          {discount > 0 ? `-$${discount.toFixed(2)}` : '--'}
                        </span>
                      </p>
                      <div className="my-3 border-top"></div>
                      <h5 className="mb-0">
                        Order Total: <span className="float-end">${(total + taxes).toFixed(2)}</span>
                      </h5>
                      <div className="my-4"></div>
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