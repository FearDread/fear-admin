'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { T } from '@/lib/legal/tokens';
import { POLICIES, type PolicySlug, type Block } from '@/lib/legal/content';

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

function useReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return p;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);
  return active;
}

function renderBlock(block: Block, accent: string, key: number) {
  switch (block.type) {
    case 'p':
      return <p className="pol-body" key={key}>{block.text}</p>;
    case 'sub':
      return <h3 className="pol-section-sub" key={key}>{block.text}</h3>;
    case 'highlight':
      return (
        <div className="pol-highlight" style={{ '--accent': accent } as CSSVars} key={key}>
          <p>{block.text}</p>
        </div>
      );
    case 'list':
      return (
        <ul className="pol-list" key={key}>
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'contact':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginTop: '.75rem' }} key={key}>
          {block.items.map((c) => (
            <div className="pol-contact-box" style={{ '--accent': accent } as CSSVars} key={c.label}>
              <span className="pol-contact-icon" style={{ color: accent }}>{c.icon}</span>
              <div>
                <span className="pol-contact-label">{c.label}</span>
                <span className="pol-contact-val">
                  {c.href ? <a href={c.href}>{c.val}</a> : c.val}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function PolicyDocument({ slug }: { slug: PolicySlug }) {
  const config = POLICIES[slug];
  const progress = useReadingProgress();
  const navIds = config.nav.map((n) => n.id);
  const activeId = useActiveSection(navIds);
  const pageAccent = T[config.accentKey];

  return (
    <div className="pol-page" style={{ '--accent': pageAccent } as CSSVars}>
      <div className="pol-progress" aria-hidden>
        <div className="pol-progress-fill" style={{ width: `${progress}%`, background: pageAccent }} />
      </div>

      <section className="pol-hero">
        <div className="pol-hero-stripe" style={{ background: pageAccent }} />
        <div className="pol-hero-ghost" aria-hidden>{config.ghost}</div>
        <div className="pol-hero-inner">
          <div className="pol-breadcrumb">
            <Link href="/" className="pol-bc-link">Home</Link>
            <span className="pol-bc-sep" style={{ color: pageAccent }}>✦</span>
            <span className="pol-bc-current" style={{ color: pageAccent }}>{config.titlePrefix} {config.titleAccent}</span>
          </div>
          <span className="pol-eyebrow" style={{ color: pageAccent }}>{config.eyebrow}</span>
          <h1 className="pol-hero-title">
            {config.titlePrefix}{' '}
            <span style={{ color: pageAccent, WebkitTextStroke: `1px ${pageAccent}` }}>{config.titleAccent}</span>
          </h1>
          <div className="pol-hero-meta">
            {config.heroMeta.map((m) => (
              <span className="pol-hero-meta-item" key={m}>✦&nbsp; {m}</span>
            ))}
          </div>
        </div>
      </section>

      {config.quickInfo && (
        <div style={{ background: T.dark2, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: `repeat(${config.quickInfo.length}, 1fr)` }}>
            {config.quickInfo.map((item, i) => (
              <div key={item.label} style={{
                padding: '1.25rem 1rem',
                borderRight: i < config.quickInfo!.length - 1 ? `1px solid ${T.border}` : 'none',
                borderLeft: i === 0 ? `3px solid ${T[item.accentKey]}` : 'none',
              }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '.4rem' }}>{item.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '.58rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.textDim, marginBottom: '.2rem' }}>{item.label}</div>
                <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '.95rem', textTransform: 'uppercase', color: T[item.accentKey] }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pol-layout">
        <main>
          <div className="pol-meta-bar" style={{ '--accent': pageAccent } as CSSVars}>
            {config.metaBar.map((c) => (
              <div className="pol-meta-chip" key={c.label}>{c.icon} <b>{c.label}:</b> {c.val}</div>
            ))}
          </div>

          {config.intro && (
            <div className="pol-section" id={config.intro.id}>
              {config.intro.num && <span className="pol-section-num">{config.intro.num}</span>}
              {config.intro.title && (
                <h2 className="pol-section-title" style={{ '--accent': pageAccent } as CSSVars}>{config.intro.title}</h2>
              )}
              {config.intro.blocks.map((b, i) => renderBlock(b, pageAccent, i))}
            </div>
          )}

          {config.sections.map((section) => {
            const sectionAccent = section.accentKey ? T[section.accentKey] : pageAccent;
            return (
              <div className="pol-section" id={section.id} key={section.id}>
                {section.num && <span className="pol-section-num" style={{ color: sectionAccent }}>{section.num}</span>}
                <h2 className="pol-section-title" style={{ '--accent': sectionAccent } as CSSVars}>{section.title}</h2>
                {section.blocks.map((b, i) => renderBlock(b, sectionAccent, i))}
              </div>
            );
          })}

          <div className="pol-doc-footer">
            <span className="pol-doc-footer-note">Last updated {config.lastUpdated}</span>
            <button className="pol-print-btn" onClick={() => window.print()}>🖨 Print / Save PDF</button>
          </div>
        </main>

        <aside className="pol-sidebar" style={{ '--sb-accent': pageAccent } as CSSVars}>
          <div className="pol-sb-card">
            <div className="pol-sb-head"><h3 className="pol-sb-title">Quick Navigation</h3></div>
            <div className="pol-sb-body" style={{ maxHeight: 480, overflowY: 'auto' }}>
              {config.nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} className={`pol-nav-link${activeId === n.id ? ' active' : ''}`}>
                  <span>{n.label}</span>
                  <span className="pol-nav-arrow">→</span>
                </a>
              ))}
            </div>
          </div>

          <div className="pol-sb-card" style={{ '--sb-accent': T[config.relatedAccentKey] } as CSSVars}>
            <div className="pol-sb-head"><h3 className="pol-sb-title">{config.relatedLabel}</h3></div>
            <div className="pol-sb-body">
              {config.related.map((r) => (
                <Link key={r.href} href={r.href} className="pol-rel-link">
                  <span className="pol-rel-link-icon">{r.icon}</span>{r.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pol-cta-card" style={{ '--sb-accent': T[config.cta.accentKey ?? config.accentKey] } as CSSVars}>
            <p className="pol-cta-card-title">{config.cta.title}</p>
            <p className="pol-cta-card-body">{config.cta.body}</p>
            <a href={config.cta.href} className="pol-cta-btn">{config.cta.label}</a>
          </div>

          {config.extraCta && (
            <div className="pol-cta-card" style={{ '--sb-accent': T[config.extraCta.accentKey ?? 'orange'], background: T.dark1 } as CSSVars}>
              <p className="pol-cta-card-title">{config.extraCta.title}</p>
              <p className="pol-cta-card-body" style={{ marginBottom: 0 }}>{config.extraCta.body}</p>
            </div>
          )}
        </aside>
      </div>

      <div className="pol-animated-border" />
    </div>
  );
}