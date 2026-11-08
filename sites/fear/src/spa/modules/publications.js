import { gsap } from 'gsap';
import { PUBLICATIONS } from '../data/publications.js';
import { esc, safeUrl, pad } from '../utils.js';
import { prefersReducedMotion, isCoarsePointer } from '../config.js';

// Publications shelf (renders into #blog-grid): tilting 3D book cards + a preview dialog
// with prev/next, Esc, focus trap and focus restore. The dialog builds its own DOM.
const hex = (c) => (/^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#ff4560');

const card = (b, n) =>
    `<article class="pub-card" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${esc('Book preview: ' + b.title)}" style="--pub:${hex(b.accent)}">` +
    `<div class="pub-book"><span class="pub-pages"></span>` +
    `<div class="pub-cover"><img src="${esc(safeUrl(b.cover))}" alt="${esc(b.alt || '')}" loading="lazy"><span class="pub-glare"></span></div>` +
    `<span class="pub-spine"></span><span class="pub-no">${pad(n + 1)}</span>` +
    (b.badge ? `<span class="pub-badge">${esc(b.badge)}</span>` : '') + `</div>` +
    `<div class="pub-info"><div class="pub-kind">F.E.A.R. \u00b7 ${esc(b.genre)}</div><h3 class="pub-name">${esc(b.title)}</h3>` +
    `<div class="pub-acro" aria-hidden="true">${b.words.map((w) => `<b>${esc(w.charAt(0))}</b>`).join('')}</div>` +
    `<span class="pub-peek">Preview <i class="bi bi-arrow-right" aria-hidden="true"></i></span></div></article>`;

const MODAL =
    `<div class="pub-modal" id="pub-modal" hidden aria-hidden="true"><div class="pub-backdrop"></div>` +
    `<div class="pub-dialog" role="dialog" aria-modal="true" aria-labelledby="pub-m-title" tabindex="-1">` +
    `<button type="button" class="pub-close" aria-label="Close preview"><i class="bi bi-x-lg" aria-hidden="true"></i></button>` +
    `<div class="pub-m-art"><div class="pub-m-float"><div class="pub-m-book"><img id="pub-m-cover" alt=""></div></div></div>` +
    `<div class="pub-m-copy"><div class="pub-m-kicker" id="pub-m-kicker"></div><h3 id="pub-m-title"></h3><p class="pub-m-tag" id="pub-m-tag"></p>` +
    `<ul class="pub-m-acro" id="pub-m-acro"></ul><p class="pub-m-preview" id="pub-m-preview"></p><dl class="pub-m-meta" id="pub-m-meta"></dl>` +
    `<div class="pub-m-actions"><span id="pub-m-links"></span><span class="pub-m-nav">` +
    `<button type="button" class="pub-nav-btn pub-prev" aria-label="Previous book"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>` +
    `<span class="pub-m-count" id="pub-m-count"></span>` +
    `<button type="button" class="pub-nav-btn pub-next" aria-label="Next book"><i class="bi bi-arrow-right" aria-hidden="true"></i></button></span></div></div></div></div>`;

export default function publicationsModule(sb) {
    let index = -1, want = -1, isOpen = false, returnFocus = null;
    const total = PUBLICATIONS.length;
    const tiltOk = () => !prefersReducedMotion() && !isCoarsePointer();
    const cards = () => $('#blog-grid .pub-card');
    const focusables = () => $('#pub-modal .pub-dialog').find('a[href],button:not([disabled])').filter(':visible');

    // ---- shelf card motion ----
    function onMove(e) {
        const el = e.currentTarget, r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        if (!tiltOk()) return;
        gsap.to($(el).find('.pub-book'), { rotationY: (x / r.width - 0.5) * 16, rotationX: (y / r.height - 0.5) * -10, transformPerspective: 900, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    }
    function onLeave(e) {
        if (!tiltOk()) return;
        gsap.to($(e.currentTarget).find('.pub-book'), { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform', overwrite: 'auto' });
    }
    // section:change fires AFTER nav has already faded the section in, so the cards must already be
    // hidden by then. Otherwise they show, vanish, and animate in again (the double flash).
    const hide = () => { if (!prefersReducedMotion()) gsap.set('#blog-grid .pub-card', { y: 44, opacity: 0 }); };
    function enter() {
        if (prefersReducedMotion()) return;
        gsap.to('#blog-grid .pub-card', { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, delay: 0.1, ease: 'power3.out', clearProps: 'transform,opacity', overwrite: 'auto' });
    }

    // ---- dialog ----
    function render(i) {
        const b = PUBLICATIONS[i]; if (!b) return;
        index = want = i;
        $('#pub-modal .pub-dialog')[0].style.setProperty('--pub', hex(b.accent));
        $('#pub-m-cover').attr({ src: safeUrl(b.cover), alt: b.alt || '' });
        $('#pub-m-kicker').text(`F.E.A.R. \u00b7 ${b.genre}`);
        $('#pub-m-title').text(b.title);
        $('#pub-m-tag').text(b.tagline || '');
        $('#pub-m-acro').html(b.words.map((w) => `<li><b>${esc(w.charAt(0))}</b>${esc(w.slice(1))}</li>`).join(''));
        $('#pub-m-preview').text(b.preview || '');
        $('#pub-m-meta').html(
            `<div><dt>Format</dt><dd>eBook</dd></div><div><dt>Genre</dt><dd>${esc(b.genre)}</dd></div>` +
            `<div><dt>Available on</dt><dd>Amazon</dd></div>` + (b.badge ? `<div><dt>Inside</dt><dd>${esc(b.badge)}</dd></div>` : '')
        );
        const url = safeUrl(b.link);
        $('#pub-m-links').html(url ? `<a class="btn-gold" href="${esc(url)}" target="_blank" rel="noopener">Get it on Amazon <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>` : '');
        $('#pub-m-count').text(`${pad(i + 1)} / ${pad(total)}`);
        $('#pub-modal .pub-dialog').scrollTop(0);
    }

    function open(i, trigger) {
        if (isOpen || i < 0 || i >= total) return;
        isOpen = true; returnFocus = trigger || document.activeElement;
        render(i);
        gsap.killTweensOf('#pub-modal .pub-backdrop, #pub-modal .pub-dialog, #pub-modal .pub-m-book, #pub-modal .pub-m-acro li');
        $('#pub-modal').prop('hidden', false).attr('aria-hidden', 'false');
        $('body').addClass('modal-open');
        if (!prefersReducedMotion()) {
            gsap.fromTo('#pub-modal .pub-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25, clearProps: 'opacity' });
            gsap.fromTo('#pub-modal .pub-dialog', { y: 30, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity' });
            gsap.fromTo('#pub-modal .pub-m-book', { rotationY: -55, x: -30, opacity: 0, transformPerspective: 900 }, { rotationY: -14, x: 0, opacity: 1, duration: 0.9, delay: 0.1, ease: 'power3.out' });
            gsap.from('#pub-modal .pub-m-acro li', { y: 14, opacity: 0, duration: 0.5, stagger: 0.09, delay: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' });
        } else gsap.set('#pub-modal .pub-m-book', { rotationY: -14, transformPerspective: 900 });
        $('#pub-modal .pub-dialog').trigger('focus');
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        const done = () => {
            $('#pub-modal').prop('hidden', true).attr('aria-hidden', 'true');
            gsap.set('#pub-modal .pub-backdrop, #pub-modal .pub-dialog, #pub-modal .pub-m-book, #pub-modal .pub-m-acro li', { clearProps: 'all' });
            $('body').removeClass('modal-open');
            if (returnFocus && document.contains(returnFocus)) $(returnFocus).trigger('focus');
        };
        if (prefersReducedMotion()) return done();
        gsap.killTweensOf('#pub-modal .pub-backdrop, #pub-modal .pub-dialog');
        gsap.to('#pub-modal .pub-backdrop', { opacity: 0, duration: 0.2 });
        gsap.to('#pub-modal .pub-dialog', { y: 18, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: done });
    }

    function step(delta) {
        want = (want + delta + total) % total; // tracks rapid presses during a fade
        if (prefersReducedMotion()) return render(want);
        const parts = '#pub-modal .pub-m-copy, #pub-modal .pub-m-book';
        gsap.killTweensOf(parts);
        gsap.to(parts, {
            opacity: 0, duration: 0.14, onComplete() {
                render(want);
                gsap.fromTo('#pub-modal .pub-m-copy', { opacity: 0, x: delta * 16 }, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' });
                gsap.fromTo('#pub-modal .pub-m-book', { opacity: 0, rotationY: -40 }, { opacity: 1, rotationY: -14, duration: 0.5, ease: 'power3.out' });
                gsap.from('#pub-modal .pub-m-acro li', { y: 10, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.1, clearProps: 'transform,opacity' });
            }
        });
    }

    function onKey(e) {
        if (!isOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        else if (e.key === 'Tab') {
            const $f = focusables(); if (!$f.length) return;
            const first = $f[0], last = $f[$f.length - 1], active = document.activeElement, dlg = $('#pub-modal .pub-dialog')[0];
            if (e.shiftKey && (active === first || active === dlg)) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
        }
    }

    return {
        load() {
            const $grid = $('#blog-grid');
            if (!$grid.length) return sb.warn('publications: missing mount #blog-grid');
            $grid.addClass('pub-shelf').html(PUBLICATIONS.map(card).join(''));
            $('#pub-modal').remove(); $('body').append(MODAL);

            $(document)
                .on('mousemove.pubs', '.pub-card', onMove).on('mouseleave.pubs', '.pub-card', onLeave)
                .on('click.pubs', '.pub-card', function () { open(cards().index(this), this); })
                .on('keydown.pubs', '.pub-card', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(cards().index(this), this); } })
                .on('click.pubs', '#pub-modal .pub-backdrop, #pub-modal .pub-close', close)
                .on('click.pubs', '#pub-modal .pub-prev', () => step(-1))
                .on('click.pubs', '#pub-modal .pub-next', () => step(1))
                .on('keydown.pubs', onKey);

            if (!$('#s7').hasClass('active')) hide();
            sb.add('section:change', (d) => (d.name === 'publications' ? enter() : hide()));
        },
        unload() { close(); $(document).off('.pubs'); gsap.killTweensOf('.pub-card'); $('#pub-modal').remove(); }
    };
}