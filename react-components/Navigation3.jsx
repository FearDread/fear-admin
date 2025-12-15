import React from 'react';

function Navigation3() {
  return (
    <nav id="navbar_main" className="mobile-offcanvas navbar navbar-expand-lg">
      <div className="offcanvas-header">
        <button className="btn-close float-end"></button>
        <h5 className="py-2 text-white">Navigation</h5>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item active"> <a className="nav-link" href="index.html">Home </a>
      </li>
      <li className="nav-item dropdown"> <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">Categories <i className='bx bx-chevron-down'></i></a>
      <div className="dropdown-menu dropdown-large-menu">
        <div className="row">
          <div className="col-md-4">
            <h6 className="large-menu-title">Fashion</h6>
            <ul>
              <li><a href="#">Casual T-Shirts</a>
            </li>
            <li><a href="#">Formal Shirts</a>
          </li>
          <li><a href="#">Jackets</a>
        </li>
        <li><a href="#">Jeans</a>
      </li>
      <li><a href="#">Dresses</a>
    </li>
    <li><a href="#">Sneakers</a>
    </li>
    <li><a href="#">Belts</a>
    </li>
    <li><a href="#">Sports Shoes</a>
    </li>
    </ul>
    </div>
    <div className="col-md-4">
      <h6 className="large-menu-title">Electronics</h6>
      <ul>
        <li><a href="#">Mobiles</a>
      </li>
      <li><a href="#">Laptops</a>
    </li>
    <li><a href="#">Macbook</a>
    </li>
    <li><a href="#">Televisions</a>
    </li>
    <li><a href="#">Lighting</a>
    </li>
    <li><a href="#">Smart Watch</a>
    </li>
    <li><a href="#">Galaxy Phones</a>
    </li>
    <li><a href="#">PC Monitors</a>
    </li>
    </ul>
    </div>
    <div className="col-md-4">
      <div className="pramotion-banner1">
        <img src="assets/images/gallery/menu-img.jpg" className="img-fluid" alt="" />
      </div>
    </div>
    </div>
    </div>
    </li>
    <li className="nav-item dropdown"> <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">Shop  <i className='bx bx-chevron-down'></i></a>
    <ul className="dropdown-menu">
      <li><a className="dropdown-item dropdown-toggle dropdown-toggle-nocaret" href="#">Shop Layouts <i className='bx bx-chevron-right float-end'></i></a>
      <ul className="submenu dropdown-menu">
        <li><a className="dropdown-item" href="shop-grid-left-sidebar.html">Shop Grid - Left Sidebar</a>
      </li>
      <li><a className="dropdown-item" href="shop-grid-right-sidebar.html">Shop Grid - Right Sidebar</a>
    </li>
    <li><a className="dropdown-item" href="shop-list-left-sidebar.html">Shop List - Left Sidebar</a>
    </li>
    <li><a className="dropdown-item" href="shop-list-right-sidebar.html">Shop List - Right Sidebar</a>
    </li>
    <li><a className="dropdown-item" href="shop-grid-filter-on-top.html">Shop Grid - Top Filter</a>
    </li>
    <li><a className="dropdown-item" href="shop-list-filter-on-top.html">Shop List - Top Filter</a>
    </li>
    </ul>
    </li>
    <li><a className="dropdown-item dropdown-toggle dropdown-toggle-nocaret" href="#">Shop Pages <i className='bx bx-chevron-right float-end'></i></a>
    <ul className="submenu dropdown-menu">
      <li><a className="dropdown-item" href="shop-cart.html">Shop Cart</a>
    </li>
    <li><a className="dropdown-item" href="shop-categories.html">Shop Categories</a>
    </li>
    <li><a className="dropdown-item" href="checkout-details.html">Checkout Details</a>
    </li>
    <li><a className="dropdown-item" href="checkout-shipping.html">Checkout Shipping</a>
    </li>
    <li><a className="dropdown-item" href="checkout-payment.html">Checkout Payment</a>
    </li>
    <li><a className="dropdown-item" href="checkout-review.html">Checkout Review</a>
    </li>
    <li><a className="dropdown-item" href="checkout-complete.html">Checkout Complete</a>
    </li>
    <li><a className="dropdown-item" href="order-tracking.html">Order Tracking</a>
    </li>
    <li><a className="dropdown-item" href="product-comparison.html">Product Comparison</a>
    </li>
    </ul>
    </li>
    <li><a className="dropdown-item" href="about-us.html">About Us</a>
    </li>
    <li><a className="dropdown-item" href="contact-us.html">Contact Us</a>
    </li>
    <li><a className="dropdown-item" href="authentication-signin.html">Sign In</a>
    </li>
    <li><a className="dropdown-item" href="authentication-signup.html">Sign Up</a>
    </li>
    <li><a className="dropdown-item" href="authentication-forgot-password.html">Forgot Password</a>
    </li>
    </ul>
    </li>
    <li className="nav-item"> <a className="nav-link" href="blog.html">Blog </a>
    </li>
    <li className="nav-item"> <a className="nav-link" href="about-us.html">About Us </a>
    </li>
    <li className="nav-item"> <a className="nav-link" href="contact-us.html">Contact Us </a>
    </li>
    <li className="nav-item"> <a className="nav-link" href="shop-categories.html">Our Store</a>
    </li>
    <li className="nav-item dropdown"> <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">My Account  <i className='bx bx-chevron-down'></i></a>
    <ul className="dropdown-menu">
      <li><a className="dropdown-item" href="account-dashboard.html">Dashboard</a>
    </li>
    <li><a className="dropdown-item" href="account-downloads.html">Downloads</a>
    </li>
    <li><a className="dropdown-item" href="account-orders.html">Orders</a>
    </li>
    <li><a className="dropdown-item" href="account-payment-methods.html">Payment Methods</a>
    </li>
    <li><a className="dropdown-item" href="account-user-details.html">User Details</a>
    </li>
    </ul>
    </li>
    </ul>
    </nav>
  );
}

export default Navigation3;
