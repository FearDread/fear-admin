import { gsap } from 'gsap';
import { prefersReducedMotion, isCoarsePointer } from '../config.js';

export default function parallaxModule() {
    // [selector, x factor, y factor]
    const blobs = [['.mb1', 50, 50], ['.mb2', -35, -35], ['.mb3', 25, 20]];
    return {
        load() {
            if (prefersReducedMotion() || isCoarsePointer()) return;
            const movers = blobs.map(([sel, fx, fy]) => ({
                x: gsap.quickTo(sel, 'x', { duration: 2.5, ease: 'power1.out' }),
                y: gsap.quickTo(sel, 'y', { duration: 2.5, ease: 'power1.out' }),
                fx, fy
            }));
            $(document).on('mousemove.parallax', (e) => {
                const rx = e.clientX / window.innerWidth - 0.5, ry = e.clientY / window.innerHeight - 0.5;
                movers.forEach((m) => { m.x(rx * m.fx); m.y(ry * m.fy); });
            });
        },
        unload() { $(document).off('.parallax'); }
    };
}
