import { gsap } from 'gsap';
import { PROFILE } from '../data/resume.js';
import { prefersReducedMotion } from '../config.js';

// [text, status, css class]
const BOOT_LINES = [
    ['Detecting caffeine levels', 'LOW', 'warn'],
    ['Mounting /dev/garrett (read-only)', 'OK', 'ok'],
    ['Loading Linux, the one true kernel', 'OK', 'ok'],
    ['Starting nginx', 'OK', 'ok'],
    ['Checking server_name directive', 'FOUND IT', 'ok'],
    ['Verifying backups', 'LOL', 'fail'],
    ['Calculating uptime', '99.9% (self-reported)', 'warn'],
    ['Starting sanity.service', 'FAILED', 'fail'],
    ['Proceeding anyway', 'OK', 'ok']
];
const GLYPHS = '!<>-_\\/[]{}\u2014=+*^?#01';
const KEY = 'fear:booted';
const store = {
    get() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } },
    set() { try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* private mode: replay is fine */ } }
};

export default function introModule() {
    let master, entrance, running = false;

    // Entrance of the page chrome + current section, built paused so it starts hidden.
    function buildEntrance() {
        const hero = $('.section.active .hero-inner').length > 0;
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', clearProps: 'transform,opacity' } });
        if (hero) {
            tl.from('.hero-eyebrow', { x: -30, opacity: 0, duration: 0.9 }, 0)
                .from('.hero-name .line1, .hero-name .line2', { yPercent: 40, opacity: 0, duration: 1.1, stagger: 0.15 }, 0.05)
                .from('.hero-sub, .hero-type, .hero-ctas, .hero-tags', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.6);
        } else {
            tl.from('.section.active .sec-inner', { y: 60, opacity: 0, duration: 1.1 }, 0);
        }
        return tl.from('#topbar', { y: -40, opacity: 0, duration: 0.9 }, 0.2)
            .from('#side-nav', { x: -40, opacity: 0, duration: 0.9 }, 0.35)
            .from('#bottombar', { y: 40, opacity: 0, duration: 0.9 }, 0.3);
    }

    function finish() {
        running = false;
        $('#boot').addClass('boot-done');
        $('body').removeClass('booting');
        $(document).off('.introskip');
        window.__fearBooted = true;
        store.set();
    }

    function addLine(log, [text, status, cls]) {
        const dots = '.'.repeat(Math.max(3, 40 - text.length));
        log.insertAdjacentHTML('beforeend', `${log.childNodes.length ? '\n' : ''}${text} ${dots} [<span class="${cls}">${status}</span>]`);
    }

    function scramble(tl, el, text, position) {
        const o = { p: 0 };
        tl.to(o, {
            p: 1, duration: 1.1, ease: 'none',
            onUpdate() {
                const done = Math.floor(o.p * text.length);
                el.textContent = text.split('').map((c, i) => (c === ' ' || i < done ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
                el.style.textShadow = `${rnd()}px 0 #ff4560, ${rnd()}px 0 #0af0c8`;
            },
            onComplete() { el.textContent = text; el.style.textShadow = '2px 0 rgba(255,69,96,.45), -2px 0 rgba(10,240,200,.35)'; }
        }, position);
        function rnd() { return (Math.random() * 6 - 3).toFixed(1); }
    }

    function play() {
        running = true;
        const log = document.getElementById('boot-log'), fill = document.getElementById('boot-fill');
        const nameEl = document.getElementById('boot-name'), subEl = document.getElementById('boot-sub');
        log.innerHTML = ''; nameEl.textContent = ''; nameEl.style.textShadow = '';
        gsap.set('#boot .boot-top, #boot .boot-bottom, #boot .boot-seam, #boot .boot-crt, #boot .boot-name, #boot .boot-sub, #boot .boot-skip, #boot-fill', { clearProps: 'all' });
        $('#boot').removeClass('boot-done'); $('body').addClass('booting');
        entrance = buildEntrance();

        master = gsap.timeline({ onComplete: finish });
        master.fromTo('.boot-crt', { scaleY: 0.004, scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.22, ease: 'power2.out' }, 0.2)
            .to('.boot-crt', { scaleY: 1, duration: 0.3, ease: 'power3.out' });

        BOOT_LINES.forEach((line, n) => {
            master.add(() => addLine(log, line), `>+${(0.1 + Math.random() * 0.14).toFixed(2)}`)
                .to(fill, { width: `${Math.round(((n + 1) / BOOT_LINES.length) * 100)}%`, duration: 0.12, ease: 'none' }, '<');
        });

        master.to('.boot-crt', { opacity: 0, duration: 0.25 }, '+=0.45');
        master.set(nameEl, { opacity: 1 }, '>');
        scramble(master, nameEl, PROFILE.name.toUpperCase(), '<');
        master.to(subEl, { opacity: 1, duration: 0.5 }, '-=0.4')
            .addLabel('reveal', '+=0.7')
            .to('#boot .boot-name, #boot .boot-sub, #boot .boot-skip', { opacity: 0, duration: 0.25 }, 'reveal')
            .to('.boot-seam', { scaleX: 1, duration: 0.35, ease: 'power3.inOut' }, 'reveal')
            .to('.boot-top', { yPercent: -101, duration: 0.9, ease: 'power4.inOut' }, 'reveal+=0.35')
            .to('.boot-bottom', { yPercent: 101, duration: 0.9, ease: 'power4.inOut' }, '<')
            .to('.boot-seam', { opacity: 0, duration: 0.35 }, 'reveal+=0.6')
            .add(() => { $('body').removeClass('booting'); entrance.play(); }, 'reveal+=0.7');

        // Any click, key, or tap fast-forwards instead of cutting, so the reveal still lands.
        $(document).on('keydown.introskip click.introskip touchstart.introskip', () => {
            if (master) master.timeScale(6);
            $('.boot-skip').hide();
        });
    }

    return {
        load() {
            const skip = prefersReducedMotion() || store.get() || !document.getElementById('boot');
            if (skip) {
                $('html').addClass('no-boot'); $('#boot').addClass('boot-done'); $('body').removeClass('booting');
                window.__fearBooted = true;
                if (!prefersReducedMotion()) buildEntrance().play();
            } else {
                play();
            }
            // Click the logo to replay the boot sequence.
            $(document).on('click.introreplay', '.logo', () => {
                if (running || prefersReducedMotion()) return;
                $('html').removeClass('no-boot'); play();
            });
        },
        unload() { if (master) master.kill(); if (entrance) entrance.kill(); $(document).off('.introskip .introreplay'); }
    };
}
