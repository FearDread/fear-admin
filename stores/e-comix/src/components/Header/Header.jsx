import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartBasket from "../Cart/CartBasket";
import store from "../../features/store";
import { User } from "../../features/user/slice";
import "./Header.css";

// Navigation menu data
const NAVIGATION_MENU = [
  {
    name: 'Shop',
    href: '/shop',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Popular',
        items: [
          { name: 'Comics', href: '/shop?category=comics' },
          { name: 'Pokemon Cards', href: '/shop?category=pokemon cards' },
          { name: 'Superhero Comics', href: '/shop?brand=dc' },
          { name: 'Trading Cards', href: '/shop?category=trading cards' }
        ]
      },
      {
        title: 'Special Offers',
        items: [
          { name: 'Science Fiction', href: '/shop' },
          { name: 'Superhero Comics', href: '/shop' },
          { name: 'Fantasy Novels', href: '/shop' },
          { name: 'Art of Comics', href: '/shop' }
        ]
      },
      {
        title: 'Best Selling',
        items: [
          { name: 'Fantasy Novels', href: '/shop' },
          { name: 'Art of Comics', href: '/shop' }
        ]
      }
    ]
  },
  { name: 'Collection', href: '/collection' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' }
];

// Cart Icon Component
const CartIcon = ({ itemCount = 0 }) => (
  <button 
    className="btn com-link cart-new-icon whilist" 
    type="button"
    data-bs-toggle="dropdown"
    aria-label={`Shopping cart with ${itemCount} items`}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden="true" 
      role="img" 
      width="30px" 
      height="30px" 
      preserveAspectRatio="xMidYMid meet" 
      viewBox="0 0 24 24"
    >
      <path 
        fill="currentColor" 
        d="M6.5 2h11a1 1 0 0 1 .8.4L21 6v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6l2.7-3.6a1 1 0 0 1 .8-.4zM19 8H5v12h14V8zm-.5-2L17 4H7L5.5 6h13zM9 10v2a3 3 0 0 0 6 0v-2h2v2a5 5 0 0 1-10 0v-2h2z"
      />
    </svg>
    {itemCount > 0 && (
      <span className="nubn" aria-label={`${itemCount} items in cart`}>
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    )}
  </button>
);

// Navigation Links Component
const NavigationLinks = () => (
  <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
    {NAVIGATION_MENU.map((item) => (
      <li 
        key={item.name}
        className={`nav-item ${item.hasDropdown ? 'dmenu megamenu-li dropdown shop-mega' : ''}`}
      >
        {item.hasDropdown ? (
          <>
            <Link 
              className="nav-link dropdown-toggle" 
              to={item.href}
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {item.name}
            </Link>
            <div className="dropdown-menu megamenu sm-menu border-top">
              <div className="row">
                {item.dropdownItems?.map((section, index) => (
                  <div key={section.title} className="col-sm-6 col-lg-4 border-right mb-4">
                    <h6>{section.title}</h6>
                    {section.items.map((subItem) => (
                      <Link 
                        key={subItem.name}
                        className="dropdown-item" 
                        to={subItem.href}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Link className="nav-link" to={item.href}>
            {item.name}
          </Link>
        )}
      </li>
    ))}
  </ul>
);

// Authentication Buttons Component
const AuthButtons = ({ isLoggedIn, onLogout }) => (
  <>
    {isLoggedIn ? (
      <>
        <li>
          <Link to="/profile" className="right-menu btn me-2">
            Profile
          </Link>
        </li>
        <li>
          <button 
            className="right-menu btn logout submit-btn" 
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link 
            to="/login" 
            className="right-menu btn submit-btn login"
          >
            Login
          </Link>
        </li>
        <li>
          <Link 
            to="/register" 
            className="btn right-menu submit-btn signup"
          >
            <span>Signup</span>
          </Link>
        </li>
      </>
    )}
  </>
);

// Mobile Menu Toggle Component
const MobileMenuToggle = () => (
  <li>
    <button
      className="btn bargar"
      data-bs-toggle="offcanvas" 
      data-bs-target="#offcanvasRightmobile"
      aria-label="Toggle mobile menu"
      type="button"
    >
      <span>
        <img alt="Menu" src="images/bargur.svg" />
      </span>
    </button>
  </li>
);

const Header = ({ user: propUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Redux state
  const { data: userData } = useSelector(state => state.user);
  const cartData = useSelector(state => state.cart.data);
  
  // Memoize auth data to prevent unnecessary re-renders
  const authData = useMemo(() => {
    return store.local.has('auth') ? store.local.get('auth') : null;
  }, []);
  
  // Determine current user (prop takes precedence, then authData, then userData)
  const currentUser = propUser || authData || userData;
  
  // Calculate cart item count
  const cartItemCount = useMemo(() => {
    return Array.isArray(cartData) ? cartData.length : 0;
  }, [cartData]);
  
  // Handle logout
  const handleLogout = useCallback((e) => {
    e.preventDefault();
    
    try {
      store.local.remove('auth');
      store.dispatch(User.logout());
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);
  
  // Update login state based on user data
  useEffect(() => {
    const hasValidAuth = currentUser && (currentUser.token || currentUser._id);
    setIsLoggedIn(!!hasValidAuth);
  }, [currentUser]);
  
  return (
    <header className="float-start w-100">
      <nav className="navbar navbar-expand-lg" role="navigation">
        <div className="container container-top">
          {/* Logo */}
          <Link className="navbar-brand mx-auto mb-4 me-lg-start" to="/">
            <img 
              alt="Ekomix Logo" 
              src="images/ekomix/logo_transparent.png" 
              loading="lazy"
            />
          </Link>
          
          {/* Main Navigation */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavigationLinks />
          </div>
          
          {/* Right Section */}
          <div className="right-sction">
            <ul className="d-flex align-items-center list-unstyled mb-0">
              {/* Authentication Buttons */}
              <AuthButtons 
                isLoggedIn={isLoggedIn} 
                onLogout={handleLogout}
              />
              
              {/* Cart (only show when logged in) */}
              {isLoggedIn && (
                <li className="dropdown position-relative mx-3">
                  <CartIcon itemCount={cartItemCount} />
                  <CartBasket cartData={cartData} />
                </li>
              )}
              
              {/* Mobile Menu Toggle */}
              <MobileMenuToggle />
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;