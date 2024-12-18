
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const Header = () => {

    return (
        <>
        <header className="float-start w-100">
 
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <a className="navbar-brand mx-auto mb-4 me-lg-start" href="index.html">
                        <img alt="logo" src="images/logo.svg"/>
                    </a>
     
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                         <li className="nav-item dmenu  megamenu-li dropdown shop-mega">
                            <a className="nav-link dropdown-toggle" href="index.html#" role="button" data-bs-toggle="dropdown">
                                Shop
                            </a>
           
                            <div className="dropdown-menu megamenu sm-menu border-top">
                            <div className="row">
                             <div className="col-sm-6 col-lg-4 border-right mb-4">
                                <h6>Popular</h6>
                                <a className="dropdown-item" href="shop.html">Action & Adventure</a>
                                <a className="dropdown-item" href="shop.html">Art of Comics </a>
                                <a className="dropdown-item" href="shop.html">Superhero Comics </a>
                                <a className="dropdown-item" href="shop.html">Quisque pharetra </a>
                            </div>
                            <div className="col-sm-6 col-lg-4 border-right mb-4">
                                <h6>Special Offers</h6>
                                <a className="dropdown-item" href="shop.html">Science Fiction</a>
                                <a className="dropdown-item" href="shop.html">Superhero Comics </a>
                                <a className="dropdown-item" href="shop.html"> Fantasy Novels </a>
                                <a className="dropdown-item" href="shop.html">Art of Comics </a>
                            </div>
                 <div className="col-sm-6 col-lg-4 border-right mb-4">
                     <h6> Best Selling </h6>
                     <a className="dropdown-item" href="shop.html"> Fantasy Novels </a>
                     <a className="dropdown-item" href="shop.html">Art of Comics </a>
                 </div>
                 
             </div>
           </div>
         </li>

         <li className="nav-item">
           <a className="nav-link" href="collection.html">Collection</a>
         </li>
         <li className="nav-item">
           <a className="nav-link" href="about.html">About</a>
         </li>
         <li className="nav-item">
           <a className="nav-link" href="blog.html">Blog</a>
         </li>
       
         
       </ul>
       
     </div>
     <div className="right-sction">
         <ul className="d-flex align-items-center">
           <li>
             <a data-bs-toggle="modal" data-bs-target="#loginModal" className="right-menu"> Login </a>
           </li>
           <li>
             <a data-bs-toggle="modal" data-bs-target="#registerModal" className="btn right-menu signup"> <span> Signup </span> </a>
           </li>
           <li className="dropdown position-relative mx-3">
             <button className="btn com-link cart-new-icon whilist" type="button"
               data-bs-toggle="dropdown" >
               <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="30px" height="30px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6.5 2h11a1 1 0 0 1 .8.4L21 6v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6l2.7-3.6a1 1 0 0 1 .8-.4zM19 8H5v12h14V8zm-.5-2L17 4H7L5.5 6h13zM9 10v2a3 3 0 0 0 6 0v-2h2v2a5 5 0 0 1-10 0v-2h2z"></path></svg>
                   <span className="nubn">1</span>
             </button>
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
           </li>
           <li>
             <a data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightmobile" className="btn bargar"> 
               <span>
                   <img alt="bargar" src="images/bargur.svg"/>  
               </span>
             </a>
           </li>
         </ul>
     </div>
   </div>
 </nav>
</header>
        </>
    )
}

export default Header;