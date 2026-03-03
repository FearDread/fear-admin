export const T = {
    red:     '#e63946',
    orange:  '#6120d9',
    teal:    '#2a9d8f',
    dark0:   '#0d0d0d',
    dark1:   '#111111',
    dark2:   '#141414',
    dark3:   '#1a1a1a',
    border:  '#222222',
    textDim: 'rgba(255,255,255,0.32)',
    textMid: 'rgba(255,255,255,0.58)',
    textHi:  'rgba(255,255,255,0.92)',
};
/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────*/
export const sidebarStyles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

/* ── Sidebar card ── */
.accsb-wrap {
    background: ${T.dark1};
    border: 1px solid ${T.border};
    border-top: 2px solid ${T.red};
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
}

/* ── Avatar section ── */
.accsb-profile {
    padding: 1.75rem 1.5rem 1.25rem;
    border-bottom: 1px solid ${T.border};
    display: flex; flex-direction: column; align-items: center;
    text-align: center; position: relative;
}
.accsb-avatar-ring {
    width: 80px; height: 80px;
    border: 2px solid ${T.border};
    border-radius: 50%;
    padding: 2px;
    background: ${T.dark2};
    margin-bottom: 1rem;
    position: relative;
    flex-shrink: 0;
}
.accsb-avatar-ring::after {
    content: '';
    position: absolute; inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(230,57,70,.2);
}
.accsb-avatar-img {
    width: 100%; height: 100%;
    border-radius: 50%; object-fit: cover; display: block;
}
.accsb-avatar-initials {
    width: 100%; height: 100%; border-radius: 50%;
    background: ${T.dark3}; border: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: center;
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.5rem; color: ${T.red};
    text-transform: uppercase;
}
.accsb-online-dot {
    position: absolute; bottom: 14px; right: calc(50% - 44px);
    width: 12px; height: 12px; border-radius: 50%;
    background: ${T.teal}; border: 2px solid ${T.dark1};
}
.accsb-name {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1.05rem; text-transform: uppercase; color: ${T.textHi};
    letter-spacing: .03em; margin: 0 0 .25rem;
}
.accsb-email {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; color: ${T.textDim};
    letter-spacing: .04em; margin: 0 0 .6rem;
    word-break: break-all;
}
.accsb-login-badge {
    display: inline-flex; align-items: center; gap: .35rem;
    padding: .2rem .6rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    font-family: 'Space Mono', monospace;
    font-size: .57rem; letter-spacing: .1em; text-transform: uppercase;
    color: ${T.textDim};
}
.accsb-login-badge span { color: ${T.teal}; font-size: .5rem; }

/* ── Nav menu ── */
.accsb-nav { padding: .5rem 0; }
.accsb-nav-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: .7rem 1.25rem;
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .08em; text-transform: uppercase;
    color: ${T.textMid};
    border-left: 3px solid transparent;
    transition: color .15s, background .15s, border-color .15s, padding-left .15s;
    position: relative;
}
.accsb-nav-item:hover {
    color: ${T.textHi};
    background: rgba(255,255,255,.03);
    padding-left: 1.5rem;
}
.accsb-nav-item.active {
    color: ${T.textHi};
    border-left-color: ${T.red};
    background: rgba(230,57,70,.06);
    padding-left: 1.5rem;
}
.accsb-nav-left {
    display: flex; align-items: center; gap: .65rem;
}
.accsb-nav-icon {
    font-size: .85rem; flex-shrink: 0; width: 16px; text-align: center;
    color: ${T.textDim};
}
.accsb-nav-item.active .accsb-nav-icon { color: ${T.red}; }
.accsb-nav-item:hover .accsb-nav-icon { color: ${T.textMid}; }
.accsb-nav-badge {
    background: ${T.red}; color: #fff;
    font-family: 'Space Mono',monospace; font-size: .5rem;
    padding: .1rem .35rem; border-radius: 2px;
    margin-left: .4rem;
}
.accsb-nav-arrow { font-size: .5rem; color: ${T.textDim}; }
.accsb-nav-item.active .accsb-nav-arrow { color: ${T.red}; }
.accsb-nav-divider { height: 1px; background: ${T.border}; margin: .35rem .5rem; }

/* Logout button */
.accsb-logout {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: .7rem 1.25rem;
    background: none; border: none; border-left: 3px solid transparent;
    border-top: 1px solid ${T.border};
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .08em; text-transform: uppercase;
    color: rgba(230,57,70,.6);
    cursor: pointer;
    transition: color .2s, background .2s, border-color .2s, padding-left .15s;
}
.accsb-logout:hover {
    color: ${T.red}; background: rgba(230,57,70,.06);
    border-left-color: ${T.red}; padding-left: 1.5rem;
}
.accsb-logout-icon { font-size: .85rem; }

/* ── Logout modal overlay ── */
.accsb-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
}
.accsb-modal {
    background: ${T.dark1}; border: 1px solid ${T.border};
    border-top: 2px solid ${T.red};
    width: 100%; max-width: 420px; margin: 1rem;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
}
.accsb-modal-head {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: space-between;
}
.accsb-modal-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1rem; text-transform: uppercase; color: ${T.textHi}; margin: 0;
}
.accsb-modal-close {
    background: none; border: 1px solid ${T.border}; color: ${T.textDim};
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: .75rem; transition: border-color .2s, color .2s;
    flex-shrink: 0;
}
.accsb-modal-close:hover { border-color: ${T.red}; color: ${T.red}; }
.accsb-modal-close:disabled { opacity: .4; cursor: not-allowed; }
.accsb-modal-body {
    padding: 1.5rem;
    font-family: 'Space Mono', monospace;
    font-size: .78rem; color: ${T.textMid}; line-height: 1.65;
}
.accsb-modal-body strong { color: ${T.textHi}; }
.accsb-modal-foot {
    padding: 1rem 1.5rem;
    border-top: 1px solid ${T.border};
    display: flex; gap: .75rem; justify-content: flex-end;
}
.accsb-btn-cancel {
    padding: .6rem 1.25rem;
    background: transparent; border: 1px solid ${T.border}; color: ${T.textMid};
    font-family: 'Space Mono',monospace; font-size: .65rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s;
}
.accsb-btn-cancel:hover { border-color: ${T.textDim}; color: ${T.textHi}; }
.accsb-btn-cancel:disabled { opacity: .4; cursor: not-allowed; }
.accsb-btn-logout {
    display: flex; align-items: center; gap: .5rem;
    padding: .6rem 1.25rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono',monospace; font-size: .65rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: opacity .2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.accsb-btn-logout:hover:not(:disabled) { opacity: .85; }
.accsb-btn-logout:disabled { opacity: .4; cursor: not-allowed; }
.accsb-spinner {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: accsbSpin .65s linear infinite;
}
@keyframes accsbSpin { to { transform: rotate(360deg); } }
`;

export const dashStyles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

/* ── Page base ── */
.dash-page {  min-height: 100vh; }

/* ── Hero ── */
.dash-hero {
    position: relative;
    background: rgba(0,0,0,.8);
    padding: 4.5rem 0 3.5rem;
    overflow: hidden;
    border-bottom: 1px solid ${T.border};
}
.dash-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 22px 22px; pointer-events: none;
}
.dash-hero-stripe {
    position: absolute; left: 0; top: 0; width: 4px; height: 100%;
    background: ${T.red};
}
.dash-hero-ghost {
    position: absolute; right: -1rem; top: 50%;
    transform: translateY(-50%);
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(5rem,14vw,11rem);
    text-transform: uppercase; color: rgba(255,255,255,.025);
    line-height: 1; user-select: none; pointer-events: none; white-space: nowrap;
}
.dash-hero-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
    position: relative; z-index: 1;
}
.dash-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .22em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .55rem;
}
.dash-hero-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: clamp(2.5rem,8vw,5.5rem);
    text-transform: uppercase; line-height: .9;
    color: #fff; margin: 0 0 1.1rem;
}
.dash-hero-title span { color: ${T.red}; -webkit-text-stroke: 1px ${T.red}; }
.dash-breadcrumb {
    display: flex; align-items: center; gap: .5rem; margin-bottom: 1.25rem;
}
.dash-bc-link {
    font-family: 'Space Mono',monospace;
    font-size: .65rem; letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim}; text-decoration: none; transition: color .2s;
}
.dash-bc-link:hover { color: #fff; }
.dash-bc-sep { color: ${T.red}; font-size: .6rem; }
.dash-bc-current {
    font-family: 'Space Mono',monospace;
    font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; color: ${T.red};
}

/* ── Layout ── */
.dash-layout {
    max-width: 1200px; margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    display: grid; grid-template-columns: 280px 1fr;
    gap: 2rem; align-items: start;
}
@media(max-width: 900px) { .dash-layout { grid-template-columns: 1fr; } }

/* ── Welcome banner ── */
.dash-welcome {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: ${T.dark2};
    border: 1px solid ${T.border};
    border-left: 3px solid ${T.red};
    margin-bottom: 2rem;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
}
.dash-welcome-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: .1rem; }
.dash-welcome-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 1rem; text-transform: uppercase; color: ${T.textHi}; margin: 0 0 .3rem;
}
.dash-welcome-title span { color: ${T.red}; }
.dash-welcome-sub {
    font-family: 'Space Mono',monospace;
    font-size: .72rem; color: ${T.textMid}; line-height: 1.55; margin: 0;
}
.dash-welcome-sub a { color: ${T.red}; text-decoration: none; }
.dash-welcome-sub a:hover { text-decoration: underline; }

/* ── Stats row ── */
.dash-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin-bottom: 2rem;
}
@media(max-width: 640px) { .dash-stats { grid-template-columns: 1fr; } }
.dash-stat-card {
    background: ${T.dark1}; border: 1px solid ${T.border};
    border-top: 2px solid var(--stat-accent, ${T.red});
    padding: 1.25rem 1.25rem 1.1rem;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
    transition: border-color .2s;
}
.dash-stat-card:hover { border-color: rgba(255,255,255,.1); }
.dash-stat-icon {
    font-size: 1.3rem; display: block; margin-bottom: .6rem;
}
.dash-stat-val {
    font-family: 'Anton','Impact',sans-serif;
    font-size: 2.25rem; color: var(--stat-accent, ${T.red});
    line-height: 1; display: block; margin-bottom: .3rem;
}
.dash-stat-label {
    font-family: 'Space Mono',monospace;
    font-size: .6rem; letter-spacing: .14em; text-transform: uppercase;
    color: ${T.textDim};
}

/* ── Section headers ── */
.dash-section-head {
    display: flex; align-items: center; gap: .85rem;
    margin-bottom: 1.1rem;
}
.dash-section-title {
    font-family: 'Anton','Impact',sans-serif;
    font-size: .95rem; text-transform: uppercase; color: ${T.textHi}; margin: 0;
}
.dash-section-line { flex: 1; height: 1px; background: ${T.border}; }

/* ── Quick actions ── */
.dash-actions {
    display: flex; flex-wrap: wrap; gap: .65rem; margin-bottom: 2rem;
}
.dash-action-btn {
    display: inline-flex; align-items: center; gap: .55rem;
    padding: .6rem 1.1rem;
    background: ${T.dark2}; border: 1px solid ${T.border}; color: ${T.textMid};
    font-family: 'Space Mono',monospace; font-size: .65rem;
    letter-spacing: .09em; text-transform: uppercase;
    text-decoration: none;
    transition: border-color .2s, color .2s, background .2s;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
}
.dash-action-btn:hover { border-color: ${T.red}; color: ${T.red}; background: rgba(230,57,70,.05); }
.dash-action-btn.primary { background: ${T.red}; border-color: ${T.red}; color: #fff; }
.dash-action-btn.primary:hover { opacity: .85; color: #fff; }
.dash-action-btn-icon { font-size: .85rem; flex-shrink: 0; }

/* ── Account info grid ── */
.dash-info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
    background: ${T.border};
    border: 1px solid ${T.border};
    margin-bottom: 2rem;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
}
@media(max-width: 540px) { .dash-info-grid { grid-template-columns: 1fr; } }
.dash-info-cell {
    background: ${T.dark1}; padding: 1rem 1.25rem;
    display: flex; flex-direction: column; gap: .25rem;
}
.dash-info-label {
    font-family: 'Space Mono',monospace;
    font-size: .58rem; letter-spacing: .16em; text-transform: uppercase;
    color: ${T.red};
}
.dash-info-val {
    font-family: 'Space Mono',monospace;
    font-size: .78rem; color: ${T.textHi}; line-height: 1.4;
}
.dash-info-empty { color: ${T.textDim}; font-style: italic; }

/* ── Loading spinner ── */
.dash-loading {
    min-height: 100vh; background: ${T.dark0};
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
}
.dash-loading-spinner {
    width: 36px; height: 36px;
    border: 2px solid ${T.border}; border-top-color: ${T.red};
    border-radius: 50%; animation: dashSpin .75s linear infinite;
}
.dash-loading-label {
    font-family: 'Space Mono',monospace;
    font-size: .65rem; letter-spacing: .18em; text-transform: uppercase;
    color: ${T.textDim};
}
@keyframes dashSpin { to { transform: rotate(360deg); } }

/* ── Animated bottom border ── */
.dash-animated-border {
    height: 3px; width: 100%;
    background: linear-gradient(90deg, #e63946, #f4a261, #2a9d8f, #e63946);
    background-size: 300% 100%;
    animation: dashGrad 4s linear infinite;
}
@keyframes dashGrad { to { background-position: 300% center; } }
`;

export const userStyles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');
.ud-page{min-height:100vh;}
.ud-hero{position:relative;background:rgba(0,0,0,.9);padding:4.5rem 0 3.5rem;overflow:hidden;border-bottom:1px solid ${T.border};}
.ud-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.045) 1px,transparent 1px);background-size:22px 22px;pointer-events:none;}
.ud-hero-stripe{position:absolute;left:0;top:0;width:4px;height:100%;background:${T.orange};}
.ud-hero-ghost{position:absolute;right:-1rem;top:50%;transform:translateY(-50%);font-family:'Anton','Impact',sans-serif;font-size:clamp(4rem,12vw,10rem);text-transform:uppercase;color:rgba(255,255,255,.025);line-height:1;user-select:none;pointer-events:none;white-space:nowrap;}
.ud-hero-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;position:relative;z-index:1;}
.ud-eyebrow{font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:${T.orange};display:block;margin-bottom:.55rem;}
.ud-hero-title{font-family:'Anton','Impact',sans-serif;font-size:clamp(2.5rem,8vw,5rem);text-transform:uppercase;line-height:.9;color:#fff;margin:0 0 1.1rem;}
.ud-hero-title span{color:${T.orange};-webkit-text-stroke:1px ${T.orange};}
.ud-breadcrumb{display:flex;align-items:center;gap:.5rem;margin-bottom:1.25rem;}
.ud-bc-link{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:${T.textDim};text-decoration:none;transition:color .2s;}
.ud-bc-link:hover{color:#fff;}
.ud-bc-sep{color:${T.orange};font-size:.6rem;}
.ud-bc-current{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:${T.orange};}
.ud-layout{max-width:1200px;margin:0 auto;padding:3rem 1.5rem 5rem;display:grid;grid-template-columns:280px 1fr;gap:2rem;align-items:start;}
@media(max-width:900px){.ud-layout{grid-template-columns:1fr;}}
.ud-toast{display:flex;align-items:flex-start;gap:.75rem;padding:.9rem 1.1rem;margin-bottom:1.5rem;border:1px solid;font-family:'Space Mono',monospace;font-size:.72rem;line-height:1.5;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%);}
.ud-toast.success{border-color:rgba(42,157,143,.4);color:${T.teal};background:rgba(42,157,143,.06);}
.ud-toast.error{border-color:rgba(230,57,70,.4);color:${T.red};background:rgba(230,57,70,.06);}
.ud-toast-icon{font-size:1rem;flex-shrink:0;}
.ud-toast-close{margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;font-size:.8rem;opacity:.6;transition:opacity .2s;flex-shrink:0;}
.ud-toast-close:hover{opacity:1;}
.ud-panel{background:${T.dark1};border:1px solid ${T.border};border-top:2px solid var(--pa,${T.orange});clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%);margin-bottom:1.5rem;}
.ud-panel-head{padding:1rem 1.5rem .85rem;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between;}
.ud-panel-title{font-family:'Anton','Impact',sans-serif;font-size:.95rem;text-transform:uppercase;color:${T.textHi};margin:0;}
.ud-panel-body{padding:1.5rem;}
.ud-field{margin-bottom:1.1rem;}
.ud-field-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.1rem;}
@media(max-width:500px){.ud-field-row{grid-template-columns:1fr;}}
.ud-label{font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:var(--pa,${T.orange});display:block;margin-bottom:.45rem;}
.ud-label-req{opacity:.5;margin-left:.2rem;}
.ud-input{width:100%;background:${T.dark2};border:1px solid ${T.border};color:${T.textHi};padding:.72rem .9rem;font-family:'Space Mono',monospace;font-size:.75rem;outline:none;transition:border-color .2s,background .2s;display:block;}
.ud-input::placeholder{color:${T.textDim};}
.ud-input:focus{border-color:rgba(244,162,97,.4);background:${T.dark3};}
.ud-input.err{border-color:rgba(230,57,70,.5);}
.ud-input:disabled{opacity:.4;cursor:not-allowed;}
.ud-field-err{font-family:'Space Mono',monospace;font-size:.62rem;color:${T.red};margin-top:.35rem;display:flex;align-items:center;gap:.3rem;}
.ud-field-err::before{content:'⚠';font-size:.6rem;}
.ud-field-hint{font-family:'Space Mono',monospace;font-size:.6rem;color:${T.textDim};margin-top:.35rem;}
.ud-pw-wrap{position:relative;}
.ud-pw-wrap .ud-input{padding-right:3rem;}
.ud-pw-toggle{position:absolute;right:0;top:0;bottom:0;width:44px;background:none;border:none;border-left:1px solid ${T.border};color:${T.textDim};font-size:.9rem;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:color .2s;}
.ud-pw-toggle:hover{color:#fff;}
.ud-btn-primary{display:inline-flex;align-items:center;gap:.6rem;padding:.75rem 1.5rem;background:var(--pa,${T.orange});border:none;color:#fff;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:opacity .2s,transform .2s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));}
.ud-btn-primary:hover:not(:disabled){opacity:.85;transform:translateY(-1px);}
.ud-btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.ud-btn-ghost{display:inline-flex;align-items:center;gap:.6rem;padding:.75rem 1.25rem;background:transparent;border:1px solid ${T.border};color:${T.textMid};font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s;}
.ud-btn-ghost:hover:not(:disabled){border-color:${T.textDim};color:${T.textHi};}
.ud-btn-ghost:disabled{opacity:.4;cursor:not-allowed;}
.ud-btn-outline{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:transparent;border:1px solid var(--pa,${T.orange});color:var(--pa,${T.orange});font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:background .2s;}
.ud-btn-outline:hover{background:rgba(244,162,97,.08);}
.ud-spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:udSpin .65s linear infinite;flex-shrink:0;}
@keyframes udSpin{to{transform:rotate(360deg);}}
.ud-pw-locked{display:flex;align-items:center;gap:.75rem;padding:1rem 1.1rem;background:${T.dark2};border:1px solid ${T.border};border-left:3px solid ${T.border};}
.ud-pw-locked-icon{font-size:1.2rem;}
.ud-pw-locked-text{font-family:'Space Mono',monospace;font-size:.7rem;color:${T.textDim};margin:0;}
.ud-animated-border{height:3px;width:100%;background:linear-gradient(90deg,#e63946,#f4a261,#2a9d8f,#e63946);background-size:300% 100%;animation:udGrad 4s linear infinite;}
@keyframes udGrad{to{background-position:300% center;}}
.ud-loading{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;background:${T.dark0};}
.ud-loading-spinner{width:32px;height:32px;border:2px solid ${T.border};border-top-color:${T.orange};border-radius:50%;animation:udSpin .75s linear infinite;}
.ud-loading-label{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:${T.textDim};}
`;
export const orderStyles=`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');
.op{#0d0d0d;min-height:100vh;}
.oh{position:relative;background:rgba(0,0,0,.9);padding:4.5rem 0 3.5rem;overflow:hidden;border-bottom:1px solid #222;}
.oh::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.045) 1px,transparent 1px);background-size:22px 22px;pointer-events:none;}
.oh-stripe{position:absolute;left:0;top:0;width:4px;height:100%;background:#e63946;}
.oh-ghost{position:absolute;right:-1rem;top:50%;transform:translateY(-50%);font-family:'Anton','Impact',sans-serif;font-size:clamp(4rem,12vw,10rem);text-transform:uppercase;color:rgba(255,255,255,.025);line-height:1;user-select:none;pointer-events:none;white-space:nowrap;}
.oh-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;position:relative;z-index:1;}
.oh-eyebrow{font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:#e63946;display:block;margin-bottom:.55rem;}
.oh-title{font-family:'Anton','Impact',sans-serif;font-size:clamp(2.5rem,8vw,5rem);text-transform:uppercase;line-height:.9;color:#fff;margin:0 0 1.1rem;}
.oh-title span{color:#e63946;-webkit-text-stroke:1px #e63946;}
.oh-bc{display:flex;align-items:center;gap:.5rem;margin-bottom:1.25rem;}
.oh-bc a{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.32);text-decoration:none;transition:color .2s;}
.oh-bc a:hover{color:#fff;}
.oh-bc-sep{color:#e63946;font-size:.6rem;}
.oh-bc-cur{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:#e63946;}
.ol{max-width:1200px;margin:0 auto;padding:3rem 1.5rem 5rem;display:grid;grid-template-columns:280px 1fr;gap:2rem;align-items:start;}
@media(max-width:900px){.ol{grid-template-columns:1fr;}}
.os{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.75rem;}
@media(max-width:540px){.os{grid-template-columns:1fr;}}
.os-item{background:#111;border:1px solid #222;border-top:2px solid var(--sa,#e63946);padding:1.1rem 1.25rem;clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%);}
.os-val{font-family:'Anton','Impact',sans-serif;font-size:2rem;color:var(--sa,#e63946);line-height:1;display:block;margin-bottom:.25rem;}
.os-lbl{font-family:'Space Mono',monospace;font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.32);}
.otb{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem;}
.otb-title{font-family:'Anton','Impact',sans-serif;font-size:.95rem;text-transform:uppercase;color:rgba(255,255,255,0.92);margin:0;}
.otb-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.5rem .9rem;background:transparent;border:1px solid #222;color:rgba(255,255,255,0.58);font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s;}
.otb-btn:hover,.otb-btn.act{border-color:#e63946;color:#e63946;}
.ofd{background:#141414;border:1px solid #222;border-left:3px solid #e63946;padding:1.1rem 1.25rem;margin-bottom:1.25rem;display:flex;align-items:flex-end;gap:1rem;flex-wrap:wrap;}
.ofd-lbl{font-family:'Space Mono',monospace;font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;color:#e63946;display:block;margin-bottom:.4rem;}
.ofd-sel{background:#111;border:1px solid #222;color:rgba(255,255,255,0.92);padding:.55rem .85rem;font-family:'Space Mono',monospace;font-size:.68rem;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;transition:border-color .2s;}
.ofd-sel:focus{border-color:rgba(230,57,70,.4);}
.ofd-clr{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem .9rem;background:transparent;border:1px solid #222;color:rgba(255,255,255,0.32);font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s;}
.ofd-clr:hover{border-color:rgba(255,255,255,0.32);color:rgba(255,255,255,0.92);}
.o-err{display:flex;align-items:flex-start;gap:.75rem;padding:.9rem 1.1rem;margin-bottom:1.25rem;border:1px solid rgba(230,57,70,.35);background:rgba(230,57,70,.05);font-family:'Space Mono',monospace;font-size:.72rem;color:#e63946;}
.o-err-close{margin-left:auto;background:none;border:none;color:inherit;opacity:.6;cursor:pointer;font-size:.8rem;transition:opacity .2s;flex-shrink:0;}
.o-err-close:hover{opacity:1;}
.oc{background:#111;border:1px solid #222;border-left:3px solid var(--sc,#222);margin-bottom:.85rem;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%);transition:background .2s;}
.oc:hover{background:#141414;}
.oc:last-child{margin-bottom:0;}
.oc-head{padding:.85rem 1.25rem;border-bottom:1px solid #222;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;}
.oc-num{font-family:'Anton','Impact',sans-serif;font-size:.9rem;text-transform:uppercase;color:rgba(255,255,255,0.92);}
.oc-num span{color:var(--sc,rgba(255,255,255,0.32));}
.oc-pill{display:inline-flex;align-items:center;gap:.35rem;padding:.2rem .65rem;border:1px solid var(--sc,#222);font-family:'Space Mono',monospace;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--sc,rgba(255,255,255,0.32));}
.oc-dot{width:5px;height:5px;border-radius:50%;background:var(--sc,rgba(255,255,255,0.32));flex-shrink:0;}
.oc-body{padding:.85rem 1.25rem;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:1rem;align-items:center;}
@media(max-width:640px){.oc-body{grid-template-columns:1fr 1fr;}.oc-actions{grid-column:1/-1;}}
.oc-fl{font-family:'Space Mono',monospace;font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.32);display:block;margin-bottom:.2rem;}
.oc-fv{font-family:'Space Mono',monospace;font-size:.72rem;color:rgba(255,255,255,0.92);}
.oc-actions{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;justify-content:flex-end;}
.ob{display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .85rem;font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;transition:opacity .2s,border-color .2s,color .2s;border:1px solid;background:transparent;white-space:nowrap;}
.ob:disabled{opacity:.4;cursor:not-allowed;}
.ob-v{border-color:#222;color:rgba(255,255,255,0.58);}
.ob-v:hover:not(:disabled){border-color:rgba(255,255,255,0.32);color:rgba(255,255,255,0.92);}
.ob-p{border-color:rgba(42,157,143,.4);color:#2a9d8f;}
.ob-p:hover:not(:disabled){background:rgba(42,157,143,.08);}
.ob-x{border-color:rgba(230,57,70,.4);color:#e63946;}
.ob-x:hover:not(:disabled){background:rgba(230,57,70,.06);}
.ob-t{border-color:rgba(77,171,247,.4);color:#4dabf7;}
.ob-t:hover:not(:disabled){background:rgba(77,171,247,.06);}
.o-spin{width:10px;height:10px;border:2px solid rgba(230,57,70,.3);border-top-color:#e63946;border-radius:50%;animation:oSpin .65s linear infinite;}
@keyframes oSpin{to{transform:rotate(360deg);}}
.o-empty{background:#111;border:1px solid #222;padding:4rem 2rem;text-align:center;}
.o-empty-icon{font-size:3rem;display:block;margin-bottom:1rem;}
.o-empty-title{font-family:'Anton','Impact',sans-serif;font-size:1.5rem;text-transform:uppercase;color:rgba(255,255,255,0.92);margin:0 0 .5rem;}
.o-empty-sub{font-family:'Space Mono',monospace;font-size:.7rem;color:rgba(255,255,255,0.32);margin:0 0 1.5rem;}
.o-btn-primary{display:inline-flex;align-items:center;gap:.6rem;padding:.75rem 1.5rem;background:#e63946;border:none;color:#fff;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:opacity .2s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));text-decoration:none;}
.o-btn-primary:hover{opacity:.85;color:#fff;}
.o-ldg{padding:4rem 0;text-align:center;}
.o-ldg-spin{display:inline-block;width:36px;height:36px;border:2px solid #222;border-top-color:#e63946;border-radius:50%;animation:oSpin .75s linear infinite;}
.o-ab{height:3px;width:100%;background:linear-gradient(90deg,#e63946,#f4a261,#2a9d8f,#e63946);background-size:300% 100%;animation:oGrad 4s linear infinite;}
@keyframes oGrad{to{background-position:300% center;}}`;