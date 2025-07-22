import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Cart } from "../../features/cart/slice"
import { store } from "../../features/store";
import CartItem from "./CartItem";

const CartBasket = ( cart ) => {

  const { data } = useSelector(state => state.cart);
  const cartItems = 2;
  const loading = true;

  useEffect(() => {
    console.log('cart data = ', data);
  }, [])

    return (
        <>
            <ul className="dropdown-menu shadow cart-dropdown-ne p-4" >
               <li className="top-notitext">
                 <div className="d-flex align-items-center justify-content-between">
                   <h6> Your Products(1 Items) </h6>
                   <a href="cart.html" className="btn cart-drop-bn m-0"> View Cart </a>
                 </div>
               </li>
               <li>
                { !loading && data.map((item) => {
                  return (
                    <CartItem {...item.productId} key={item._id} />
                  )
                })}
               </li>
               <li>
                 <div className="sub-total-products">
                   <h6 className="ct-text05"> <span> Subtotal: </span> <span> $36.00 </span>  </h6>
                   <h6 className="ct-text05"> <span> Shipping: </span> <span> $2.52 </span>  </h6>
                   <hr/>
                   <h6 className="ct-text06"> <span> Total: </span> <span> $38.00 </span>  </h6>
                 </div>
               </li>
               <li>
                   <a href="checkout.html" className="btn mb-4 check-drop-bn"> Check out <span> <i className="fas fa-arrow-right"></i> </span> </a>
               </li>
             </ul>
        </>
    )
}

export default CartBasket;