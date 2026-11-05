import { gsap } from 'gsap';
import { prefersReducedMotion } from '../config.js';

export default function introModule() {
    let tl;
    return {
        load() {
            if (prefersReducedMotion()) return;
            const hero = $('.section.active .hero-inner').length > 0;
            tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'transform,opacity' } });
            if (hero) {
                tl.from('.hero-name .line1, .hero-name .line2', { yPercent: 40, opacity: 0, duration: 1.1, stagger: 0.15 }, 0.2)
                    .from('.hero-eyebrow', { x: -30, opacity: 0, duration: 0.9 }, 0.15)
                    .from('.hero-sub, .hero-type, .hero-ctas, .hero-tags', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.8);
            } else {
                tl.from('.section.active .sec-inner', { y: 60, opacity: 0, duration: 1.2 }, 0.2);
            }
            tl.from('#topbar', { y: -40, opacity: 0, duration: 0.9 }, 0.45)
                .from('#side-nav', { x: -40, opacity: 0, duration: 0.9 }, 0.6)
                .from('#bottombar', { y: 40, opacity: 0, duration: 0.9 }, 0.5);
        },
        unload() { if (tl) tl.kill(); }
    };
}
