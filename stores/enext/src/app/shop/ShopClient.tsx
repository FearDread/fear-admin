'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  title: string;
  icon: string;
  faqs: FaqEntry[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    title: 'General Questions',
    icon: 'bx-help-circle',
    faqs: [
      {
        id: 'faq1',
        question: 'What is your return policy?',
        answer:
          'We offer a 30-day return policy on all items. Products must be unused and in their original packaging. Simply contact our customer service team to initiate a return. Refunds are processed within 5-7 business days after we receive the returned item.',
      },
      {
        id: 'faq2',
        question: 'How long does shipping take?',
        answer:
          'Standard shipping typically takes 5-7 business days. Express shipping is available and takes 2-3 business days. International shipping times vary by location, generally 10-15 business days. You will receive a tracking number once your order ships.',
      },
      {
        id: 'faq3',
        question: 'Do you ship internationally?',
        answer:
          'Yes, we ship to over 100 countries worldwide. International shipping rates are calculated at checkout based on your location and the weight of your order. Please note that customs fees and import duties may apply and are the responsibility of the customer.',
      },
      {
        id: 'faq4',
        question: 'How can I track my order?',
        answer:
          "Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on our website or directly on the carrier's website. You can also track your order by logging into your account and viewing your order history.",
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Orders',
    icon: 'bx-user-circle',
    faqs: [
      {
        id: 'faq5',
        question: 'How do I create an account?',
        answer:
          'Click on the "Sign Up" button in the top right corner of our website. Fill in your email address, create a password, and provide your basic information. You can also sign up using your Google or Facebook account for faster registration.',
      },
      {
        id: 'faq6',
        question: 'I forgot my password. What should I do?',
        answer:
          "Click on the \"Forgot Password\" link on the login page. Enter your email address and we will send you instructions to reset your password. If you don't receive the email within a few minutes, check your spam folder or contact customer support.",
      },
      {
        id: 'faq7',
        question: 'Can I modify my order after placing it?',
        answer:
          'You can modify your order within 1 hour of placing it by contacting our customer service team. After this time, orders enter our fulfillment process and cannot be modified. However, you can always return items once you receive them.',
      },
      {
        id: 'faq8',
        question: 'How do I cancel my order?',
        answer:
          'Orders can be cancelled within 1 hour of placement through your account dashboard or by contacting customer service. Once an order has been shipped, it cannot be cancelled but can be returned following our standard return policy.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment & Pricing',
    icon: 'bx-credit-card',
    faqs: [
      {
        id: 'faq9',
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption to protect your payment information.',
      },
      {
        id: 'faq10',
        question: 'Do you offer price matching?',
        answer:
          'Yes, we offer price matching on identical items sold by authorized retailers. Submit a price match request within 7 days of your purchase with proof of the lower price, and we will refund the difference if approved.',
      },
      {
        id: 'faq11',
        question: 'Are there any hidden fees?',
        answer:
          'No, the price you see at checkout is the final price you pay. This includes all applicable taxes. Shipping costs are clearly displayed before you complete your purchase. International orders may be subject to customs fees which are not included in our pricing.',
      },
      {
        id: 'faq12',
        question: 'Do you offer gift cards?',
        answer:
          'Yes, we offer digital gift cards in various denominations. Gift cards are delivered via email and can be used for any products on our website. They never expire and can be combined with other payment methods.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & Stock',
    icon: 'bx-package',
    faqs: [
      {
        id: 'faq13',
        question: 'How do I know if an item is in stock?',
        answer:
          'Product availability is displayed on each product page. If an item shows "In Stock," it is available for immediate purchase. Out of stock items will display "Out of Stock" and you can sign up for notifications when they become available again.',
      },
      {
        id: 'faq14',
        question: 'Do you restock sold-out items?',
        answer:
          'Most popular items are restocked regularly. Click "Notify Me" on any out-of-stock product page to receive an email alert when the item is back in stock. Restocking times vary depending on the product and supplier availability.',
      },
      {
        id: 'faq15',
        question: 'Are your products authentic?',
        answer:
          'Yes, all products sold on our website are 100% authentic and sourced directly from authorized distributors and manufacturers. We guarantee the authenticity of every item and provide certificates of authenticity upon request for luxury items.',
      },
      {
        id: 'faq16',
        question: 'Do you offer product warranties?',
        answer:
          "Yes, all products come with the manufacturer's standard warranty. Warranty periods vary by product and brand. Additionally, we offer extended warranty options at checkout for select products. Warranty information is available on each product page.",
      },
    ],
  },
];

const QUICK_LINKS: { href: string; icon: string; label: string }[] = [
  { href: '/shop', icon: 'bx-shopping-bag', label: 'Shop Now' },
  { href: '/account/orders', icon: 'bx-package', label: 'Track Order' },
  { href: '/account/dashboard', icon: 'bx-refresh', label: 'Returns' },
  // TODO: source pointed this at "/account/shipping", which isn't a route
  // anywhere in the app (App.js has no shipping-info page). Pointing at
  // /faq for now — swap once a real shipping-info page exists.
  { href: '/faq', icon: 'bx-car', label: 'Shipping Info' },
];

export default function FaqClient() {
  const [openItems, setOpenItems] = useState<string[]>(['faq1']);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isOpen = (itemId: string) => openItems.includes(itemId);

  const expandAll = () => {
    setOpenItems(FAQ_CATEGORIES.flatMap(cat => cat.faqs.map(faq => faq.id)));
  };

  const collapseAll = () => setOpenItems([]);

  return (
    <div className="faq-page">
      {/* ── Hero ── */}
      <section className="faq-hero">
        <div className="faq-hero-halftone" />
        <div className="faq-hero-stripe" />
        <span className="faq-hero-ghost" aria-hidden="true">FAQ</span>

        <div className="faq-hero-inner">
          <nav className="faq-breadcrumb" aria-label="breadcrumb">
            <Link href="/" className="faq-bc-link">
              <i className="bx bx-home-alt" /> Home
            </Link>
            <span className="faq-bc-sep">▸</span>
            <span className="faq-bc-current">FAQ</span>
          </nav>

          <span className="faq-eyebrow">Support Center</span>
          <h1 className="faq-hero-title">
            Frequently<br />
            <span>Asked</span>
          </h1>
          <p className="faq-hero-sub">
            Find answers to common questions about our products, shipping, and policies.
          </p>

          <div className="faq-controls">
            <button className="faq-btn-primary" onClick={expandAll}>
              <i className="bx bx-plus-circle" /> Expand All
            </button>
            <button className="faq-btn-ghost" onClick={collapseAll}>
              <i className="bx bx-minus-circle" /> Collapse All
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ Body ── */}
      <section className="faq-body">
        <div className="faq-container">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.id} className="faq-category">
              <div className="faq-cat-header">
                <span className="faq-cat-icon">
                  <i className={`bx ${category.icon}`} />
                </span>
                <h2 className="faq-cat-title">{category.title}</h2>
                <span className="faq-cat-count">{category.faqs.length}</span>
              </div>

              <div className="faq-accordion">
                {category.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`faq-item${isOpen(faq.id) ? ' faq-item--open' : ''}`}
                  >
                    <button
                      className="faq-item-trigger"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen(faq.id)}
                    >
                      <span className="faq-item-q">
                        <i className="bx bx-help-circle faq-item-q-icon" />
                        {faq.question}
                      </span>
                      <i className={`bx ${isOpen(faq.id) ? 'bx-chevron-up' : 'bx-chevron-down'} faq-item-chevron`} />
                    </button>

                    <div className={`faq-item-body${isOpen(faq.id) ? ' faq-item-body--open' : ''}`}>
                      <p className="faq-item-answer">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ── Still Need Help ── */}
          <div className="faq-support">
            <div className="faq-support-inner">
              <span className="faq-support-icon">
                <i className="bx bx-support" />
              </span>
              <span className="faq-eyebrow" style={{ textAlign: 'center' }}>We&apos;re here</span>
              <h3 className="faq-support-title">Still Have Questions?</h3>
              <p className="faq-support-sub">
                Can&apos;t find what you&apos;re looking for? Our support team is standing by.
              </p>
              <div className="faq-support-actions">
                <Link href="/contact" className="faq-btn-primary">
                  <i className="bx bx-envelope" /> Contact Support
                </Link>
                <a href="tel:+1234567890" className="faq-btn-ghost">
                  <i className="bx bx-phone" /> (123) 456-7890
                </a>
                <button className="faq-btn-outline">
                  <i className="bx bx-message-dots" /> Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="faq-quicklinks">
            <span className="faq-eyebrow">Quick Access</span>
            <div className="faq-quicklinks-grid">
              {QUICK_LINKS.map(({ href, icon, label }) => (
                <Link key={href + label} href={href} className="faq-quicklink-card">
                  <i className={`bx ${icon} faq-quicklink-icon`} />
                  <span className="faq-quicklink-label">{label}</span>
                  <i className="bx bx-chevron-right faq-quicklink-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}