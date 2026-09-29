/**
 * components/account/styles.ts
 */
import { T } from '@/components/styles';

const ANTON = "var(--font-anton), 'Anton', Impact, sans-serif";
const MONO = "var(--font-space-mono), 'Space Mono', monospace";
const CLIP_LG = 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)';
const CLIP_BTN = 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))';

export { T };

export const accountStyles = `
.acct-page { min-height: 100vh; --acct-accent: ${T.red}; }

/* ── Hero ── */
.acct-hero { position: relative; background: ${T.dark0}; padding: 5rem 0 3.5rem; overflow: hidden; border-bottom: 1px solid ${T.border}; }
.acct-hero::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px); background-size: 22px 22px; pointer-events: none; }
.acct-hero-stripe { position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: var(--acct-accent); }
.acct-hero-ghost { position: absolute; right: -1rem; top: 50%; transform: translateY(-50%); font-family: ${ANTON}; font-size: clamp(5rem,14vw,11rem); text-transform: uppercase; color: rgba(255,255,255,.025); line-height: 1; user-select: none; pointer-events: none; white-space: nowrap; }
.acct-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
.acct-crumb { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.acct-crumb a, .acct-crumb span { font-family: ${MONO}; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; }
.acct-crumb a { color: ${T.textDim}; transition: color .2s; }
.acct-crumb a:hover { color: #fff; }
.acct-crumb .sep { color: var(--acct-accent); font-size: .6rem; }
.acct-crumb .cur { color: var(--acct-accent); }
.acct-eyebrow { font-family: ${MONO}; font-size: .68rem; letter-spacing: .22em; text-transform: uppercase; color: var(--acct-accent); display: block; margin-bottom: .6rem; }
.acct-hero-title { font-family: ${ANTON}; font-size: clamp(2.5rem,8vw,5.5rem); text-transform: uppercase; line-height: .92; color: #fff; margin: 0; -webkit-text-stroke: 1.5px var(--acct-accent); }
.acct-hero-title span { color: var(--acct-accent); -webkit-text-stroke: 0; }

/* ── Layout ── */
.acct-layout { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem 5rem; display: grid; grid-template-columns: 280px minmax(0,1fr); gap: 2rem; align-items: start; }
@media (max-width: 900px) { .acct-layout { grid-template-columns: 1fr; } }
.acct-main { min-width: 0; }
.acct-animated-border { height: 3px; width: 100%; background: linear-gradient(90deg, ${T.red}, ${T.orange}, ${T.teal}, ${T.red}); background-size: 300% 100%; animation: acctGrad 4s linear infinite; }
@keyframes acctGrad { to { background-position: 300% center; } }

/* ── Sidebar ── */
.acct-sb { background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid ${T.red}; clip-path: ${CLIP_LG}; position: sticky; top: 8rem; }
@media (max-width: 900px) { .acct-sb { position: static; } }
.acct-sb-profile { padding: 1.75rem 1.5rem 1.25rem; border-bottom: 1px solid ${T.border}; display: flex; flex-direction: column; align-items: center; text-align: center; }
.acct-avatar { width: 80px; height: 80px; border: 2px solid ${T.border}; border-radius: 50%; padding: 2px; background: ${T.dark2}; margin-bottom: 1rem; position: relative; }
.acct-avatar img, .acct-avatar-initials { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }
.acct-avatar-initials { background: ${T.dark3}; display: flex; align-items: center; justify-content: center; font-family: ${ANTON}; font-size: 1.5rem; color: ${T.red}; }
.acct-avatar-dot { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%; background: ${T.teal}; border: 2px solid ${T.dark1}; }
.acct-sb-name { font-family: ${ANTON}; font-size: 1.05rem; text-transform: uppercase; color: ${T.textHi}; letter-spacing: .03em; margin: 0 0 .25rem; }
.acct-sb-email { font-family: ${MONO}; font-size: .62rem; color: ${T.textDim}; margin: 0 0 .6rem; word-break: break-all; }
.acct-sb-login { font-family: ${MONO}; font-size: .57rem; letter-spacing: .1em; text-transform: uppercase; color: ${T.textDim}; padding: .2rem .6rem; background: ${T.dark2}; border: 1px solid ${T.border}; }
.acct-sb-login b { color: ${T.teal}; font-weight: normal; margin-right: .3rem; }
.acct-nav { padding: .5rem 0; }
.acct-nav-item { display: flex; align-items: center; justify-content: space-between; padding: .7rem 1.25rem; font-family: ${MONO}; font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: ${T.textMid}; text-decoration: none; border-left: 3px solid transparent; transition: color .15s, background .15s, padding-left .15s; }
.acct-nav-item:hover { color: ${T.textHi}; background: rgba(255,255,255,.03); padding-left: 1.5rem; }
.acct-nav-item.active { color: ${T.textHi}; border-left-color: ${T.red}; background: rgba(179,14,28,.08); padding-left: 1.5rem; }
.acct-nav-left { display: flex; align-items: center; gap: .65rem; }
.acct-nav-icon { width: 16px; text-align: center; color: ${T.textDim}; font-size: .85rem; }
.acct-nav-item.active .acct-nav-icon, .acct-nav-item.active .acct-nav-arrow { color: ${T.red}; }
.acct-nav-arrow { font-size: .55rem; color: ${T.textDim}; }
.acct-nav-divider { height: 1px; background: ${T.border}; margin: .35rem .5rem; }
.acct-logout { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: .7rem 1.25rem; background: none; border: none; border-left: 3px solid transparent; font-family: ${MONO}; font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: rgba(230,57,70,.7); cursor: pointer; transition: color .2s, background .2s, padding-left .15s; }
.acct-logout:hover { color: #e63946; background: rgba(230,57,70,.06); border-left-color: #e63946; padding-left: 1.5rem; }

/* ── Panels ── */
.acct-panel { background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid var(--pa, var(--acct-accent)); clip-path: ${CLIP_LG}; margin-bottom: 1.5rem; }
.acct-panel-head { padding: 1rem 1.5rem .85rem; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.acct-panel-title { font-family: ${ANTON}; font-size: .95rem; text-transform: uppercase; color: ${T.textHi}; margin: 0; }
.acct-panel-body { padding: 1.5rem; }
.acct-section-head { display: flex; align-items: center; gap: .85rem; margin-bottom: 1.1rem; }
.acct-section-head h3 { font-family: ${ANTON}; font-size: .95rem; text-transform: uppercase; color: ${T.textHi}; margin: 0; }
.acct-section-head i { flex: 1; height: 1px; background: ${T.border}; }

/* ── Stats / info ── */
.acct-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
@media (max-width: 640px) { .acct-stats { grid-template-columns: 1fr; } }
.acct-stat { background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid var(--sa, ${T.red}); padding: 1.1rem 1.25rem; clip-path: ${CLIP_LG}; }
.acct-stat-val { font-family: ${ANTON}; font-size: 2rem; color: var(--sa, ${T.red}); line-height: 1; display: block; margin-bottom: .3rem; }
.acct-stat-lbl { font-family: ${MONO}; font-size: .6rem; letter-spacing: .14em; text-transform: uppercase; color: ${T.textDim}; }
.acct-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: ${T.border}; border: 1px solid ${T.border}; margin-bottom: 2rem; clip-path: ${CLIP_LG}; }
@media (max-width: 540px) { .acct-info-grid { grid-template-columns: 1fr; } }
.acct-info-cell { background: ${T.dark1}; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: .25rem; }
.acct-info-lbl { font-family: ${MONO}; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; color: ${T.red}; }
.acct-info-val { font-family: ${MONO}; font-size: .78rem; color: ${T.textHi}; word-break: break-word; }
.acct-info-val.empty { color: ${T.textDim}; font-style: italic; }
.acct-welcome { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem 1.5rem; background: ${T.dark2}; border: 1px solid ${T.border}; border-left: 3px solid ${T.red}; margin-bottom: 2rem; clip-path: ${CLIP_LG}; }
.acct-welcome h2 { font-family: ${ANTON}; font-size: 1rem; text-transform: uppercase; color: ${T.textHi}; margin: 0 0 .3rem; }
.acct-welcome h2 span { color: ${T.red}; }
.acct-welcome p { font-family: ${MONO}; font-size: .72rem; color: ${T.textMid}; line-height: 1.6; margin: 0; }
.acct-welcome a { color: ${T.red}; text-decoration: none; }
.acct-welcome a:hover { text-decoration: underline; }

/* ── Buttons ── */
.acct-btn { display: inline-flex; align-items: center; justify-content: center; gap: .55rem; padding: .7rem 1.4rem; background: var(--pa, ${T.red}); border: 1px solid transparent; color: #fff; font-family: ${MONO}; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: opacity .2s, transform .2s, border-color .2s, color .2s; clip-path: ${CLIP_BTN}; }
.acct-btn:hover:not(:disabled) { opacity: .85; transform: translateY(-1px); color: #fff; }
.acct-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
.acct-btn--ghost { background: transparent; border-color: ${T.border}; color: ${T.textMid}; clip-path: none; }
.acct-btn--ghost:hover:not(:disabled) { border-color: ${T.textDim}; color: ${T.textHi}; opacity: 1; }
.acct-btn--danger { background: transparent; border-color: rgba(230,57,70,.45); color: #e63946; clip-path: none; }
.acct-btn--danger:hover:not(:disabled) { background: rgba(230,57,70,.08); color: #e63946; opacity: 1; }
.acct-btn--sm { padding: .45rem .85rem; font-size: .6rem; letter-spacing: .09em; }
.acct-actions { display: flex; flex-wrap: wrap; gap: .65rem; margin-bottom: 2rem; }
.acct-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: acctSpin .65s linear infinite; flex-shrink: 0; }
@keyframes acctSpin { to { transform: rotate(360deg); } }

/* ── Forms ── */
.acct-field { margin-bottom: 1.1rem; }
.acct-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 560px) { .acct-field-row { grid-template-columns: 1fr; } }
.acct-field--full { grid-column: 1 / -1; }
.acct-label { font-family: ${MONO}; font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; color: var(--pa, ${T.red}); display: block; margin-bottom: .45rem; }
.acct-label em { opacity: .5; font-style: normal; margin-left: .2rem; }
.acct-input, .acct-select { width: 100%; display: block; background: ${T.dark2}; border: 1px solid ${T.border}; color: ${T.textHi}; padding: .72rem .9rem; font-family: ${MONO}; font-size: .75rem; outline: none; transition: border-color .2s, background .2s; border-radius: 0; }
.acct-input::placeholder { color: ${T.textDim}; }
.acct-input:focus, .acct-select:focus { border-color: rgba(179,14,28,.6); background: ${T.dark3}; }
.acct-input.err, .acct-select.err { border-color: rgba(230,57,70,.6); }
.acct-input:disabled, .acct-input[readonly] { opacity: .5; cursor: not-allowed; }
.acct-select { -webkit-appearance: none; appearance: none; padding-right: 2rem; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right .8rem center; }
.acct-hint { font-family: ${MONO}; font-size: .6rem; color: ${T.textDim}; margin-top: .35rem; }
.acct-err { font-family: ${MONO}; font-size: .62rem; color: #e63946; margin-top: .35rem; }
.acct-err::before { content: '⚠ '; }
.acct-pw { position: relative; }
.acct-pw .acct-input { padding-right: 3rem; }
.acct-pw-toggle { position: absolute; right: 0; top: 0; bottom: 0; width: 44px; background: none; border: none; border-left: 1px solid ${T.border}; color: ${T.textDim}; cursor: pointer; transition: color .2s; }
.acct-pw-toggle:hover { color: #fff; }
.acct-check { display: flex; align-items: center; gap: .7rem; cursor: pointer; font-family: ${MONO}; font-size: .68rem; color: ${T.textMid}; user-select: none; }
.acct-check input { position: absolute; opacity: 0; pointer-events: none; }
.acct-check-box { width: 18px; height: 18px; flex-shrink: 0; background: ${T.dark2}; border: 1px solid ${T.border}; display: flex; align-items: center; justify-content: center; transition: background .2s, border-color .2s; }
.acct-check input:checked + .acct-check-box { background: ${T.red}; border-color: ${T.red}; }
.acct-check input:checked + .acct-check-box::after { content: '✓'; font-size: .7rem; color: #fff; }
.acct-check input:focus-visible + .acct-check-box { outline: 2px solid ${T.textMid}; outline-offset: 2px; }
.acct-form-actions { display: flex; gap: .75rem; flex-wrap: wrap; padding-top: .5rem; }

/* ── Alerts ── */
.acct-alert { display: flex; align-items: flex-start; gap: .7rem; padding: .8rem 1rem; margin-bottom: 1.25rem; border: 1px solid; font-family: ${MONO}; font-size: .7rem; line-height: 1.5; }
.acct-alert.error { border-color: rgba(230,57,70,.4); color: #e63946; background: rgba(230,57,70,.06); }
.acct-alert.success { border-color: rgba(42,157,143,.4); color: ${T.teal}; background: rgba(42,157,143,.06); }
.acct-alert.info { border-color: ${T.border}; color: ${T.textMid}; background: ${T.dark2}; }
.acct-alert button { margin-left: auto; background: none; border: none; color: inherit; opacity: .6; cursor: pointer; }
.acct-alert button:hover { opacity: 1; }

/* ── Chips / pills ── */
.acct-chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.25rem; }
.acct-chip { padding: .4rem .9rem; background: ${T.dark2}; border: 1px solid ${T.border}; color: ${T.textDim}; font-family: ${MONO}; font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; transition: border-color .2s, color .2s, background .2s; }
.acct-chip:hover { border-color: ${T.textDim}; color: ${T.textHi}; }
.acct-chip.active { border-color: ${T.red}; color: ${T.red}; background: rgba(179,14,28,.1); }
.acct-chip b { font-weight: normal; opacity: .6; margin-left: .35rem; }
.acct-pill { display: inline-flex; align-items: center; gap: .35rem; padding: .2rem .65rem; border: 1px solid var(--c, ${T.border}); font-family: ${MONO}; font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--c, ${T.textDim}); }
.acct-pill::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--c, ${T.textDim}); }
.acct-badge { font-family: ${MONO}; font-size: .55rem; letter-spacing: .1em; text-transform: uppercase; padding: .15rem .5rem; border: 1px solid ${T.teal}; color: ${T.teal}; }
.acct-badge--warn { border-color: #f4a261; color: #f4a261; }
.acct-badge--bad { border-color: #e63946; color: #e63946; }

/* ── Orders ── */
.acct-order { background: ${T.dark1}; border: 1px solid ${T.border}; border-left: 3px solid var(--c, ${T.border}); margin-bottom: .85rem; clip-path: ${CLIP_LG}; transition: background .2s; }
.acct-order:hover { background: ${T.dark2}; }
.acct-order-head { padding: .85rem 1.25rem; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; gap: .5rem; flex-wrap: wrap; }
.acct-order-num { font-family: ${ANTON}; font-size: .9rem; text-transform: uppercase; color: ${T.textHi}; }
.acct-order-num span { color: var(--c, ${T.textDim}); }
.acct-order-body { padding: .85rem 1.25rem; display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 1rem; align-items: center; }
@media (max-width: 700px) { .acct-order-body { grid-template-columns: 1fr 1fr; } .acct-order-actions { grid-column: 1 / -1; justify-content: flex-start; } }
.acct-fl { font-family: ${MONO}; font-size: .55rem; letter-spacing: .14em; text-transform: uppercase; color: ${T.textDim}; display: block; margin-bottom: .2rem; }
.acct-fv { font-family: ${MONO}; font-size: .74rem; color: ${T.textHi}; }
.acct-order-actions { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: flex-end; align-items: center; }
.acct-order-items { border-top: 1px solid ${T.border}; padding: .5rem 1.25rem .85rem; }
.acct-order-line { display: flex; justify-content: space-between; gap: 1rem; padding: .5rem 0; border-bottom: 1px solid ${T.border}; font-family: ${MONO}; font-size: .7rem; color: ${T.textMid}; }
.acct-order-line:last-child { border-bottom: none; }
.acct-order-line b { color: ${T.textHi}; font-weight: normal; }
.acct-order-track { font-family: ${MONO}; font-size: .62rem; color: ${T.textDim}; padding-top: .6rem; }

/* ── Addresses ── */
.acct-addr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.acct-addr { background: ${T.dark2}; border: 1px solid ${T.border}; padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: .75rem; }
.acct-addr.default { border-color: rgba(42,157,143,.5); }
.acct-address { font-style: normal; font-family: ${MONO}; font-size: .72rem; line-height: 1.7; color: ${T.textMid}; }
.acct-address strong { color: ${T.textHi}; font-weight: normal; }
.acct-addr-actions { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: auto; }

/* ── Payment methods ── */
.acct-pm { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: ${T.dark2}; border: 1px solid ${T.border}; border-left: 3px solid ${T.border}; margin-bottom: .75rem; flex-wrap: wrap; }
.acct-pm.default { border-left-color: ${T.teal}; }
.acct-pm-brand { font-family: ${ANTON}; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; color: ${T.textHi}; padding: .35rem .6rem; background: ${T.dark3}; border: 1px solid ${T.border}; min-width: 72px; text-align: center; }
.acct-pm-info { flex: 1; min-width: 160px; font-family: ${MONO}; font-size: .74rem; color: ${T.textHi}; }
.acct-pm-info small { display: block; font-size: .62rem; color: ${T.textDim}; margin-top: .2rem; }
.acct-pm-actions { display: flex; gap: .5rem; flex-wrap: wrap; align-items: center; }
.acct-stripe-field { background: ${T.dark2}; border: 1px solid ${T.border}; padding: .85rem .9rem; transition: border-color .2s; }
.acct-stripe-field:focus-within { border-color: rgba(179,14,28,.6); }

/* ── Modal ── */
.acct-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
.acct-modal { background: ${T.dark1}; border: 1px solid ${T.border}; border-top: 2px solid var(--pa, ${T.red}); width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); }
.acct-modal-head { padding: 1.1rem 1.5rem; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; }
.acct-modal-title { font-family: ${ANTON}; font-size: 1rem; text-transform: uppercase; color: ${T.textHi}; margin: 0; }
.acct-modal-close { width: 28px; height: 28px; background: none; border: 1px solid ${T.border}; color: ${T.textDim}; cursor: pointer; transition: border-color .2s, color .2s; }
.acct-modal-close:hover:not(:disabled) { border-color: ${T.red}; color: ${T.red}; }
.acct-modal-body { padding: 1.5rem; font-family: ${MONO}; font-size: .78rem; color: ${T.textMid}; line-height: 1.65; }
.acct-modal-body strong { color: ${T.textHi}; font-weight: normal; }
.acct-modal-foot { padding: 1rem 1.5rem; border-top: 1px solid ${T.border}; display: flex; gap: .75rem; justify-content: flex-end; }

/* ── Empty / loading ── */
.acct-empty { background: ${T.dark1}; border: 1px dashed ${T.border}; padding: 3.5rem 2rem; text-align: center; }
.acct-empty-icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
.acct-empty h3 { font-family: ${ANTON}; font-size: 1.4rem; text-transform: uppercase; color: ${T.textHi}; margin: 0 0 .5rem; }
.acct-empty p { font-family: ${MONO}; font-size: .72rem; color: ${T.textDim}; margin: 0 0 1.5rem; }
.acct-loading { min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
.acct-loading-spin { width: 36px; height: 36px; border: 2px solid ${T.border}; border-top-color: ${T.red}; border-radius: 50%; animation: acctSpin .75s linear infinite; }
.acct-loading-lbl { font-family: ${MONO}; font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; color: ${T.textDim}; }
.acct-skel { height: 88px; background: ${T.dark2}; border: 1px solid ${T.border}; margin-bottom: .85rem; animation: acctPulse 1.6s ease-in-out infinite; }
@keyframes acctPulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

.acct-btn:focus-visible, .acct-chip:focus-visible, .acct-nav-item:focus-visible, .acct-logout:focus-visible { outline: 2px solid ${T.textMid}; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .acct-animated-border, .acct-spinner, .acct-loading-spin, .acct-skel { animation: none; } }
`;