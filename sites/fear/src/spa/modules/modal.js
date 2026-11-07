import { gsap } from 'gsap';
import { PROJECTS } from '../data/resume.js';
import { esc, safeUrl, icon, pad } from '../utils.js';
import { prefersReducedMotion } from '../config.js';

// Project detail dialog: opens from a .proj-row, supports prev/next, Esc, focus trap and focus restore.
export default function modalModule() {
    let index = -1, want = -1, isOpen = false, returnFocus = null;

    const $modal = () => $('#modal');
    const rows = () => $('#proj-list .proj-card');
    const focusables = () => $('#modal .modal-card').find('a[href],button:not([disabled])').filter(':visible');

    function render(i) {
        const p = PROJECTS[i]; if (!p) return;
        index = want = i;
        $('#modal-icon').attr('class', 'bi ' + icon(p.icon));
        $('#modal-kicker').text([p.category, p.status].filter(Boolean).join(' \u00b7 '));
        $('#modal-title').text(p.title);
        $('#modal-summary').text(p.summary || '');
        $('#modal-meta').html(
            `<div><dt>Role</dt><dd>${esc(p.role || '')}</dd></div>` +
            `<div class="modal-stack"><dt>Stack</dt><dd>${(p.tags || []).map((t) => `<span class="tech-tag">${esc(t)}</span>`).join('')}</dd></div>`
        );
        $('#modal-list').html((p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join(''));
        const url = safeUrl(p.link);
        $('#modal-links').html(url ? `<a class="btn-gold" href="${esc(url)}" target="_blank" rel="noopener">Visit project <i class="bi bi-arrow-up-right"></i></a>` : '');
        $('#modal-count').text(`${pad(i + 1)} / ${pad(PROJECTS.length)}`);
        $('#modal .modal-card').scrollTop(0);
    }

    function open(i, trigger) {
        if (isOpen || i < 0 || i >= PROJECTS.length) return;
        isOpen = true; returnFocus = trigger || document.activeElement;
        render(i);
        gsap.killTweensOf('#modal .modal-backdrop, #modal .modal-card');
        $modal().prop('hidden', false).attr('aria-hidden', 'false');
        $('body').addClass('modal-open');
        if (!prefersReducedMotion()) {
            gsap.fromTo('#modal .modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25, clearProps: 'opacity' });
            gsap.fromTo('#modal .modal-card', { y: 28, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', clearProps: 'transform,opacity' });
        }
        $('#modal .modal-card').trigger('focus');
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        const done = () => {
            $modal().prop('hidden', true).attr('aria-hidden', 'true');
            gsap.set('#modal .modal-backdrop, #modal .modal-card', { clearProps: 'all' });
            $('body').removeClass('modal-open');
            if (returnFocus && document.contains(returnFocus)) $(returnFocus).trigger('focus');
        };
        if (prefersReducedMotion()) return done();
        gsap.killTweensOf('#modal .modal-backdrop, #modal .modal-card');
        gsap.to('#modal .modal-backdrop', { opacity: 0, duration: 0.2 });
        gsap.to('#modal .modal-card', { y: 16, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: done });
    }

    function step(delta) {
        want = (want + delta + PROJECTS.length) % PROJECTS.length; // tracks rapid presses while a fade is running
        if (prefersReducedMotion()) return render(want);
        const parts = '#modal .modal-head, #modal .modal-body';
        gsap.killTweensOf(parts);
        gsap.to(parts, { opacity: 0, x: delta * -14, duration: 0.14, onComplete() {
            render(want);
            gsap.fromTo(parts, { opacity: 0, x: delta * 14 }, { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out', clearProps: 'transform,opacity' });
        } });
    }

    function onKey(e) {
        if (!isOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        else if (e.key === 'Tab') {
            const $f = focusables(); if (!$f.length) return;
            const first = $f[0], last = $f[$f.length - 1], active = document.activeElement;
            if (e.shiftKey && (active === first || active === $('#modal .modal-card')[0])) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
        }
    }

    return {
        load() {
            $(document)
                .on('click.modal', '.proj-card', function () { open(rows().index(this), this); })
                .on('keydown.modal', '.proj-card', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(rows().index(this), this); } })
                .on('click.modal', '#modal .modal-backdrop, #modal .modal-close', close)
                .on('click.modal', '#modal .modal-prev', () => step(-1))
                .on('click.modal', '#modal .modal-next', () => step(1))
                .on('keydown.modal', onKey);
        },
        unload() { close(); $(document).off('.modal'); }
    };
}
