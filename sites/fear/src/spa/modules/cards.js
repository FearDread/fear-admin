import { gsap } from 'gsap';
import { prefersReducedMotion, isCoarsePointer } from '../config.js';

// Project card motion: cursor spotlight, subtle 3D tilt, and a staggered entrance when Work opens.
//
// Entrance fix: nav.js fades the whole section in and only then emits `section:change`.
// Running a fromTo() at that point snapped visible cards back to opacity 0 (a second flash).
// Instead, cards are parked hidden whenever Work is not the active section, so they are
// already invisible while the section fades in and then reveal exactly once.
export default function cardsModule(sb) {
    const tiltOk = () => !prefersReducedMotion() && !isCoarsePointer();
    const HIDDEN = { y: 36, opacity: 0 };

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

    // Park the cards hidden while another section is showing.
    function hide() {
        if (prefersReducedMotion()) return;
        gsap.killTweensOf('.proj-card');
        gsap.set('.proj-card', HIDDEN);
    }

    // Single reveal from the parked state (to(), not fromTo(): no snap back to hidden).
    function enter() {
        if (prefersReducedMotion()) return;
        gsap.to('.proj-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, delay: 0.05, ease: 'power3.out', clearProps: 'transform,opacity', overwrite: 'auto' });
    }

    return {
        load() {
            $(document).on('mousemove.cards', '.proj-card', onMove).on('mouseleave.cards', '.proj-card', onLeave);
            sb.add('section:change', (d) => (d.name === 'work' ? enter() : hide()));
            // Work (s2) is shown right away on a direct #work load: leave the cards visible there.
            if (!$('#s2').hasClass('active')) hide();
        },
        unload() { $(document).off('.cards'); gsap.killTweensOf('.proj-card'); gsap.set('.proj-card', { clearProps: 'transform,opacity' }); }
    };
}