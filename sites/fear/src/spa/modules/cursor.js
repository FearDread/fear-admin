import { gsap } from 'gsap';
import { INTERACTIVE, isCoarsePointer } from '../config.js';

export default function cursorModule() {
    return {
        load() {
            const dot = document.getElementById('cur'), ring = document.getElementById('cur-r');
            if (!dot || !ring) return;
            if (isCoarsePointer()) { $(dot).add(ring).hide(); return; }

            gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
            const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
            const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
            const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
            const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
            const $body = $('body');

            $(document)
                .on('mousemove.cursor', (e) => {
                    $body.addClass('cur-ready');
                    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
                })
                .on('mouseover.cursor', (e) => $body.toggleClass('cur-grow', $(e.target).closest(INTERACTIVE).length > 0))
                .on('mousedown.cursor', () => $body.addClass('cur-down'))
                .on('mouseup.cursor', () => $body.removeClass('cur-down'))
                .on('mouseleave.cursor', () => $body.removeClass('cur-ready'));
        },
        unload() { $(document).off('.cursor'); }
    };
}
