// pages/FAQ.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  // State to track which accordion items are open
  const [openItems, setOpenItems] = useState(['faq1']); // First item open by default

  // FAQ data structure
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: 'bx-help-circle',
      faqs: [
        {
          id: 'faq1',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy on all items. Products must be unused and in their original packaging. Simply contact our customer service team to initiate a return. Refunds are processed within 5-7 business days after we receive the returned item.'
        },
        {
          id: 'faq2',
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 5-7 business days. Express shipping is available and takes 2-3 business days. International shipping times vary by location, generally 10-15 business days. You will receive a tracking number once your order ships.'
        },
        {
          id: 'faq3',
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates are calculated at checkout based on your location and the weight of your order. Please note that customs fees and import duties may apply and are the responsibility of the customer.'
        },
        {
          id: 'faq4',
          question: 'How can I track my order?',
          answer: 'Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on our website or directly on the carrier\'s website. You can also track your order by logging into your account and viewing your order history.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Orders',
      icon: 'bx-user-circle',
      faqs: [
        {
          id: 'faq5',
          question: 'How do I create an account?',
          answer: 'Click on the "Sign Up" button in the top right corner of our website. Fill in your email address, create a password, and provide your basic information. You can also sign up using your Google or Facebook account for faster registration.'
        },
        {
          id: 'faq6',
          question: 'I forgot my password. What should I do?',
          answer: 'Click on the "Forgot Password" link on the login page. Enter your email address and we will send you instructions to reset your password. If you don\'t receive the email within a few minutes, check your spam folder or contact customer support.'
        },
        {
          id: 'faq7',
          question: 'Can I modify my order after placing it?',
          answer: 'You can modify your order within 1 hour of placing it by contacting our customer service team. After this time, orders enter our fulfillment process and cannot be modified. However, you can always return items once you receive them.'
        },
        {
          id: 'faq8',
          question: 'How do I cancel my order?',
          answer: 'Orders can be cancelled within 1 hour of placement through your account dashboard or by contacting customer service. Once an order has been shipped, it cannot be cancelled but can be returned following our standard return policy.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Pricing',
      icon: 'bx-credit-card',
      faqs: [
        {
          id: 'faq9',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption to protect your payment information.'
        },
        {
          id: 'faq10',
          question: 'Do you offer price matching?',
          answer: 'Yes, we offer price matching on identical items sold by authorized retailers. Submit a price match request within 7 days of your purchase with proof of the lower price, and we will refund the difference if approved.'
        },
        {
          id: 'faq11',
          question: 'Are there any hidden fees?',
          answer: 'No, the price you see at checkout is the final price you pay. This includes all applicable taxes. Shipping costs are clearly displayed before you complete your purchase. International orders may be subject to customs fees which are not included in our pricing.'
        },
        {
          id: 'faq12',
          question: 'Do you offer gift cards?',
          answer: 'Yes, we offer digital gift cards in various denominations. Gift cards are delivered via email and can be used for any products on our website. They never expire and can be combined with other payment methods.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Products & Stock',
      icon: 'bx-package',
      faqs: [
        {
          id: 'faq13',
          question: 'How do I know if an item is in stock?',
          answer: 'Product availability is displayed on each product page. If an item shows "In Stock," it is available for immediate purchase. Out of stock items will display "Out of Stock" and you can sign up for notifications when they become available again.'
        },
        {
          id: 'faq14',
          question: 'Do you restock sold-out items?',
          answer: 'Most popular items are restocked regularly. Click "Notify Me" on any out-of-stock product page to receive an email alert when the item is back in stock. Restocking times vary depending on the product and supplier availability.'
        },
        {
          id: 'faq15',
          question: 'Are your products authentic?',
          answer: 'Yes, all products sold on our website are 100% authentic and sourced directly from authorized distributors and manufacturers. We guarantee the authenticity of every item and provide certificates of authenticity upon request for luxury items.'
        },
        {
          id: 'faq16',
          question: 'Do you offer product warranties?',
          answer: 'Yes, all products come with the manufacturer\'s standard warranty. Warranty periods vary by product and brand. Additionally, we offer extended warranty options at checkout for select products. Warranty information is available on each product page.'
        }
      ]
    }
  ];

  // Toggle accordion item
  const toggleItem = (itemId) => {
    setOpenItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Check if item is open
  const isOpen = (itemId) => openItems.includes(itemId);

  // Expand all items
  const expandAll = () => {
    const allIds = faqCategories.flatMap(cat => cat.faqs.map(faq => faq.id));
    setOpenItems(allIds);
  };

  // Collapse all items
  const collapseAll = () => {
    setOpenItems([]);
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Frequently Asked Questions</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="bx bx-home-alt"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    FAQ
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-4">
        <div className="container">
          {/* Header */}
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2 className="mb-3">How Can We Help You?</h2>
              <p className="text-muted mb-4">
                Find answers to commonly asked questions about our products, services, and policies.
              </p>
              
              {/* Expand/Collapse All */}
              <div className="d-flex justify-content-center gap-2 mb-4">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={expandAll}
                >
                  <i className='bx bx-plus-circle me-1'></i>
                  Expand All
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={collapseAll}
                >
                  <i className='bx bx-minus-circle me-1'></i>
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="row">
            <div className="col-12">
              {faqCategories.map((category, categoryIndex) => (
                <div key={category.id} className="mb-4">
                  {/* Category Header */}
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body bg-light">
                      <h5 className="mb-0 d-flex align-items-center">
                        <i className={`bx ${category.icon} me-2 fs-4 text-primary`}></i>
                        {category.title}
                      </h5>
                    </div>
                  </div>

                  {/* FAQ Accordion */}
                  <div className="accordion" id={`accordion-${category.id}`}>
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faq.id} className="card rounded-0 mb-2">
                        <div className="card-header border-bottom-0 bg-transparent">
                          <button
                            className={`btn btn-link text-decoration-none w-100 text-start d-flex justify-content-between align-items-center ${
                              isOpen(faq.id) ? '' : 'collapsed'
                            }`}
                            type="button"
                            onClick={() => toggleItem(faq.id)}
                            aria-expanded={isOpen(faq.id)}
                          >
                            <span className="fw-500">
                              <i className='bx bx-help-circle me-2 text-primary'></i>
                              {faq.question}
                            </span>
                            <i className={`bx ${isOpen(faq.id) ? 'bx-chevron-up' : 'bx-chevron-down'} fs-5`}></i>
                          </button>
                        </div>
                        
                        <div
                          className={`collapse ${isOpen(faq.id) ? 'show' : ''}`}
                          id={faq.id}
                        >
                          <div className="card-body pt-0">
                            <p className="mb-0 text-muted ps-4">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm bg-light">
                <div className="card-body p-4 text-center">
                  <i className='bx bx-support display-4 text-primary mb-3'></i>
                  <h4 className="mb-3">Still Have Questions?</h4>
                  <p className="text-muted mb-4">
                    Can't find the answer you're looking for? Our customer support team is here to help!
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/contact" className="btn btn-primary">
                      <i className='bx bx-envelope me-2'></i>
                      Contact Support
                    </Link>
                    <a href="tel:+1234567890" className="btn btn-outline-primary">
                      <i className='bx bx-phone me-2'></i>
                      Call Us: (123) 456-7890
                    </a>
                    <button className="btn btn-outline-secondary">
                      <i className='bx bx-message-dots me-2'></i>
                      Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0">
                <div className="card-body">
                  <h6 className="mb-3">Quick Links</h6>
                  <div className="row">
                    <div className="col-md-3 col-6 mb-2">
                      <Link to="/shop" className="text-decoration-none">
                        <i className='bx bx-shopping-bag me-2'></i>
                        Shop Now
                      </Link>
                    </div>
                    <div className="col-md-3 col-6 mb-2">
                      <Link to="/account/orders" className="text-decoration-none">
                        <i className='bx bx-package me-2'></i>
                        Track Order
                      </Link>
                    </div>
                    <div className="col-md-3 col-6 mb-2">
                      <Link to="/returns" className="text-decoration-none">
                        <i className='bx bx-refresh me-2'></i>
                        Returns
                      </Link>
                    </div>
                    <div className="col-md-3 col-6 mb-2">
                      <Link to="/shipping" className="text-decoration-none">
                        <i className='bx bx-car me-2'></i>
                        Shipping Info
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;