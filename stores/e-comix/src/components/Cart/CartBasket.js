import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Cart } from "../../features/cart/slice"
import { store } from "../../features/store";
import CartItem from "./CartItem";

const CartBasket = (cart) => {

  const cartState = useSelector(state => state.cart.data);
  const cartStateItems = useSelector(state => state.cart.data.length);

  const [cartItems, setCartItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.00);

  useEffect(() => {
    console.log('cart data = ', cartState);
    console.log('cart items from prop = ', cart);
  }, [cart])

    return (
        <>
            <ul className="dropdown-menu shadow cart-dropdown-ne p-4" >
               <li className="top-notitext">
                 <div className="d-flex align-items-center justify-content-between">
                   <h6> Your Products: ({cartStateItems} Items) </h6>
                   <Link to='/cart' className="btn cart-drop-bn m-0">View Cart</Link>
                 </div>
               </li>
               <li>

                { cartStateItems && cartState.map((item) => {
                  return (
                    <CartItem {...item.productId} key={item._id} />
                  )
                })}

               </li>
               <li>
                 <div className="sub-total-products">
                   <h6 className="ct-text05"> <span> Subtotal: </span> <span> ${cartState.total || 0.00} </span>  </h6>
                   <h6 className="ct-text05"> <span> Shipping: </span> <span> ${cartState.tax || 0.00} </span>  </h6>
                   <hr/>
                   <h6 className="ct-text06"> <span> Total: </span> <span> ${totalCost} </span>  </h6>
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