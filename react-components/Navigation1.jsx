import React from 'react';

function Navigation1() {
  return (
    <nav className="navbar navbar-expand">
      <div className="shiping-title text-uppercase font-13 text-white d-none d-sm-flex">Welcome to our eTrans store!</div>
      <ul className="navbar-nav ms-auto d-none d-lg-flex">
        <li className="nav-item">	<a className="nav-link" href="order-tracking.html">Track Order</a>
      </li>
      <li className="nav-item">	<a className="nav-link" href="about-us.html">About</a>
    </li>
    <li className="nav-item">	<a className="nav-link" href="shop-categories.html">Our Stores</a>
    </li>
    <li className="nav-item">	<a className="nav-link" href="blog.html">Blog</a>
    </li>
    <li className="nav-item">	<a className="nav-link" href="contact-us.html">Contact</a>
    </li>
    <li className="nav-item">	<a className="nav-link" href="javascript:;">Help & FAQs</a>
    </li>
    </ul>
    <ul className="navbar-nav">
      <li className="nav-item dropdown">	<a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">USD</a>
      <ul className="dropdown-menu dropdown-menu-lg-end">
        <li><a className="dropdown-item" href="#">USD</a>
      </li>
      <li><a className="dropdown-item" href="#">EUR</a>
    </li>
    </ul>
    </li>
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">
        <div className="lang d-flex gap-1">
          <div><i className="flag-icon flag-icon-um"></i>
        </div>
        <div><span>ENG</span>
      </div>
    </div>
    </a>
    <div className="dropdown-menu dropdown-menu-lg-end">
      <a className="dropdown-item d-flex allign-items-center" href="javascript:;">	<i className="flag-icon flag-icon-de me-2"></i><span>German</span>
    </a>	<a className="dropdown-item d-flex allign-items-center" href="javascript:;"><i
    className="flag-icon flag-icon-fr me-2"></i><span>French</span></a>
    <a className="dropdown-item d-flex allign-items-center" href="javascript:;"><i
      className="flag-icon flag-icon-um me-2"></i><span>English</span></a>
      <a className="dropdown-item d-flex allign-items-center" href="javascript:;"><i
        className="flag-icon flag-icon-in me-2"></i><span>Hindi</span></a>
        <a className="dropdown-item d-flex allign-items-center" href="javascript:;"><i
          className="flag-icon flag-icon-cn me-2"></i><span>Chinese</span></a>
          <a className="dropdown-item d-flex allign-items-center" href="javascript:;"><i
            className="flag-icon flag-icon-ae me-2"></i><span>Arabic</span></a>
          </div>
        </li>
      </ul>
      <ul className="navbar-nav social-link ms-lg-2 ms-auto">
        <li className="nav-item">	<a className="nav-link" href="javascript:;"><i className='bx bxl-facebook'></i></a>
      </li>
      <li className="nav-item">	<a className="nav-link" href="javascript:;"><i className='bx bxl-twitter'></i></a>
    </li>
    <li className="nav-item">	<a className="nav-link" href="javascript:;"><i className='bx bxl-linkedin'></i></a>
    </li>
    </ul>
    </nav>
  );
}

export default Navigation1;
