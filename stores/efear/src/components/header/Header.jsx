import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectCurrentUser
} from '../../features/user/slice';
import {
  selectCartItems,
  selectCartItemCount,
  removeItem
} from '../../features/cart/slice';
import CartDropdown from "./CartDropdown";
import CatDropdown from "./CatDropdown";
import SearchBar from "./SearchBar";


// Configuration objects for dynamic content
const topMenuLinks = [
  { label: 'Track Order', path: '/order-tracking' },
  { label: 'About', path: '/about' },
  { label: 'Our Stores', path: '/shop-categories' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
  { label: 'Help & FAQs', path: '/faq' }
];

const currencies = ['USD', 'EUR'];

const languages = [
  { code: 'en', flag: 'um', label: 'English' },
  { code: 'de', flag: 'de', label: 'German' },
  { code: 'fr', flag: 'fr', label: 'French' },
  { code: 'hi', flag: 'in', label: 'Hindi' },
  { code: 'zh', flag: 'cn', label: 'Chinese' },
  { code: 'ar', flag: 'ae', label: 'Arabic' }
];

const socialLinks = [
  { icon: 'bxl-facebook', url: 'https://facebook.com' },
  { icon: 'bxl-twitter', url: 'https://twitter.com' },
  { icon: 'bxl-linkedin', url: 'https://linkedin.com' }
];

const categories = {
  'Comics & Books': [
    { label: 'Comic Books', path: '/shop?category=Comics' },
    { label: 'E-Books', path: '/shop?category=Ebooks' },
    { label: 'Graphic Novels', path: '/shop?category=GraphicNovels' },
    { label: 'Manga', path: '/shop?category=Manga' },
    { label: 'Anime', path: '/shop?category=Anime' }
  ],
  'Trading Cards': [
    { label: 'Basketball', path: '/shop?category=Basketball' },
    { label: 'Football', path: '/shop?category=Football' },
    { label: 'Magic The Gathering', path: '/shop?category=MTG' },
    { label: 'Baseball', path: '/shop?category=Baseball' },
    { label: 'Pokemon', path: '/shop?category=Pokemon' }
  ]
};

const mainNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Our Store', path: '/shop' }
];

const accountLinks = [
  { label: 'Dashboard', path: '/account/dashboard' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Payment Methods', path: '/account/payment-methods' },
  { label: 'User Details', path: '/account/details' },
  { label: 'Saved Addresses', path: '/account/addresses'}
];

export const Header = () => {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const location = useLocation();

  // Redux selectors
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = useSelector(selectCartItemCount);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeItem(productId));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const searchCategories = ['Comics', 'E-Books', 'Trading Cards'];

  return (
    <div className="wrapper">
      <div className="header-wrapper bg-dark-1">
        {/* Top Menu */}
        <div className="top-menu border-bottom">
          <div className="container">
            <nav className="navbar navbar-expand">
              <div className="shiping-title text-uppercase font-13 text-white d-none d-sm-flex">
                Welcome to the e-FEAR store!
              </div>

              {/* Top Links */}
              <ul className="navbar-nav ms-auto d-none d-lg-flex">
                {topMenuLinks.map((link) => (
                  <li key={link.path} className="nav-item">
                    <Link className="nav-link" to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>

              {/* Currency & Language */}
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    {currency}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-lg-end">
                    {currencies.map((curr) => (
                      <li key={curr}>
                        <button
                          className="dropdown-item"
                          onClick={() => setCurrency(curr)}
                        >
                          {curr}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">
                    <div className="lang d-flex gap-1">
                      <div><i className={`flag-icon flag-icon-${languages.find(l => l.code === language)?.flag}`}></i></div>
                      <div><span>{language.toUpperCase()}</span></div>
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-lg-end">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="dropdown-item d-flex align-items-center"
                        onClick={() => setLanguage(lang.code)}
                      >
                        <i className={`flag-icon flag-icon-${lang.flag} me-2`}></i>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </li>
              </ul>

              {/* Social Links */}
              <ul className="navbar-nav social-link ms-lg-2 ms-auto">
                {socialLinks.map((social) => (
                  <li key={social.icon} className="nav-item">
                    <a className="nav-link" href={social.url} target="_blank" rel="noopener noreferrer">
                      <i className={`bx ${social.icon}`}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Header Content */}
        <div className="header-content pb-3 pb-md-0">
          <div className="container">
            <div className="row align-items-center">
              <div className="col col-md-auto">
                <div className="d-flex align-items-center">
                  <button
                    className="mobile-toggle-menu d-lg-none px-lg-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <i className='bx bx-menu'></i>
                  </button>
                  <div className="logo d-none d-lg-flex">
                    <Link to="/">
                      <img src="assets/images/fear/efear-logo.png" className="logo-icon" alt="Logo" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="col-12 col-md order-4 order-md-2">
                <SearchBar categories={searchCategories} />
              </div>

              {/* Contact Info */}
              <div className="col col-md-auto order-3 d-none d-xl-flex align-items-center">
                <div className="fs-1 text-white">
                  <i className='bx bx-headphone'></i>
                </div>
                <div className="ms-2">
                  <p className="mb-0 font-13">CALL US NOW</p>
                  <h5 className="mb-0">+1 (254) 435 - 0130</h5>
                </div>
              </div>

              {/* Cart Icons - Authenticated */}
              {isAuthenticated && (
                <div className="col col-md-auto order-2 order-md-4">
                  <div className="top-cart-icons">
                    <nav className="navbar navbar-expand">
                      <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                          <Link to="/account/dashboard" className="nav-link cart-link">
                            <i className='bx bx-user'></i>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/account/wishlist" className="nav-link cart-link">
                            <i className='bx bx-heart'></i>
                          </Link>
                        </li>
                        <li className="nav-item dropdown dropdown-large">
                          <a href="#" className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative cart-link" data-bs-toggle="dropdown">
                            <span className="alert-count">{cartItemCount}</span>
                            <i className='bx bx-shopping-bag'></i>
                          </a>
                          <CartDropdown items={cartItems} onRemoveItem={handleRemoveFromCart} />
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}

              {/* Cart Icons - Not Authenticated */}
              {!isAuthenticated && (
                <div className="col col-md-auto order-2 order-md-4">
                  <div className="top-cart-icons">
                    <nav className="navbar navbar-expand">
                      <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                          <Link to="/login" className="nav-link cart-link">
                            <button className='btn btn-white btn-ecom'>Login</button>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/register" className="nav-link cart-link">
                            <button className='btn btn-white btn-ecom'>Register</button>
                          </Link>
                        </li>
                        <li className="nav-item dropdown dropdown-large">
                          <a href="#" className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative cart-link" data-bs-toggle="dropdown">
                            <span className="alert-count">{cartItemCount}</span>
                            <i className='bx bx-shopping-bag'></i>
                          </a>
                          <CartDropdown items={cartItems} onRemoveItem={handleRemoveFromCart} />
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Menu */}
        <div className="primary-menu border-top">
          <div className="container">
            <nav id="navbar_main" className={`mobile-offcanvas navbar navbar-expand-lg ${mobileMenuOpen ? 'show' : ''}`}>
              <div className="offcanvas-header">
                <button className="btn-close float-end" onClick={() => setMobileMenuOpen(false)}></button>
                <h5 className="py-2 text-white">Navigation</h5>
              </div>
              <ul className="navbar-nav">
                {mainNavItems.map((item) => (
                  <li key={item.path} className={`nav-item ${isActiveRoute(item.path)}`}>
                    <Link className="nav-link" to={item.path}>{item.label}</Link>
                  </li>
                ))}

                {/* Categories Dropdown */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">
                    Categories <i className='bx bx-chevron-down'></i>
                  </a>
                  <CatDropdown categories={categories} />
                </li>

                {/* Account Dropdown */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">
                    My Account <i className='bx bx-chevron-down'></i>
                  </a>
                  <ul className="dropdown-menu">
                    {accountLinks.map((link) => (
                      <li key={link.path}>
                        <Link className="dropdown-item" to={link.path}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;