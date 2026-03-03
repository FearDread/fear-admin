import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/user/slice';
import { selectCartItems, selectCartItemCount, removeItem } from '../../features/cart/slice';
import CartDropdown from './CartDropdown';
import CatDropdown from './CatDropdown';
import SearchBar from './SearchBar';
import { T, headerStyles } from "../styles";

const topMenuLinks = [
  { label: 'Compare', path: '/product-comparison' },
  { label: 'About', path: '/about' },
  { label: 'Our Store', path: '/shop' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQs', path: '/faq' },
];
const currencies = ['USD', 'EUR'];
const languages = [
  { code: 'en', flag: 'um', label: 'English' },
  { code: 'de', flag: 'de', label: 'German' },
  { code: 'fr', flag: 'fr', label: 'French' },
  { code: 'hi', flag: 'in', label: 'Hindi' },
  { code: 'zh', flag: 'cn', label: 'Chinese' },
  { code: 'ar', flag: 'ae', label: 'Arabic' },
];
const socialLinks = [
  { icon: '𝒇', url: 'https://facebook.com', label: 'Facebook' },
  { icon: '𝕏', url: 'https://twitter.com', label: 'Twitter' },
  { icon: 'in', url: 'https://linkedin.com', label: 'LinkedIn' },
];
const categories = {
  'Comics & Books': [
    { label: 'Comic Books', path: '/shop?search=comics' },
    { label: 'E-Books', path: '/shop?search=E-Books' },
    { label: 'Graphic Novels', path: '/shop?search=GraphicNovels' },
    { label: 'Manga', path: '/shop?search=Manga' },
    { label: 'Anime', path: '/shop?category=Anime' },
  ],
  'Trading Cards': [
    { label: 'Basketball', path: '/shop?category=Basketball' },
    { label: 'Football', path: '/shop?category=Football' },
    { label: 'Magic The Gathering', path: '/shop?category=MTG' },
    { label: 'Baseball', path: '/shop?category=Baseball' },
    { label: 'Pokemon', path: '/shop?search=pokemon' },
  ],
};
const mainNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Our Store', path: '/shop' },
];
const accountLinks = [
  { label: 'Dashboard', path: '/account/dashboard' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Payment Methods', path: '/account/payment-methods' },
  { label: 'User Details', path: '/account/details' },
  { label: 'Saved Addresses', path: '/account/addresses' },
];

// ── Reusable hook: close when clicking outside ref ──────────────────────────
function useOutsideClick(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

export const Header2 = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUser    = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems      = useSelector(selectCartItems);
  const cartItemCount  = useSelector(selectCartItemCount);

  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [currency,        setCurrency]        = useState('USD');
  const [language,        setLanguage]        = useState('en');
  const [currencyOpen,    setCurrencyOpen]    = useState(false);
  const [languageOpen,    setLanguageOpen]    = useState(false);
  const [cartOpen,        setCartOpen]        = useState(false);
  const [categoriesOpen,  setCategoriesOpen]  = useState(false);  // ← NEW
  const [accountOpen,     setAccountOpen]     = useState(false);  // ← NEW
  const [scrollProgress,  setScrollProgress]  = useState(0);
  const [headerHidden,    setHeaderHidden]    = useState(false);
  const [headerCompact,   setHeaderCompact]   = useState(false);

  const lastScrollY = useRef(0);
  const ticking     = useRef(false);

  // One ref per dropdown wrapper
  const currencyRef   = useRef(null);
  const languageRef   = useRef(null);
  const cartRef       = useRef(null);
  const categoriesRef = useRef(null);
  const accountRef    = useRef(null);

  useOutsideClick(currencyRef,   useCallback(() => setCurrencyOpen(false),   []));
  useOutsideClick(languageRef,   useCallback(() => setLanguageOpen(false),   []));
  useOutsideClick(cartRef,       useCallback(() => setCartOpen(false),       []));
  useOutsideClick(categoriesRef, useCallback(() => setCategoriesOpen(false), []));
  useOutsideClick(accountRef,    useCallback(() => setAccountOpen(false),    []));

  // Scroll
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y    = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docH > 0 ? (y / docH) * 100 : 0);
        setHeaderCompact(y > 60);
        if      (y > lastScrollY.current + 8 && y > 120) setHeaderHidden(true);
        else if (y < lastScrollY.current - 4)             setHeaderHidden(false);
        lastScrollY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCurrencyOpen(false); setLanguageOpen(false);
    setCartOpen(false); setCategoriesOpen(false); setAccountOpen(false);
  }, [location.pathname]);

  const handleRemoveFromCart = (id) => dispatch(removeItem(id));
  const isActive = (path) => location.pathname === path;
  const currentLang = languages.find(l => l.code === language) || languages[0];

  // Toggle helpers — opening one closes the others
  const toggleCurrency   = () => { setCurrencyOpen(o=>!o);   setLanguageOpen(false); setCartOpen(false); setAccountOpen(false); };
  const toggleLanguage   = () => { setLanguageOpen(o=>!o);   setCurrencyOpen(false); setCartOpen(false); setAccountOpen(false); };
  const toggleCart       = () => { setCartOpen(o=>!o);       setCurrencyOpen(false); setLanguageOpen(false); setAccountOpen(false); };
  const toggleCategories = () => { setCategoriesOpen(o=>!o); setAccountOpen(false); };
  const toggleAccount    = () => { setAccountOpen(o=>!o);    setCategoriesOpen(false); };

  return (
    <>
      <style>{headerStyles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

      <header className={['hdr-outer', headerHidden ? 'hdr-hidden' : '', headerCompact ? 'hdr-compact' : ''].join(' ')}>

        {/* ── TOPBAR ── */}
        <div className="hdr-topbar">
          <div className="hdr-topbar-inner">
            <span className="hdr-topbar-brand d-none d-lg-block">
              Welcome to <span>e-FEAR</span> — Comics · E-Books · Collectibles
            </span>
            <ul className="hdr-toplinks d-none d-lg-flex">
              {topMenuLinks.map(l => <li key={l.path}><Link to={l.path}>{l.label}</Link></li>)}
            </ul>
            <div className="hdr-topbar-right">

              {/* Currency */}
              <div ref={currencyRef} style={{ position: 'relative' }}>
                <button className="hdr-util-btn" onClick={toggleCurrency}>
                  {currency} <span style={{ fontSize: '.5rem' }}>▾</span>
                </button>
                {currencyOpen && (
                  <div className="hdr-util-dropdown">
                    {currencies.map(c => (
                      <button key={c} onClick={() => { setCurrency(c); setCurrencyOpen(false); }}>{c}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div ref={languageRef} style={{ position: 'relative' }}>
                <button className="hdr-util-btn" onClick={toggleLanguage}>
                  <i className={`flag-icon flag-icon-${currentLang.flag}`} style={{ marginRight: '.25rem' }} />
                  {language.toUpperCase()} <span style={{ fontSize: '.5rem' }}>▾</span>
                </button>
                {languageOpen && (
                  <div className="hdr-util-dropdown">
                    {languages.map(l => (
                      <button key={l.code} onClick={() => { setLanguage(l.code); setLanguageOpen(false); }}>
                        <i className={`flag-icon flag-icon-${l.flag}`} />{l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Social */}
              <div className="hdr-social" style={{ display:'flex', gap:'.25rem', paddingLeft:'.5rem', borderLeft:`1px solid ${T.border}` }}>
                {socialLinks.map(s => (
                  <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label}>{s.icon}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN BAR ── */}
        <div className="hdr-main">
          <div className="hdr-main-inner">
            <button onClick={() => setMobileMenuOpen(true)}
              className="d-flex d-lg-none"
              style={{ display:'none', width:'40px', height:'40px', background:T.dark2, border:`1px solid ${T.border}`, color:T.textMid, fontSize:'1.2rem', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}
            >☰</button>

            <Link to="/" className="hdr-logo">
              <img src="assets/images/fear/efear-logo.png" className="logo-icon" alt="eFear Logo"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <span className="hdr-logo-text" style={{ display:'none' }}>e<span>Fear</span></span>
            </Link>

            <div className="hdr-search"><SearchBar /></div>

            <div className="hdr-contact d-none d-xl-flex">
              <div className="hdr-contact-icon">📞</div>
              <div>
                <span className="hdr-contact-label">Call Us Now</span>
                <span className="hdr-contact-number">+1 (254) 435-0130</span>
              </div>
            </div>

            <div className="hdr-icons">
              {isAuthenticated ? (
                <>
                  <Link to="/account/dashboard" className="hdr-icon-btn" title="Account">👤</Link>
                  <Link to="/wishlist"           className="hdr-icon-btn" title="Wishlist">♡</Link>
                </>
              ) : (
                <>
                  <Link to="/login"    className="hdr-btn-login    d-none d-sm-flex">Login</Link>
                  <Link to="/register" className="hdr-btn-register d-none d-sm-flex">Register</Link>
                </>
              )}

              {/* Cart — single instance for both guest & auth */}
              <div ref={cartRef} style={{ position: 'relative' }}>
                <button className="hdr-icon-btn" title="Cart" onClick={toggleCart}>
                  🛒
                  {cartItemCount > 0 && <span className="hdr-icon-badge">{cartItemCount}</span>}
                </button>
                {cartOpen && (
                  <CartDropdown items={cartItems} onRemoveItem={handleRemoveFromCart} onClose={() => setCartOpen(false)} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRIMARY NAV ── */}
        <nav className="hdr-nav">
          <div className="hdr-scroll-progress" style={{ width: `${scrollProgress}%` }} />
          <div className="hdr-nav-inner">

            {mainNavItems.map(item => (
              <div key={item.path} className="hdr-nav-item">
                <Link to={item.path} className={`hdr-nav-link${isActive(item.path) ? ' active' : ''}`}>
                  {item.label}
                </Link>
              </div>
            ))}

            {/* Categories — pure React, Bootstrap removed */}
            <div ref={categoriesRef} className="hdr-nav-item" style={{ position: 'relative' }}>
              <button className="hdr-nav-link"
                style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}
                onClick={toggleCategories}
                aria-expanded={categoriesOpen}
              >
                Categories <span className="hdr-nav-arrow">▾</span>
              </button>
              {categoriesOpen && (
                <CatDropdown categories={categories} onClose={() => setCategoriesOpen(false)} />
              )}
            </div>

            {/* My Account — now has state */}
            <div ref={accountRef} className="hdr-nav-item" style={{ marginLeft:'auto', position:'relative' }}>
              <button className="hdr-nav-link"
                style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}
                onClick={toggleAccount}
                aria-expanded={accountOpen}
              >
                {isAuthenticated && currentUser
                  ? `Hi, ${currentUser.firstName || 'User'}`
                  : 'My Account'
                } <span className="hdr-nav-arrow">▾</span>
              </button>
              {accountOpen && (
                <div className="hdr-account-dd" style={{ display: 'block' }}>
                  {accountLinks.map(link => (
                    <Link key={link.path} to={link.path} onClick={() => setAccountOpen(false)}>{link.label}</Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <Link to="/login"    style={{ color: T.red }} onClick={() => setAccountOpen(false)}>Login</Link>
                      <Link to="/register" style={{ color: T.red }} onClick={() => setAccountOpen(false)}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </nav>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <>
          <div className="hdr-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="hdr-mobile-drawer">
            <div className="hdr-drawer-head">
              <h2 className="hdr-drawer-title">e<span style={{ color: T.red }}>Fear</span></h2>
              <button className="hdr-drawer-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <div className="hdr-drawer-search"><SearchBar placeholder="Search products..." /></div>
            <div className="hdr-drawer-nav">
              {mainNavItems.map(item => (
                <Link key={item.path} to={item.path} className={`hdr-drawer-nav-link${isActive(item.path) ? ' active' : ''}`}>
                  {item.label}<span style={{ color:T.textDim, fontSize:'.6rem' }}>→</span>
                </Link>
              ))}
              {Object.entries(categories).map(([group, items]) => (
                <div key={group}>
                  <div className="hdr-drawer-section-title">{group}</div>
                  {items.map(item => (
                    <Link key={item.label} to={item.path} className="hdr-drawer-cat-link">
                      {item.label}<span style={{ color:T.textDim, fontSize:'.6rem' }}>→</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="hdr-drawer-section-title">My Account</div>
              {accountLinks.map(link => (
                <Link key={link.path} to={link.path} className="hdr-drawer-cat-link">{link.label}</Link>
              ))}
            </div>
            <div className="hdr-drawer-footer">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" style={{ display:'block', padding:'.75rem', textAlign:'center', border:`1px solid ${T.border}`, color:T.textMid, fontFamily:"'Space Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', textDecoration:'none' }}>Login</Link>
                  <Link to="/register" style={{ display:'block', padding:'.75rem', textAlign:'center', background:T.red, color:'#fff', fontFamily:"'Space Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', textDecoration:'none', clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>Register</Link>
                </>
              ) : (
                <Link to="/account/dashboard" style={{ display:'block', padding:'.75rem', textAlign:'center', background:T.dark2, border:`1px solid ${T.border}`, color:T.textMid, fontFamily:"'Space Mono',monospace", fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', textDecoration:'none' }}>My Dashboard</Link>
              )}
              <div style={{ display:'flex', gap:'.5rem' }}>
                {currencies.map(c => (
                  <button key={c} onClick={() => setCurrency(c)} style={{ flex:1, padding:'.45rem', background:currency===c ? T.red : T.dark2, border:`1px solid ${currency===c ? T.red : T.border}`, color:currency===c ? '#fff' : T.textDim, fontFamily:"'Space Mono',monospace", fontSize:'.62rem', letterSpacing:'.1em', cursor:'pointer' }}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header2;