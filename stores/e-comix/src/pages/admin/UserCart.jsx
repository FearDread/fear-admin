import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import BannerSub from "../../components/Banner/BannerSub";
import UserCartItem from "../../components/Cart/UserCartItem";
import Recommended from "../../components/Carousel/Recommended";

// Helper function to calculate cart totals
const calculateCartTotals = (cartData) => {
  if (!cartData || cartData.length === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      deliveryCharges: 0,
      discount: 0,
      total: 0
    };
  }

  const itemCount = cartData.length;
  const subtotal = cartData.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  
  const deliveryCharges = subtotal > 0 ? 5.00 : 0; // Free delivery over certain amount
  const discount = 0; // TODO: Implement discount logic
  const total = subtotal + deliveryCharges - discount;

  return {
    itemCount,
    subtotal: subtotal.toFixed(2),
    deliveryCharges: deliveryCharges.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2)
  };
};

// Order Summary Component
const OrderSummary = ({ totals, onApplyDiscount }) => {
  const [discountCode, setDiscountCode] = useState("");

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (discountCode.trim()) {
      onApplyDiscount(discountCode);
      setDiscountCode("");
    }
  };

  return (
    <div className="col-lg-4 cart-summary">
      <div className="total-count-div">
        <h4>Order Summary</h4>
        <hr className="my-2" />
        
        <div className="itemsl-list my-4">
          <ul>
            <li className="d-flex align-items-center justify-content-between">
              <span>Items({totals.itemCount})</span>
              <span>${totals.subtotal}</span>
            </li>
          </ul>
        </div>

        <div className="promo-code1">
          <form onSubmit={handleApplyDiscount}>
            <div className="form-group">
              <label htmlFor="discount-code">Do you have Any Discount Code?</label>
              <input
                id="discount-code"
                type="text"
                className="form-control"
                placeholder="Enter your code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button type="submit" className="btn">
                Apply
              </button>
            </div>
          </form>
        </div>

        <ul className="pay-listy mt-4">
          <li>
            <span className="list-payt">
              Subtotal <b>({totals.itemCount} Items)</b>
            </span>
            <span className="price-bn">${totals.subtotal}</span>
          </li>
          <li>
            <span className="list-payt">Delivery charges</span>
            <span className="price-bn">${totals.deliveryCharges}</span>
          </li>
          <li>
            <span className="list-payt">Discount price</span>
            <span className="price-bn">
              {totals.discount > 0 ? `-$${totals.discount}` : '-'}
            </span>
          </li>
        </ul>
        
        <hr />
        <h3>
          <span>Total Cost</span> 
          <span>${totals.total}</span>
        </h3>
      </div>
      
      <Link 
        to="/checkout" 
        className="btn comon-button mt-5"
        aria-label={`Checkout with total of $${totals.total}`}
      >
        <span>Checkout</span>
      </Link>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => (
  <div className="col-12 text-center py-5">
    <div className="empty-cart-message">
      <h3>Your cart is empty</h3>
      <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
      <Link to="/shop" className="btn comon-button">
        <span>Continue Shopping</span>
      </Link>
    </div>
  </div>
);

const UserCart = () => {
  const cartData = useSelector(state => state.cart.data);
  
  // Memoize cart totals to prevent unnecessary recalculations
  const cartTotals = useMemo(() => calculateCartTotals(cartData), [cartData]);
  
  // Handle discount code application
  const handleApplyDiscount = (discountCode) => {
    // TODO: Implement discount logic with API call
    console.log('Applying discount code:', discountCode);
  };

  useEffect(() => {
    console.log('Cart data updated:', cartData);
  }, [cartData]);

  const hasItems = cartData && cartData.length > 0;

  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="cart-page-div pt-5 d-inline-block w-100">
          <div className="container">
            <div className="row gx-lg-5">
              {hasItems ? (
                <>
                  {/* Cart Items Section */}
                  <div className="col-lg-8 user-cart-items">
                    <div className="cart-haedeing">
                      <h2 className="d-flex page-haeding align-items-center justify-content-between mb-4">
                        My Cart
                        <span className="ms-lg-auto">
                          {cartTotals.itemCount} Item{cartTotals.itemCount !== 1 ? 's' : ''}
                        </span>
                      </h2>
                    </div>

                    {cartData.map((item) => (
                      <UserCartItem 
                        key={item._id} 
                        data={{ ...item.productId }}
                        quantity={item.quantity}
                        cartItemId={item._id}
                      />
                    ))}
                  </div>

                  {/* Order Summary Section */}
                  <OrderSummary 
                    totals={cartTotals} 
                    onApplyDiscount={handleApplyDiscount}
                  />
                </>
              ) : (
                <EmptyCart />
              )}

              {/* Recommended Products */}
              <div className="reconded-procuts d-inline-block w-100 py-5">
                <Recommended />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UserCart;