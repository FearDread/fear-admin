import { TERMINAL } from '../data/resume.js';
import { esc } from '../utils.js';
import { prefersReducedMotion } from '../config.js';

// Types the About-page terminal once, the first time the section is shown.
export default function terminalModule(sb) {
    let timer, done = false;
    const el = () => document.getElementById('term-body');
    const row = (l) => (l.cmd ? `<span class="t-prompt">$</span> ${esc(l.s)}` : `<span class="t-out">${esc(l.s)}</span>`);

    function play() {
        const target = el(); if (!target || done) return;
        done = true;
        if (prefersReducedMotion()) { target.innerHTML = TERMINAL.map(row).join('\n'); return; }
        let i = 0;
        const next = () => {
            if (i >= TERMINAL.length) { target.insertAdjacentHTML('beforeend', '\n<span class="t-prompt">$</span> <span class="caret"></span>'); return; }
            target.insertAdjacentHTML('beforeend', (i ? '\n' : '') + row(TERMINAL[i]));
            const wait = TERMINAL[i].cmd ? 520 : 280;
            i++; timer = setTimeout(next, wait);
        };
        next();
    }

    return {
        load() {
            sb.add('section:change', (d) => { if (d.name === 'about') play(); });
            if ($('#s1').hasClass('active')) play();
        },
        unload() { clearTimeout(timer); }
    };
}
