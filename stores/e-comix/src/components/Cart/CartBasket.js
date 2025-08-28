import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import "./CartBasket.css";

const CartBasket = (cart) => {

  const cartState = useSelector(state => state.cart.data);
  const [cartItems, setCartItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.00);

  useEffect(() => {
    let totalSum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      totalSum =
        totalSum + Number(cartState[index].quantity) * cartState[index].price;

      setTotalCost(totalSum);
    }
  }, [cartState]);

  useEffect(() => {

    let items = cartState?.length;
    setCartItems(items);

  }, [cart])

  return (
    <>
      <ul className="dropdown-menu shadow cart-dropdown-ne p-4" >
        <li className="top-notitext">
          <div className="d-flex align-items-center justify-content-between">
            <h6> Your Products: ({cartItems} Items) </h6>
            <Link to='/cart' className="btn cart-drop-bn m-0">View Cart</Link>
          </div>
        </li>
        <li>
          <div className='cart-basket-items'>
            {cartItems > 0 && cartState.map((item) => {
              if (item.productId) {
                return (
                  <CartItem data={{ ...item.productId }} key={item._id} />
                )
              } else {
                return (
                  <div> No Items </div>
                )
              }
            })}

          </div>
        </li>
        <li>
          <div className="sub-total-products">
            <h6 className="ct-text05"> <span> Subtotal: </span> <span> ${totalCost || 0.00} </span>  </h6>
            <h6 className="ct-text05"> <span> Shipping: </span> <span> ${cartState.tax || 0.00} </span>  </h6>
            <hr />
            <h6 className="ct-text06"> <span> Total: </span> <span> ${totalCost} </span>  </h6>
          </div>
        </li>
        <li>
          <a href="/checkout" className="btn mb-4 check-drop-bn"> Check out <span> <i className="fas fa-arrow-right"></i> </span> </a>
        </li>
      </ul>
    </>
  )
}

export default CartBasket;