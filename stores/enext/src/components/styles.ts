export const T = {
  red: '#b30e1c',
  orange: '#6120d9',
  teal: '#2a9d8f',
  dark0: 'rgba(0,0,0,.9)',
  dark1: '#111111',
  dark2: '#141414',
  dark3: '#1a1a1a',
  border: '#222222',
  textDim: 'rgba(255,255,255,0.30)',
  textMid: 'rgba(255,255,255,0.55)',
  textHi: 'rgba(255,255,255,0.90)',
};

export const blogStyles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

/* ── Page base ── */
.blog-page { min-height: 100vh; }

/* ── Page Hero ── */
.blog-hero {
    position: relative;
    background: ${T.dark0};
    padding: 5rem 0 4rem;
    overflow: hidden;
    border-bottom: 1px solid ${T.border};
}
.blog-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 22px 22px; pointer-events: none;
}
.blog-hero-stripe {
    position: absolute; left: 0; top: 0; width: 4px; height: 100%;
    background: ${T.red};
}
.blog-hero-ghost {
    position: absolute; right: -1rem; top: 50%;
    transform: translateY(-50%);
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(6rem,16vw,14rem);
    text-transform: uppercase; color: rgba(255,255,255,.025);
    line-height: 1; user-select: none; pointer-events: none; white-space: nowrap;
}
.blog-hero-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
    position: relative; z-index: 1;
}
.blog-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .22em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .6rem;
}
.blog-hero-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(3.5rem,10vw,8rem);
    text-transform: uppercase; line-height: .9;
    color: #fff; margin: 0 0 1.25rem;
    -webkit-text-stroke: 1.5px ${T.red};
}
.blog-hero-title span { -webkit-text-stroke: 0; color: ${T.red}; }
.blog-hero-meta {
    display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
}
.blog-hero-meta-item {
    font-family: 'Space Mono', monospace;
    font-size: .65rem; letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim};
    display: flex; align-items: center; gap: .4rem;
}
.blog-hero-meta-item span { color: ${T.red}; font-size: .9rem; }
.blog-breadcrumb {
    display: flex; align-items: center; gap: .5rem;
    margin-bottom: 1.5rem;
}
.blog-bc-link {
    font-family: 'Space Mono', monospace;
    font-size: .65rem; letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none; transition: color .2s;
}
.blog-bc-link:hover { color: #fff; }
.blog-bc-sep { color: ${T.red}; font-size: .6rem; }
.blog-bc-current {
    font-family: 'Space Mono', monospace;
    font-size: .65rem; letter-spacing: .12em; text-transform: uppercase;
    color: ${T.red};
}

/* ── Layout ── */
.blog-layout {
    max-width: 1200px; margin: 0 auto; padding: 4rem 1.5rem;
    display: grid; grid-template-columns: 1fr 320px;
    gap: 3rem; align-items: start;
}
@media(max-width: 960px) { .blog-layout { grid-template-columns: 1fr; } }

/* ── Post Cards ── */
.blog-posts-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
}
.blog-posts-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.25rem; text-transform: uppercase; color: #fff; margin: 0;
}
.blog-posts-title span { color: ${T.red}; }
.blog-posts-count {
    font-family: 'Space Mono', monospace;
    font-size: .63rem; letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim};
    background: ${T.dark2}; border: 1px solid ${T.border};
    padding: .25rem .65rem;
}
.blog-sort-select {
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid}; padding: .45rem .85rem;
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .08em; text-transform: uppercase;
    outline: none; cursor: pointer;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .6rem center;
    padding-right: 1.75rem;
}

/* Featured (first) post card */
.blog-card-featured {
    background: ${T.dark1};
    border: 1px solid ${T.border};
    border-top: 2px solid ${T.red};
    margin-bottom: 2rem;
    position: relative; overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
    transition: border-color .2s;
}
.blog-card-featured:hover { border-color: rgba(230,57,70,.5); }
.blog-card-featured-img-wrap {
    position: relative; overflow: hidden;
    height: 340px;
}
.blog-card-featured-img {
    width: 100%; height: 100%; object-fit: cover;
    display: block; transition: transform .5s;
}
.blog-card-featured:hover .blog-card-featured-img { transform: scale(1.03); }
.blog-card-featured-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.85) 100%);
    pointer-events: none;
}
.blog-card-featured-badge {
    position: absolute; top: 1rem; left: 1rem;
    font-family: 'Anton','Impact',sans-serif;
    font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
    color: #fff; background: ${T.red};
    padding: .3rem .7rem;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
}
.blog-card-featured-cat {
    position: absolute; bottom: 1rem; left: 1rem;
    font-family: 'Space Mono', monospace;
    font-size: .6rem; letter-spacing: .16em; text-transform: uppercase;
    color: rgba(255,255,255,.7);
    background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.15);
    padding: .2rem .55rem;
}
.blog-card-featured-body { padding: 1.75rem 2rem 2rem; }
.blog-card-featured-meta {
    display: flex; align-items: center; gap: 1.25rem;
    margin-bottom: 1rem; flex-wrap: wrap;
}
.blog-card-meta-item {
    display: flex; align-items: center; gap: .4rem;
    font-family: 'Space Mono', monospace;
    font-size: .62rem; letter-spacing: .08em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none; transition: color .2s;
}
.blog-card-meta-item:hover { color: ${T.textMid}; }
.blog-card-meta-dot { color: ${T.red}; font-size: .5rem; }
.blog-card-featured-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(1.4rem, 3vw, 2rem);
    text-transform: uppercase; line-height: 1.05;
    color: #fff; margin: 0 0 .85rem;
    text-decoration: none; display: block;
    transition: color .2s;
}
.blog-card-featured-title:hover { color: ${T.red}; }
.blog-card-featured-excerpt {
    font-size: .88rem; color: ${T.textMid}; line-height: 1.7;
    margin: 0 0 1.5rem;
}
.blog-card-cta {
    display: inline-flex; align-items: center; gap: .6rem;
    padding: .65rem 1.4rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .1em; text-transform: uppercase;
    text-decoration: none; transition: opacity .2s, transform .2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.blog-card-cta:hover { opacity: .85; transform: translateY(-2px); color: #fff; }
.blog-card-cta-ghost {
    display: inline-flex; align-items: center; gap: .6rem;
    padding: .65rem 1.4rem;
    background: transparent; border: 1px solid ${T.border}; color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .1em; text-transform: uppercase;
    text-decoration: none; transition: border-color .2s, color .2s;
}
.blog-card-cta-ghost:hover { border-color: ${T.red}; color: ${T.red}; }

/* Regular post cards */
.blog-card {
    display: grid; grid-template-columns: 220px 1fr;
    background: ${T.dark1}; border: 1px solid ${T.border};
    margin-bottom: 1.25rem; overflow: hidden;
    transition: border-color .2s, background .2s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
}
.blog-card:hover { border-color: rgba(230,57,70,.35); background: ${T.dark2}; }
.blog-card:last-child { margin-bottom: 0; }
@media(max-width: 640px) { .blog-card { grid-template-columns: 1fr; } }
.blog-card-img-wrap {
    position: relative; overflow: hidden;
}
.blog-card-img-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    display: block; transition: transform .4s;
    min-height: 160px;
}
.blog-card:hover .blog-card-img-wrap img { transform: scale(1.05); }
.blog-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(230,57,70,.15), transparent);
    pointer-events: none;
}
.blog-card-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; }
.blog-card-cat-tag {
    display: inline-flex; align-items: center;
    font-family: 'Space Mono', monospace;
    font-size: .57rem; letter-spacing: .16em; text-transform: uppercase;
    color: var(--tag-color, ${T.red}); margin-bottom: .65rem;
    border-left: 2px solid var(--tag-color, ${T.red}); padding-left: .45rem;
}
.blog-card-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.15rem; text-transform: uppercase; line-height: 1.1;
    color: #fff; margin: 0 0 .65rem;
    text-decoration: none; display: block; transition: color .2s;
}
.blog-card-title:hover { color: ${T.red}; }
.blog-card-excerpt {
    font-size: .79rem; color: ${T.textMid}; line-height: 1.6;
    margin: 0 0 .85rem; flex: 1;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
}
.blog-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: .75rem; flex-wrap: wrap;
}
.blog-card-date {
    font-family: 'Space Mono', monospace;
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    color: ${T.textDim};
}
.blog-card-read-link {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; letter-spacing: .1em; text-transform: uppercase;
    color: ${T.red}; text-decoration: none;
    border-bottom: 1px solid rgba(230,57,70,.3);
    padding-bottom: 1px; transition: border-color .2s;
}
.blog-card-read-link:hover { border-color: ${T.red}; }

/* ── Skeleton loader ── */
.blog-skeleton { animation: blogPulse 1.6s ease-in-out infinite; }
@keyframes blogPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.blog-skel-block {
    background: ${T.dark2}; border: 1px solid ${T.border};
    margin-bottom: 1.25rem;
}
.blog-skel-img { height: 340px; background: ${T.dark3}; }
.blog-skel-body { padding: 1.75rem 2rem; }
.blog-skel-line {
    height: 10px; background: ${T.dark3}; margin-bottom: .65rem; border-radius: 1px;
}
.blog-skel-row {
    display: grid; grid-template-columns: 220px 1fr;
    height: 160px; overflow: hidden;
}
.blog-skel-thumb { background: ${T.dark3}; }
.blog-skel-row-body { padding: 1.25rem; }

/* ── Empty / Error states ── */
.blog-empty {
    background: ${T.dark1}; border: 1px solid ${T.border};
    padding: 4rem 2rem; text-align: center;
}
.blog-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
.blog-empty-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.5rem; text-transform: uppercase; color: #fff; margin: 0 0 .5rem;
}
.blog-empty-sub {
    font-family: 'Space Mono', monospace;
    font-size: .72rem; color: ${T.textDim}; margin: 0 0 1.5rem;
}
.blog-error {
    display: flex; align-items: flex-start; gap: .85rem;
    padding: 1.25rem 1.5rem;
    background: rgba(230,57,70,.06); border: 1px solid rgba(230,57,70,.3);
    margin-bottom: 1.5rem;
}
.blog-error-icon {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.75rem; color: ${T.red}; line-height: 1; flex-shrink: 0;
}
.blog-error-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: .9rem; text-transform: uppercase; color: #fff; margin: 0 0 .25rem;
}
.blog-error-msg {
    font-family: 'Space Mono', monospace;
    font-size: .7rem; color: ${T.textMid}; margin: 0;
}

/* ── Load more ── */
.blog-load-more {
    display: flex; justify-content: center;
    margin-top: 2rem; padding-top: 2rem;
    border-top: 1px solid ${T.border};
}

/* ═══════════ SIDEBAR ═══════════ */
.blog-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }

/* Sidebar card */
.blog-sb-card {
    background: ${T.dark1}; border: 1px solid ${T.border};
    border-top: 2px solid var(--sb-accent, ${T.red});
    position: relative; overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
}
.blog-sb-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem .75rem;
    border-bottom: 1px solid ${T.border};
}
.blog-sb-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: .88rem; text-transform: uppercase; color: #fff; margin: 0;
}
.blog-sb-body { padding: 1.1rem 1.25rem; }

/* Search in sidebar */
.blog-sb-search-form {
    display: flex; height: 42px;
    border: 1px solid ${T.border}; background: ${T.dark2};
    transition: border-color .2s;
}
.blog-sb-search-form:focus-within { border-color: rgba(230,57,70,.4); }
.blog-sb-search-input {
    flex: 1; background: none; border: none; outline: none;
    padding: 0 .85rem;
    font-family: 'Space Mono', monospace; font-size: .72rem;
    color: ${T.textHi};
}
.blog-sb-search-input::placeholder { color: ${T.textDim}; }
.blog-sb-search-btn {
    width: 42px; flex-shrink: 0; background: ${T.red}; border: none;
    color: #fff; font-size: .85rem; cursor: pointer; transition: opacity .2s;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
}
.blog-sb-search-btn:hover { opacity: .85; }

/* Category list */
.blog-sb-cat {
    display: flex; align-items: center; justify-content: space-between;
    padding: .55rem 0;
    border-bottom: 1px solid ${T.border};
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .06em; text-transform: uppercase;
    color: ${T.textMid};
    transition: color .2s, padding-left .2s;
    cursor: pointer;
}
.blog-sb-cat:last-child { border-bottom: none; }
.blog-sb-cat:hover { color: #fff; padding-left: .25rem; }
.blog-sb-cat.active { color: ${T.red}; border-left: 2px solid ${T.red}; padding-left: .5rem; }
.blog-sb-cat-arrow { font-size: .55rem; color: ${T.textDim}; flex-shrink: 0; }
.blog-sb-cat.active .blog-sb-cat-arrow { color: ${T.red}; }
.blog-sb-cat-count {
    font-size: .55rem; background: ${T.dark3}; border: 1px solid ${T.border};
    padding: .1rem .35rem; color: ${T.textDim};
    font-family: 'Space Mono', monospace;
}

/* Clear filter chip */
.blog-clear-chip {
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .3rem .65rem; margin-bottom: .75rem;
    background: rgba(230,57,70,.08); border: 1px solid rgba(230,57,70,.3);
    color: ${T.red}; font-family: 'Space Mono', monospace;
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: background .2s;
}
.blog-clear-chip:hover { background: rgba(230,57,70,.15); }

/* Recent posts */
.blog-recent-item {
    display: flex; align-items: center; gap: .85rem;
    padding: .75rem 0; border-bottom: 1px solid ${T.border};
    text-decoration: none; transition: opacity .2s;
}
.blog-recent-item:last-child { border-bottom: none; padding-bottom: 0; }
.blog-recent-item:hover { opacity: .8; }
.blog-recent-thumb {
    width: 58px; height: 58px; flex-shrink: 0; object-fit: cover;
    border: 1px solid ${T.border}; background: ${T.dark3};
}
.blog-recent-info { flex: 1; min-width: 0; }
.blog-recent-title {
    font-family: 'Space Mono', monospace;
    font-size: .7rem; color: ${T.textHi}; line-height: 1.4; margin: 0 0 .3rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    display: block;
}
.blog-recent-date {
    font-family: 'Space Mono', monospace;
    font-size: .58rem; color: ${T.textDim}; letter-spacing: .08em; text-transform: uppercase;
}

/* Tags */
.blog-tags-wrap { display: flex; flex-wrap: wrap; gap: .45rem; }
.blog-tag {
    display: inline-block; padding: .35rem .75rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textDim};
    font-family: 'Space Mono', monospace; font-size: .6rem;
    letter-spacing: .08em; text-transform: uppercase;
    text-decoration: none;
    transition: border-color .2s, color .2s, background .2s;
    cursor: pointer;
}
.blog-tag:hover { border-color: ${T.red}; color: ${T.red}; background: rgba(230,57,70,.05); }
.blog-tag.active { border-color: ${T.red}; color: #fff; background: ${T.red}; }

/* Newsletter in sidebar */
.blog-sb-newsletter-input {
    width: 100%; background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .65rem .85rem; outline: none;
    font-family: 'Space Mono', monospace; font-size: .72rem; margin-bottom: .65rem;
    transition: border-color .2s;
}
.blog-sb-newsletter-input::placeholder { color: ${T.textDim}; }
.blog-sb-newsletter-input:focus { border-color: rgba(230,57,70,.4); }
.blog-sb-newsletter-btn {
    width: 100%; padding: .7rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer; transition: opacity .2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.blog-sb-newsletter-btn:hover { opacity: .85; }

/* ── Animated bottom border ── */
.blog-animated-border {
    height: 3px; width: 100%;
    background: linear-gradient(90deg, #b30e1c, #f4a261, #2a9d8f, #b30e1c);
    background-size: 300% 100%;
    animation: blogGrad 4s linear infinite;
}
@keyframes blogGrad { to { background-position: 300% center; } }

/* ── Responsive ── */
@media(max-width: 960px) { .blog-sidebar { order: -1; } }
`;

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
    background: #0d0d0d;
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
  .hdr-category-dropdown {
    position: fixed;
    top: 152px;
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

export const AboutStyles = () =>
  `
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />
    <style>{"
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
    "}</style>
  </>
  `;

export const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  /* ── Page shell ── */
  .auth-page {
    min-height: 100vh;
    display: flex;
  }

  /* ── LEFT PANEL ── */
  .auth-left {
    width: 420px; flex-shrink: 0;
    background: ${T.dark1};
    border-right: 1px solid ${T.border};
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
  }
  .auth-left::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 22px 22px; pointer-events: none;
  }
  .auth-left-stripe {
    position: absolute; left: 0; top: 0; width: 4px; height: 100%;
    background: ${T.red};
  }
  .auth-left-ghost {
    position: absolute; bottom: -2rem; left: -1rem;
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(7rem,15vw,12rem);
    text-transform: uppercase; color: rgba(255,255,255,.03);
    line-height: 1; user-select: none; pointer-events: none;
    writing-mode: vertical-rl; text-orientation: mixed;
    white-space: nowrap;
  }
  .auth-left-inner {
    padding: 3rem 2.5rem;
    position: relative; z-index: 1;
    display: flex; flex-direction: column; height: 100%;
  }
  .auth-left-logo {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 2rem; text-transform: uppercase; color: #fff;
    text-decoration: none; letter-spacing: .03em; line-height: 1;
    margin-bottom: 3rem; display: inline-block;
  }
  .auth-left-logo span { color: ${T.red}; }
  .auth-left-heading {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(2rem,4vw,3rem);
    text-transform: uppercase; line-height: .95;
    color: #fff; margin: 0 0 1rem;
  }
  .auth-left-heading span { color: ${T.red}; }
  .auth-left-sub {
    font-family: 'Space Mono', monospace;
    font-size: .78rem; color: ${T.textMid}; line-height: 1.7;
    margin-bottom: 2.5rem;
  }

  /* Feature list */
  .auth-features { display: flex; flex-direction: column; gap: .85rem; margin-bottom: auto; }
  .auth-feature {
    display: flex; align-items: flex-start; gap: .85rem;
    padding: .85rem 1rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    border-left: 3px solid var(--feat-accent, ${T.red});
    transition: border-color .2s;
  }
  .auth-feature-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: .05rem; }
  .auth-feature-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: .8rem; text-transform: uppercase; color: #fff;
    margin: 0 0 .2rem;
  }
  .auth-feature-desc {
    font-family: 'Space Mono',monospace;
    font-size: .62rem; color: ${T.textDim}; line-height: 1.5; margin: 0;
  }

  /* Bottom bar on left panel */
  .auth-left-foot {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${T.border};
  }
  .auth-left-foot-label {
    font-family: 'Space Mono',monospace;
    font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
    color: ${T.textDim}; margin-bottom: .75rem;
  }
  .auth-stat-row {
    display: flex; gap: 1.5rem;
  }
  .auth-stat-val {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.5rem; color: ${T.red}; line-height: 1; display: block;
  }
  .auth-stat-lbl {
    font-family: 'Space Mono',monospace;
    font-size: .58rem; letter-spacing: .1em; text-transform: uppercase;
    color: ${T.textDim};
  }

  /* ── RIGHT PANEL (form) ── */
  .auth-right {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
    overflow-y: auto;
  }
  .auth-form-wrap {
    width: 100%; max-width: 480px;
    padding: 15px;
  }

  /* Form header */
  .auth-form-eyebrow {
    font-family: 'Space Mono',monospace;
    font-size: .68rem; letter-spacing: .22em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .6rem;
  }
  .auth-form-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(1.75rem,4vw,2.5rem);
    text-transform: uppercase; color: #fff; margin: 0 0 .5rem;
  }
  .auth-form-title span { color: ${T.red}; }
  .auth-form-sub {
    font-family: 'Space Mono',monospace;
    font-size: .72rem; color: ${T.textMid}; line-height: 1.6;
    margin: 0 0 0rem;
  }
  .auth-form-sub a {
    color: ${T.red}; text-decoration: none; border-bottom: 1px solid rgba(230,57,70,.3);
    transition: border-color .2s;
  }
  .auth-form-sub a:hover { border-color: ${T.red}; }

  /* Social buttons */
  .auth-socials { display: flex; flex-direction: column; gap: .65rem; margin-bottom: 1.75rem; }
  .auth-social-btn {
    display: flex; align-items: center; justify-content: center; gap: .75rem;
    width: 100%; padding: .75rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono',monospace; font-size: .7rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s, background .2s;
  }
  .auth-social-btn:hover { border-color: ${T.textDim}; color: #fff; background: ${T.dark3}; }
  .auth-social-btn:disabled { opacity: .4; cursor: not-allowed; }
  .auth-social-icon { font-size: 1rem; flex-shrink: 0; }

  /* Divider */
  .auth-divider {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.75rem;
  }
  .auth-divider-line { flex: 1; height: 1px; background: ${T.border}; }
  .auth-divider-text {
    font-family: 'Space Mono',monospace;
    font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
    color: ${T.textDim}; white-space: nowrap;
  }

  /* Form fields */
  .auth-field { margin-bottom: 1.1rem; }
  .auth-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .auth-label {
    font-family: 'Space Mono',monospace;
    font-size: .6rem; letter-spacing: .16em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .45rem;
  }
  .auth-label-req { opacity: .5; margin-left: .2rem; }
  .auth-input, .auth-select {
    width: 100%; background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .72rem .9rem;
    font-family: 'Space Mono',monospace; font-size: .75rem;
    outline: none; transition: border-color .2s, background .2s;
    display: block;
  }
  .auth-input::placeholder { color: ${T.textDim}; }
  .auth-input:focus, .auth-select:focus {
    border-color: rgba(230,57,70,.5); background: ${T.dark3};
  }
  .auth-input.error, .auth-select.error { border-color: rgba(230,57,70,.6); }
  .auth-input:disabled, .auth-select:disabled { opacity: .4; cursor: not-allowed; }
  .auth-select {
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .8rem center;
    padding-right: 2rem;
  }

  /* Password wrapper */
  .auth-pw-wrap { position: relative; }
  .auth-pw-wrap .auth-input { padding-right: 3rem; }
  .auth-pw-toggle {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: 44px; background: none; border: none; border-left: 1px solid ${T.border};
    color: ${T.textDim}; font-size: .9rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: color .2s;
  }
  .auth-pw-toggle:hover { color: #fff; }

  /* Field error */
  .auth-field-error {
    font-family: 'Space Mono',monospace;
    font-size: .62rem; color: ${T.red};
    margin-top: .35rem; display: flex; align-items: center; gap: .3rem;
  }
  .auth-field-error::before { content: '⚠'; font-size: .6rem; }

  /* Password strength */
  .auth-pw-strength { margin-top: .6rem; }
  .auth-pw-bars { display: flex; gap: 3px; margin-bottom: .3rem; }
  .auth-pw-bar {
    flex: 1; height: 3px; background: ${T.border};
    transition: background .3s;
  }
  .auth-pw-bar.fill-1 { background: ${T.red}; }
  .auth-pw-bar.fill-2 { background: ${T.orange}; }
  .auth-pw-bar.fill-3 { background: ${T.orange}; }
  .auth-pw-bar.fill-4 { background: ${T.teal}; }
  .auth-pw-bar.fill-5 { background: ${T.teal}; }
  .auth-pw-label {
    font-family: 'Space Mono',monospace;
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
  }
  .auth-pw-hint {
    font-family: 'Space Mono',monospace;
    font-size: .6rem; color: ${T.textDim}; margin-top: .35rem;
  }

  /* Checkbox */
  .auth-check-row {
    display: flex; align-items: flex-start; gap: .75rem; cursor: pointer;
  }
  .auth-check-box {
    width: 18px; height: 18px; flex-shrink: 0; margin-top: .05rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: center;
    transition: border-color .2s, background .2s;
  }
  .auth-check-box.checked { background: ${T.red}; border-color: ${T.red}; }
  .auth-check-box.checked::after { content: '✓'; font-size: .7rem; color: #fff; font-weight: bold; }
  .auth-check-box.error { border-color: rgba(230,57,70,.6); }
  .auth-check-label {
    font-family: 'Space Mono',monospace;
    font-size: .68rem; color: ${T.textMid}; line-height: 1.55;
  }
  .auth-check-label a { color: ${T.red}; text-decoration: none; }
  .auth-check-label a:hover { text-decoration: underline; }

  /* Remember me / forgot row */
  .auth-remember-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .auth-forgot {
    font-family: 'Space Mono',monospace;
    font-size: .63rem; letter-spacing: .08em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none;
    border-bottom: 1px solid ${T.border}; padding-bottom: 1px;
    transition: color .2s, border-color .2s;
  }
  .auth-forgot:hover { color: ${T.red}; border-color: ${T.red}; }

  /* Alert */
  .auth-alert {
    display: flex; align-items: flex-start; gap: .7rem;
    padding: .8rem 1rem; margin-bottom: 1.25rem;
    border: 1px solid;
    font-family: 'Space Mono',monospace; font-size: .7rem; line-height: 1.5;
  }
  .auth-alert.error   { border-color: rgba(230,57,70,.4);  color: ${T.red};   background: rgba(230,57,70,.06); }
  .auth-alert.success { border-color: rgba(42,157,143,.4); color: ${T.teal};  background: rgba(42,157,143,.06); }
  .auth-alert-icon { font-size: .9rem; flex-shrink: 0; margin-top: .1rem; }
  .auth-alert-close {
    margin-left: auto; background: none; border: none; cursor: pointer;
    color: inherit; font-size: .8rem; padding: 0; opacity: .6; transition: opacity .2s;
    flex-shrink: 0;
  }
  .auth-alert-close:hover { opacity: 1; }

  /* Submit button */
  .auth-submit {
    display: flex; align-items: center; justify-content: center; gap: .65rem;
    width: 100%; padding: .9rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono',monospace; font-size: .78rem;
    letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer; transition: opacity .2s, transform .2s;
    margin-top: 1.5rem;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .auth-submit:hover:not(:disabled) { opacity: .85; transform: translateY(-1px); }
  .auth-submit:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .auth-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: authSpin .65s linear infinite;
  }
  @keyframes authSpin { to { transform: rotate(360deg); } }

  /* Footer note */
  .auth-form-foot {
    margin-top: 1.5rem; padding-top: 1.5rem;
    border-top: 1px solid ${T.border};
    font-family: 'Space Mono',monospace;
    font-size: .6rem; color: ${T.textDim}; line-height: 1.6; text-align: center;
  }
  .auth-form-foot a { color: ${T.textDim}; text-decoration: none; border-bottom: 1px solid ${T.border}; }
  .auth-form-foot a:hover { color: #fff; border-color: ${T.textDim}; }

  /* ── Animated bottom border ── */
  .auth-animated-border {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${T.red}, ${T.orange}, ${T.teal}, ${T.red});
    background-size: 300% 100%;
    animation: authGrad 4s linear infinite; z-index: 100;
  }
  @keyframes authGrad { to { background-position: 300% center; } }

  /* ── Responsive ── */
  @media(max-width: 900px) {
    .auth-left { display: none; }
    .auth-right { padding: 2rem 1.25rem; }
  }
  @media(max-width: 480px) {
    .auth-field-row { grid-template-columns: 1fr; }
  }
`;

export const shopStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { background: ${T.dark0}; color: ${T.textMid}; }

  /* ── Sidebar ── */
  .shop-sidebar {
    background: ${T.dark1};
    border: 1px solid ${T.border};
    position: sticky; top: 1.5rem;
  }
  .sidebar-section {
    padding: 1.5rem;
    border-bottom: 1px solid ${T.border};
  }
  .sidebar-section:last-child { border-bottom: none; }
  .sidebar-heading {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: .85rem; letter-spacing: .15em; text-transform: uppercase;
    color: ${T.textHi}; margin: 0 0 1.1rem;
    display: flex; align-items: center; gap: .6rem;
  }
  .sidebar-heading::after {
    content: ''; flex: 1; height: 1px; background: ${T.border};
  }

  /* category links */
  .cat-filter-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: .5rem .75rem; margin-bottom: .25rem;
    font-family: 'Space Mono', monospace; font-size: .73rem;
    letter-spacing: .06em; text-transform: uppercase;
    color: ${T.textMid}; text-decoration: none;
    border: 1px solid transparent;
    transition: color .2s, border-color .2s, background .2s;
  }
  .cat-filter-link:hover { color: #fff; border-color: ${T.border}; }
  .cat-filter-link.active {
    color: ${T.red}; border-color: ${T.red};
    background: rgba(230,57,70,.07);
  }
  .cat-count {
    font-family: 'Space Mono', monospace; font-size: .65rem;
    color: ${T.textDim}; background: ${T.dark3};
    padding: .1rem .45rem; border: 1px solid ${T.border};
  }
  .cat-filter-link.active .cat-count {
    color: ${T.red}; border-color: ${T.red}; background: rgba(230,57,70,.12);
  }

  /* brand checkboxes */
  .brand-check-row {
    display: flex; align-items: center; gap: .65rem;
    padding: .45rem 0; cursor: pointer;
  }
  .brand-check-box {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 1px solid ${T.border}; background: ${T.dark3};
    display: flex; align-items: center; justify-content: center;
    transition: border-color .2s, background .2s;
  }
  .brand-check-box.checked {
    border-color: ${T.red}; background: ${T.red};
  }
  .brand-check-box.checked::after {
    content: '✓'; font-size: .65rem; color: #fff; font-weight: bold;
  }
  .brand-check-label {
    font-family: 'Space Mono', monospace; font-size: .72rem;
    text-transform: uppercase; letter-spacing: .05em;
    color: ${T.textMid}; flex: 1;
    transition: color .2s;
  }
  .brand-check-row:hover .brand-check-label { color: #fff; }
  .brand-check-row:hover .brand-check-box { border-color: ${T.textDim}; }

  /* price range */
  .price-range-inputs { display: flex; gap: .75rem; margin-bottom: 1rem; }
  .price-input-wrap { flex: 1; }
  .price-input-label {
    font-family: 'Space Mono', monospace; font-size: .6rem;
    letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim}; display: block; margin-bottom: .4rem;
  }
  .price-input {
    width: 100%; background: ${T.dark3}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .5rem .65rem;
    font-family: 'Space Mono', monospace; font-size: .78rem;
    outline: none; transition: border-color .2s;
  }
  .price-input:focus { border-color: ${T.red}; }

  /* custom range slider */
  .shop-range {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 3px;
    background: linear-gradient(to right, ${T.red} var(--pct,50%), ${T.border} var(--pct,50%));
    outline: none; margin: .75rem 0;
  }
  .shop-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px; height: 14px;
    background: ${T.red}; border: 2px solid ${T.dark0};
    cursor: pointer;
  }
  .shop-range::-moz-range-thumb {
    width: 14px; height: 14px;
    background: ${T.red}; border: 2px solid ${T.dark0};
    cursor: pointer; border-radius: 0;
  }

  /* clear btn */
  .btn-clear {
    width: 100%; padding: .65rem;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .7rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .btn-clear:hover { border-color: ${T.red}; color: ${T.red}; }

  /* ── Toolbar ── */
  .shop-toolbar {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    padding: 1rem 1.25rem;
    background: ${T.dark1}; border: 1px solid ${T.border};
    margin-bottom: 1.5rem;
  }
  .toolbar-label {
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim}; white-space: nowrap;
  }
  .shop-select {
    background: ${T.dark3}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .45rem .75rem;
    font-family: 'Space Mono', monospace; font-size: .72rem;
    letter-spacing: .05em; outline: none;
    cursor: pointer; transition: border-color .2s;
    -webkit-appearance: none; appearance: none;
    padding-right: 1.75rem;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right .6rem center;
  }
  .shop-select:focus { border-color: ${T.red}; }
  .toolbar-results {
    font-family: 'Space Mono', monospace; font-size: .68rem;
    color: ${T.textDim}; margin-left: auto;
  }
  .toolbar-results span { color: ${T.red}; }

  /* view toggle */
  .view-toggle-btn {
    width: 36px; height: 36px;
    background: ${T.dark3}; border: 1px solid ${T.border};
    color: ${T.textDim}; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .view-toggle-btn.active { border-color: ${T.red}; color: ${T.red}; background: rgba(230,57,70,.08); }
  .view-toggle-btn:hover { border-color: ${T.borderHi}; color: #fff; }

  /* ── Active filter chips ── */
  .filter-chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.25rem; }
  .filter-chip {
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .3rem .7rem;
    background: rgba(230,57,70,.1); border: 1px solid rgba(230,57,70,.4);
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .08em; text-transform: uppercase; color: ${T.red};
  }
  .filter-chip-x {
    cursor: pointer; opacity: .7; font-size: .8rem; line-height: 1;
    transition: opacity .2s;
  }
  .filter-chip-x:hover { opacity: 1; }

  /* ── Empty state ── */
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 6rem 2rem; text-align: center;
    border: 1px dashed ${T.border};
    background: ${T.dark1};
  }
  .empty-icon {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 5rem; color: ${T.border}; line-height: 1; margin-bottom: 1.5rem;
  }
  .empty-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1.75rem; text-transform: uppercase; color: ${T.textHi};
    margin: 0 0 .75rem;
  }
  .empty-body { font-size: .88rem; color: ${T.textDim}; margin-bottom: 2rem; }

  /* ── Pagination ── */
  .shop-pagination { display: flex; align-items: center; justify-content: center; gap: .4rem; margin-top: 2.5rem; }
  .page-btn {
    width: 40px; height: 40px;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .8rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s, background .2s;
    text-decoration: none;
  }
  .page-btn:hover { border-color: ${T.borderHi}; color: #fff; }
  .page-btn.active { border-color: ${T.red}; background: ${T.red}; color: #fff; cursor: default; }
  .page-btn.disabled { opacity: .3; pointer-events: none; }

  /* ── Mobile filter drawer ── */
  .mobile-filter-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,.75);
    animation: fadeIn .2s ease;
  }
  .mobile-filter-drawer {
    position: fixed; left: 0; top: 0; bottom: 0; width: 320px; max-width: 90vw;
    background: ${T.dark1}; border-right: 1px solid ${T.border};
    z-index: 1001; overflow-y: auto;
    animation: slideInLeft .25s ease;
  }
  .mobile-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid ${T.border};
    position: sticky; top: 0; background: ${T.dark1}; z-index: 1;
  }
  .mobile-drawer-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1.25rem; text-transform: uppercase; color: #fff; margin: 0;
  }
  .mobile-drawer-close {
    width: 36px; height: 36px;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid}; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .mobile-drawer-close:hover { border-color: ${T.red}; color: ${T.red}; }

  /* ── Loading skeleton ── */
  .skeleton-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
  .skeleton-card {
    background: ${T.dark2}; border: 1px solid ${T.border};
    aspect-ratio: 3/4;
    animation: skeletonPulse 1.6s ease-in-out infinite;
  }
  @keyframes skeletonPulse {
    0%,100% { opacity: 1; }
    50% { opacity: .4; }
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }

  /* ── Loading / Error screens ── */
  .shop-loading-screen, .shop-error-screen {
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: ${T.dark0};
  }
  .loading-spinner {
    width: 48px; height: 48px;
    border: 3px solid ${T.border};
    border-top-color: ${T.red};
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin-bottom: 1.5rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Misc ── */
  .price-display {
    display: flex; justify-content: space-between;
    font-family: 'Space Mono', monospace; font-size: .7rem;
    color: ${T.textDim}; margin-top: .25rem;
  }
  .price-display span { color: ${T.textHi}; }

  /* Filter btn (mobile trigger) */
  .btn-filter-trigger {
    display: flex; align-items: center; gap: .6rem;
    padding: .65rem 1.25rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .72rem;
    letter-spacing: .08em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .btn-filter-trigger:hover { border-color: ${T.red}; color: ${T.red}; }
  .btn-apply-price {
    padding: .5rem 1rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono', monospace; font-size: .7rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: opacity .2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .btn-apply-price:hover { opacity: .85; }

  @media(max-width:768px) {
    .skeleton-grid { grid-template-columns: repeat(2,1fr); }
    .shop-toolbar { gap: .6rem; }
  }
`;

export const contactStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  .ct-page { min-height: 100vh; }

  /* ── Page Hero ── */
  .ct-hero {
    position: relative;
    background: ${T.dark0};
    padding: 5rem 0 4rem;
    overflow: hidden;
    border-bottom: 1px solid ${T.border};
  }
  .ct-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }
  .ct-hero-ghost {
    position: absolute; right: -1rem; top: 50%;
    transform: translateY(-50%);
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(6rem,16vw,14rem);
    text-transform: uppercase;
    color: rgba(255,255,255,.025);
    line-height: 1; user-select: none; pointer-events: none; white-space: nowrap;
  }
  .ct-hero-stripe {
    position: absolute; left: 0; top: 0; width: 4px; height: 100%;
    background: ${T.red};
  }
  .ct-hero-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
    position: relative; z-index: 1;
  }
  .ct-breadcrumb {
    display: flex; align-items: center; gap: .5rem;
    margin-bottom: 1.75rem;
  }
  .ct-bc-link {
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .15em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none; transition: color .2s;
  }
  .ct-bc-link:hover { color: #fff; }
  .ct-bc-sep { color: ${T.red}; font-size: .7rem; }
  .ct-bc-current {
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .15em; text-transform: uppercase;
    color: ${T.red};
  }
  .ct-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: .72rem; letter-spacing: .22em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .6rem;
  }
  .ct-hero-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(3rem,9vw,7rem);
    text-transform: uppercase; line-height: .92;
    color: #fff; margin: 0 0 1.5rem;
    -webkit-text-stroke: 1.5px ${T.red};
  }
  .ct-hero-title span { -webkit-text-stroke: 0; color: ${T.red}; }
  .ct-hero-sub {
    font-size: 1.05rem; color: ${T.textMid};
    max-width: 500px; line-height: 1.65; margin: 0;
  }

  /* ── Quick-info bar ── */
  .ct-infobar {
    background: ${T.dark2};
    border-top: 1px solid ${T.border};
    border-bottom: 1px solid ${T.border};
  }
  .ct-infobar-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4, 1fr);
  }
  @media(max-width:900px) { .ct-infobar-inner { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:500px) { .ct-infobar-inner { grid-template-columns: 1fr; } }
  .ct-info-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1.5rem;
    border-right: 1px solid ${T.border};
    transition: background .2s;
  }
  .ct-info-item:last-child { border-right: none; }
  .ct-info-item:hover { background: ${T.dark3}; }
  .ct-info-icon-wrap {
    width: 44px; height: 44px; flex-shrink: 0;
    background: rgba(230,57,70,.1);
    border: 1px solid rgba(230,57,70,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.15rem; color: ${T.red};
  }
  .ct-info-label {
    font-family: 'Space Mono', monospace;
    font-size: .58rem; letter-spacing: .18em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .2rem;
  }
  .ct-info-val {
    font-family: 'Space Mono', monospace;
    font-size: .72rem; color: ${T.textHi}; line-height: 1.5;
  }
  .ct-info-val a {
    color: ${T.textHi}; text-decoration: none; transition: color .2s;
  }
  .ct-info-val a:hover { color: ${T.red}; }

  /* ── Main layout ── */
  .ct-main {
    max-width: 1200px; margin: 0 auto;
    padding: 4rem 1.5rem;
    display: grid; grid-template-columns: 1fr 380px;
    gap: 3rem; align-items: start;
  }
  @media(max-width:960px) { .ct-main { grid-template-columns: 1fr; } }

  /* ── Form panel ── */
  .ct-form-panel {
    background: ${T.dark1};
    border: 1px solid ${T.border};
    height: 825px;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
  .ct-form-header {
    padding: 2rem 2rem 0;
  }
  .ct-form-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    text-transform: uppercase; color: #fff; margin: 0 0 .5rem;
  }
  .ct-form-title span { color: ${T.red}; }
  .ct-form-sub {
    font-size: .88rem; color: ${T.textMid}; margin: 0;
    font-family: 'Space Mono', monospace; line-height: 1.65;
  }
  .ct-form-body { padding: 1.75rem 2rem 2rem; }

  /* Input rows */
  .ct-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  @media(max-width:580px) { .ct-field-row { grid-template-columns: 1fr; } }
  .ct-field { margin-bottom: 1.25rem; }
  .ct-field-label {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .5rem;
  }
  .ct-input, .ct-textarea {
    width: 100%; background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .75rem 1rem;
    font-family: 'Space Mono', monospace; font-size: .78rem;
    outline: none; transition: border-color .2s, background .2s;
    display: block;
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: ${T.textDim}; }
  .ct-input:focus, .ct-textarea:focus {
    border-color: rgba(230,57,70,.5);
    background: ${T.dark3};
  }
  .ct-input:disabled, .ct-textarea:disabled { opacity: .45; cursor: not-allowed; }
  .ct-textarea { resize: vertical; min-height: 160px; }

  /* Subject pills */
  .ct-subject-pills { display: flex; flex-wrap: wrap; gap: .5rem; }
  .ct-subject-pill {
    padding: .4rem .9rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textDim};
    font-family: 'Space Mono', monospace; font-size: .62rem;
    letter-spacing: .08em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s, background .2s;
  }
  .ct-subject-pill:hover { border-color: ${T.textDim}; color: ${T.textHi}; }
  .ct-subject-pill.active {
    border-color: ${T.red}; color: ${T.red};
    background: rgba(230,57,70,.08);
  }

  /* Inline alert */
  .ct-alert {
    display: flex; align-items: flex-start; gap: .75rem;
    padding: .85rem 1rem; margin-bottom: 1.25rem;
    border: 1px solid;
    font-family: 'Space Mono', monospace; font-size: .72rem; line-height: 1.5;
  }
  .ct-alert.error   { border-color: rgba(230,57,70,.4); color: ${T.red};   background: rgba(230,57,70,.06); }
  .ct-alert.success { border-color: rgba(42,157,143,.4); color: ${T.teal}; background: rgba(42,157,143,.06); }
  .ct-alert-icon { font-size: 1rem; flex-shrink: 0; margin-top: .05rem; }

  /* Submit button */
  .ct-submit {
    display: inline-flex; align-items: center; gap: .75rem;
    padding: .9rem 2.25rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono', monospace; font-size: .78rem;
    letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer; transition: opacity .2s, transform .2s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .ct-submit:hover:not(:disabled) { opacity: .85; transform: translateY(-2px); }
  .ct-submit:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .ct-submit-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: ctSpin .65s linear infinite;
  }
  @keyframes ctSpin { to { transform: rotate(360deg); } }

  /* ── Sidebar ── */
  .ct-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
  .ct-sidebar-card {
    background: ${T.dark1};
    border: 1px solid ${T.border};
    position: relative; overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
  }
  .ct-sidebar-card::before {
    content: '';
    position: absolute; left: 0; top: 0; width: 3px; height: 100%;
    background: var(--card-accent, ${T.red});
  }
  .ct-sidebar-card-head {
    display: flex; align-items: center; gap: .65rem;
    padding: 1.25rem 1.5rem .85rem;
    border-bottom: 1px solid ${T.border};
  }
  .ct-sidebar-card-icon { font-size: 1.25rem; }
  .ct-sidebar-card-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: .9rem; text-transform: uppercase; color: #fff; margin: 0;
  }
  .ct-sidebar-card-body { padding: 1.25rem 1.5rem; }
  .ct-sidebar-card-body p {
    font-family: 'Space Mono', monospace;
    font-size: .72rem; color: ${T.textMid}; line-height: 1.7; margin: 0 0 1rem;
  }
  .ct-sidebar-card-body p:last-child { margin: 0; }
  .ct-sidebar-link {
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .55rem 1rem;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .1em; text-transform: uppercase;
    text-decoration: none; transition: border-color .2s, color .2s;
  }
  .ct-sidebar-link:hover { border-color: ${T.red}; color: ${T.red}; }

  /* ── Hours table ── */
  .ct-hours-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: .45rem 0;
    border-bottom: 1px solid ${T.border};
    font-family: 'Space Mono', monospace; font-size: .68rem;
  }
  .ct-hours-row:last-child { border-bottom: none; }
  .ct-hours-day { color: ${T.textDim}; text-transform: uppercase; letter-spacing: .08em; }
  .ct-hours-time { color: ${T.textHi}; }
  .ct-hours-closed { color: ${T.red}; }
  .ct-hours-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${T.teal}; flex-shrink: 0;
    box-shadow: 0 0 6px ${T.teal};
    animation: ctPulse 2s ease-in-out infinite;
  }
  @keyframes ctPulse {
    0%,100% { opacity:1; } 50% { opacity:.4; }
  }

  /* ── Map section ── */
  .ct-map-section {
    background: ${T.dark0};
    border-top: 1px solid ${T.border};
    padding: 4rem 0 0;
  }
  .ct-map-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 0; }
  .ct-map-header { margin-bottom: 1.5rem; }
  .ct-map-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(1.5rem,3vw,2.25rem);
    text-transform: uppercase; color: #fff; margin: 0;
  }
  .ct-map-title span { color: ${T.red}; }
  .ct-map-wrap {
    border: 1px solid ${T.border};
    border-bottom: none;
    position: relative; overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
  }
  .ct-map-wrap iframe { display: block; width: 100%; border: 0; }
  .ct-map-overlay {
    position: absolute; top: 1rem; left: 1rem;
    background: ${T.dark1}; border: 1px solid ${T.border};
    border-left: 3px solid ${T.red};
    padding: .85rem 1.1rem;
  }
  .ct-map-overlay-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: .85rem; text-transform: uppercase; color: #fff;
  }
  .ct-map-overlay-addr {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; color: ${T.textMid};
    margin-top: .2rem;
  }

  /* ── Animated bottom border ── */
  .ct-animated-border {
    height: 3px; width: 100%;
    background: linear-gradient(90deg, ${T.red}, ${T.orange}, ${T.teal}, ${T.red});
    background-size: 300% 100%;
    animation: ctGrad 4s linear infinite;
  }
  @keyframes ctGrad { to { background-position: 300% center; } }
`;
