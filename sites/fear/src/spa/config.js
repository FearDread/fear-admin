export const API = '/fear/api/portfolio';

// Order matters: index N maps to <section id="sN"> and the side-nav item with data-s="N".
export const SECTIONS = ['home', 'about', 'work', 'services', 'process', 'clients', 'stats', 'blog', 'contact'];

export const INTERACTIVE = 'a,button,.logo,.modal-close,.modal-nav,.modal-backdrop,.snav-item,.proj-row,.proj-card,.blog-card,.serv-cell,.proc-step,.testi-dot,.soc-link,.b-soc,.btn-gold,.btn-ghost,.send-btn';
export const TYPING = 'input,textarea,select,[contenteditable]';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;
