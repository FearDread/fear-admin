import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectCurrentUser
} from '../../features/user/slice';
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
  { label: 'Downloads', path: '/account/downloads' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Payment Methods', path: '/account/payment-methods' },
  { label: 'User Details', path: '/account/user-details' }
];

// Cart items - in a real app, this would come from state management
const initialCartItems = [
  { id: 1, name: 'Men White T-Shirt', price: 29.00, quantity: 1, image: 'assets/images/products/01.png' },
  { id: 2, name: 'Puma Sports Shoes', price: 29.00, quantity: 1, image: 'assets/images/products/05.png' },
  { id: 3, name: 'Women Red Sneakers', price: 29.00, quantity: 1, image: 'assets/images/products/17.png' },
  { id: 4, name: 'Black Headphone', price: 29.00, quantity: 1, image: 'assets/images/products/10.png' },
  { id: 5, name: 'Blue Girl Shoes', price: 29.00, quantity: 1, image: 'assets/images/products/08.png' },
  { id: 6, name: 'Men Leather Belt', price: 29.00, quantity: 1, image: 'assets/images/products/18.png' },
  { id: 7, name: 'Men Yellow T-Shirt', price: 29.00, quantity: 1, image: 'assets/images/products/04.png' },
  { id: 8, name: 'Pool Chair', price: 29.00, quantity: 1, image: 'assets/images/products/16.png' }
];

// Search Component
const SearchBar = ({ categories: searchCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm, 'in', selectedCategory);
  };

  return (
    <form onSubmit={handleSearch} className="input-group flex-nowrap px-xl-4">
      <input
        type="text"
        className="form-control w-100"
        placeholder="Search for Products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="form-select flex-shrink-0"
        style={{ width: '10.5rem' }}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option>All Categories</option>
        {searchCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit" className="input-group-text cursor-pointer">
        <i className='bx bx-search'></i>
      </button>
    </form>
  );
};

// Cart Dropdown Component
const CartDropdown = ({ items, onRemoveItem }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="dropdown-menu dropdown-menu-end">
      <Link to="/cart">
        <div className="cart-header">
          <p className="cart-header-title mb-0">{items.length} ITEMS</p>
          <p className="cart-header-clear ms-auto mb-0">VIEW CART</p>
        </div>
      </Link>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="dropdown-item">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="cart-product-title">{item.name}</h6>
                <p className="cart-product-price">{item.quantity} X ${item.price.toFixed(2)}</p>
              </div>
              <div className="position-relative">
                <button
                  className="cart-product-cancel position-absolute"
                  onClick={() => onRemoveItem(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <i className='bx bx-x'></i>
                </button>
                <div className="cart-product">
                  <img src={item.image} alt={item.name} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/cart">
        <div className="text-center cart-footer d-flex align-items-center">
          <h5 className="mb-0">TOTAL</h5>
          <h5 className="mb-0 ms-auto">${total.toFixed(2)}</h5>
        </div>
      </Link>
      <div className="d-grid p-3 border-top">
        <Link to="/checkout" className="btn btn-light btn-ecomm">CHECKOUT</Link>
      </div>
    </div>
  );
};

// Category Dropdown Component
const CategoryDropdown = ({ categories: categoryData }) => {
  return (
    <div className="dropdown-menu dropdown-large-menu">
      <div className="row">
        {Object.entries(categoryData).map(([title, items], idx) => (
          <div key={title} className="col-md-4">
            <h6 className="large-menu-title">{title}</h6>
            <ul>
              {items.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="dropdown-item">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-md-4">
          <div className="pramotion-banner1">
            <img src="assets/images/gallery/menu-img.jpg" className="img-fluid" alt="Promotion" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Header Component
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const location = useLocation();

  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
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
                      <img src="assets/images/logo-icon.png" className="logo-icon" alt="Logo" />
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

              {/* Cart Icons */}
              {(isAuthenticated) && (
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
                          <span className="alert-count">{cartItems.length}</span>
                          <i className='bx bx-shopping-bag'></i>
                        </a>
                        <CartDropdown items={cartItems} onRemoveItem={removeFromCart} />
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              )}
              {(!isAuthenticated) && (
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
                  <CategoryDropdown categories={categories} />
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