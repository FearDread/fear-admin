// lib/legal/tokens.ts
export const T = {
  red: '#e63946',
  orange: '#6120d9',
  teal: '#2a9d8f',
  dark0: '#0d0d0d',
  dark1: '#111111',
  dark2: '#141414',
  dark3: '#1a1a1a',
  border: '#222222',
  textDim: 'rgba(255,255,255,0.32)',
  textMid: 'rgba(255,255,255,0.58)',
  textHi: 'rgba(255,255,255,0.92)',
} as const;

export type AccentKey = keyof Pick<typeof T, 'red' | 'orange' | 'teal'>;

// Note: the @import font line is dropped here — wire Anton + Space Mono
// through next/font in the root layout instead of a manual <link>/@import,
// same as you did for the rest of the conversion. Swap the two font-family
// declarations below for var(--font-anton) / var(--font-space-mono) once
// that's in place.
export const policyStyles = `
/* ── Base ── */
.pol-page { min-height: 100vh; }

.pol-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 200; background: ${T.border}; }
.pol-progress-fill { height: 100%; background: ${T.red}; transition: width .1s linear; min-width: 0; }

.pol-hero { position: relative; padding: 5rem 0 4rem; overflow: hidden; border-bottom: 1px solid ${T.border}; }
.pol-hero::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 22px 22px; pointer-events: none;
}
.pol-hero-stripe { position: absolute; left: 0; top: 0; width: 4px; height: 100%; }
.pol-hero-ghost {
  position: absolute; right: -1rem; top: 50%; transform: translateY(-50%);
  font-family: 'Anton','Impact',sans-serif;
  font-size: clamp(5rem,14vw,11rem); text-transform: uppercase;
  color: rgba(255,255,255,.025); line-height: 1; user-select: none;
  pointer-events: none; white-space: nowrap; letter-spacing: -.02em;
}
.pol-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
.pol-eyebrow { font-family: 'Space Mono', monospace; font-size: .68rem; letter-spacing: .22em; text-transform: uppercase; display: block; margin-bottom: .6rem; }
.pol-hero-title { font-family: 'Anton','Impact',sans-serif; font-size: clamp(3rem, 10vw, 7rem); text-transform: uppercase; line-height: .9; color: #fff; margin: 0 0 1.25rem; }
.pol-hero-meta { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.pol-hero-meta-item { font-family: 'Space Mono', monospace; font-size: .63rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.textDim}; display: flex; align-items: center; gap: .4rem; }
.pol-breadcrumb { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.5rem; }
.pol-bc-link { font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.textDim}; text-decoration: none; transition: color .2s; }
.pol-bc-link:hover { color: #fff; }
.pol-bc-sep { font-size: .6rem; }
.pol-bc-current { font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; }

.pol-layout { max-width: 1200px; margin: 0 auto; padding: 4rem 1.5rem 5rem; display: grid; grid-template-columns: 1fr 296px; gap: 3rem; align-items: start; }
@media(max-width: 960px) { .pol-layout { grid-template-columns: 1fr; } .pol-sidebar { order: -1; } }

.pol-meta-bar { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; padding: .75rem 1.25rem; background: ${T.dark2}; border: 1px solid ${T.border}; border-left: 3px solid var(--accent, ${T.red}); margin-bottom: 2.5rem; }
.pol-meta-chip { font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: ${T.textDim}; display: flex; align-items: center; gap: .35rem; }
.pol-meta-chip b { color: ${T.textMid}; font-weight: normal; }

.pol-section { margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid ${T.border}; scroll-margin-top: 5rem; }
.pol-section:last-child { border-bottom: none; }
.pol-section-num { font-family: 'Space Mono', monospace; font-size: .58rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent, ${T.red}); display: block; margin-bottom: .4rem; }
.pol-section-title { font-family: 'Anton','Impact',sans-serif; font-size: clamp(1.1rem, 2.5vw, 1.5rem); text-transform: uppercase; line-height: 1.05; color: ${T.textHi}; margin: 0 0 1.1rem; padding-left: .85rem; border-left: 3px solid var(--accent, ${T.red}); }
.pol-section-sub { font-family: 'Anton','Impact',sans-serif; font-size: 1rem; text-transform: uppercase; color: ${T.textHi}; margin: 1.5rem 0 .65rem; padding-left: .65rem; border-left: 2px solid ${T.border}; }
.pol-body { font-size: .88rem; color: ${T.textMid}; line-height: 1.8; margin: 0 0 .85rem; }
.pol-body a { color: var(--accent, ${T.red}); transition: opacity .2s; }
.pol-body a:hover { opacity: .75; }
.pol-body strong { color: ${T.textHi}; font-weight: 600; }
.pol-list { padding-left: 0; margin: 0 0 .85rem; list-style: none; }
.pol-list li { font-size: .88rem; color: ${T.textMid}; line-height: 1.75; padding: .35rem 0 .35rem 1.25rem; position: relative; border-bottom: 1px solid rgba(255,255,255,.04); }
.pol-list li:last-child { border-bottom: none; }
.pol-list li::before { content: '✦'; position: absolute; left: 0; top: .4rem; font-size: .5rem; color: var(--accent, ${T.red}); line-height: 2.2; }
.pol-list li strong { color: ${T.textHi}; font-weight: 600; }

.pol-highlight { background: rgba(230,57,70,.05); border: 1px solid rgba(230,57,70,.2); border-left: 3px solid var(--accent, ${T.red}); padding: 1rem 1.25rem; margin: 1.25rem 0; }
.pol-highlight p { font-family: 'Space Mono', monospace; font-size: .75rem; color: ${T.textMid}; line-height: 1.65; margin: 0; }
.pol-highlight p a { color: var(--accent, ${T.red}); }

.pol-contact-box { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem; background: ${T.dark2}; border: 1px solid ${T.border}; border-top: 2px solid var(--accent, ${T.red}); margin-top: 1rem; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }
.pol-contact-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: .1rem; color: var(--accent, ${T.red}); }
.pol-contact-label { font-family: 'Space Mono', monospace; font-size: .6rem; letter-spacing: .15em; text-transform: uppercase; color: ${T.textDim}; display: block; margin-bottom: .25rem; }
.pol-contact-val { font-family: 'Space Mono', monospace; font-size: .78rem; color: ${T.textHi}; }
.pol-contact-val a { color: var(--accent, ${T.red}); text-decoration: none; }
.pol-contact-val a:hover { text-decoration: underline; }

.pol-doc-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding: 1.25rem 0; margin-top: 1rem; border-top: 1px solid ${T.border}; }
.pol-doc-footer-note { font-family: 'Space Mono', monospace; font-size: .62rem; color: ${T.textDim}; letter-spacing: .08em; text-transform: uppercase; }
.pol-print-btn { display: inline-flex; align-items: center; gap: .5rem; padding: .5rem 1rem; background: transparent; border: 1px solid ${T.border}; color: ${T.textDim}; font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: border-color .2s, color .2s; text-decoration: none; }
.pol-print-btn:hover { border-color: var(--accent, ${T.red}); color: var(--accent, ${T.red}); }

.pol-sidebar { display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 5rem; }
.pol-sb-card { background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid var(--sb-accent, ${T.red}); overflow: hidden; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }
.pol-sb-head { padding: .85rem 1.1rem .7rem; border-bottom: 1px solid ${T.border}; }
.pol-sb-title { font-family: 'Anton','Impact',sans-serif; font-size: .88rem; text-transform: uppercase; color: #fff; margin: 0; }
.pol-sb-body { padding: .85rem 1.1rem; }

.pol-nav-link { display: flex; align-items: center; justify-content: space-between; padding: .5rem 0; border-bottom: 1px solid ${T.border}; font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .06em; text-transform: uppercase; color: ${T.textMid}; text-decoration: none; transition: color .15s, padding-left .15s; }
.pol-nav-link:last-child { border-bottom: none; }
.pol-nav-link:hover { color: #fff; padding-left: .2rem; }
.pol-nav-link.active { color: var(--sb-accent, ${T.red}); border-left: 2px solid var(--sb-accent, ${T.red}); padding-left: .45rem; }
.pol-nav-arrow { font-size: .5rem; color: ${T.textDim}; }
.pol-nav-link.active .pol-nav-arrow { color: var(--sb-accent, ${T.red}); }

.pol-rel-link { display: flex; align-items: center; gap: .6rem; padding: .5rem 0; border-bottom: 1px solid ${T.border}; font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .06em; text-transform: uppercase; color: ${T.textMid}; text-decoration: none; transition: color .2s; }
.pol-rel-link:last-child { border-bottom: none; }
.pol-rel-link:hover { color: #fff; }
.pol-rel-link-icon { font-size: .85rem; flex-shrink: 0; }

.pol-cta-card { background: ${T.dark2}; border: 1px solid ${T.border}; border-top: 2px solid var(--sb-accent, ${T.red}); padding: 1.1rem; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }
.pol-cta-card-title { font-family: 'Anton','Impact',sans-serif; font-size: .85rem; text-transform: uppercase; color: #fff; margin: 0 0 .5rem; }
.pol-cta-card-body { font-family: 'Space Mono', monospace; font-size: .65rem; color: ${T.textDim}; line-height: 1.6; margin: 0 0 1rem; }
.pol-cta-btn { display: flex; align-items: center; justify-content: center; gap: .5rem; width: 100%; padding: .65rem; background: var(--sb-accent, ${T.red}); border: none; color: #fff; font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: opacity .2s; clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px)); }
.pol-cta-btn:hover { opacity: .85; color: #fff; }

.pol-animated-border { height: 3px; width: 100%; background: linear-gradient(90deg, #e63946, #f4a261, #2a9d8f, #e63946); background-size: 300% 100%; animation: polGrad 4s linear infinite; }
@keyframes polGrad { to { background-position: 300% center; } }
`;