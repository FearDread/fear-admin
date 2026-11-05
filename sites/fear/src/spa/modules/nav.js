import { SECTIONS, TYPING } from '../config.js';
import { gsap } from 'gsap';
import { pad } from '../utils.js';
export default function navModule(sb) {
    let current = 0, busy = false, wheelAt = 0, touchY = 0;
    function routeIndex(name) { return SECTIONS.indexOf(String(name || '').replace(/^#/, '').toLowerCase()); }
    function activate(index, { updateHash = true } = {}) {
        if (index < 0 || index >= SECTIONS.length || busy || index === current) return Promise.resolve();
        busy = true;
        const direction = index > current ? 1 : -1, $old = $('.section').eq(current), $next = $('.section').eq(index);
        return new Promise((resolve) => {
            gsap.to($old.find('.sec-inner'), { y: direction * -55, opacity: 0, duration: .38, ease: 'power2.in', onComplete() {
                $old.removeClass('active'); gsap.set($old.find('.sec-inner'), { y: 0, opacity: 1 });
                $next.addClass('active'); gsap.fromTo($next.find('.sec-inner'), { y: direction * 65, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', delay: .12 }); resolve();
            }});
        }).then(() => { current = index; $('.snav-item').removeClass('active').filter('[data-s="' + index + '"],[data-route="' + SECTIONS[index] + '"]').addClass('active'); $('#cur-num').text(pad(index + 1)); if (updateHash && location.hash !== '#' + SECTIONS[index]) history.pushState({ route: SECTIONS[index] }, '', '#' + SECTIONS[index]); return sb.emit('section:change', { name: SECTIONS[index], index }); }).finally(() => { busy = false; });
    }
    return { load() {
        const initial = routeIndex(location.hash); if (initial >= 0) current = initial;
        $('.section').removeClass('active').eq(current).addClass('active'); $('.snav-item').removeClass('active').filter('[data-s="' + current + '"],[data-route="' + SECTIONS[current] + '"]').addClass('active'); $('#cur-num').text(pad(current + 1));
        sb.add('spa:navigate', ({ route, index, options } = {}) => activate(index == null ? routeIndex(route) : index, options));
        $(document).on('click.nav', '.snav-item,a[href^="#"]', function (e) { const route = ($(this).data('route') || $(this).data('s')) ?? String($(this).attr('href') || '').slice(1); const index = Number.isInteger(route) || /^\d+$/.test(route) ? Number(route) : routeIndex(route); if (index >= 0) { e.preventDefault(); activate(index); } });
        $(window).on('wheel.nav', (e) => { if ($(e.target).closest(TYPING).length) return; const now = Date.now(); if (now - wheelAt < 850) return; wheelAt = now; activate(current + (e.originalEvent.deltaY > 0 ? 1 : -1)); });
        $(document).on('keydown.nav', (e) => { if ($(e.target).closest(TYPING).length) return; if (e.key === 'ArrowDown' || e.key === 'PageDown') activate(current + 1); if (e.key === 'ArrowUp' || e.key === 'PageUp') activate(current - 1); const n = Number(e.key); if (n >= 1 && n <= SECTIONS.length) activate(n - 1); }).on('touchstart.nav', (e) => { touchY = e.originalEvent.touches[0].clientY; }).on('touchend.nav', (e) => { const delta = touchY - e.originalEvent.changedTouches[0].clientY; if (Math.abs(delta) > 40) activate(current + (delta > 0 ? 1 : -1)); });
        $(window).on('popstate.nav hashchange.nav', () => { const index = routeIndex(location.hash); if (index >= 0 && index !== current) activate(index, { updateHash: false }); });
        sb.emit('section:change', { name: SECTIONS[current], index: current });
    }, unload() { $(document).off('.nav'); $(window).off('.nav'); } };
}
