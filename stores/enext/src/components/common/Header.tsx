'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject,
  type SyntheticEvent,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '@/lib/redux/slices/authSlice';
import { selectCartItems, selectCartItemCount, removeItem } from '@/lib/redux/slices/cartSlice';
import CartDropdown from '../header/CartDropdown';
import CatDropdown from '../header/CatDropdown';
import SearchBar from '../header/SearchBar';
import { T, headerStyles } from '@/components/styles';

interface NavLink {
  label: string;
  path: string;
}

const topMenuLinks: NavLink[] = [
  { label: 'Compare', path: '/product-comparison' },
  { label: 'About', path: '/about' },
  { label: 'Our Store', path: '/shop' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQs', path: '/faq' },
];

const currencies = ['USD', 'EUR'];

interface Language {
  code: string;
  flag: string;
  label: string;
}

const languages: Language[] = [
  { code: 'en', flag: 'um', label: 'English' },
  { code: 'de', flag: 'de', label: 'German' },
  { code: 'fr', flag: 'fr', label: 'French' },
  { code: 'hi', flag: 'in', label: 'Hindi' },
  { code: 'zh', flag: 'cn', label: 'Chinese' },
  { code: 'ar', flag: 'ae', label: 'Arabic' },
];

interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: '𝒇', url: 'https://facebook.com', label: 'Facebook' },
  { icon: '𝕏', url: 'https://twitter.com', label: 'Twitter' },
  { icon: 'in', url: 'https://linkedin.com', label: 'LinkedIn' },
];

const categories: Record<string, NavLink[]> = {
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

const mainNavItems: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Our Store', path: '/shop' },
];

const accountLinks: NavLink[] = [
  { label: 'Dashboard', path: '/account/dashboard' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Payment Methods', path: '/account/payment-methods' },
  { label: 'User Details', path: '/account/details' },
  { label: 'Saved Addresses', path: '/account/addresses' },
];

// ── Reusable hook: close when clicking outside ref ──────────────────────────
function useOutsideClick<T extends HTMLElement>(ref: RefObject<T | null>, onClose: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

export const Header = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItems = useAppSelector(selectCartItems);
  const cartItemCount = useAppSelector(selectCartItemCount);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // One ref per dropdown wrapper
  const currencyRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    currencyRef,
    useCallback(() => setCurrencyOpen(false), []),
  );
  useOutsideClick(
    languageRef,
    useCallback(() => setLanguageOpen(false), []),
  );
  useOutsideClick(
    cartRef,
    useCallback(() => setCartOpen(false), []),
  );
  useOutsideClick(
    categoriesRef,
    useCallback(() => setCategoriesOpen(false), []),
  );
  useOutsideClick(
    accountRef,
    useCallback(() => setAccountOpen(false), []),
  );

  // Scroll
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docH > 0 ? (y / docH) * 100 : 0);
        setHeaderCompact(y > 60);
        if (y > lastScrollY.current + 8 && y > 120) setHeaderHidden(true);
        else if (y < lastScrollY.current - 4) setHeaderHidden(false);
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
    setCurrencyOpen(false);
    setLanguageOpen(false);
    setCartOpen(false);
    setCategoriesOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const handleRemoveFromCart = (id: string) => dispatch(removeItem(id));
  const isActive = (path: string) => pathname === path;
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const handleLogoError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement | null;
    if (fallback) fallback.style.display = 'flex';
  };

  // Toggle helpers — opening one closes the others
  const toggleCurrency = () => {
    setCurrencyOpen((o) => !o);
    setLanguageOpen(false);
    setCartOpen(false);
    setAccountOpen(false);
  };
  const toggleLanguage = () => {
    setLanguageOpen((o) => !o);
    setCurrencyOpen(false);
    setCartOpen(false);
    setAccountOpen(false);
  };
  const toggleCategories = () => {
    setCategoriesOpen((o) => !o);
    setAccountOpen(false);
  };
  const toggleAccount = () => {
    setAccountOpen((o) => !o);
    setCategoriesOpen(false);
  };
  const toggleCart = () => {
    setCartOpen((o) => !o);
    setCurrencyOpen(false);
    setLanguageOpen(false);
    setAccountOpen(false);
  };

  return (
    <>
      <style>{headerStyles}</style>

      <header
        className={[
          'hdr-outer',
          headerHidden ? 'hdr-hidden' : '',
          headerCompact ? 'hdr-compact' : '',
        ].join(' ')}
      >
        {/* ── TOPBAR ── */}
        <div className="hdr-topbar">
          <div className="hdr-topbar-inner">
            <span className="hdr-topbar-brand d-none d-lg-block">
              Welcome to <span>e-FEAR</span> — Comics · E-Books · Collectibles
            </span>
            <ul className="hdr-toplinks d-none d-lg-flex">
              {topMenuLinks.map((l) => (
                <li key={l.path}>
                  <Link href={l.path}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="hdr-topbar-right">
              {/* Currency */}
              <div ref={currencyRef} style={{ position: 'relative' }}>
                <button className="hdr-util-btn" onClick={toggleCurrency}>
                  {currency} <span style={{ fontSize: '.5rem' }}>▾</span>
                </button>
                {currencyOpen && (
                  <div className="hdr-util-dropdown">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyOpen(false);
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div ref={languageRef} style={{ position: 'relative' }}>
                <button className="hdr-util-btn" onClick={toggleLanguage}>
                  <i
                    className={`flag-icon flag-icon-${currentLang.flag}`}
                    style={{ marginRight: '.25rem' }}
                  />
                  {language.toUpperCase()} <span style={{ fontSize: '.5rem' }}>▾</span>
                </button>
                {languageOpen && (
                  <div className="hdr-util-dropdown">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLanguageOpen(false);
                        }}
                      >
                        <i className={`flag-icon flag-icon-${l.flag}`} />
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Social */}
              <div
                className="hdr-social"
                style={{
                  display: 'flex',
                  gap: '.25rem',
                  paddingLeft: '.5rem',
                  borderLeft: `1px solid ${T.border}`,
                }}
              >
                {socialLinks.map((s) => (
                  <a
                    key={s.icon}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN BAR ── */}
        <div className="hdr-main">
          <div className="hdr-main-inner">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="d-flex d-lg-none"
              style={{
                display: 'none',
                width: '40px',
                height: '40px',
                background: T.dark2,
                border: `1px solid ${T.border}`,
                color: T.textMid,
                fontSize: '1.2rem',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ☰
            </button>

            <Link href="/" className="hdr-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/fear/efear-logo.png"
                className="logo-icon"
                alt="eFear Logo"
                onError={handleLogoError}
              />
              <span className="hdr-logo-text" style={{ display: 'none' }}>
                e<span>Fear</span>
              </span>
            </Link>

            <div className="hdr-search">
              <SearchBar />
            </div>

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
                  <Link href="/account/dashboard" className="hdr-icon-btn" title="Account">
                    👤
                  </Link>
                  <Link href="/wishlist" className="hdr-icon-btn" title="Wishlist">
                    ♡
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="hdr-btn-login d-none d-sm-flex">
                    Login
                  </Link>
                  <Link href="/register" className="hdr-btn-register d-none d-sm-flex">
                    Register
                  </Link>
                </>
              )}

              {/* Cart — single instance for both guest & auth */}
              <div ref={cartRef} style={{ position: 'relative' }}>
                <button className="hdr-icon-btn" title="Cart" onClick={toggleCart}>
                  🛒
                  {cartItemCount > 0 && <span className="hdr-icon-badge">{cartItemCount}</span>}
                </button>
                {cartOpen && (
                  <CartDropdown
                    items={cartItems}
                    onRemoveItem={handleRemoveFromCart}
                    onClose={() => setCartOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRIMARY NAV ── */}
        <nav className="hdr-nav">
          <div className="hdr-scroll-progress" style={{ width: `${scrollProgress}%` }} />
          <div className="hdr-nav-inner">
            {mainNavItems.map((item) => (
              <div key={item.path} className="hdr-nav-item">
                <Link
                  href={item.path}
                  className={`hdr-nav-link${isActive(item.path) ? ' active' : ''}`}
                >
                  {item.label}
                </Link>
              </div>
            ))}

            {/* Categories */}
            <div ref={categoriesRef} className="hdr-nav-item" style={{ position: 'relative' }}>
              <button
                className="hdr-nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={toggleCategories}
                aria-expanded={categoriesOpen}
              >
                Categories <span className="hdr-nav-arrow">▾</span>
              </button>
              {categoriesOpen && (
                <CatDropdown categories={categories} onClose={() => setCategoriesOpen(false)} />
              )}
            </div>

            {/* My Account */}
            <div
              ref={accountRef}
              className="hdr-nav-item"
              style={{ marginLeft: 'auto', position: 'relative' }}
            >
              <button
                className="hdr-nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={toggleAccount}
                aria-expanded={accountOpen}
              >
                {isAuthenticated && currentUser
                  ? `Hi, ${currentUser.firstName || 'User'}`
                  : 'My Account'}{' '}
                <span className="hdr-nav-arrow">▾</span>
              </button>
              {accountOpen && (
                <div className="hdr-account-dd" style={{ display: 'block' }}>
                  {accountLinks.map((link) => (
                    <Link key={link.path} href={link.path} onClick={() => setAccountOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <Link
                        href="/login"
                        style={{ color: T.red }}
                        onClick={() => setAccountOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        style={{ color: T.red }}
                        onClick={() => setAccountOpen(false)}
                      >
                        Register
                      </Link>
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
              <h2 className="hdr-drawer-title">
                e<span style={{ color: T.red }}>Fear</span>
              </h2>
              <button className="hdr-drawer-close" onClick={() => setMobileMenuOpen(false)}>
                ✕
              </button>
            </div>
            <div className="hdr-drawer-search">
              <SearchBar placeholder="Search products..." />
            </div>
            <div className="hdr-drawer-nav">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`hdr-drawer-nav-link${isActive(item.path) ? ' active' : ''}`}
                >
                  {item.label}
                  <span style={{ color: T.textDim, fontSize: '.6rem' }}>→</span>
                </Link>
              ))}
              {Object.entries(categories).map(([group, items]) => (
                <div key={group}>
                  <div className="hdr-drawer-section-title">{group}</div>
                  {items.map((item) => (
                    <Link key={item.label} href={item.path} className="hdr-drawer-cat-link">
                      {item.label}
                      <span style={{ color: T.textDim, fontSize: '.6rem' }}>→</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="hdr-drawer-section-title">My Account</div>
              {accountLinks.map((link) => (
                <Link key={link.path} href={link.path} className="hdr-drawer-cat-link">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="hdr-drawer-footer">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    style={{
                      display: 'block',
                      padding: '.75rem',
                      textAlign: 'center',
                      border: `1px solid ${T.border}`,
                      color: T.textMid,
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '.72rem',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    style={{
                      display: 'block',
                      padding: '.75rem',
                      textAlign: 'center',
                      background: T.red,
                      color: '#fff',
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '.72rem',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      clipPath:
                        'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    }}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Link
                  href="/account/dashboard"
                  style={{
                    display: 'block',
                    padding: '.75rem',
                    textAlign: 'center',
                    background: T.dark2,
                    border: `1px solid ${T.border}`,
                    color: T.textMid,
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '.72rem',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  My Dashboard
                </Link>
              )}
              <div style={{ display: 'flex', gap: '.5rem' }}>
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      flex: 1,
                      padding: '.45rem',
                      background: currency === c ? T.red : T.dark2,
                      border: `1px solid ${currency === c ? T.red : T.border}`,
                      color: currency === c ? '#fff' : T.textDim,
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '.62rem',
                      letterSpacing: '.1em',
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
