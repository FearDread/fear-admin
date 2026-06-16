'use client';

/**
 * components/layout/SiteLayout.jsx
 *
 * Wraps every page with Navbar and Footer.
 * Import your existing components below.
 */

// TODO: replace with your real Navbar and Footer imports
// import Navbar from './Navbar';
// import Footer from './Footer';

import { usePathname } from 'next/navigation';

// Routes where Navbar/Footer should be hidden (e.g. landing page, checkout complete)
const BARE_ROUTES = [
  '/landing',
  '/checkout/complete',
];

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  const isBare = BARE_ROUTES.includes(pathname);

  return (
    <>
      {!isBare && <Navbar />}
      <main>{children}</main>
      {!isBare && <Footer />}
    </>
  );
}

// ─── Placeholder Navbar ───────────────────────────────────────────────────────
// Delete this once you import your real one

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          eFear
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/shop">Shop</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/blog">Blog</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <a href="/wishlist" className="nav-link">♡</a>
            <a href="/cart" className="nav-link">🛒</a>
            <a href="/account/dashboard" className="btn btn-outline-primary btn-sm">
              Account
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Placeholder Footer ───────────────────────────────────────────────────────
// Delete this once you import your real one

function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">eFear</h5>
            <p className="text-muted small">
              Your one-stop shop for everything you need.
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Shop</h6>
            <ul className="list-unstyled small">
              <li><a href="/shop" className="text-muted text-decoration-none">All Products</a></li>
              <li><a href="/shop-categories" className="text-muted text-decoration-none">Categories</a></li>
              <li><a href="/product-comparison" className="text-muted text-decoration-none">Compare</a></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Help</h6>
            <ul className="list-unstyled small">
              <li><a href="/faq" className="text-muted text-decoration-none">FAQ</a></li>
              <li><a href="/contact" className="text-muted text-decoration-none">Contact</a></li>
              <li><a href="/returns" className="text-muted text-decoration-none">Returns</a></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Legal</h6>
            <ul className="list-unstyled small">
              <li><a href="/terms" className="text-muted text-decoration-none">Terms</a></li>
              <li><a href="/privacy" className="text-muted text-decoration-none">Privacy</a></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled small">
              <li><a href="/login" className="text-muted text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-muted text-decoration-none">Register</a></li>
              <li><a href="/account/dashboard" className="text-muted text-decoration-none">Dashboard</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary mt-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <span>© {new Date().getFullYear()} eFear. All rights reserved.</span>
          <span className="mt-2 mt-md-0">Built with FEAR</span>
        </div>
      </div>
    </footer>
  );
}