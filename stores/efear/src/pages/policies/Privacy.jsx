import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { T, policyStyles } from './styles';

const NAV = [
    { id: 'changes',    label: 'Changes to Policy'    },
    { id: 'collect',    label: 'How We Collect'       },
    { id: 'what',       label: 'What We Collect'      },
    { id: 'usage',      label: 'How We Use Data'      },
    { id: 'cookies',    label: 'Cookies'              },
    { id: 'disclosure', label: 'Disclosure'           },
    { id: 'ugc',        label: 'User Content'         },
    { id: 'links',      label: 'Third-Party Links'    },
    { id: 'children',   label: "Children's Data"      },
    { id: 'security',   label: 'Security & Retention' },
    { id: 'rights',     label: 'Your Rights'          },
    { id: 'contact',    label: 'Contact'              },
];

const RELATED = [
    { label: 'Terms of Service', to: '/terms',   icon: '📄' },
    { label: 'Return Policy',    to: '/returns', icon: '📦' },
    { label: 'Cookie Policy',    to: '/cookies', icon: '🍪' },
];

function useReadingProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        const fn = () => {
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            setP(max > 0 ? (el.scrollTop / max) * 100 : 0);
        };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return p;
}

function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
            { rootMargin: '-20% 0px -70% 0px' }
        );
        ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);
    return active;
}

export const PrivacyPolicy = () => {
    const progress = useReadingProgress();
    const activeId = useActiveSection(NAV.map(n => n.id));

    return (
        <>
            <style>{policyStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

            <div className="pol-progress" aria-hidden>
                <div className="pol-progress-fill" style={{ width: `${progress}%`, background: T.teal }} />
            </div>

            <div className="pol-page" style={{ '--accent': T.teal }}>

                {/* ── HERO ── */}
                <section className="pol-hero">
                    <div className="pol-hero-stripe" style={{ background: T.teal }} />
                    <div className="pol-hero-ghost" aria-hidden>PRIVACY</div>
                    <div className="pol-hero-inner">
                        <div className="pol-breadcrumb">
                            <Link to="/" className="pol-bc-link">Home</Link>
                            <span className="pol-bc-sep" style={{ color: T.teal }}>✦</span>
                            <span className="pol-bc-current" style={{ color: T.teal }}>Privacy Policy</span>
                        </div>
                        <span className="pol-eyebrow" style={{ color: T.teal }}>Legal · Last Updated January 2026</span>
                        <h1 className="pol-hero-title">
                            Privacy <span style={{ color: T.teal, WebkitTextStroke: `1px ${T.teal}` }}>Policy</span>
                        </h1>
                        <div className="pol-hero-meta">
                            <span className="pol-hero-meta-item">✦&nbsp; {NAV.length} sections</span>
                            <span className="pol-hero-meta-item">✦&nbsp; ~8 min read</span>
                            <span className="pol-hero-meta-item">✦&nbsp; FEAR Inc.</span>
                        </div>
                    </div>
                </section>

                <div className="pol-layout">
                    <main>
                        {/* Meta bar */}
                        <div className="pol-meta-bar" style={{ '--accent': T.teal }}>
                            <div className="pol-meta-chip">📅 <b>Last updated:</b> January 2026</div>
                            <div className="pol-meta-chip">🏢 <b>Entity:</b> FEAR Inc.</div>
                            <div className="pol-meta-chip">📧 <b>Contact:</b> fear.dread@underworld.dog</div>
                        </div>

                        {/* Intro */}
                        <div className="pol-section" id="intro">
                            <p className="pol-body">This Privacy Policy describes how FEAR Inc. (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from e-fear.vercel.app or otherwise communicate with us (collectively, the "Services"). "You" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.</p>
                            <div className="pol-highlight" style={{ '--accent': T.teal }}>
                                <p>Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree, please do not use or access any of the Services.</p>
                            </div>
                        </div>

                        <div className="pol-section" id="changes">
                            <span className="pol-section-num">Section 01</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Changes to This Privacy Policy</h2>
                            <p className="pol-body">We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.</p>
                        </div>

                        <div className="pol-section" id="collect">
                            <span className="pol-section-num">Section 02</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>How We Collect and Use Your Personal Information</h2>
                            <p className="pol-body">To provide the Services, we collect and have collected over the past 12 months personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.</p>
                            <p className="pol-body">In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.</p>
                        </div>

                        <div className="pol-section" id="what">
                            <span className="pol-section-num">Section 03</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>What Personal Information We Collect</h2>
                            <p className="pol-body">The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you.</p>
                            <h3 className="pol-section-sub">Information We Collect Directly from You</h3>
                            <p className="pol-body">Information that you directly submit to us through our Services may include:</p>
                            <ul className="pol-list">
                                <li>Basic contact details including your name, address, phone number, email</li>
                                <li>Order information including your name, billing address, shipping address, payment confirmation, email address, phone number</li>
                                <li>Account information including your username, password, security questions</li>
                                <li>Shopping information including the items you view, put in your cart or add to your wishlist</li>
                                <li>Customer support information including the information you choose to include in communications with us</li>
                            </ul>
                            <h3 className="pol-section-sub">Information We Collect through Cookies</h3>
                            <p className="pol-body">We also automatically collect certain information about your interaction with the Services ("Usage Data"). To do this, we may use cookies, pixels and similar technologies ("Cookies"). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.</p>
                            <h3 className="pol-section-sub">Information We Obtain from Third Parties</h3>
                            <p className="pol-body">We may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:</p>
                            <ul className="pol-list">
                                <li>Companies who support our Site and Services, such as Shopify</li>
                                <li>Our payment processors, who collect payment information (e.g., bank account, credit or debit card information, billing address) to process your payment in order to fulfill your orders</li>
                                <li>When you visit our Site, open or click on emails we send you, or interact with our Services or advertisements, we, or third parties we work with, may automatically collect certain information using online tracking technologies</li>
                            </ul>
                            <p className="pol-body">Any information we obtain from third parties will be treated in accordance with this Privacy Policy. We are not responsible for the accuracy of the information provided to us by third parties.</p>
                        </div>

                        <div className="pol-section" id="usage">
                            <span className="pol-section-num">Section 04</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>How We Use Your Personal Information</h2>
                            <h3 className="pol-section-sub">Providing Products and Services</h3>
                            <p className="pol-body">We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, to send notifications to you related to your account, purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, facilitate any returns and exchanges and to enable you to post reviews.</p>
                            <h3 className="pol-section-sub">Marketing and Advertising</h3>
                            <p className="pol-body">We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you advertisements for products or services.</p>
                            <h3 className="pol-section-sub">Security and Fraud Prevention</h3>
                            <p className="pol-body">We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password, or other access details with anyone else.</p>
                            <h3 className="pol-section-sub">Communicating with You</h3>
                            <p className="pol-body">We use your personal information to provide you with customer support and improve our Services. This is in our legitimate interests in order to be responsive to you, to provide effective services to you, and to maintain our business relationship with you.</p>
                        </div>

                        <div className="pol-section" id="cookies">
                            <span className="pol-section-num">Section 05</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Cookies</h2>
                            <p className="pol-body">Like many websites, we use Cookies on our Site. We use Cookies to power and improve our Site and our Services (including to remember your actions and preferences), to run analytics and better understand user interaction with the Services. We may also permit third parties and services providers to use Cookies on our Site to better tailor the services, products and advertising on our Site and other websites.</p>
                            <p className="pol-body">Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls. Please keep in mind that removing or blocking Cookies can negatively impact your user experience and may cause some of the Services, including certain features and general functionality, to work incorrectly or no longer be available.</p>
                        </div>

                        <div className="pol-section" id="disclosure">
                            <span className="pol-section-num">Section 06</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>How We Disclose Personal Information</h2>
                            <p className="pol-body">In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:</p>
                            <ul className="pol-list">
                                <li>With vendors or other third parties who perform services on our behalf (e.g., IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping)</li>
                                <li>With business and marketing partners, including Shopify, to provide services and advertise to you</li>
                                <li>When you direct, request us or otherwise consent to our disclosure of certain information to third parties</li>
                                <li>With our affiliates or otherwise within our corporate group, in our legitimate interests to run a successful business</li>
                                <li>In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations</li>
                            </ul>
                            <h3 className="pol-section-sub">Categories of Personal Information Disclosed</h3>
                            <ul className="pol-list">
                                <li><strong>Identifiers</strong> such as basic contact details and certain order and account information</li>
                                <li><strong>Commercial information</strong> such as order information, shopping information and customer support information</li>
                                <li><strong>Internet or other similar network activity</strong>, such as Usage Data</li>
                            </ul>
                            <p className="pol-body">We do not use or disclose sensitive personal information for the purposes of inferring characteristics about you.</p>
                        </div>

                        <div className="pol-section" id="ugc">
                            <span className="pol-section-num">Section 07</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>User Generated Content</h2>
                            <p className="pol-body">The Services may enable you to post product reviews and other user-generated content. If you choose to submit user generated content to any public area of the Services, this content will be public and accessible by anyone.</p>
                            <p className="pol-body">We do not control who will have access to the information that you choose to make available to others, and cannot ensure that parties who have access to such information will respect your privacy or keep it secure. We are not responsible for the privacy or security of any information that you make publicly available.</p>
                        </div>

                        <div className="pol-section" id="links">
                            <span className="pol-section-num">Section 08</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Third Party Websites and Links</h2>
                            <p className="pol-body">Our Site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites.</p>
                            <p className="pol-body">Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party.</p>
                        </div>

                        <div className="pol-section" id="children">
                            <span className="pol-section-num">Section 09</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Children's Data</h2>
                            <p className="pol-body">The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.</p>
                            <p className="pol-body">As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we "share" or "sell" personal information of individuals under 16 years of age.</p>
                        </div>

                        <div className="pol-section" id="security">
                            <span className="pol-section-num">Section 10</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Security and Retention of Your Information</h2>
                            <p className="pol-body">Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee "perfect security." In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.</p>
                            <p className="pol-body">How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide the Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.</p>
                        </div>

                        <div className="pol-section" id="rights">
                            <span className="pol-section-num">Section 11</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Your Rights and Choices</h2>
                            <p className="pol-body">Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.</p>
                            <ul className="pol-list">
                                <li><strong>Right to Access / Know.</strong> You may have a right to request access to personal information that we hold about you, including details relating to the ways in which we use and share your information.</li>
                                <li><strong>Right to Delete.</strong> You may have a right to request that we delete personal information we maintain about you.</li>
                                <li><strong>Right to Correct.</strong> You may have a right to request that we correct inaccurate personal information we maintain about you.</li>
                                <li><strong>Right of Portability.</strong> You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</li>
                                <li><strong>Right to Opt out of Sale or Sharing or Targeted Advertising.</strong> You may have a right to direct us not to "sell" or "share" your personal information or to opt out of the processing of your personal information for purposes considered to be "targeted advertising".</li>
                                <li><strong>Restriction of Processing.</strong> You may have the right to ask us to stop or restrict our processing of personal information.</li>
                                <li><strong>Withdrawal of Consent.</strong> Where we rely on consent to process your personal information, you may have the right to withdraw this consent.</li>
                                <li><strong>Appeal.</strong> You may have a right to appeal our decision if we decline to process your request.</li>
                                <li><strong>Managing Communication Preferences.</strong> We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you.</li>
                            </ul>
                            <p className="pol-body">We will not discriminate against you for exercising any of these rights. We may need to collect information from you to verify your identity before providing a substantive response to the request.</p>
                        </div>

                        <div className="pol-section" id="contact">
                            <span className="pol-section-num">Section 12</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Contact Information</h2>
                            <p className="pol-body">If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginTop: '.75rem' }}>
                                {[
                                    { icon: '🏢', label: 'Company',  val: 'FEAR Inc.',                                href: null },
                                    { icon: '📧', label: 'Email',    val: 'fear.dread@underworld.dog',               href: 'mailto:fear.dread@underworld.dog' },
                                    { icon: '🌐', label: 'Website',  val: 'e-fear.vercel.app',                       href: 'https://e-fear.vercel.app' },
                                ].map(c => (
                                    <div key={c.label} className="pol-contact-box" style={{ '--accent': T.teal }}>
                                        <span className="pol-contact-icon" style={{ color: T.teal }}>{c.icon}</span>
                                        <div>
                                            <span className="pol-contact-label">{c.label}</span>
                                            <span className="pol-contact-val">
                                                {c.href ? <a href={c.href}>{c.val}</a> : c.val}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pol-doc-footer">
                            <span className="pol-doc-footer-note">Last updated January 2026</span>
                            <button className="pol-print-btn" onClick={() => window.print()}>🖨 Print / Save PDF</button>
                        </div>
                    </main>

                    {/* ── SIDEBAR ── */}
                    <aside className="pol-sidebar" style={{ '--sb-accent': T.teal }}>
                        <div className="pol-sb-card">
                            <div className="pol-sb-head"><h3 className="pol-sb-title">Quick Navigation</h3></div>
                            <div className="pol-sb-body">
                                {NAV.map(n => (
                                    <a key={n.id} href={`#${n.id}`} className={`pol-nav-link${activeId === n.id ? ' active' : ''}`}>
                                        <span>{n.label}</span>
                                        <span className="pol-nav-arrow">→</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="pol-sb-card" style={{ '--sb-accent': T.orange }}>
                            <div className="pol-sb-head"><h3 className="pol-sb-title">Related Policies</h3></div>
                            <div className="pol-sb-body">
                                {RELATED.map(r => (
                                    <Link key={r.to} to={r.to} className="pol-rel-link">
                                        <span className="pol-rel-link-icon">{r.icon}</span>{r.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="pol-cta-card" style={{ '--sb-accent': T.teal }}>
                            <p className="pol-cta-card-title">🔒 Your Privacy Matters</p>
                            <p className="pol-cta-card-body">We are committed to protecting your personal information and your right to privacy. Questions about our practices?</p>
                            <a href="mailto:fear.dread@underworld.dog" className="pol-cta-btn">Contact Privacy Team →</a>
                        </div>
                        <div className="pol-cta-card" style={{ '--sb-accent': T.orange, background: T.dark1 }}>
                            <p className="pol-cta-card-title">⚖️ Privacy Rights</p>
                            <p className="pol-cta-card-body" style={{ marginBottom: 0 }}>You have rights regarding your personal data, including access, deletion, and correction. Contact us to exercise your rights.</p>
                        </div>
                    </aside>
                </div>

                <div className="pol-animated-border" />
            </div>
        </>
    );
};

export default PrivacyPolicy;