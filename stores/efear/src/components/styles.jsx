
export const T = {
  red:     '#e63946',
  orange:  '#f4a261',
  teal:    '#2a9d8f',
  dark0:   '#0d0d0d',
  dark1:   '#111111',
  dark2:   '#141414',
  dark3:   '#1a1a1a',
  border:  '#222222',
  textDim: 'rgba(255,255,255,0.30)',
  textMid: 'rgba(255,255,255,0.55)',
  textHi:  'rgba(255,255,255,0.90)',
};


export const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  /* ── Wrapper & scroll behaviour ── */
  .hdr-outer {
    position: fixed;
    width:100%;
    top: -1px;
    z-index: 1000;
    transform: translateY(0);
    transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s;
    will-change: transform;
  }

  .hdr-outer.hdr-compact .hdr-topbar { height: 0; overflow: hidden; opacity: 0; pointer-events: none; }
  .hdr-outer.hdr-compact { box-shadow: 0 4px 40px rgba(0,0,0,.7); }

  /* ── Top bar ── */
  .hdr-topbar {
    height: 38px;
    background: ${T.dark0};
    border-bottom: 1px solid ${T.border};
    display: flex; align-items: center;
    transition: height .3s, opacity .3s;
    overflow: hidden;
  }
  .hdr-topbar-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
    display: flex; align-items: center; width: 100%; gap: 1rem;
  }
  .hdr-topbar-brand {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
    color: ${T.textDim}; white-space: nowrap;
  }
  .hdr-topbar-brand span { color: ${T.red}; }

  .hdr-toplinks {
    display: flex; align-items: center; gap: 0; list-style: none; margin: 0; padding: 0;
  }
  .hdr-toplinks a {
    font-family: 'Space Mono', monospace;
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none; padding: 0 .7rem;
    border-right: 1px solid ${T.border};
    transition: color .2s;
  }
  .hdr-toplinks a:last-child { border-right: none; }
  .hdr-toplinks a:hover { color: #fff; }

  .hdr-topbar-right {
    display: flex; align-items: center; gap: .25rem; margin-left: auto;
  }
  .hdr-util-btn {
    display: flex; align-items: center; gap: .35rem;
    padding: .25rem .6rem;
    background: none; border: none; border-left: 1px solid ${T.border};
    color: ${T.textDim};
    font-family: 'Space Mono', monospace; font-size: .6rem;
    letter-spacing: .08em; text-transform: uppercase;
    cursor: pointer; position: relative; transition: color .2s;
  }
  .hdr-util-btn:first-child { border-left: none; }
  .hdr-util-btn:hover { color: #fff; }
  .hdr-util-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: ${T.dark1}; border: 1px solid ${T.border};
    border-top: 2px solid ${T.red};
    min-width: 140px; z-index: 9999;
    animation: ddFadeIn .15s ease;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
  }
  @keyframes ddFadeIn {
    from { opacity:0; transform: translateY(-6px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .hdr-util-dropdown button,
  .hdr-util-dropdown a {
    display: flex; align-items: center; gap: .5rem;
    width: 100%; padding: .55rem .85rem;
    background: none; border: none;
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .08em; text-transform: uppercase;
    cursor: pointer; text-decoration: none;
    border-bottom: 1px solid ${T.border};
    transition: background .15s, color .15s;
  }
  .hdr-util-dropdown button:last-child,
  .hdr-util-dropdown a:last-child { border-bottom: none; }
  .hdr-util-dropdown button:hover,
  .hdr-util-dropdown a:hover { background: ${T.dark2}; color: #fff; }

  .hdr-social a {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    color: ${T.textDim}; text-decoration: none; font-size: .75rem;
    border: 1px solid ${T.border};
    transition: border-color .2s, color .2s;
  }
  .hdr-social a:hover { border-color: ${T.textDim}; color: #fff; }

  /* ── Main header bar ── */
  .hdr-main {
    background: ${T.dark1};
    border-bottom: 1px solid ${T.border};
  }
  .hdr-main-inner {
    max-width: 1200px; margin: 0 auto; padding: .75rem 1.5rem;
    display: flex; align-items: center; gap: 1.5rem;
  }

  /* Logo */
  .hdr-logo { flex-shrink: 0; display: flex; align-items: center; }
  .hdr-logo img { height: 42px; width: auto; display: block; }
  .hdr-logo-text {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1.6rem; text-transform: uppercase; color: #fff;
    text-decoration: none; letter-spacing: .03em; line-height: 1;
  }
  .hdr-logo-text span { color: ${T.red}; }

  /* Search */
  .hdr-search { flex: 1; min-width: 0; }

  /* Contact */
  .hdr-contact {
    flex-shrink: 0; display: flex; align-items: center; gap: .75rem;
  }
  .hdr-contact-icon {
    width: 40px; height: 40px;
    background: rgba(230,57,70,.1); border: 1px solid rgba(230,57,70,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; color: ${T.red};
  }
  .hdr-contact-label {
    font-family: 'Space Mono', monospace;
    font-size: .58rem; letter-spacing: .15em; text-transform: uppercase;
    color: ${T.textDim}; display: block; margin-bottom: .15rem;
  }
  .hdr-contact-number {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: .95rem; color: #fff; letter-spacing: .03em; white-space: nowrap;
  }

  /* Icons area */
  .hdr-icons { flex-shrink: 0; display: flex; align-items: center; gap: .25rem; }
  .hdr-icon-btn {
    position: relative; width: 42px; height: 42px;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid}; font-size: 1.15rem;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; cursor: pointer;
    transition: border-color .2s, color .2s, background .2s;
  }
  .hdr-icon-btn:hover { border-color: ${T.borderHi}; color: #fff; background: ${T.dark3}; }
  .hdr-icon-badge {
    position: absolute; top: -5px; right: -5px;
    width: 18px; height: 18px;
    background: ${T.red}; color: #fff;
    font-family: 'Space Mono', monospace; font-size: .55rem;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid ${T.dark1};
  }

  /* Auth buttons */
  .hdr-btn-login {
    padding: .5rem 1.1rem;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .08em; text-transform: uppercase;
    text-decoration: none; transition: border-color .2s, color .2s;
  }
  .hdr-btn-login:hover { border-color: #fff; color: #fff; }
  .hdr-btn-register {
    padding: .5rem 1.1rem;
    background: ${T.red}; border: 1px solid ${T.red};
    color: #fff;
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .08em; text-transform: uppercase;
    text-decoration: none; transition: opacity .2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .hdr-btn-register:hover { opacity: .85; color: #fff; }

  /* ── Primary nav bar ── */
  .hdr-nav {
    background: ${T.dark2};
    border-bottom: 1px solid ${T.border};
    position: relative;
  }
  .hdr-nav::after {
    content: '';
    position: absolute; bottom: 0; left: 0;
    width: 80px; height: 2px; background: ${T.red};
  }
  .hdr-nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
    display: flex; align-items: stretch;
  }

  /* nav items */
  .hdr-nav-item {
    position: relative;
    display: flex; align-items: center;
  }
  .hdr-nav-link {
    display: flex; align-items: center; gap: .35rem;
    padding: .85rem 1rem;
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .08em; text-transform: uppercase;
    color: ${T.textMid}; text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: color .2s, border-color .2s;
    white-space: nowrap;
  }
  .hdr-nav-link:hover,
  .hdr-nav-link.active { color: #fff; border-bottom-color: ${T.red}; }
  .hdr-nav-link .hdr-nav-arrow {
    font-size: .55rem; transition: transform .2s; color: ${T.textDim};
  }
  .hdr-nav-item:hover .hdr-nav-arrow { transform: rotate(180deg); }

  /* dropdown appear on hover */
  .hdr-nav-item .cat-dd,
  .hdr-nav-item .hdr-account-dd { display: none; }
  .hdr-nav-item:hover .cat-dd,
  .hdr-nav-item:hover .hdr-account-dd { display: block; }

  /* account dropdown */
  .hdr-account-dd {
    position: absolute; top: calc(100% + 4px); left: 0;
    width: 200px;
    background: ${T.dark1}; border: 1px solid ${T.border};
    border-top: 2px solid ${T.red};
    z-index: 9999;
    box-shadow: 0 16px 48px rgba(0,0,0,.7);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
    animation: ddFadeIn .15s ease;
  }
  .hdr-account-dd a {
    display: flex; align-items: center; gap: .5rem;
    padding: .6rem 1rem;
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .08em; text-transform: uppercase;
    color: ${T.textMid}; text-decoration: none;
    border-bottom: 1px solid ${T.border};
    transition: background .15s, color .15s;
  }
  .hdr-account-dd a:last-child { border-bottom: none; }
  .hdr-account-dd a:hover { background: ${T.dark2}; color: #fff; }

  /* ── Mobile overlay menu ── */
  .hdr-mobile-overlay {
    position: fixed; inset: 0; z-index: 1100;
    background: rgba(0,0,0,.8);
    animation: fadeOverlay .2s ease;
  }
  @keyframes fadeOverlay { from{opacity:0} to{opacity:1} }
  .hdr-mobile-drawer {
    position: fixed; left: 0; top: 0; bottom: 0;
    width: 300px; max-width: 85vw;
    background: ${T.dark1};
    border-right: 1px solid ${T.border};
    z-index: 1101; overflow-y: auto;
    animation: slideDrawer .25s ease;
    display: flex; flex-direction: column;
  }
  @keyframes slideDrawer { from{transform:translateX(-100%)} to{transform:translateX(0)} }
  .hdr-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid ${T.border};
    position: sticky; top: 0; background: ${T.dark1}; z-index: 1;
  }
  .hdr-drawer-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1.2rem; text-transform: uppercase; color: #fff; margin: 0;
  }
  .hdr-drawer-close {
    width: 34px; height: 34px;
    background: none; border: 1px solid ${T.border}; color: ${T.textMid};
    font-size: 1rem; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .hdr-drawer-close:hover { border-color: ${T.red}; color: ${T.red}; }
  .hdr-drawer-search { padding: 1rem 1.25rem; border-bottom: 1px solid ${T.border}; }
  .hdr-drawer-nav { flex: 1; }
  .hdr-drawer-nav-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: .85rem 1.25rem;
    font-family: 'Space Mono', monospace; font-size: .72rem;
    letter-spacing: .08em; text-transform: uppercase;
    color: ${T.textMid}; text-decoration: none;
    border-bottom: 1px solid ${T.border};
    transition: color .2s, background .2s;
  }
  .hdr-drawer-nav-link:hover,
  .hdr-drawer-nav-link.active { color: #fff; background: ${T.dark2}; }
  .hdr-drawer-nav-link.active::before {
    content: ''; display: inline-block;
    width: 3px; height: 1em; background: ${T.red};
    margin-right: .6rem; flex-shrink: 0;
  }
  .hdr-drawer-section-title {
    padding: .65rem 1.25rem;
    font-family: 'Space Mono', monospace; font-size: .58rem;
    letter-spacing: .2em; text-transform: uppercase;
    color: ${T.textDim}; background: ${T.dark0};
    border-bottom: 1px solid ${T.border};
  }
  .hdr-drawer-cat-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: .7rem 1.25rem .7rem 1.75rem;
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .06em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none;
    border-bottom: 1px solid ${T.border};
    transition: color .2s, background .2s;
  }
  .hdr-drawer-cat-link:hover { color: #fff; background: ${T.dark2}; }
  .hdr-drawer-footer {
    padding: 1.25rem;
    border-top: 1px solid ${T.border};
    display: flex; flex-direction: column; gap: .75rem;
  }

  /* ── Scroll progress bar ── */
  .hdr-scroll-progress {
    position: absolute; bottom: 0; left: 0;
    height: 2px; background: ${T.red};
    transition: width .1s linear;
    pointer-events: none;
  }

  /* ── Responsive ── */
  @media(max-width: 1199px) {
    .hdr-contact { display: none !important; }
  }
  @media(max-width: 991px) {
    .hdr-nav { display: none; }
    .hdr-topbar { display: none !important; }
  }
  @media(max-width: 767px) {
    .hdr-main-inner { gap: .75rem; padding: .6rem 1rem; }
  }
`;

export const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  /* ── Marquee (reuse from Home) ── */
  @keyframes marqueeScroll { from { transform:translateX(0) } to { transform:translateX(-50%) } }
  @keyframes footerFadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }

  /* ── Pre-footer marquee ── */
  .ftr-marquee-wrap { background:${T.red}; overflow:hidden; padding:.65rem 0; }
  .ftr-marquee-track {
    display:flex; width:max-content;
    animation:marqueeScroll 30s linear infinite;
  }
  .ftr-marquee-item {
    font-family:'Anton','Impact',sans-serif;
    font-size:.95rem; text-transform:uppercase; letter-spacing:.08em;
    color:#fff; white-space:nowrap; padding:0 1.5rem;
  }
  .ftr-marquee-sep { opacity:.45; margin-left:1.5rem; }

  /* ── Main footer body ── */
  .ftr-body {
    background:${T.dark1};
    border-top:2px solid ${T.red};
    padding:4.5rem 0 2.5rem;
    position:relative; overflow:hidden;
  }
  /* halftone */
  .ftr-body::before {
    content:'';
    position:absolute; inset:0;
    background-image:radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
    background-size:22px 22px;
    pointer-events:none;
  }
  /* big ghost word */
  .ftr-ghost {
    position:absolute; right:-1rem; bottom:-1.5rem;
    font-family:'Anton','Impact',sans-serif;
    font-size:clamp(6rem,16vw,14rem);
    text-transform:uppercase; color:rgba(255,255,255,.025);
    line-height:1; user-select:none; pointer-events:none; white-space:nowrap;
  }
  .ftr-container { max-width:1200px; margin:0 auto; padding:0 1.5rem; position:relative; z-index:1; }

  /* ── Section heading ── */
  .ftr-heading {
    font-family:'Anton','Impact',sans-serif;
    font-size:.82rem; letter-spacing:.18em; text-transform:uppercase;
    color:${T.textHi}; margin:0 0 1.1rem;
    display:flex; align-items:center; gap:.65rem;
  }
  .ftr-heading::after { content:''; flex:1; height:1px; background:${T.border}; }
  .ftr-heading-accent { color:${T.red}; }

  /* ── Grid ── */
  .ftr-grid {
    display:grid;
    grid-template-columns:1.1fr 1fr 1fr 1.3fr;
    gap:3rem;
  }
  @media(max-width:1100px){ .ftr-grid{ grid-template-columns:1fr 1fr; gap:2.5rem; } }
  @media(max-width:580px) { .ftr-grid{ grid-template-columns:1fr; gap:2rem; } }

  /* ── Contact info ── */
  .ftr-contact-item { margin-bottom:1.1rem; }
  .ftr-contact-label {
    font-family:'Space Mono',monospace;
    font-size:.6rem; letter-spacing:.18em; text-transform:uppercase;
    color:${T.red}; display:block; margin-bottom:.3rem;
  }
  .ftr-contact-val {
    font-size:.82rem; color:${T.textMid}; line-height:1.6;
  }
  .ftr-contact-val a {
    color:${T.textMid}; text-decoration:none;
    transition:color .2s;
  }
  .ftr-contact-val a:hover { color:#fff; }

  /* ── Logo area ── */
  .ftr-logo-text {
    font-family:'Anton','Impact',sans-serif;
    font-size:2.2rem; text-transform:uppercase; color:#fff;
    text-decoration:none; letter-spacing:.03em; line-height:1;
    display:inline-block; margin-bottom:1rem;
  }
  .ftr-logo-text span { color:${T.red}; }
  .ftr-tagline {
    font-family:'Space Mono',monospace;
    font-size:.7rem; letter-spacing:.14em; text-transform:uppercase;
    color:${T.textDim}; margin-bottom:1.25rem;
    border-left:2px solid ${T.red}; padding-left:.75rem;
    display:block;
  }
  .ftr-about-text { font-size:.83rem; color:${T.textMid}; line-height:1.7; margin-bottom:1.5rem; }

  /* Social icons */
  .ftr-socials { display:flex; gap:.5rem; margin-top:.5rem; }
  .ftr-social-btn {
    width:36px; height:36px;
    background:${T.dark2}; border:1px solid ${T.border};
    color:${T.textMid}; font-size:.8rem;
    display:flex; align-items:center; justify-content:center;
    text-decoration:none; transition:border-color .2s, color .2s, background .2s;
  }
  .ftr-social-btn:hover { border-color:${T.red}; color:#fff; background:rgba(230,57,70,.1); }

  /* ── Category links ── */
  .ftr-cat-link {
    display:flex; align-items:center; justify-content:space-between;
    padding:.42rem 0;
    font-family:'Space Mono',monospace;
    font-size:.68rem; letter-spacing:.06em; text-transform:uppercase;
    color:${T.textMid}; text-decoration:none;
    border-bottom:1px solid ${T.border};
    transition:color .2s, padding-left .2s;
  }
  .ftr-cat-link:last-child { border-bottom:none; }
  .ftr-cat-link:hover { color:#fff; padding-left:.35rem; }
  .ftr-cat-arrow {
    font-size:.6rem; color:${T.textDim}; flex-shrink:0;
    transition:color .2s, transform .2s;
  }
  .ftr-cat-link:hover .ftr-cat-arrow { color:${T.red}; transform:translateX(3px); }

  /* ── Support links ── */
  .ftr-support-link {
    display:flex; align-items:center; gap:.5rem;
    padding:.42rem 0;
    font-family:'Space Mono',monospace;
    font-size:.68rem; letter-spacing:.06em; text-transform:uppercase;
    color:${T.textMid}; text-decoration:none;
    border-bottom:1px solid ${T.border};
    transition:color .2s;
  }
  .ftr-support-link:last-child { border-bottom:none; }
  .ftr-support-link::before {
    content:'→'; font-size:.6rem; color:${T.red}; flex-shrink:0;
    transition:transform .2s;
  }
  .ftr-support-link:hover { color:#fff; }
  .ftr-support-link:hover::before { transform:translateX(3px); }

  /* ── Newsletter ── */
  .ftr-sub-form {
    display:flex; height:44px; margin-bottom:.85rem;
    clip-path:polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    border:1px solid ${T.border}; background:${T.dark2};
    transition:border-color .2s;
  }
  .ftr-sub-form:focus-within { border-color:rgba(230,57,70,.45); }
  .ftr-sub-input {
    flex:1; background:none; border:none; outline:none;
    padding:0 .85rem;
    font-family:'Space Mono',monospace; font-size:.72rem;
    color:${T.textHi}; min-width:0;
  }
  .ftr-sub-input::placeholder { color:${T.textDim}; }
  .ftr-sub-input:disabled { opacity:.5; }
  .ftr-sub-btn {
    flex-shrink:0; padding:0 1.1rem;
    background:${T.red}; border:none; color:#fff;
    font-family:'Space Mono',monospace; font-size:.68rem;
    letter-spacing:.1em; text-transform:uppercase;
    cursor:pointer; transition:opacity .2s; white-space:nowrap;
    clip-path:polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
  }
  .ftr-sub-btn:hover { opacity:.85; }
  .ftr-sub-btn:disabled { opacity:.4; cursor:not-allowed; }
  .ftr-sub-note {
    font-family:'Space Mono',monospace;
    font-size:.62rem; color:${T.textDim}; line-height:1.6;
  }

  /* ── App badges ── */
  .ftr-app-badges { display:flex; flex-direction:column; gap:.5rem; margin-top:1.5rem; }
  .ftr-app-badge {
    display:flex; align-items:center; gap:.75rem;
    padding:.6rem .85rem;
    background:${T.dark2}; border:1px solid ${T.border};
    text-decoration:none; transition:border-color .2s;
  }
  .ftr-app-badge:hover { border-color:${T.borderHi}; }
  .ftr-app-badge-icon { font-size:1.4rem; flex-shrink:0; }
  .ftr-app-badge-top {
    font-family:'Space Mono',monospace;
    font-size:.55rem; letter-spacing:.14em; text-transform:uppercase;
    color:${T.textDim}; display:block;
  }
  .ftr-app-badge-name {
    font-family:'Anton','Impact',sans-serif;
    font-size:.9rem; color:#fff; letter-spacing:.03em;
  }

  /* ── Divider ── */
  .ftr-divider { height:1px; background:${T.border}; margin:2.5rem 0; }

  /* ── Bottom bar ── */
  .ftr-bottom {
    display:flex; align-items:center; justify-content:space-between;
    gap:1.5rem; flex-wrap:wrap;
  }
  .ftr-copy {
    font-family:'Space Mono',monospace;
    font-size:.65rem; color:${T.textDim}; letter-spacing:.06em;
  }
  .ftr-copy a { color:${T.textDim}; text-decoration:none; border-bottom:1px solid ${T.border}; padding-bottom:1px; transition:color .2s; }
  .ftr-copy a:hover { color:#fff; border-color:#fff; }
  .ftr-copy span { color:${T.red}; }

  /* Payment icons */
  .ftr-payments { display:flex; align-items:center; gap:.5rem; }
  .ftr-pay-pill {
    padding:.3rem .65rem;
    background:${T.dark2}; border:1px solid ${T.border};
    font-family:'Space Mono',monospace;
    font-size:.6rem; letter-spacing:.08em; text-transform:uppercase;
    color:${T.textDim};
  }
  .ftr-pay-icon { height:22px; width:auto; opacity:.55; filter:grayscale(1); transition:opacity .2s, filter .2s; }
  .ftr-pay-icon:hover { opacity:1; filter:grayscale(0); }

  /* ── Animated bottom border ── */
  .ftr-animated-border {
    height:3px; width:100%;
    background:linear-gradient(90deg, ${T.red}, ${T.orange}, ${T.teal}, ${T.red});
    background-size:300% 100%;
    animation:gradShift 4s linear infinite;
  }
  @keyframes gradShift { to { background-position:300% center } }
`;

export const AboutStyles = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      body { background: ${T.dark0}; color: ${T.textMid}; margin: 0; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
      .about-eyebrow {
        font-family: 'Space Mono', monospace;
        font-size: .72rem; letter-spacing: .22em; text-transform: uppercase;
        color: ${T.red}; display: block; margin-bottom: .75rem;
      }
      .about-section-title {
        font-family: 'Anton', 'Impact', sans-serif;
        font-size: clamp(2rem, 5vw, 3.5rem);
        text-transform: uppercase; line-height: 1.0;
        color: #fff; margin: 0 0 1.5rem;
      }
      .about-body-text {
        font-size: .97rem; line-height: 1.75;
        color: ${T.textMid}; margin-bottom: 1.1rem;
      }
      .about-body-text em { color: ${T.textHi}; font-style: italic; }
      .halftone-overlay {
        position: absolute; inset: 0;
        background-image: radial-gradient(circle, rgba(255,255,255,.055) 1px, transparent 1px);
        background-size: 22px 22px;
        pointer-events: none; z-index: 0;
      }
      .clip-corner {
        clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
      }
      .btn-about-primary {
        display: inline-block; padding: .85rem 2.25rem;
        background: ${T.red}; color: #fff;
        font-family: 'Space Mono', monospace; font-size: .78rem;
        letter-spacing: .1em; text-transform: uppercase;
        text-decoration: none;
        clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        transition: opacity .2s, transform .2s;
      }
      .btn-about-primary:hover { opacity: .85; transform: translateY(-2px); color:#fff; }
      .btn-about-ghost {
        display: inline-block; padding: .85rem 2.25rem;
        border: 1px solid rgba(255,255,255,.25);
        color: rgba(255,255,255,.7);
        font-family: 'Space Mono', monospace; font-size: .78rem;
        letter-spacing: .1em; text-transform: uppercase;
        text-decoration: none;
        transition: border-color .2s, color .2s;
      }
      .btn-about-ghost:hover { border-color: #fff; color: #fff; }
    `}</style>
  </>
);