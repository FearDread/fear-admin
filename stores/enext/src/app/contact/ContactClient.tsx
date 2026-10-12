'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Toast, { type ToastType } from '@/components/common/Toast';
import { useContactMutation } from '@/lib/redux/api/mailApi';
import { T, contactStyles } from '@/components/styles';

const MAX_MESSAGE = 2000;

const SUBJECTS = [
  'Order Inquiry',
  'Product Question',
  'Returns & Refunds',
  'Wholesale / Bulk',
  'Press / Media',
  'Just Saying Hi',
];

// Form state uses plain keys that match the input `name` attributes.
// The $-prefixed shape the FEAR mail route expects is built at submit time.
interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface InlineMessage {
  text: string;
  type: 'error' | 'success' | '';
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const EMPTY_FORM: ContactForm = { name: '', email: '', message: '' };

const ADDRESS_LINE = '2003 E. Veterans Memorial Blvd, Killeen TX 76541';

// Keyless embed of the real store address (the old iframe pointed at Melbourne, AU).
const MAP_SRC =
  'https://www.google.com/maps?q=2003+E+Veterans+Memorial+Blvd,+Killeen,+TX+76541&output=embed';

const HOURS = [
  { day: 'Monday', time: '9:30 AM – 6:30 PM', open: true },
  { day: 'Tuesday', time: '9:30 AM – 6:30 PM', open: true },
  { day: 'Wednesday', time: '9:30 AM – 6:30 PM', open: true },
  { day: 'Thursday', time: '9:30 AM – 6:30 PM', open: true },
  { day: 'Friday', time: '9:30 AM – 6:30 PM', open: true },
  { day: 'Saturday', time: 'Closed', open: false },
  { day: 'Sunday', time: 'Closed', open: false },
];

const INFO_ITEMS = [
  { icon: '📍', label: 'Address', val: ADDRESS_LINE },
  {
    icon: '📞',
    label: 'Phone',
    val: (
      <>
        <a href="tel:+12544350130">+1 (254) 435-0130</a>
        <br />
        <a href="tel:+12546235923">+1 (254) 623-5923</a>
      </>
    ),
  },
  {
    icon: '✉️',
    label: 'Email',
    val: <a href="mailto:fear.dread@underworld.dog">fear.dread@underworld.dog</a>,
  },
  { icon: '🕐', label: 'Hours', val: 'Mon–Fri / 9:30 AM – 6:30 PM' },
];

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ContactClient() {
  const [contactForm, setContactForm] = useState<ContactForm>(EMPTY_FORM);
  const [activeSubject, setActiveSubject] = useState('');
  const [inlineMsg, setInlineMsg] = useState<InlineMessage>({ text: '', type: '' });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // "Open now" depends on the visitor's clock, so compute it after mount.
  // Computing it during render would differ between the server HTML and the
  // client's first render and cause a hydration mismatch.
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const day = new Date().getDay(); // 0 = Sun, 6 = Sat
    setIsOpen(day >= 1 && day <= 5);
  }, []);

  const [sendContact, { isLoading: contactLoading, isSuccess, isError, reset }] =
    useContactMutation();

  const addToast = (message: string, type: ToastType) =>
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setInlineMsg({ text: '', type: '' });

    const { name, email, message } = contactForm;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setInlineMsg({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    if (!isValidEmail(email.trim())) {
      setInlineMsg({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    sendContact({
      $name: name.trim(),
      $email: email.trim().toLowerCase(),
      $subject: activeSubject ? `Contact Form: ${activeSubject}` : 'Contact Form',
      $message: message.trim(),
    });
  };

  useEffect(() => {
    if (isError) {
      addToast('Failed to send message. Please try again.', 'error');
      reset();
    }
    if (isSuccess) {
      addToast("Message sent! We'll get back to you soon.", 'success');
      setContactForm(EMPTY_FORM);
      setActiveSubject('');
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <>
      <style>{contactStyles}</style>

      <div className="ct-page">
        {/* ── PAGE HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-ghost" aria-hidden="true">CONTACT</div>
          <div className="ct-hero-stripe" />
          <div className="ct-hero-inner">
            <div className="ct-breadcrumb">
              <Link href="/" className="ct-bc-link">Home</Link>
              <span className="ct-bc-sep">✦</span>
              <span className="ct-bc-current">Contact Us</span>
            </div>
            <span className="ct-eyebrow">We don&apos;t bite. Usually.</span>
            <h1 className="ct-hero-title">
              Get In<br /><span>Touch.</span>
            </h1>
            <p className="ct-hero-sub">
              Shoot us a message and we&apos;ll get back to you faster than DC responds to fan feedback. That bar is low, but we clear it with room to spare.
            </p>
          </div>
        </section>

        {/* ── QUICK INFO BAR ── */}
        <div className="ct-infobar">
          <div className="ct-infobar-inner">
            {INFO_ITEMS.map((item) => (
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
                <span className="ct-field-label">What&apos;s this about? (optional)</span>
                <div className="ct-subject-pills">
                  {SUBJECTS.map((s) => (
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

              <form onSubmit={handleSubmit} noValidate>
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
                      autoComplete="name"
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
                      autoComplete="email"
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
                    maxLength={MAX_MESSAGE}
                    value={contactForm.message}
                    onChange={handleChange}
                    disabled={contactLoading}
                  />
                  <div
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: '.58rem',
                      color: T.textDim,
                      textAlign: 'right',
                      marginTop: '.35rem',
                    }}
                  >
                    {contactForm.message.length} / {MAX_MESSAGE}
                  </div>
                </div>

                {/* Inline alert */}
                {inlineMsg.text && (
                  <div className={`ct-alert ${inlineMsg.type}`} role="alert">
                    <span className="ct-alert-icon">{inlineMsg.type === 'error' ? '⚠' : '✓'}</span>
                    {inlineMsg.text}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="ct-submit" disabled={contactLoading}>
                  {contactLoading ? (
                    <>
                      <div className="ct-submit-spinner" /> Sending...
                    </>
                  ) : (
                    <>Send Message →</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="ct-sidebar">
            {/* Store hours */}
            <div
              className="ct-sidebar-card"
              style={{ '--card-accent': isOpen ? T.teal : T.textDim } as React.CSSProperties}
            >
              <div className="ct-sidebar-card-head">
                <span className="ct-sidebar-card-icon">🕐</span>
                <h3 className="ct-sidebar-card-title">Store Hours</h3>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  {isOpen && <div className="ct-hours-dot" />}
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: '.6rem',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: isOpen ? T.teal : T.textDim,
                    }}
                  >
                    {isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="ct-sidebar-card-body">
                {HOURS.map((h) => (
                  <div className="ct-hours-row" key={h.day}>
                    <span className="ct-hours-day">{h.day}</span>
                    <span className={h.open ? 'ct-hours-time' : 'ct-hours-closed'}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy (the two near-duplicate bodies are merged into one) */}
            <div className="ct-sidebar-card" style={{ '--card-accent': T.orange } as React.CSSProperties}>
              <div className="ct-sidebar-card-head">
                <span className="ct-sidebar-card-icon">🛡️</span>
                <h3 className="ct-sidebar-card-title">Your Privacy</h3>
              </div>
              <div className="ct-sidebar-card-body">
                <p>
                  We&apos;re committed to protecting your personal information. We&apos;ve read enough dystopian comics to know data misuse is bad.
                </p>
                <p>
                  You have the right to access, delete, correct, and port your personal data. Contact us to exercise any of these rights and we&apos;ll respond within 30 days.
                </p>
                <a href="mailto:fear.dread@underworld.dog" className="ct-sidebar-link">
                  Contact Privacy Team →
                </a>{' '}
                <Link href="/privacy" className="ct-sidebar-link">
                  View Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAP SECTION ── */}
        <section className="ct-map-section">
          <div className="ct-map-inner">
            <div className="ct-map-header">
              <span className="ct-eyebrow">Find us in person</span>
              <h2 className="ct-map-title">Our <span>Location</span></h2>
            </div>
            <div className="ct-map-wrap">
              <iframe
                src={MAP_SRC}
                height={440}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="eFear Comics store location in Killeen, TX"
                style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
              />
              <div className="ct-map-overlay">
                <div className="ct-map-overlay-title">eFear Comics</div>
                <div className="ct-map-overlay-addr">
                  2003 E. Veterans Memorial Blvd<br />Killeen, TX 76541
                </div>
              </div>
            </div>
          </div>
          <div className="ct-animated-border" style={{ marginTop: 0 }} />
        </section>
      </div>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  );
}