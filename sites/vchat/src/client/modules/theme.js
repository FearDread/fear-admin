/**
 * Theme switcher module for jquery.gui.js
 *
 * Swaps the page's theme stylesheet when a button is clicked, remembers the choice
 * in localStorage, and announces changes on the GUI broker.
 *
 *   import { registerThemeSwitcher } from './modules/theme-switcher.js';
 *
 *   registerThemeSwitcher(window.FEAR, { version: 'abc123' });
 *   window.FEAR.start('themeSwitcher');
 *
 * Ways to switch:
 *   - the built-in button, appended to `mount` (default ".bar"); each click goes to the next theme
 *   - any element with data-theme-cycle, or data-theme-set="blackout"
 *   - the broker: FEAR.emit('theme:set', { id: 'blackout' }) / FEAR.emit('theme:cycle')
 *   - code: FEAR.registry.get('themeSwitcher').set('blackout')
 *
 * Listen for changes with: sb.add('theme:changed', (theme) => { ... })  // { id, name }
 *
 * Handlers passed to the broker must be written with parenthesized parameters, as above.
 * The framework counts the parameters of a handler by regex to decide whether it is
 * callback-style, and `data => fn(a, b, c)` is miscounted.
 */

const DEFAULTS = {
    themes: [
        { id: 'cyan', name: 'Cyan Ring', href: '/assets/css/styles.css', swatch: '#19c8ff' },
        { id: 'blackout', name: 'Blackout', href: '/assets/css/theme-blackout.css', swatch: '#d4161f' },
    ],
    default: null, // theme id; falls back to whatever the page loaded with, then the first theme
    storageKey: 'vchat:theme',
    linkId: 'theme-css', // id of the <link rel="stylesheet"> to manage; created if missing
    mount: '.bar', // where the built-in button goes
    button: true, // false = no built-in button, use data-theme-* attributes or the broker
    version: '', // cache-buster appended as ?v=... (the server caches .css for a year)
};

export function registerThemeSwitcher(gui = window.FEAR, overrides = {}) {
    if (!gui || typeof gui.create !== 'function') {
        throw new Error('registerThemeSwitcher needs the GUI instance (window.FEAR from jquery.gui.js)');
    }

    // Defaults are passed at registration because gui.start() only reads per-start
    // options from a nested `{ options: {...} }` key.
    gui.create('themeSwitcher', createThemeSwitcher, { ...DEFAULTS, ...overrides });
    return gui;
}

export default function themeModule(sandbox) {
    const $ = sb.$;
    const NS = '.themeswitcher';
    const BUTTON_ID = 'theme-toggle';

    let opts = null;
    let themes = [];
    let current = null;
    let link = null;
    let token = 0; // bumped on every swap so a slow, older request can't win
    const subscriptions = [];

    // ---------------------------------------------------------------- helpers

    const find = (id) => themes.find((t) => t.id === id) || null;
    const url = (t) => (opts.version ? `${t.href}?v=${encodeURIComponent(opts.version)}` : t.href);
    const fail = (err) => sb.warn('themeSwitcher:', err && err.message ? err.message : err);

    const read = () => {
        try {
            return localStorage.getItem(opts.storageKey);
        } catch (err) {
            return null; // storage blocked (private mode, sandboxed iframe)
        }
    };

    const write = (id) => {
        try {
            localStorage.setItem(opts.storageKey, id);
        } catch (err) {
            /* not persisted, still applied for this session */
        }
    };

    const nextAfter = (theme) => themes[(themes.indexOf(theme) + 1) % themes.length];

    // Loads a stylesheet and resolves once it has applied, so the old one is only
    // removed after the new one is ready (no flash of unstyled page).
    const loadLink = (href, after) =>
        new Promise((resolve, reject) => {
            const el = document.createElement('link');
            el.rel = 'stylesheet';
            el.href = href;
            el.onload = () => resolve(el);
            el.onerror = () => {
                el.remove();
                reject(new Error(`Could not load theme stylesheet: ${href}`));
            };

            // Insert next to the current theme so cascade order versus other sheets stays put.
            if (after && after.parentNode) after.after(el);
            else document.head.appendChild(el);
        });

    // ----------------------------------------------------------------- button

    const renderButton = () => {
        if (!opts.button || themes.length < 2) return;

        const $mount = $(opts.mount).first();
        if (!$mount.length) return; // this view has no bar; it is picked up on components:init

        let $btn = $(`#${BUTTON_ID}`);

        if (!$btn.length) {
            $btn = $(`<button type="button" id="${BUTTON_ID}" class="quiet" data-theme-cycle></button>`).appendTo($mount);
        }

        const shown = current || themes[0];
        const next = nextAfter(shown);

        const swatch = document.createElement('span');
        swatch.setAttribute('aria-hidden', 'true');
        Object.assign(swatch.style, {
            display: 'inline-block',
            width: '0.7em',
            height: '0.7em',
            marginRight: '0.5em',
            borderRadius: '50%',
            background: shown.swatch || 'currentColor',
        });

        $btn
            .empty()
            .append(swatch, document.createTextNode(shown.name))
            .attr({
                title: `Switch to ${next.name}`,
                'aria-label': `Theme: ${shown.name}. Switch to ${next.name}`,
            });
    };

    const reflect = () => {
        if (current) document.documentElement.dataset.theme = current.id;
        renderButton();
    };

    // ----------------------------------------------------------------- switch

    const swap = (theme, persist) => {
        const mine = ++token;

        return loadLink(url(theme), link).then((next) => {
            if (mine !== token) {
                next.remove(); // a newer request started while this one was loading
                return current;
            }

            const old = link;
            if (old) {
                old.removeAttribute('id'); // keep ids unique
                old.remove();
            }

            next.id = opts.linkId;
            link = next;
            current = theme;

            if (persist) write(theme.id);
            reflect();

            sandbox
                .emit('theme:changed', { id: theme.id, name: theme.name })
                .catch(fail);

            return theme;
        });
    };

    const set = (id, persist = true) => {
        const theme = find(id);
        if (!theme) return Promise.reject(new Error(`Unknown theme: ${id}`));

        if (theme === current) {
            if (persist) write(theme.id);
            return Promise.resolve(theme);
        }

        return swap(theme, persist);
    };

    const cycle = () => set(nextAfter(current).id);

    return {
        set,
        cycle,
        load: (options) => {
            opts = { ...DEFAULTS, ...options };
            themes = (opts.themes || []).map((t) => ({ ...t }));

            if (!themes.length) return Promise.reject(new Error('themeSwitcher needs at least one theme'));

            link = document.getElementById(opts.linkId);

            if (!link) {
                link = document.createElement('link');
                link.id = opts.linkId;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }

            const loadedHref = (link.getAttribute('href') || '').split('?')[0];
            current = themes.find((t) => t.href === loadedHref) || null;

            const wanted = find(read()) || find(opts.default) || current || themes[0];

            if (!link.getAttribute('href')) {
                link.href = url(wanted);
                current = wanted;
            }

            $(document)
                .on(`click${NS}`, '[data-theme-cycle]', (e) => {
                    e.preventDefault();
                    cycle().catch(fail);
                })
                .on(`click${NS}`, '[data-theme-set]', (e) => {
                    e.preventDefault();
                    set($(e.currentTarget).attr('data-theme-set')).catch(fail);
                });

            // broker: other modules can drive the switcher, and views re-render the bar
            const onSet = (data) => set(data && data.id).catch(fail);
            const onCycle = () => cycle().catch(fail);
            const onMount = () => renderButton();

            [
                ['theme:set', onSet],
                ['theme:cycle', onCycle],
                ['components:init', onMount],
            ].forEach(([channel, handler]) => {
                sb.add(channel, handler);
                subscriptions.push([channel, handler]);
            });

            reflect();

            // The page loaded with one theme but the saved choice is another: swap without re-saving.
            if (wanted !== current) return swap(wanted, false).catch(fail);

            return Promise.resolve();
        },
        unload: () => {
            $(document).off(NS);
            $(`#${BUTTON_ID}`).remove();
            delete document.documentElement.dataset.theme;

            // Leave the stylesheet in place; unloading the switcher should not unstyle the page.
            // Broker removal goes last so a failure there cannot leave DOM behind.
            subscriptions.splice(0).forEach(([channel, handler]) => sb.remove(channel, handler));

            return Promise.resolve();
        },
        current: () => current,
        list: () => themes.map((t) => ({ ...t })),
    };
}