import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { T, policyStyles } from './styles';

const NAV = [
    { id: 'policy', label: 'Return Policy' },
    { id: 'damages', label: 'Damages & Issues' },
    { id: 'exchanges', label: 'Exchanges' },
    { id: 'eu', label: 'EU Cooling-Off' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'contact', label: 'Contact' },
];

const RELATED = [
    { label: 'Privacy Policy', to: '/privacy', icon: '🔒' },
    { label: 'Terms of Service', to: '/terms', icon: '📄' },
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

/* Quick-info strip data */
const QUICK_INFO = [
    { icon: '🗓️', label: 'Return Window', val: '30 Days', accent: T.red },
    { icon: '📦', label: 'Condition', val: 'Original / Unused', accent: T.orange },
    { icon: '💳', label: 'Refund Timeline', val: '10 Business Days', accent: T.teal },
    { icon: '📧', label: 'Start a Return', val: 'fear.dread@underworld.dog', accent: T.red },
];

export const ReturnPolicy = () => {
    const progress = useReadingProgress();
    const activeId = useActiveSection(NAV.map(n => n.id));

    return (
        <>
            <style>{policyStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

            <div className="pol-progress" aria-hidden>
                <div className="pol-progress-fill" style={{ width: `${progress}%`, background: T.red }} />
            </div>

            <div className="pol-page" style={{ '--accent': T.red }}>

                {/* ── HERO ── */}
                <section className="pol-hero">
                    <div className="pol-hero-stripe" style={{ background: T.red }} />
                    <div className="pol-hero-ghost" aria-hidden>RETURNS</div>
                    <div className="pol-hero-inner">
                        <div className="pol-breadcrumb">
                            <Link to="/" className="pol-bc-link">Home</Link>
                            <span className="pol-bc-sep" style={{ color: T.red }}>✦</span>
                            <span className="pol-bc-current" style={{ color: T.red }}>Return Policy</span>
                        </div>
                        <span className="pol-eyebrow" style={{ color: T.red }}>Legal · Last Updated January 2026</span>
                        <h1 className="pol-hero-title">
                            Return <span style={{ color: T.red, WebkitTextStroke: `1px ${T.red}` }}>Policy</span>
                        </h1>
                        <div className="pol-hero-meta">
                            <span className="pol-hero-meta-item">✦&nbsp; 30-day window</span>
                            <span className="pol-hero-meta-item">✦&nbsp; ~3 min read</span>
                            <span className="pol-hero-meta-item">✦&nbsp; FEAR Inc.</span>
                        </div>
                    </div>
                </section>

                {/* ── QUICK-INFO STRIP ── */}
                <div style={{
                    background: T.dark2,
                    borderBottom: `1px solid ${T.border}`,
                }}>
                    <div style={{
                        maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                    }}>
                        {QUICK_INFO.map((item, i) => (
                            <div key={item.label} style={{
                                padding: '1.25rem 1rem',
                                borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
                                borderLeft: i === 0 ? `3px solid ${item.accent}` : 'none',
                            }}>
                                <div style={{ fontSize: '1.1rem', marginBottom: '.4rem' }}>{item.icon}</div>
                                <div style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '.58rem', letterSpacing: '.15em', textTransform: 'uppercase',
                                    color: T.textDim, marginBottom: '.2rem',
                                }}>{item.label}</div>
                                <div style={{
                                    fontFamily: "'Anton','Impact',sans-serif",
                                    fontSize: '.95rem', textTransform: 'uppercase', color: item.accent,
                                }}>{item.val}</div>
                            </div>
                        ))}
                    </div>
                    <style>{`@media(max-width:700px){ .pol-qi-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
                </div>

                <div className="pol-layout">
                    <main>
                        {/* Meta bar */}
                        <div className="pol-meta-bar" style={{ '--accent': T.red }}>
                            <div className="pol-meta-chip">📅 <b>Last updated:</b> January 2026</div>
                            <div className="pol-meta-chip">📍 <b>Address:</b> 2003 E. Veterans Memorial Blvd, Killeen TX 76451</div>
                        </div>

                        {/* Return Policy */}
                        <div className="pol-section" id="policy">
                            <span className="pol-section-num">Section 01</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.red }}>Return / Refund Policy</h2>
                            <p className="pol-body">We have a <strong>30-day return policy</strong>, which means you have 30 days after receiving your item to request a return.</p>
                            <p className="pol-body">To be eligible for a return, your item must be in the same condition that you received it — unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.</p>
                            <div className="pol-highlight" style={{ '--accent': T.red }}>
                                <p>To start a return, contact us at <a href="mailto:fear.dread@underworld.dog">fear.dread@underworld.dog</a>. Returns will need to be sent to: <strong>2003 E. Veterans Memorial Blvd, Killeen, TX, 76451, United States</strong>. Items sent back to us without first requesting a return will not be accepted.</p>
                            </div>
                            <p className="pol-body">If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Please note that if your country of residence is not United States, shipping your goods may take longer than expected.</p>
                            <p className="pol-body">You can always contact us for any return questions at <a href="mailto:fear.dread@underworld.dog" style={{ color: T.red }}>fear.dread@underworld.dog</a>.</p>
                        </div>

                        {/* Damages */}
                        <div className="pol-section" id="damages">
                            <span className="pol-section-num">Section 02</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.orange }}>Damages and Issues</h2>
                            <p className="pol-body">Please inspect your order upon receipt and contact us immediately if the item is defective, damaged, or if you receive the wrong item, so that we may evaluate the issue and make it right.</p>
                            <p className="pol-body">Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.</p>
                            <div className="pol-highlight" style={{ '--accent': T.orange }}>
                                <p>Unfortunately, we <strong>cannot accept returns on sale items or gift cards</strong>.</p>
                            </div>
                        </div>

                        {/* Exchanges */}
                        <div className="pol-section" id="exchanges">
                            <span className="pol-section-num">Section 03</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>Exchanges</h2>
                            <p className="pol-body">The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
                        </div>

                        {/* EU cooling off */}
                        <div className="pol-section" id="eu">
                            <span className="pol-section-num">Section 04</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.teal }}>European Union 3-Day Cooling-Off Period</h2>
                            <p className="pol-body">Notwithstanding the above, if merchandise is being shipped into the European Union, you have the right to cancel or return your order within 3 days for any reason and without justification.</p>
                            <p className="pol-body">As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.</p>
                        </div>

                        {/* Refunds */}
                        <div className="pol-section" id="refunds">
                            <span className="pol-section-num">Section 05</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.red }}>Refunds</h2>
                            <p className="pol-body">We will notify you once we've received and inspected your return to let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within <strong>10 business days</strong>. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
                            <div className="pol-highlight" style={{ '--accent': T.red }}>
                                <p>If more than <strong>15 business days</strong> have passed since we've approved your return, please contact us at <a href="mailto:fear.dread@underworld.dog">fear.dread@underworld.dog</a>.</p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="pol-section" id="contact">
                            <span className="pol-section-num">Section 06</span>
                            <h2 className="pol-section-title" style={{ '--accent': T.red }}>Contact Us</h2>
                            <p className="pol-body">For any return or refund questions, reach us at:</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginTop: '.75rem' }}>
                                {[
                                    { icon: '📧', label: 'Email', val: 'fear.dread@underworld.dog', href: 'mailto:fear.dread@underworld.dog' },
                                    { icon: '📍', label: 'Address', val: '2003 E. Veterans Memorial Blvd, Killeen, TX 76451', href: null },
                                ].map(c => (
                                    <div key={c.label} className="pol-contact-box" style={{ '--accent': T.red }}>
                                        <span className="pol-contact-icon" style={{ color: T.red }}>{c.icon}</span>
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
                    <aside className="pol-sidebar" style={{ '--sb-accent': T.red }}>
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
                        <div className="pol-cta-card" style={{ '--sb-accent': T.red }}>
                            <p className="pol-cta-card-title">📦 Start a Return</p>
                            <p className="pol-cta-card-body">Ready to return something? Email us first. Do not ship anything back without getting confirmation — we won't accept unrequested returns.</p>
                            <a href="mailto:fear.dread@underworld.dog" className="pol-cta-btn">Email Returns Team →</a>
                        </div>
                        <div className="pol-cta-card" style={{ '--sb-accent': T.orange, background: T.dark1 }}>
                            <p className="pol-cta-card-title">⚠️ Non-Returnable Items</p>
                            <p className="pol-cta-card-body" style={{ marginBottom: 0 }}>Perishables, custom/personalized products, personal care goods, hazardous materials, sale items, and gift cards cannot be returned.</p>
                        </div>
                    </aside>
                </div>

                <div className="pol-animated-border" />
            </div>
        </>
    );
};

export default ReturnPolicy;