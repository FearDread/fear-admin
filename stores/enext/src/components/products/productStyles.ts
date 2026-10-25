// components/products/productStyles.ts
//
// All `pd-*` styles for the product details page + gallery.
// Fonts come from next/font CSS variables set in app/layout.tsx — no @import here.

import { T, FONT_ANTON, FONT_MONO } from '@/components/styles';

const HI = 'rgba(255,255,255,0.18)';

export const productStyles = `
/* ───────── Page shell ───────── */
.pd-page { padding: 1.5rem 0 4rem; }
.pd-crumbs { padding: .9rem 0; border-bottom: 1px solid ${T.border}; background: ${T.dark1}; }
.pd-crumbs ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.pd-crumbs li { font-family: ${FONT_MONO}; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.textDim}; display: flex; align-items: center; gap: .5rem; }
.pd-crumbs li + li::before { content: '✦'; color: ${T.red}; font-size: .55rem; }
.pd-crumbs a { color: ${T.textDim}; text-decoration: none; transition: color .2s; }
.pd-crumbs a:hover { color: #fff; }
.pd-crumbs [aria-current] { color: ${T.red}; max-width: 38ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.pd-hero { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr); gap: 3.25rem; align-items: start; padding-top: 2rem; }
.pd-gallery-col { position: sticky; top: 9.5rem; }
@media (max-width: 991px) {
  .pd-hero { grid-template-columns: minmax(0, 1fr); gap: 1.75rem; padding-top: 1rem; }
  .pd-gallery-col { position: static; }
}

/* ───────── Gallery ───────── */
.pd-gallery { display: grid; grid-template-columns: 84px minmax(0, 1fr); gap: .9rem; align-items: start; }
.pd-gallery.is-single { grid-template-columns: minmax(0, 1fr); }

.pd-gallery-thumbs {
  display: flex; flex-direction: column; gap: .6rem;
  max-height: 620px; overflow-y: auto; scrollbar-width: thin;
  scrollbar-color: ${T.border} transparent; padding-right: 2px;
}
.pd-gallery-thumb {
  position: relative; flex: 0 0 auto; width: 100%; aspect-ratio: 4 / 5;
  padding: 0; background: ${T.dark2}; border: 1px solid ${T.border};
  cursor: pointer; overflow: hidden; opacity: .6;
  transition: opacity .2s, border-color .2s, transform .2s;
}
.pd-gallery-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pd-gallery-thumb:hover { opacity: 1; border-color: ${HI}; }
.pd-gallery-thumb.active { opacity: 1; border-color: ${T.red}; box-shadow: 0 0 0 1px ${T.red}; }
.pd-gallery-thumb:focus-visible { outline: 2px solid ${T.red}; outline-offset: 2px; }

.pd-gallery-main {
  position: relative; aspect-ratio: 4 / 5; overflow: hidden;
  background: radial-gradient(circle at 50% 35%, ${T.dark3} 0%, ${T.dark1} 70%);
  border: 1px solid ${T.border}; border-top: 2px solid ${T.red};
  cursor: zoom-in; touch-action: pan-y; user-select: none;
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
}
.pd-gallery-main:focus-visible { outline: 2px solid ${T.red}; outline-offset: 3px; }
.pd-gallery-main img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: contain; display: block; padding: 1rem;
  transition: transform .18s ease-out, opacity .25s; pointer-events: none;
}
@media (hover: hover) {
  .pd-gallery-main.is-zooming img { transform: scale(2.3); transition: transform .12s ease-out; padding: 0; }
  .pd-gallery-main.is-zooming { cursor: zoom-out; }
}

.pd-gallery-badges { position: absolute; top: .9rem; left: .9rem; z-index: 3; display: flex; flex-direction: column; gap: .4rem; }
.pd-gallery-badge {
  font-family: ${FONT_ANTON}; font-size: .72rem; letter-spacing: .14em; text-transform: uppercase;
  padding: .3rem .65rem; color: #fff; background: ${T.red};
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
}
.pd-gallery-badge.dark { background: #000; border: 1px solid ${T.border}; }

.pd-gallery-counter {
  position: absolute; bottom: .9rem; left: .9rem; z-index: 3;
  font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .14em;
  color: ${T.textMid}; background: rgba(0,0,0,.65); border: 1px solid ${T.border}; padding: .25rem .55rem;
}
.pd-gallery-hint {
  position: absolute; bottom: .9rem; right: .9rem; z-index: 3;
  font-family: ${FONT_MONO}; font-size: .6rem; letter-spacing: .12em; text-transform: uppercase;
  color: ${T.textMid}; background: rgba(0,0,0,.65); border: 1px solid ${T.border}; padding: .25rem .55rem;
  display: inline-flex; align-items: center; gap: .35rem; pointer-events: none;
}
@media (hover: none) { .pd-gallery-hint { display: none; } }

.pd-gallery-nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 3;
  width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.7); border: 1px solid ${T.border}; color: #fff; font-size: 1.4rem; line-height: 1;
  cursor: pointer; opacity: 0; transition: opacity .2s, background .2s, border-color .2s;
}
.pd-gallery-main:hover .pd-gallery-nav, .pd-gallery-nav:focus-visible { opacity: 1; }
@media (hover: none) { .pd-gallery-nav { opacity: .85; width: 36px; height: 36px; } }
.pd-gallery-nav:hover { background: ${T.red}; border-color: ${T.red}; }
.pd-gallery-nav.prev { left: .6rem; }
.pd-gallery-nav.next { right: .6rem; }

@media (max-width: 640px) {
  .pd-gallery { grid-template-columns: minmax(0, 1fr); }
  .pd-gallery-thumbs { order: 2; flex-direction: row; max-height: none; overflow-x: auto; overflow-y: hidden; padding: 0 0 4px; }
  .pd-gallery-thumb { width: 66px; }
}

/* ───────── Lightbox ───────── */
.pd-lightbox { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,.94); display: flex; flex-direction: column; animation: pdFade .18s ease; }
@keyframes pdFade { from { opacity: 0 } to { opacity: 1 } }
.pd-lightbox-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; border-bottom: 1px solid ${T.border}; }
.pd-lightbox-title { font-family: ${FONT_ANTON}; font-size: .95rem; letter-spacing: .06em; text-transform: uppercase; color: #fff; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pd-lightbox-count { font-family: ${FONT_MONO}; font-size: .65rem; letter-spacing: .14em; color: ${T.textDim}; white-space: nowrap; }
.pd-lightbox-close { width: 38px; height: 38px; background: none; border: 1px solid ${T.border}; color: #fff; font-size: 1.05rem; cursor: pointer; flex-shrink: 0; transition: border-color .2s, color .2s; }
.pd-lightbox-close:hover { border-color: ${T.red}; color: ${T.red}; }
.pd-lightbox-stage { position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 1rem 4rem; touch-action: pan-y; }
.pd-lightbox-stage img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; user-select: none; }
.pd-lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 46px; height: 46px; background: rgba(0,0,0,.6); border: 1px solid ${T.border}; color: #fff; font-size: 1.6rem; cursor: pointer; transition: background .2s, border-color .2s; }
.pd-lightbox-nav:hover { background: ${T.red}; border-color: ${T.red}; }
.pd-lightbox-nav.prev { left: 1rem; }
.pd-lightbox-nav.next { right: 1rem; }
.pd-lightbox-strip { display: flex; justify-content: center; gap: .5rem; padding: .75rem 1rem 1rem; overflow-x: auto; border-top: 1px solid ${T.border}; }
.pd-lightbox-strip button { width: 56px; aspect-ratio: 4 / 5; flex: 0 0 auto; padding: 0; background: ${T.dark2}; border: 1px solid ${T.border}; opacity: .55; cursor: pointer; transition: opacity .2s, border-color .2s; }
.pd-lightbox-strip button img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pd-lightbox-strip button.active, .pd-lightbox-strip button:hover { opacity: 1; border-color: ${T.red}; }
@media (max-width: 640px) { .pd-lightbox-stage { padding: .5rem; } .pd-lightbox-nav { width: 38px; height: 38px; } .pd-lightbox-nav.prev { left: .4rem; } .pd-lightbox-nav.next { right: .4rem; } }

/* ───────── Info column ───────── */
.pd-info-col { min-width: 0; }
.pd-brand-row { display: flex; align-items: center; gap: .6rem; margin-bottom: .85rem; flex-wrap: wrap; }
.pd-brand-badge { font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .18em; text-transform: uppercase; color: ${T.red}; border-left: 2px solid ${T.red}; padding-left: .55rem; }
.pd-brand-fav { background: none; border: 1px solid ${T.border}; color: ${T.textDim}; width: 28px; height: 28px; cursor: pointer; font-size: .9rem; transition: color .2s, border-color .2s; }
.pd-brand-fav:hover, .pd-brand-fav.active { color: ${T.red}; border-color: ${T.red}; }
.pd-cat-link { font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .14em; text-transform: uppercase; color: ${T.textDim}; text-decoration: none; margin-left: auto; transition: color .2s; }
.pd-cat-link:hover { color: #fff; }

.pd-title { font-family: ${FONT_ANTON}; font-size: clamp(1.9rem, 4vw, 3rem); text-transform: uppercase; line-height: 1.02; letter-spacing: .01em; color: #fff; margin: 0 0 1rem; }

.pd-rating-row { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
.pd-stars { display: inline-flex; gap: 2px; }
.pd-star { color: ${T.border}; font-size: 1rem; line-height: 1; }
.pd-star.filled { color: #f4a261; }
.pd-star.interactive { cursor: pointer; transition: transform .1s; }
.pd-star.interactive:hover { transform: scale(1.2); }
.pd-rating-count { font-family: ${FONT_MONO}; font-size: .65rem; letter-spacing: .08em; color: ${T.textDim}; text-decoration: none; border-bottom: 1px dashed ${T.border}; }
.pd-rating-count:hover { color: #fff; }

.pd-price-panel { display: flex; align-items: baseline; flex-wrap: wrap; gap: .85rem; padding: 1.1rem 1.25rem; background: ${T.dark1}; border: 1px solid ${T.border}; border-left: 3px solid ${T.red}; margin-bottom: 1.1rem; }
.pd-price-main { font-family: ${FONT_ANTON}; font-size: clamp(2rem, 4.5vw, 2.9rem); color: #fff; line-height: 1; }
.pd-price-original { font-family: ${FONT_MONO}; font-size: .95rem; color: ${T.textDim}; text-decoration: line-through; }
.pd-price-badge { font-family: ${FONT_ANTON}; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: ${T.red}; padding: .25rem .6rem; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%); }
.pd-price-save { font-family: ${FONT_MONO}; font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; color: ${T.teal}; margin-left: auto; }

.pd-badges { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.25rem; }
.pd-badge { font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; padding: .3rem .7rem; border: 1px solid ${T.border}; color: ${T.textMid}; background: ${T.dark2}; display: inline-flex; align-items: center; gap: .4rem; }
.pd-badge.in-stock { color: ${T.teal}; border-color: rgba(42,157,143,.4); background: rgba(42,157,143,.07); }
.pd-badge.low-stock { color: #f4a261; border-color: rgba(244,162,97,.4); background: rgba(244,162,97,.07); }
.pd-badge.out-of-stock { color: ${T.red}; border-color: rgba(179,14,28,.5); background: rgba(179,14,28,.08); }
.pd-badge.in-cart { color: #4dabf7; border-color: rgba(77,171,247,.4); }
.pd-badge.in-wishlist { color: ${T.red}; border-color: rgba(179,14,28,.4); }
.pd-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.pd-desc { font-size: .95rem; line-height: 1.75; color: ${T.textMid}; margin: 0 0 1.5rem; }

.pd-spec-table { display: grid; grid-template-columns: max-content 1fr; border: 1px solid ${T.border}; margin-bottom: 1.5rem; background: ${T.dark1}; }
.pd-spec-key, .pd-spec-val { padding: .6rem .9rem; border-bottom: 1px solid ${T.border}; font-family: ${FONT_MONO}; font-size: .7rem; }
.pd-spec-key { color: ${T.red}; letter-spacing: .14em; text-transform: uppercase; font-size: .6rem; border-right: 1px solid ${T.border}; }
.pd-spec-val { color: ${T.textHi}; word-break: break-word; }
.pd-spec-table > :nth-last-child(-n+2) { border-bottom: none; }

/* Purchase row */
.pd-buy-row { display: flex; align-items: stretch; gap: .75rem; flex-wrap: wrap; margin-bottom: 1rem; }
.pd-qty { display: inline-flex; align-items: stretch; border: 1px solid ${T.border}; background: ${T.dark2}; }
.pd-qty button { width: 40px; background: none; border: none; color: ${T.textMid}; font-size: 1.1rem; cursor: pointer; transition: background .15s, color .15s; }
.pd-qty button:hover:not(:disabled) { background: ${T.dark3}; color: #fff; }
.pd-qty button:disabled { opacity: .3; cursor: not-allowed; }
.pd-qty output { min-width: 44px; display: flex; align-items: center; justify-content: center; font-family: ${FONT_MONO}; font-size: .85rem; color: #fff; border-left: 1px solid ${T.border}; border-right: 1px solid ${T.border}; }

.pd-btn-primary {
  flex: 1 1 200px; display: inline-flex; align-items: center; justify-content: center; gap: .6rem;
  padding: .95rem 1.5rem; background: ${T.red}; border: none; color: #fff; cursor: pointer;
  font-family: ${FONT_MONO}; font-size: .78rem; letter-spacing: .14em; text-transform: uppercase;
  transition: opacity .2s, transform .2s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.pd-btn-primary:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
.pd-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.pd-btn-primary.added { background: ${T.teal}; }
.pd-btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  padding: .95rem 1.1rem; background: transparent; border: 1px solid ${T.border}; color: ${T.textMid}; cursor: pointer;
  font-family: ${FONT_MONO}; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase;
  transition: border-color .2s, color .2s, background .2s;
}
.pd-btn-ghost:hover:not(:disabled) { border-color: ${T.red}; color: ${T.red}; }
.pd-btn-ghost.active { border-color: ${T.red}; color: ${T.red}; background: rgba(179,14,28,.08); }
.pd-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }
.pd-spinner-inline { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: pdSpin .65s linear infinite; }

/* Trust grid */
.pd-trust { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: ${T.border}; border: 1px solid ${T.border}; margin: 1.5rem 0; }
.pd-trust-item { display: flex; align-items: center; gap: .75rem; padding: .85rem 1rem; background: ${T.dark1}; }
.pd-trust-icon { font-size: 1.15rem; flex-shrink: 0; }
.pd-trust-title { display: block; font-family: ${FONT_ANTON}; font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: #fff; }
.pd-trust-sub { display: block; font-family: ${FONT_MONO}; font-size: .58rem; color: ${T.textDim}; letter-spacing: .04em; margin-top: .15rem; }
@media (max-width: 480px) { .pd-trust { grid-template-columns: 1fr; } }

.pd-hr { height: 1px; background: ${T.border}; margin: 1.25rem 0; }
.pd-share-row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.pd-share-label { font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .16em; text-transform: uppercase; color: ${T.textDim}; margin-right: .35rem; }
.pd-share-btn { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; background: ${T.dark2}; border: 1px solid ${T.border}; color: ${T.textMid}; text-decoration: none; font-family: ${FONT_MONO}; font-size: .68rem; font-weight: 700; cursor: pointer; transition: border-color .2s, color .2s, background .2s; }
.pd-share-btn:hover { border-color: ${T.red}; background: ${T.red}; color: #fff; }

/* ───────── Tabs ───────── */
.pd-tabs-section { margin-top: 4rem; }
.pd-tab-bar { display: flex; gap: 0; border-bottom: 1px solid ${T.border}; overflow-x: auto; scrollbar-width: none; }
.pd-tab { position: relative; display: inline-flex; align-items: center; gap: .5rem; padding: 1rem 1.5rem; background: none; border: none; cursor: pointer; white-space: nowrap; font-family: ${FONT_ANTON}; font-size: .9rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.textDim}; transition: color .2s; }
.pd-tab::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: ${T.red}; transform: scaleX(0); transition: transform .25s; }
.pd-tab:hover { color: #fff; }
.pd-tab.active { color: #fff; }
.pd-tab.active::after { transform: scaleX(1); }
.pd-tab-count { font-family: ${FONT_MONO}; font-size: .6rem; padding: .1rem .4rem; background: ${T.dark3}; border: 1px solid ${T.border}; color: ${T.textMid}; }
.pd-tab-body { padding: 2rem; }
.pd-tab-body[hidden] { display: none; }
.pd-full-desc { font-size: .95rem; line-height: 1.85; color: ${T.textMid}; max-width: 75ch; margin: 0 0 1.25rem; white-space: pre-line; }
.pd-feature-list { list-style: none; margin: 0 0 1.5rem; padding: 0; max-width: 75ch; }
.pd-feature-list li { position: relative; padding: .55rem 0 .55rem 1.5rem; border-bottom: 1px solid ${T.border}; font-size: .9rem; color: ${T.textMid}; }
.pd-feature-list li::before { content: '✦'; position: absolute; left: 0; top: .7rem; font-size: .6rem; color: ${T.red}; }
.pd-tags { display: flex; flex-wrap: wrap; gap: .5rem; }
.pd-tag { padding: .35rem .8rem; background: ${T.dark2}; border: 1px solid ${T.border}; color: ${T.textDim}; text-decoration: none; font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; transition: border-color .2s, color .2s; }
.pd-tag:hover { border-color: ${T.red}; color: ${T.red}; }

/* ───────── Reviews ───────── */
.pd-reviews-layout { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 3rem; align-items: start; }
@media (max-width: 900px) { .pd-reviews-layout { grid-template-columns: minmax(0, 1fr); gap: 2rem; } }
.pd-review-summary { display: grid; grid-template-columns: auto 1fr; gap: 1.75rem; align-items: center; padding: 1.25rem 1.5rem; background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid ${T.red}; margin-bottom: 1.5rem; }
@media (max-width: 480px) { .pd-review-summary { grid-template-columns: 1fr; } }
.pd-review-avg { text-align: center; }
.pd-review-avg-num { font-family: ${FONT_ANTON}; font-size: 3.2rem; line-height: 1; color: #fff; display: block; }
.pd-review-avg-sub { font-family: ${FONT_MONO}; font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.textDim}; }
.pd-dist-row { display: grid; grid-template-columns: 2.2rem 1fr 2rem; align-items: center; gap: .6rem; font-family: ${FONT_MONO}; font-size: .62rem; color: ${T.textDim}; margin-bottom: .35rem; }
.pd-dist-bar { height: 6px; background: ${T.dark3}; border: 1px solid ${T.border}; }
.pd-dist-fill { height: 100%; background: #f4a261; }
.pd-review-list { display: flex; flex-direction: column; gap: .85rem; }
.pd-review-item { padding: 1.25rem 1.5rem; background: ${T.dark1}; border: 1px solid ${T.border}; border-left: 3px solid ${T.border}; transition: border-left-color .2s; }
.pd-review-item:hover { border-left-color: ${T.red}; }
.pd-review-header { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: .75rem; flex-wrap: wrap; }
.pd-reviewer-name { font-family: ${FONT_ANTON}; font-size: .95rem; letter-spacing: .05em; text-transform: uppercase; color: #fff; margin: 0 0 .3rem; }
.pd-verified-badge { font-family: ${FONT_MONO}; font-size: .56rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.teal}; margin-left: .6rem; }
.pd-review-date { font-family: ${FONT_MONO}; font-size: .6rem; letter-spacing: .08em; color: ${T.textDim}; }
.pd-review-title { font-weight: 600; color: ${T.textHi}; margin: 0 0 .4rem; font-size: .92rem; }
.pd-review-body { margin: 0; font-size: .88rem; line-height: 1.7; color: ${T.textMid}; }
.pd-review-empty { padding: 2rem; text-align: center; border: 1px dashed ${T.border}; background: ${T.dark1}; font-family: ${FONT_MONO}; font-size: .72rem; color: ${T.textDim}; }

.pd-review-form { position: sticky; top: 9.5rem; padding: 1.5rem; background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid ${T.red}; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%); }
@media (max-width: 900px) { .pd-review-form { position: static; } }
.pd-review-form-title { font-family: ${FONT_ANTON}; font-size: 1.15rem; text-transform: uppercase; letter-spacing: .05em; color: #fff; margin: 0 0 1.25rem; }
.pd-field { margin-bottom: 1rem; }
.pd-label { display: block; font-family: ${FONT_MONO}; font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; color: ${T.red}; margin-bottom: .4rem; }
.pd-input { width: 100%; background: ${T.dark2}; border: 1px solid ${T.border}; color: ${T.textHi}; padding: .7rem .85rem; font-family: ${FONT_MONO}; font-size: .75rem; outline: none; transition: border-color .2s, background .2s; display: block; }
.pd-input::placeholder { color: ${T.textDim}; }
.pd-input:focus { border-color: rgba(179,14,28,.6); background: ${T.dark3}; }
textarea.pd-input { resize: vertical; min-height: 110px; }

/* ───────── Sticky mobile buy bar ───────── */
.pd-sticky-bar { display: none; }
@media (max-width: 991px) {
  .pd-sticky-bar {
    display: flex; align-items: center; gap: .85rem; position: fixed; left: 0; right: 0; bottom: 0; z-index: 900;
    padding: .7rem 1rem calc(.7rem + env(safe-area-inset-bottom)); background: rgba(10,10,10,.96); backdrop-filter: blur(8px);
    border-top: 2px solid ${T.red}; transform: translateY(110%); transition: transform .3s;
  }
  .pd-sticky-bar.show { transform: translateY(0); }
  .pd-sticky-info { flex: 1; min-width: 0; }
  .pd-sticky-title { display: block; font-family: ${FONT_MONO}; font-size: .62rem; letter-spacing: .06em; text-transform: uppercase; color: ${T.textMid}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd-sticky-price { font-family: ${FONT_ANTON}; font-size: 1.25rem; color: #fff; }
  .pd-sticky-bar .pd-btn-primary { flex: 0 0 auto; padding: .8rem 1.25rem; }
  .pd-page { padding-bottom: 5rem; }
}

/* ───────── Shared bits ───────── */
.pd-spinner { width: 40px; height: 40px; border: 2px solid ${T.border}; border-top-color: ${T.red}; border-radius: 50%; animation: pdSpin .75s linear infinite; }
@keyframes pdSpin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .pd-gallery-main img, .pd-sticky-bar, .pd-tab::after, .pd-lightbox { transition: none; animation: none; }
}
.pd-gallery.is-single {
    width: 100% !important;
}
`;
