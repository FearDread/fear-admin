import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Cart = (props) => {

    return (
        <>
            <ul className="dropdown-menu shadow cart-dropdown-ne p-4" >
               <li className="top-notitext">
                 <div className="d-flex align-items-center justify-content-between">
                   <h6> Your Products(2 Items) </h6>
                   <a href="cart.html" className="btn cart-drop-bn m-0"> View Cart </a>
                 </div>
               </li>
               <li>
                 <div className="comon-cart-ps">
                     <div className="d-flex align-items-center justify-content-between">
                       <a href="index.html#" className="products-sm-pic">
                           <div className="imo-caty">
                               <img src="images/blog2.png" alt="bn"/>
                           </div>
                       </a>
                       <div className="cart-ps-details">
                           <a href="index.html#" className="titel-crt-products">
                           Birthday Card
                           </a>
                           <h6> $12.52 </h6>
                       </div>
                       <a href="index.html#" className="close-crt"> <i className="fas fa-close"></i> </a>
                     </div>
                 </div>
                 <div className="comon-cart-ps">
                   <div className="d-flex align-items-center justify-content-between">
                     <a href="index.html#" className="products-sm-pic">
                         <div className="imo-caty">
                             <img src="images/b5197a7a-image-22.jpg" alt="bn"/>
                         </div>
                     </a>
                     <div className="cart-ps-details">
                         <a href="index.html#" className="titel-crt-products">
                           Wedding Card
                         </a>
                         <h6> $12.52 </h6>
                     </div>
                     <a href="index.html#" className="close-crt"> <i className="fas fa-close"></i> </a>
                   </div>
                 </div>
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

export default Cart;