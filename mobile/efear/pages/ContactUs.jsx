import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/common/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { sendContact } from '../features/mail/slice';
import { T, contactStyles } from "../styles";

const SUBJECTS = [
  'Order Inquiry',
  'Product Question',
  'Returns & Refunds',
  'Wholesale / Bulk',
  'Press / Media',
  'Just Saying Hi',
];

export const ContactUs = () => {
  const dispatch = useDispatch();

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [activeSubject, setActiveSubject] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [inlineMsg, setInlineMsg] = useState({ text: '', type: '' });
  const [toasts, setToasts] = useState([]);

  const { success, loading, error } = useSelector(state => state.mail);

  const addToast    = (message, type) => setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  const removeToast = (id)            => setToasts(prev => prev.filter(t => t.id !== id));
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = e => setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e?.preventDefault();
    setInlineMsg({ text: '', type: '' });

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setInlineMsg({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    if (!isValidEmail(contactForm.email)) {
      setInlineMsg({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    const payload = JSON.stringify({
      '$name':    contactForm.name,
      '$email':   contactForm.email,
      '$message': `[${activeSubject || 'General'}] ${contactForm.message}`,
    });

    setContactLoading(true);
    dispatch(sendContact(payload));
  };

  useEffect(() => {
    if (!loading && error) {
      addToast('Failed to send message. Please try again.', 'error');
      setContactLoading(false);
    }
    if (!loading && success) {
      addToast("Message sent! We'll get back to you soon.", 'success');
      setContactLoading(false);
      setContactForm({ name: '', email: '', message: '' });
      setActiveSubject('');
    }
  }, [loading, success, error]);

  /* info bar items */
  const infoItems = [
    { icon: '📍', label: 'Address',      val: '2003 E. Veterans Memorial Blvd, Killeen TX 76541' },
    { icon: '📞', label: 'Phone',        val: <><a href="tel:+12544350130">+1 (254) 435-0130</a><br /><a href="tel:+12546235923">+1 (254) 623-5923</a></> },
    { icon: '✉️', label: 'Email',        val: <a href="mailto:fear.dread@underworld.dog">fear.dread@underworld.dog</a> },
    { icon: '🕐', label: 'Hours',        val: 'Mon–Fri / 9:30 AM – 6:30 PM' },
  ];

  /* hours rows */
  const hours = [
    { day: 'Monday',    time: '9:30 AM – 6:30 PM', open: true  },
    { day: 'Tuesday',   time: '9:30 AM – 6:30 PM', open: true  },
    { day: 'Wednesday', time: '9:30 AM – 6:30 PM', open: true  },
    { day: 'Thursday',  time: '9:30 AM – 6:30 PM', open: true  },
    { day: 'Friday',    time: '9:30 AM – 6:30 PM', open: true  },
    { day: 'Saturday',  time: 'Closed',             open: false },
    { day: 'Sunday',    time: 'Closed',             open: false },
  ];

  /* check if currently open (very simple — just checks day-of-week) */
  const now    = new Date();
  const day    = now.getDay(); // 0=Sun,6=Sat
  const isOpen = day >= 1 && day <= 5;

  return (
    <>
      <style>{contactStyles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

      <div className="ct-page">

        {/* ── PAGE HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-ghost" aria-hidden="true">CONTACT</div>
          <div className="ct-hero-stripe" />
          <div className="ct-hero-inner">
            <div className="ct-breadcrumb">
              <Link to="/"       className="ct-bc-link">Home</Link>
              <span className="ct-bc-sep">✦</span>
              <span className="ct-bc-current">Contact Us</span>
            </div>
            <span className="ct-eyebrow">We don't bite. Usually.</span>
            <h1 className="ct-hero-title">
              Get In<br /><span>Touch.</span>
            </h1>
            <p className="ct-hero-sub">
              Shoot us a message and we'll get back to you faster than DC responds to fan feedback. That bar is low, but we clear it with room to spare.
            </p>
          </div>
        </section>

        {/* ── QUICK INFO BAR ── */}
        <div className="ct-infobar">
          <div className="ct-infobar-inner">
            {infoItems.map(item => (
              <div className="ct-info-item" key={item.label}>
                <div className="ct-info-icon-wrap">{item.icon}</div>
                <div>
                  <span className="ct-info-label">{item.label}</span>
                  <span className="ct-info-val">{item.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="ct-main">

          {/* ── CONTACT FORM ── */}
          <div className="ct-form-panel">
            <div className="ct-form-header">
              <span className="ct-eyebrow">Send a message</span>
              <h2 className="ct-form-title">Want To Know <span>More?</span></h2>
              <p className="ct-form-sub">
                Fill in the form below and one of our comic-obsessed humans will respond. We read every message personally. Even the weird ones.
              </p>
            </div>

            <div className="ct-form-body">
              {/* Subject pills */}
              <div className="ct-field" style={{ marginBottom: '1.5rem' }}>
                <span className="ct-field-label">What's this about? (optional)</span>
                <div className="ct-subject-pills">
                  {SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`ct-subject-pill${activeSubject === s ? ' active' : ''}`}
                      onClick={() => setActiveSubject(activeSubject === s ? '' : s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name + Email row */}
                <div className="ct-field-row">
                  <div className="ct-field">
                    <label htmlFor="ct-name" className="ct-field-label">Name *</label>
                    <input
                      id="ct-name"
                      type="text"
                      name="name"
                      className="ct-input"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={handleChange}
                      disabled={contactLoading}
                    />
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-email" className="ct-field-label">Email Address *</label>
                    <input
                      id="ct-email"
                      type="email"
                      name="email"
                      className="ct-input"
                      placeholder="you@example.com"
                      value={contactForm.email}
                      onChange={handleChange}
                      disabled={contactLoading}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="ct-field">
                  <label htmlFor="ct-message" className="ct-field-label">Message *</label>
                  <textarea
                    id="ct-message"
                    name="message"
                    className="ct-textarea"
                    placeholder="What's on your mind? Orders, questions, unsolicited Spider-Man opinions — all welcome."
                    rows={14}
                    value={contactForm.message}
                    onChange={handleChange}
                    disabled={contactLoading}
                  />
                  {/* Character count */}
                  <div style={{
                    fontFamily: "'Space Mono',monospace", fontSize: '.58rem',
                    color: T.textDim, textAlign: 'right', marginTop: '.35rem',
                  }}>
                    {contactForm.message.length} / 2000
                  </div>
                </div>

                {/* Inline alert */}
                {inlineMsg.text && (
                  <div className={`ct-alert ${inlineMsg.type}`}>
                    <span className="ct-alert-icon">{inlineMsg.type === 'error' ? '⚠' : '✓'}</span>
                    {inlineMsg.text}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="ct-submit" disabled={contactLoading}>
                  {contactLoading ? (
                    <><div className="ct-submit-spinner" /> Sending...</>
                  ) : (
                    <>Send Message →</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="ct-sidebar">

            {/* Live status card */}
            <div className="ct-sidebar-card" style={{ '--card-accent': isOpen ? T.teal : T.textDim }}>
              <div className="ct-sidebar-card-head">
                <span className="ct-sidebar-card-icon">🕐</span>
                <h3 className="ct-sidebar-card-title">Store Hours</h3>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  {isOpen && <div className="ct-hours-dot" />}
                  <span style={{
                    fontFamily: "'Space Mono',monospace", fontSize: '.6rem',
                    letterSpacing: '.12em', textTransform: 'uppercase',
                    color: isOpen ? T.teal : T.textDim,
                  }}>{isOpen ? 'Open Now' : 'Closed'}</span>
                </div>
              </div>
              <div className="ct-sidebar-card-body">
                {hours.map(h => (
                  <div className="ct-hours-row" key={h.day}>
                    <span className="ct-hours-day">{h.day}</span>
                    <span className={h.open ? 'ct-hours-time' : 'ct-hours-closed'}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy card */}
            <div className="ct-sidebar-card" style={{ '--card-accent': T.orange }}>
              <div className="ct-sidebar-card-head">
                <span className="ct-sidebar-card-icon">🛡️</span>
                <h3 className="ct-sidebar-card-title">Your Privacy</h3>
              </div>
              <div className="ct-sidebar-card-body">
                <p>We're committed to protecting your personal information. We've read enough dystopian comics to know data misuse is bad.</p>
                <p>You have rights to access, delete, and correct any data we hold. Just ask.</p>
                <a href="mailto:fear.dread@underworld.dog" className="ct-sidebar-link">
                  Contact Privacy Team →
                </a>
                
              </div>
                            <div className="ct-sidebar-card-body">
                <p>Under applicable law, you have the right to access, delete, rectify, and port your personal data.</p>
                <p>Contact us to exercise any of these rights and we'll respond within 30 days.</p>
                <Link to="/privacy" className="ct-sidebar-link">View Privacy Policy →</Link>
              </div>
            </div>

            {/* Social card 
            <div className="ct-sidebar-card" style={{ '--card-accent': T.red }}>
              <div className="ct-sidebar-card-head">
                <span className="ct-sidebar-card-icon">📣</span>
                <h3 className="ct-sidebar-card-title">Find Us Online</h3>
              </div>
              <div className="ct-sidebar-card-body">
                {[
                  { icon: '𝒇', label: 'Facebook',  href: 'https://facebook.com' },
                  { icon: '𝕏', label: 'Twitter/X', href: 'https://twitter.com'  },
                  { icon: 'in', label: 'LinkedIn',  href: 'https://linkedin.com' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '.75rem',
                      padding: '.55rem 0', borderBottom: `1px solid ${T.border}`,
                      textDecoration: 'none', transition: 'opacity .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <span style={{
                      width: '32px', height: '32px', background: T.dark2,
                      border: `1px solid ${T.border}`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'serif', fontSize: '.8rem', color: '#fff', flexShrink: 0,
                    }}>{s.icon}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.08em', color: T.textMid }}>{s.label}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono',monospace", fontSize: '.6rem', color: T.textDim }}>→</span>
                  </a>
                ))}
              </div>
            </div>
            */}
          </div>{/* /ct-sidebar */}
        </div>{/* /ct-main */}

        {/* ── MAP SECTION ── */}
        <section className="ct-map-section">
          <div className="ct-map-inner">
            <div className="ct-map-header">
              <span className="ct-eyebrow">Find us in person</span>
              <h2 className="ct-map-title">Our <span>Location</span></h2>
            </div>
            <div className="ct-map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805184.6319269302!2d144.49269200596396!3d-37.971237009163936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1618835176130!5m2!1sen!2sin"
                height="440"
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
                style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
              />
              <div className="ct-map-overlay">
                <div className="ct-map-overlay-title">eFear Comics</div>
                <div className="ct-map-overlay-addr">2003 E. Veterans Memorial Blvd<br />Killeen, TX 76541</div>
              </div>
            </div>
          </div>
          <div className="ct-animated-border" style={{ marginTop: 0 }} />
        </section>

      </div>

      {/* Toasts */}
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  );
};

export default ContactUs;