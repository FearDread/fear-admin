import { gsap } from 'gsap';
import { prefersReducedMotion, isCoarsePointer } from '../config.js';

// Project card motion: cursor spotlight, subtle 3D tilt, and a staggered entrance when Work opens.
export default function cardsModule(sb) {
    const tiltOk = () => !prefersReducedMotion() && !isCoarsePointer();

    function onMove(e) {
        const card = e.currentTarget, r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        if (!tiltOk()) return;
        gsap.to(card, { rotationX: (y / r.height - 0.5) * -8, rotationY: (x / r.width - 0.5) * 8, transformPerspective: 900, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }
    function onLeave(e) {
        if (!tiltOk()) return;
        gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform', overwrite: 'auto' });
    }
    function enter() {
        if (prefersReducedMotion()) return;
        gsap.fromTo('.proj-card', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, delay: 0.25, ease: 'power3.out', clearProps: 'transform,opacity', overwrite: 'auto' });
    }

    return {
        load() {
            $(document).on('mousemove.cards', '.proj-card', onMove).on('mouseleave.cards', '.proj-card', onLeave);
            sb.add('section:change', (d) => { if (d.name === 'work') enter(); });
        },
        unload() { $(document).off('.cards'); gsap.killTweensOf('.proj-card'); }
    };
}
