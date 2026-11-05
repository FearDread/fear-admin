import { gsap } from 'gsap';
import { prefersReducedMotion } from '../config.js';

export default function statsModule(sb) {
    let tweens = [];
    const render = ($el, n) => {
        const d = Number($el.data('d')) || 0, suffix = $el.data('suffix');
        $el.html(`${$el.data('prefix') || ''}${d ? n.toFixed(d) : Math.round(n)}${suffix ? `<span class="stat-sup">${suffix}</span>` : ''}`);
    };

    function reset() {
        tweens.forEach((tw) => tw.kill()); tweens = [];
        $('.sk-fill').css('width', 0);
        $('.sk-pct').each(function () { $(this).text('0%'); });
        $('.counter').each(function () { render($(this), 0); });
    }

    function run() {
        reset();
        const reduce = prefersReducedMotion();
        requestAnimationFrame(() => $('.sk-fill').each(function () { $(this).css('width', $(this).data('w') + '%'); }));
        $('.sk-pct').each(function () {
            const $el = $(this), target = Number($el.data('w')), o = { n: 0 };
            tweens.push(gsap.to(o, { n: target, duration: reduce ? 0.01 : 1.5, ease: 'power2.out', onUpdate: () => $el.text(Math.round(o.n) + '%') }));
        });
        $('.counter').each(function () {
            const $el = $(this), target = Number($el.data('t')), o = { n: 0 };
            tweens.push(gsap.to(o, { n: target, duration: reduce ? 0.01 : 1.5, ease: 'power2.out', onUpdate: () => render($el, o.n), onComplete: () => render($el, target) }));
        });
    }

    return {
        load() {
            sb.add('section:change', (d) => (d.name === 'stats' ? run() : reset()));
            if ($('#s6').hasClass('active')) run();
        },
        unload() { tweens.forEach((tw) => tw.kill()); }
    };
}
