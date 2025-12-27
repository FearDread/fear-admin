import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartDiscount,
  removeItem,
  updateQuantity,
  clearCart,
  applyDiscount,
  setShipping
} from '../../features/cart/slice';
import {
  selectIsAuthenticated,
  selectCurrentUser
} from '../../features/user/slice';

export const ShopCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const discount = useSelector(selectCartDiscount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  // Local state
  const [discountCode, setDiscountCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Calculate taxes (example: 7% tax rate)
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: parseInt(newQuantity) }));
    }
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  // Handle apply discount
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);

    // Simulate discount validation (in real app, this would be an API call)
    setTimeout(() => {
      // Example discount codes
      const validCodes = {
        'SAVE10': 10,
        'SAVE20': 20,
        'WELCOME15': 15
      };

      const discountPercentage = validCodes[discountCode.toUpperCase()];

      if (discountPercentage) {
        const discountAmount = (subtotal * discountPercentage) / 100;
        dispatch(applyDiscount(discountAmount));
        alert(`Discount applied! You saved $${discountAmount.toFixed(2)}`);
      } else {
        alert('Invalid discount code');
      }

      setIsApplyingDiscount(false);
    }, 500);
  };

  // Handle shipping estimation
  const handleEstimateShipping = () => {
    if (!zipCode.trim()) {
      alert('Please enter a zip code');
      return;
    }

    // Simulate shipping calculation (in real app, this would be an API call)
    const shippingCost = country === 'United States' ? 10.00 : 25.00;
    dispatch(setShipping(shippingCost));
    alert(`Shipping estimated: $${shippingCost.toFixed(2)}`);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/shop');
  };

  // Show empty cart message
  if (cartItems.length === 0) {
    return (
      <>
        <section className="py-3 border-bottom d-none d-md-flex">
          <div className="container">
            <div className="page-breadcrumb d-flex align-items-center">
              <h3 className="breadcrumb-title pe-3">Shop Cart</h3>
              <div className="ms-auto">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 p-0">
                    <li className="breadcrumb-item"><a href="javascript:;"><i className="bx bx-home-alt"></i> Home</a>
                    </li>
                    <li className="breadcrumb-item"><a href="javascript:;">Shop</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Shop Cart</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container">
            <div className="text-center py-5">
              <i className='bx bx-shopping-bag display-1 text-muted'></i>
              <h3 className="mt-3">Your cart is empty</h3>
              <p className="text-muted mb-4">Add some items to get started!</p>
              <button
                onClick={handleContinueShopping}
                className="btn btn-white btn-ecomm"
              >
                <i className='bx bx-shopping-bag'></i> Start Shopping
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Shop Cart ({itemCount} items)</h3>
            <div className="ms-auto">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 p-0">
                    <li className="breadcrumb-item"><a href="javascript:;"><i className="bx bx-home-alt"></i> Home</a>
                    </li>
                    <li className="breadcrumb-item"><a href="javascript:;">Shop</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Shop Cart</li>
                  </ol>
                </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="shop-cart">
            <div className="row">
              {/* Cart Items */}
              <div className="col-12 col-xl-8">
                <div className="shop-cart-list mb-3 p-3">
                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.productId}>
                      {index > 0 && <div className="my-4 border-top"></div>}

                      <div className="row align-items-center g-3">
                        <div className="col-12 col-lg-6">
                          <div className="d-lg-flex align-items-center gap-2">
                            <div className="cart-img text-center text-lg-start">
                              <img
                                src={item.image || 'assets/images/products/placeholder.png'}
                                width="130"
                                alt={item.title}
                              />
                            </div>
                            <div className="cart-detail text-center text-lg-start">
                              <h6 className="mb-2">{item.name}</h6>
                              {item.size && (
                                <p className="mb-0">
                                  Size: <span>{item.size}</span>
                                </p>
                              )}
                              {item.color && (
                                <p className="mb-2">
                                  Color: <span>{item.color}</span>
                                </p>
                              )}
                              <h5 className="mb-0">${item.price.toFixed(2)}</h5>
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
                              onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-lg-3">
                          <div className="text-center">
                            <div className="d-flex gap-2 justify-content-center justify-content-lg-end">
                              <button
                                onClick={() => handleRemoveItem(item.productId)}
                                className="btn btn-light rounded-0 btn-ecomm"
                              >
                                <i className='bx bx-x-circle'></i> Remove
                              </button>
                              <Link
                                to="/account/wishlist"
                                className="btn btn-light rounded-0 btn-ecomm"
                              >
                                <i className='bx bx-heart me-0'></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}

                  <div className="my-4 border-top"></div>

                  {/* Cart Actions */}
                  <div className="d-lg-flex align-items-center gap-2">
                    <button
                      onClick={handleContinueShopping}
                      className="btn btn-light btn-ecomm"
                    >
                      <i className='bx bx-shopping-bag'></i> Continue Shopping
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="btn btn-light btn-ecomm ms-auto"
                    >
                      <i className='bx bx-x-circle'></i> Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkout Sidebar */}
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
                          disabled={isApplyingDiscount}
                        />
                        <button
                          className="btn btn-light btn-ecomm"
                          type="button"
                          onClick={handleApplyDiscount}
                          disabled={isApplyingDiscount}
                        >
                          {isApplyingDiscount ? 'Applying...' : 'Apply Discount'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Estimation */}
                  <div className="card rounded-0 border bg-transparent shadow-none">
                    <div className="card-body">
                      <p className="fs-5 text-white">Estimate Shipping and Tax</p>
                      <div className="my-3 border-top"></div>

                      <div className="mb-3">
                        <label className="form-label">Country Name</label>
                        <select
                          className="form-select rounded-0"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
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
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          <option value="California">California</option>
                          <option value="Texas">Texas</option>
                          <option value="New York">New York</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Zip/Postal Code</label>
                        <input
                          type="text"
                          className="form-control rounded-0"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="Enter zip code"
                        />
                      </div>

                      <button
                        onClick={handleEstimateShipping}
                        className="btn btn-light btn-ecomm w-100"
                      >
                        Estimate Shipping
                      </button>
                    </div>
                  </div>

                  {/* Order Summary */}
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
                        Taxes: <span className="float-end">${taxes.toFixed(2)}</span>
                      </p>
                      <p className="mb-0">
                        Discount: <span className="float-end">
                          {discount > 0 ? `-$${discount.toFixed(2)}` : '--'}
                        </span>
                      </p>
                      <div className="my-3 border-top"></div>
                      <h5 className="mb-0">
                        Order Total: <span className="float-end">
                          ${(total + taxes).toFixed(2)}
                        </span>
                      </h5>
                      <div className="my-4"></div>
                      <div className="d-grid">
                        <button
                          onClick={handleCheckout}
                          className="btn btn-white btn-ecomm"
                        >
                          {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </button>
                      </div>
                      {!isAuthenticated && (
                        <p className="text-center text-muted mt-2 mb-0 small">
                          You need to login to complete checkout
                        </p>
                      )}
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

export default ShopCart;