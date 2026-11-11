import { T } from '@/components/styles';

export const wishlistStyles = `
.wl-page { min-height: 100vh; }
.wl-hero { position: relative; background: ${T.dark0}; padding: 4.5rem 0 3rem; overflow: hidden; border-bottom: 1px solid ${T.border}; }
.wl-hero::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px); background-size: 22px 22px; pointer-events: none; }
.wl-hero-stripe { position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: ${T.red}; }
.wl-hero-ghost { position: absolute; right: -1rem; top: 50%; transform: translateY(-50%); font-family: var(--font-anton), Impact, sans-serif; font-size: clamp(5rem, 14vw, 11rem); text-transform: uppercase; color: rgba(255,255,255,.025); line-height: 1; user-select: none; pointer-events: none; white-space: nowrap; }
.wl-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
.wl-breadcrumb { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.25rem; }
.wl-bc-link, .wl-bc-current { font-family: var(--font-space-mono), monospace; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; }
.wl-bc-link { color: ${T.textDim}; transition: color .2s; }
.wl-bc-link:hover { color: #fff; }
.wl-bc-sep { color: ${T.red}; font-size: .6rem; }
.wl-bc-current { color: ${T.red}; }
.wl-eyebrow { font-family: var(--font-space-mono), monospace; font-size: .68rem; letter-spacing: .22em; text-transform: uppercase; color: ${T.red}; display: block; margin-bottom: .55rem; }
.wl-title { font-family: var(--font-anton), Impact, sans-serif; font-size: clamp(2.5rem, 8vw, 5rem); text-transform: uppercase; line-height: .9; color: #fff; margin: 0 0 1rem; }
.wl-title span { color: ${T.red}; -webkit-text-stroke: 1px ${T.red}; }
.wl-count { font-family: var(--font-space-mono), monospace; font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; color: ${T.textDim}; margin: 0; }

.wl-body { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
.wl-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
.wl-card { background: ${T.dark1}; border: 1px solid ${T.border}; display: flex; flex-direction: column; transition: border-color .2s, transform .2s; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%); }
.wl-card:hover { border-color: rgba(179,14,28,.5); transform: translateY(-3px); }
.wl-card-img-wrap { display: block; aspect-ratio: 3/4; overflow: hidden; background: ${T.dark3}; }
.wl-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
.wl-card:hover .wl-card-img { transform: scale(1.04); }
.wl-card-body { padding: 1rem 1.1rem 1.1rem; display: flex; flex-direction: column; gap: .5rem; flex: 1; }
.wl-card-cat { font-family: var(--font-space-mono), monospace; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; color: ${T.red}; }
.wl-card-name { font-family: var(--font-anton), Impact, sans-serif; font-size: 1rem; text-transform: uppercase; line-height: 1.15; color: #fff; text-decoration: none; transition: color .2s; }
.wl-card-name:hover { color: ${T.red}; }
.wl-card-price { font-family: var(--font-space-mono), monospace; font-size: .85rem; color: ${T.textHi}; display: flex; gap: .6rem; align-items: baseline; }
.wl-card-price-old { color: ${T.textDim}; text-decoration: line-through; font-size: .7rem; }
.wl-card-actions { display: flex; gap: .5rem; margin-top: auto; padding-top: .5rem; }

.wl-btn-primary { flex: 1; display: inline-flex; align-items: center; justify-content: center; padding: .65rem 1rem; background: ${T.red}; border: none; color: #fff; font-family: var(--font-space-mono), monospace; font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: opacity .2s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); }
.wl-btn-primary:hover:not(:disabled) { opacity: .85; color: #fff; }
.wl-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.wl-btn-ghost { width: 40px; flex-shrink: 0; background: transparent; border: 1px solid ${T.border}; color: ${T.textMid}; cursor: pointer; transition: border-color .2s, color .2s; }
.wl-btn-ghost:hover:not(:disabled) { border-color: ${T.red}; color: ${T.red}; }
.wl-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }

.wl-state { min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; text-align: center; }
.wl-state .wl-btn-primary { flex: none; }
.wl-state-title { font-family: var(--font-anton), Impact, sans-serif; font-size: 1.5rem; text-transform: uppercase; color: #fff; margin: 0; }
.wl-state-label { font-family: var(--font-space-mono), monospace; font-size: .7rem; letter-spacing: .1em; color: ${T.textDim}; margin: 0; }
.wl-empty-icon { font-size: 3.5rem; color: ${T.border}; line-height: 1; }
.wl-spinner { width: 36px; height: 36px; border: 2px solid ${T.border}; border-top-color: ${T.red}; border-radius: 50%; animation: wlSpin .75s linear infinite; }
@keyframes wlSpin { to { transform: rotate(360deg); } }
`;
