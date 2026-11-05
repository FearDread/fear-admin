import { gsap } from 'gsap';
import { SECTIONS, TYPING, prefersReducedMotion } from '../config.js';
import { pad, canScrollInside } from '../utils.js';

const WHEEL_COOLDOWN = 850;
const SWIPE_MIN = 48;

export default function navModule(sb) {
    let current = 0, busy = false, wheelAt = 0, touchY = 0, touchTarget = null;

    const indexOf = (name) => SECTIONS.indexOf(String(name || '').replace(/^#/, '').toLowerCase());
    const $sections = () => $('.section');

    function syncChrome(index) {
        const $item = $('.snav-item').removeClass('active').removeAttr('aria-current').filter(`[data-s="${index}"]`);
        $item.addClass('active').attr('aria-current', 'page');
        $('#cur-num').text(`${pad(index + 1)} / ${pad(SECTIONS.length)}`);
        $sections().attr('aria-hidden', 'true').eq(index).attr('aria-hidden', 'false');
        const label = $item.find('.snav-label').text();
        document.title = label && index ? `${label} · Garrett Haptonstall` : 'Garrett Haptonstall · Linux, Code & Controlled Panic';
    }

    function activate(index, { updateHash = true } = {}) {
        if (!Number.isInteger(index) || index < 0 || index >= SECTIONS.length || busy || index === current) return Promise.resolve();
        busy = true;
        const dir = index > current ? 1 : -1;
        const reduce = prefersReducedMotion();
        const $old = $sections().eq(current), $next = $sections().eq(index);
        const outEl = $old.find('.sec-inner'), inEl = $next.find('.sec-inner');

        return new Promise((resolve) => {
            gsap.timeline({ onComplete: resolve })
                .to(outEl, { y: reduce ? 0 : dir * -55, opacity: 0, duration: reduce ? 0.01 : 0.38, ease: 'power2.in' })
                .add(() => {
                    $old.removeClass('active');
                    gsap.set(outEl, { clearProps: 'transform,opacity' });
                    $next.addClass('active');
                })
                .fromTo(inEl, { y: reduce ? 0 : dir * 65, opacity: 0 }, { y: 0, opacity: 1, duration: reduce ? 0.01 : 0.6, ease: 'power3.out', clearProps: 'transform' }, '+=0.05');
        }).then(() => {
            current = index;
            syncChrome(index);
            if (updateHash && location.hash !== '#' + SECTIONS[index]) history.pushState({ route: SECTIONS[index] }, '', '#' + SECTIONS[index]);
            return sb.emit('section:change', { name: SECTIONS[index], index });
        }).finally(() => { busy = false; });
    }

    const step = (delta) => activate(current + delta);

    function onClick(e) {
        const $el = $(e.currentTarget);
        const raw = $el.attr('data-route') ?? $el.attr('data-s') ?? String($el.attr('href') || '').slice(1);
        const index = /^\d+$/.test(raw) ? Number(raw) : indexOf(raw);
        if (index >= 0) { e.preventDefault(); activate(index); }
    }

    function onWheel(e) {
        if ($(e.target).closest(TYPING).length) return;
        const dy = e.originalEvent.deltaY;
        if (!dy || canScrollInside(e.target, dy)) return;
        const now = Date.now();
        if (now - wheelAt < WHEEL_COOLDOWN) return;
        wheelAt = now;
        step(dy > 0 ? 1 : -1);
    }

    function onKey(e) {
        if ($(e.target).closest(TYPING).length || e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.key === 'Enter' && $(e.target).is('.snav-item')) return $(e.target).trigger('click');
        if (e.key === 'ArrowDown' || e.key === 'PageDown') step(1);
        else if (e.key === 'ArrowUp' || e.key === 'PageUp') step(-1);
        else if (e.key === 'Home') activate(0);
        else if (e.key === 'End') activate(SECTIONS.length - 1);
        else if (/^[1-9]$/.test(e.key) && Number(e.key) <= SECTIONS.length) activate(Number(e.key) - 1);
    }

    return {
        load() {
            const initial = indexOf(location.hash);
            if (initial >= 0) current = initial;
            $sections().removeClass('active').eq(current).addClass('active');
            syncChrome(current);

            sb.add('spa:navigate', ({ route, index, options } = {}) => activate(index == null ? indexOf(route) : index, options));

            $(document)
                .on('click.nav', '.snav-item,a[href^="#"]', onClick)
                .on('keydown.nav', onKey)
                .on('touchstart.nav', (e) => { touchY = e.originalEvent.touches[0].clientY; touchTarget = e.target; })
                .on('touchend.nav', (e) => {
                    const delta = touchY - e.originalEvent.changedTouches[0].clientY;
                    if (Math.abs(delta) < SWIPE_MIN || $(touchTarget).closest(TYPING).length || canScrollInside(touchTarget, delta)) return;
                    step(delta > 0 ? 1 : -1);
                });

            $(window)
                .on('wheel.nav', onWheel)
                .on('popstate.nav hashchange.nav', () => {
                    const index = indexOf(location.hash);
                    if (index >= 0 && index !== current) activate(index, { updateHash: false });
                });

            sb.emit('section:change', { name: SECTIONS[current], index: current });
        },
        unload() { $(document).off('.nav'); $(window).off('.nav'); gsap.killTweensOf('.sec-inner'); }
    };
}
