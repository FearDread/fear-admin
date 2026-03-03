import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { T, policyStyles } from './styles';

const NAV = [
    { id: 's1',  label: '§1 — Online Store Terms'     },
    { id: 's2',  label: '§2 — General Conditions'     },
    { id: 's3',  label: '§3 — Accuracy & Timeliness'  },
    { id: 's4',  label: '§4 — Modifications'          },
    { id: 's5',  label: '§5 — Products & Services'    },
    { id: 's6',  label: '§6 — Billing & Accounts'     },
    { id: 's7',  label: '§7 — Optional Tools'         },
    { id: 's8',  label: '§8 — Third-Party Links'      },
    { id: 's9',  label: '§9 — User Submissions'       },
    { id: 's10', label: '§10 — Personal Information'  },
    { id: 's11', label: '§11 — Errors & Omissions'    },
    { id: 's12', label: '§12 — Prohibited Uses'       },
    { id: 's13', label: '§13 — Disclaimer'            },
    { id: 's14', label: '§14 — Indemnification'       },
    { id: 's15', label: '§15 — Severability'          },
    { id: 's16', label: '§16 — Termination'           },
    { id: 's17', label: '§17 — Entire Agreement'      },
    { id: 's18', label: '§18 — Governing Law'         },
    { id: 's19', label: '§19 — Changes to Terms'      },
    { id: 's20', label: '§20 — Contact'               },
];

const RELATED = [
    { label: 'Privacy Policy',  to: '/privacy', icon: '🔒' },
    { label: 'Return Policy',   to: '/returns', icon: '📦' },
    { label: 'Shipping Policy', to: '/shipping', icon: '🚚' },
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

export const Terms = () => {
    const progress = useReadingProgress();
    const activeId = useActiveSection(NAV.map(n => n.id));

    return (
        <>
            <style>{policyStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

            <div className="pol-progress" aria-hidden>
                <div className="pol-progress-fill" style={{ width: `${progress}%`, background: T.orange }} />
            </div>

            <div className="pol-page" style={{ '--accent': T.orange }}>

                {/* ── HERO ── */}
                <section className="pol-hero">
                    <div className="pol-hero-stripe" style={{ background: T.orange }} />
                    <div className="pol-hero-ghost" aria-hidden>TERMS</div>
                    <div className="pol-hero-inner">
                        <div className="pol-breadcrumb">
                            <Link to="/" className="pol-bc-link">Home</Link>
                            <span className="pol-bc-sep" style={{ color: T.orange }}>✦</span>
                            <span className="pol-bc-current" style={{ color: T.orange }}>Terms of Service</span>
                        </div>
                        <span className="pol-eyebrow" style={{ color: T.orange }}>Legal · Last Updated January 2026</span>
                        <h1 className="pol-hero-title">
                            Terms of <span style={{ color: T.orange, WebkitTextStroke: `1px ${T.orange}` }}>Service</span>
                        </h1>
                        <div className="pol-hero-meta">
                            <span className="pol-hero-meta-item">✦&nbsp; 20 sections</span>
                            <span className="pol-hero-meta-item">✦&nbsp; ~12 min read</span>
                            <span className="pol-hero-meta-item">✦&nbsp; FEAR Inc.</span>
                        </div>
                    </div>
                </section>

                <div className="pol-layout">
                    <main>
                        {/* Meta bar */}
                        <div className="pol-meta-bar" style={{ '--accent': T.orange }}>
                            <div className="pol-meta-chip">📅 <b>Last updated:</b> January 2026</div>
                            <div className="pol-meta-chip">🏢 <b>Operator:</b> FEAR Inc.</div>
                            <div className="pol-meta-chip">⚖️ <b>Jurisdiction:</b> United States</div>
                        </div>

                        {/* Overview */}
                        <div className="pol-section" id="overview">
                            <span className="pol-section-num">Overview</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Overview</h2>
                            <p className="pol-body">This website is operated by FEAR Inc. Throughout the site, the terms "we", "us" and "our" refer to FEAR Inc. FEAR Inc. offers this website, including all information, tools and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
                            <p className="pol-body">By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
                            <div className="pol-highlight" style={{ '--accent': T.orange }}>
                                <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any Services.</p>
                            </div>
                        </div>

                        <div className="pol-section" id="s1">
                            <span className="pol-section-num">Section 01</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Online Store Terms</h2>
                            <p className="pol-body">By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</p>
                            <p className="pol-body">You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
                            <p className="pol-body">You must not transmit any worms or viruses or any code of a destructive nature.</p>
                            <p className="pol-body">A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
                        </div>

                        <div className="pol-section" id="s2">
                            <span className="pol-section-num">Section 02</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>General Conditions</h2>
                            <p className="pol-body">We reserve the right to refuse service to anyone for any reason at any time.</p>
                            <p className="pol-body">You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.</p>
                            <p className="pol-body">You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</p>
                        </div>

                        <div className="pol-section" id="s3">
                            <span className="pol-section-num">Section 03</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Accuracy, Completeness and Timeliness of Information</h2>
                            <p className="pol-body">We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.</p>
                            <p className="pol-body">This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site.</p>
                        </div>

                        <div className="pol-section" id="s4">
                            <span className="pol-section-num">Section 04</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Modifications to the Service and Prices</h2>
                            <p className="pol-body">Prices for our products are subject to change without notice.</p>
                            <p className="pol-body">We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
                            <p className="pol-body">We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
                        </div>

                        <div className="pol-section" id="s5">
                            <span className="pol-section-num">Section 05</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Products or Services</h2>
                            <p className="pol-body">Certain products or Services may be available exclusively online through the website. These products or Services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
                            <p className="pol-body">We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
                            <p className="pol-body">We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis.</p>
                        </div>

                        <div className="pol-section" id="s6">
                            <span className="pol-section-num">Section 06</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Accuracy of Billing and Account Information</h2>
                            <p className="pol-body">We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.</p>
                            <p className="pol-body">You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.</p>
                        </div>

                        <div className="pol-section" id="s7">
                            <span className="pol-section-num">Section 07</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Optional Tools</h2>
                            <p className="pol-body">We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</p>
                            <p className="pol-body">You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
                        </div>

                        <div className="pol-section" id="s8">
                            <span className="pol-section-num">Section 08</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Third-Party Links</h2>
                            <p className="pol-body">Certain content, products and Services available via our Service may include materials from third-parties.</p>
                            <p className="pol-body">Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or Services of third-parties.</p>
                        </div>

                        <div className="pol-section" id="s9">
                            <span className="pol-section-num">Section 09</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>User Comments, Feedback and Other Submissions</h2>
                            <p className="pol-body">If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.</p>
                            <p className="pol-body">We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</p>
                        </div>

                        <div className="pol-section" id="s10">
                            <span className="pol-section-num">Section 10</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Personal Information</h2>
                            <p className="pol-body">Your submission of personal information through the store is governed by our{' '}
                                <Link to="/privacy" style={{ color: T.orange }}>Privacy Policy</Link>.
                            </p>
                        </div>

                        <div className="pol-section" id="s11">
                            <span className="pol-section-num">Section 11</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Errors, Inaccuracies and Omissions</h2>
                            <p className="pol-body">Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice.</p>
                        </div>

                        <div className="pol-section" id="s12">
                            <span className="pol-section-num">Section 12</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Prohibited Uses</h2>
                            <p className="pol-body">In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:</p>
                            <ul className="pol-list">
                                <li>(a) for any unlawful purpose</li>
                                <li>(b) to solicit others to perform or participate in any unlawful acts</li>
                                <li>(c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                                <li>(d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                                <li>(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability</li>
                                <li>(f) to submit false or misleading information</li>
                                <li>(g) to upload or transmit viruses or any other type of malicious code</li>
                                <li>(h) to collect or track the personal information of others</li>
                                <li>(i) to spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                                <li>(j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service</li>
                            </ul>
                        </div>

                        <div className="pol-section" id="s13">
                            <span className="pol-section-num">Section 13</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Disclaimer of Warranties; Limitation of Liability</h2>
                            <p className="pol-body">We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.</p>
                            <p className="pol-body">You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and Services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied.</p>
                            <p className="pol-body">In no case shall FEAR Inc., our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.</p>
                        </div>

                        <div className="pol-section" id="s14">
                            <span className="pol-section-num">Section 14</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Indemnification</h2>
                            <p className="pol-body">You agree to indemnify, defend and hold harmless FEAR Inc. and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.</p>
                        </div>

                        <div className="pol-section" id="s15">
                            <span className="pol-section-num">Section 15</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Severability</h2>
                            <p className="pol-body">In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service.</p>
                        </div>

                        <div className="pol-section" id="s16">
                            <span className="pol-section-num">Section 16</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Termination</h2>
                            <p className="pol-body">The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.</p>
                            <p className="pol-body">These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.</p>
                        </div>

                        <div className="pol-section" id="s17">
                            <span className="pol-section-num">Section 17</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Entire Agreement</h2>
                            <p className="pol-body">The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p>
                            <p className="pol-body">These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us.</p>
                        </div>

                        <div className="pol-section" id="s18">
                            <span className="pol-section-num">Section 18</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Governing Law</h2>
                            <p className="pol-body">These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States.</p>
                        </div>

                        <div className="pol-section" id="s19">
                            <span className="pol-section-num">Section 19</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Changes to Terms of Service</h2>
                            <p className="pol-body">You can review the most current version of the Terms of Service at any time at this page.</p>
                            <p className="pol-body">We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.</p>
                        </div>

                        <div className="pol-section" id="s20">
                            <span className="pol-section-num">Section 20</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Contact Information</h2>
                            <p className="pol-body">Questions about the Terms of Service should be sent to us at:</p>
                            <div className="pol-contact-box" style={{ '--accent': T.orange, marginTop: '.75rem' }}>
                                <span className="pol-contact-icon" style={{ color: T.orange }}>📧</span>
                                <div>
                                    <span className="pol-contact-label">Email</span>
                                    <span className="pol-contact-val">
                                        <a href="mailto:fear.dread@underworld.dog">fear.dread@underworld.dog</a>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pol-doc-footer">
                            <span className="pol-doc-footer-note">Last updated January 2026</span>
                            <button className="pol-print-btn" onClick={() => window.print()}>🖨 Print / Save PDF</button>
                        </div>
                    </main>

                    {/* ── SIDEBAR ── */}
                    <aside className="pol-sidebar" style={{ '--sb-accent': T.orange }}>
                        <div className="pol-sb-card">
                            <div className="pol-sb-head"><h3 className="pol-sb-title">Quick Navigation</h3></div>
                            <div className="pol-sb-body" style={{ maxHeight: 480, overflowY: 'auto' }}>
                                {NAV.map(n => (
                                    <a key={n.id} href={`#${n.id}`} className={`pol-nav-link${activeId === n.id ? ' active' : ''}`}>
                                        <span>{n.label}</span>
                                        <span className="pol-nav-arrow">→</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="pol-sb-card" style={{ '--sb-accent': T.teal }}>
                            <div className="pol-sb-head"><h3 className="pol-sb-title">Related Documents</h3></div>
                            <div className="pol-sb-body">
                                {RELATED.map(r => (
                                    <Link key={r.to} to={r.to} className="pol-rel-link">
                                        <span className="pol-rel-link-icon">{r.icon}</span>{r.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="pol-cta-card" style={{ '--sb-accent': T.orange }}>
                            <p className="pol-cta-card-title">❓ Need Help?</p>
                            <p className="pol-cta-card-body">If you have any questions about our Terms of Service, please don't hesitate to reach out.</p>
                            <a href="mailto:fear.dread@underworld.dog" className="pol-cta-btn">Contact Us →</a>
                        </div>
                    </aside>
                </div>

                <div className="pol-animated-border" />
            </div>
        </>
    );
};

export default Terms;