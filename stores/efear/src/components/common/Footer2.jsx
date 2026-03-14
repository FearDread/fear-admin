import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from './Toast';
import { fetchCategories, selectAllCategories } from '../../features/categories/slice';
import { sendSubscribe } from '../../features/mail/slice';
import { T, footerStyles } from "../styles";


export const Footer2 = ({ categories }) => {
  const dispatch = useDispatch();
  const [subEmail, setSubEmail]   = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [toasts, setToasts]         = useState([]);

  const allCategories = useSelector(selectAllCategories);
  const { success, error, loading } = useSelector(state => state.mail);

  if (!categories) categories = allCategories;

  /* toast helpers */
  const addToast    = (message, type) => setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  const removeToast = (id)             => setToasts(prev => prev.filter(t => t.id !== id));
  const isValidEmail = (email)         => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = (e) => {
    e?.preventDefault();
    if (!subEmail.trim())        { addToast('Please enter an email address', 'error'); return; }
    if (!isValidEmail(subEmail)) { addToast('Please enter a valid email address', 'error'); return; }
    setSubLoading(true);
    dispatch(sendSubscribe(JSON.stringify({ $email: subEmail, $subject: 'E-Fear Subscription Notice' })));
  };

  useEffect(() => {
    if (!loading && error)   { addToast('Failed to subscribe. Please try again.', 'error'); setSubLoading(false); }
    if (!loading && success) { setSubEmail(''); setSubLoading(false); addToast('Subscribed! Check your email.', 'success'); }
  }, [loading, success, error]);

  /* ── marquee items ── */
  const marqueeItems = ['Marvel','DC Comics','Dark Horse','Image','IDW','Boom!','Pokémon','Vertigo','Valiant','Dynamite','Fantagraphics','Anime'];

  const supportLinks = [
    { label: 'Privacy Policy',           path: '/privacy'  },
    { label: 'Terms & Conditions',       path: '/terms'    },
    { label: 'Shipping & Returns',       path: '/returns'  },
    { label: 'FAQs',                     path: '/faq'      },
    { label: 'Contact Us',               path: '/contact'  },
    { label: 'About eFear',              path: '/about'    },
  ];

  const socialLinks = [
    { label: '𝒇', href: 'https://facebook.com',  title: 'Facebook'  },
    { label: '𝕏', href: 'https://twitter.com',   title: 'Twitter'   },
    { label: 'in', href: 'https://linkedin.com', title: 'LinkedIn'  },
    { label: '▶',  href: '#',                    title: 'YouTube'   },
  ];

  return (
    <>
      <style>{footerStyles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

      <footer>
        {/* ── PRE-FOOTER MARQUEE ── */}
        <div className="ftr-marquee-wrap">
          <div className="ftr-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="ftr-marquee-item">
                {item} <span className="ftr-marquee-sep">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── MAIN FOOTER BODY ── */}
        <div className="ftr-body">
          <span className="ftr-ghost" aria-hidden="true">eFear</span>

          <div className="ftr-container">
            <div className="ftr-grid">

              {/* ── COL 1 : Brand + Contact ── */}
              <div>
                {/* Logo */}
                <Link to="/" className="ftr-logo-text">
                  e<span>Fear</span>
                </Link>
                <span className="ftr-tagline">Comics · E-Books · Collectibles</span>
                <p className="ftr-about-text">
                  Founded in a code-violating basement out of spite, love, and an embarrassing number of long boxes. We sell comics, e-books, and trading cards because someone told us not to.
                </p>
                {/* Social */}
                <div className="ftr-heading"><span>Follow Us</span></div>
                <div className="ftr-socials">
                  {socialLinks.map(s => (
                    <a key={s.title} href={s.href} className="ftr-social-btn" title={s.title} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  ))}
                </div>

                {/* Contact info */}
                <div style={{ marginTop: '1.75rem' }}>
                  <div className="ftr-heading"><span>Contact</span></div>
                  <div className="ftr-contact-item">
                    <span className="ftr-contact-label">Address</span>
                    <span className="ftr-contact-val">2003 E. Veterans Memorial Blvd.</span>
                  </div>
                  <div className="ftr-contact-item">
                    <span className="ftr-contact-label">Phone</span>
                    <span className="ftr-contact-val">
                      <a href="tel:+12543450130">+1 (254) 345-0130</a>
                    </span>
                  </div>
                  <div className="ftr-contact-item">
                    <span className="ftr-contact-label">Email</span>
                    <span className="ftr-contact-val">
                      <a href="mailto:fear.dread@underworld.dog">fear.dread@underworld.dog</a>
                    </span>
                  </div>
                  <div className="ftr-contact-item">
                    <span className="ftr-contact-label">Hours</span>
                    <span className="ftr-contact-val">Mon – Fri / 9:30 AM – 6:30 PM</span>
                  </div>
                </div>
              </div>

              {/* ── COL 2 : Categories ── */}
              <div>
                <div className="ftr-heading">
                  <span>Shop <span className="ftr-heading-accent">Categories</span></span>
                </div>
                {categories && categories.slice(0, 10).map(cat => (
                  <Link
                    key={cat._id}
                    to={`/shop?search=${cat.title}`}
                    className="ftr-cat-link"
                  >
                    {cat.title}
                    <span className="ftr-cat-arrow">→</span>
                  </Link>
                ))}
                {(!categories || categories.length === 0) && (
                  ['Comics', 'E-Books', 'Manga', 'Graphic Novels', 'Pokémon', 'Basketball Cards', 'Football Cards', 'Collectibles'].map(c => (
                    <Link key={c} to={`/shop?search=${c}`} className="ftr-cat-link">
                      {c} <span className="ftr-cat-arrow">→</span>
                    </Link>
                  ))
                )}
              </div>

              {/* ── COL 3 : Support ── */}
              <div>
                <div className="ftr-heading"><span>Support</span></div>
                {supportLinks.map(l => (
                  <Link key={l.path} to={l.path} className="ftr-support-link">
                    {l.label}
                  </Link>
                ))}

                {/* Quick stats row */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="ftr-heading"><span>By the Numbers</span></div>
                  {[
                    { val: '1000+', lbl: 'Titles In Stock' },
                    { val: 'NM',    lbl: 'Quality Standard' },
                    { val: '30',    lbl: 'Day Returns' },
                    { val: '24/7',  lbl: 'Support Hours' },
                  ].map(s => (
                    <div key={s.lbl} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '.4rem 0', borderBottom: `1px solid ${T.border}`,
                    }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', letterSpacing: '.08em', textTransform: 'uppercase', color: T.textDim }}>{s.lbl}</span>
                      <span style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '1rem', color: T.red }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── COL 4 : Newsletter + App ── */}
              <div>
                <div className="ftr-heading">
                  <span>Stay <span className="ftr-heading-accent">Informed</span></span>
                </div>
                <p className="ftr-sub-note" style={{ marginBottom: '1rem' }}>
                  Early access to discounts, new arrivals, and the occasional deeply personal opinion about Spider-Man.
                </p>

                {/* Email form */}
                <form onSubmit={handleSubscribe} style={{ marginBottom: '.75rem' }}>
                  <div className="ftr-sub-form">
                    <input
                      type="email"
                      className="ftr-sub-input"
                      placeholder="Your email address"
                      value={subEmail}
                      onChange={e => setSubEmail(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSubscribe(e)}
                      disabled={subLoading}
                    />
                    <button type="submit" className="ftr-sub-btn" disabled={subLoading}>
                      {subLoading ? '...' : 'Subscribe'}
                    </button>
                  </div>
                </form>
                <p className="ftr-sub-note">
                  No spam. No selling your data. We read enough dystopian comics to know better.
                </p>

                {/* App download */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="ftr-heading"><span>Download App</span></div>
                  <div className="ftr-app-badges">
                    <a href="#" className="ftr-app-badge">
                      <span className="ftr-app-badge-icon">🍎</span>
                      <div>
                        <span className="ftr-app-badge-top">Download on the</span>
                        <span className="ftr-app-badge-name">App Store</span>
                      </div>
                    </a>
                    <a href="#" className="ftr-app-badge">
                      <span className="ftr-app-badge-icon">▶</span>
                      <div>
                        <span className="ftr-app-badge-top">Get it on</span>
                        <span className="ftr-app-badge-name">Google Play</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

            </div>{/* /ftr-grid */}

            <div className="ftr-divider" />

            {/* ── BOTTOM BAR ── */}
            <div className="ftr-bottom">
              <p className="ftr-copy">
                Copyright © <a href="https://feard.vercel.app">FEAR Inc.</a> <span>2025</span>. All rights reserved.
                &nbsp;·&nbsp;
                <Link to="/privacy">Privacy</Link>
                &nbsp;·&nbsp;
                <Link to="/terms">Terms</Link>
              </p>

              {/* Payment badges */}
              <div className="ftr-payments">
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.58rem', letterSpacing: '.12em', textTransform: 'uppercase', color: T.textDim, marginRight: '.35rem' }}>We accept</span>
                {[
                  { src: 'assets/images/icons/visa.png',            alt: 'Visa'            },
                  { src: 'assets/images/icons/paypal.png',          alt: 'PayPal'          },
                  { src: 'assets/images/icons/mastercard.png',       alt: 'Mastercard'      },
                  { src: 'assets/images/icons/american-express.png', alt: 'Amex'            },
                ].map(p => (
                  <img key={p.alt} src={p.src} alt={p.alt} className="ftr-pay-icon" title={p.alt} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ftr-animated-border" />
      </footer>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  );
};

export default Footer2;