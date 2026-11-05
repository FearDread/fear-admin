import { PROFILE } from '../data/resume.js';
import { prefersReducedMotion } from '../config.js';

// Rotates the hero taglines while the home section is visible.
export default function typewriterModule(sb) {
    let timer, line = 0, pos = 0, deleting = false, running = false;
    const lines = PROFILE.taglines;
    const el = () => document.getElementById('tagline');

    function tick() {
        const target = el(); if (!target) return;
        const text = lines[line];
        if (!deleting) {
            target.textContent = text.slice(0, ++pos);
            if (pos === text.length) { deleting = true; timer = setTimeout(tick, 2400); return; }
            timer = setTimeout(tick, 34 + Math.random() * 40);
        } else {
            target.textContent = text.slice(0, --pos);
            if (pos === 0) { deleting = false; line = (line + 1) % lines.length; timer = setTimeout(tick, 450); return; }
            timer = setTimeout(tick, 16);
        }
    }
    const start = () => { if (running || prefersReducedMotion()) return; running = true; tick(); };
    const stop = () => { running = false; clearTimeout(timer); };

    return {
        load() {
            if (!el()) return;
            if (prefersReducedMotion()) { el().textContent = lines[0]; return; }
            sb.add('section:change', (d) => (d.name === 'home' ? start() : stop()));
            if ($('#s0').hasClass('active')) start();
        },
        unload: stop
    };
}
