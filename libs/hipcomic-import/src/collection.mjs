// hipcomic-collection-export.js
// Run this in YOUR browser, on your own collection page:
//   1. Open https://www.hipcomic.com/myc/@<you>/collection (sign in if needed)
//   2. F12 -> Console -> paste this whole file -> Enter
//   3. It loads each page of your collection in a hidden frame, scrolls to every comic tile and
//      waits for its cover to actually finish loading, then downloads hipcomic-collection.json
//
// It runs as you, in your real browser session, so there is no scraping
// client for the site to block.

(async () => {
    const PAGE_PARAM = 'page';        // if the URL changes to something else when you click page 2, change this
    const PAGE_DELAY_MS = 800;        // pause between collection pages
    const PAGE_TIMEOUT_MS = 20000;    // max wait for a page's tiles to appear
    const COVER_TIMEOUT_MS = 5000;    // max wait for ONE tile's cover (comics with no cover hit this)
    const POLL_MS = 100;
    const MAX_PAGES = 300;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Each comic is <a class="my-comic-tile">. Its cover is the CSS background-image of the
    // .v-image__image div inside it. That div does not exist until the tile scrolls into view,
    // and while the cover downloads it carries the class v-image__image--preload (a blurred
    // placeholder). A cover only counts as loaded once that class is gone.
    const TILE_SEL = 'a.my-comic-tile, a[href*="/collection/"][href*="/comic/"]';
    const BG_RE = /url\((['"]?)(.*?)\1\)/i;

    async function waitFor(fn, timeoutMs) {
        const end = Date.now() + timeoutMs;
        for (;;) {
            let v = null;
            try { v = fn(); } catch { /* frame not ready yet */ }
            if (v) return v;
            if (Date.now() > end) return null;
            await sleep(POLL_MS);
        }
    }

    /* ------------------------------------------------------------ image helpers */

    // Cover URL of a tile, or null if it isn't drawn yet / is still the preload placeholder
    function tileImage(a) {
        const el = a.querySelector('.v-image__image');
        if (!el || el.classList.contains('v-image__image--preload')) return null;
        const view = el.ownerDocument.defaultView;
        const computed = view ? view.getComputedStyle(el).backgroundImage : '';
        const m = (computed || '').match(BG_RE) || (el.getAttribute('style') || '').match(BG_RE);
        if (!m || !m[2]) return null;
        try {
            return new URL(m[2], location.origin).href;
        } catch {
            return null;
        }
    }

    /* ------------------------------------------------------------- tile parsing */

    function parseAnchor(a) {
        const href = a.getAttribute('href') || '';
        if (!/\/collection\//.test(href) || !/\/comic\//.test(href)) return null;
        const path = new URL(href, location.origin).pathname.split('/').filter(Boolean);
        const rest = path.slice(path.indexOf('collection') + 1);
        const id = rest[rest.length - 1];
        if (!/^[0-9a-f]{24}$/i.test(id)) return null;

        // URL shape: [country]/[publisher]/comic/[series-slug]/[issue]/[variant...]/[id]  or  comic/[id]
        const ci = rest.indexOf('comic');
        const full = ci === 2;
        const text = a.textContent.replace(/\s+/g, ' ').trim();

        const m = text.match(/^(.*?)\s*Grade:\s*(.+?)\s*FMV:\s*(\$[\d,.]+|--)\s*$/);
        let head = m ? m[1] : text;
        const key = head.includes('\u{1F511}');
        const starred = /\*/.test(head);
        head = head.replace('\u{1F511}', '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();

        let series = null, issue = null, variant = null, year = null;
        const t1 = head.match(/^(.*?)\s+#(\S+)\s*(.*?)\s*\((\d{4})\)$/);
        const t2 = head.match(/^(.*?)\s*\((\d{4})\)$/);
        if (t1) [, series, issue, variant, year] = t1;
        else if (t2) [, series, year] = t2;
        else if (head) series = head;

        const gradeRaw = m ? m[2] : null;
        const gm = gradeRaw && gradeRaw.match(/^(\S+)\s+([\d.]+)$/);

        return {
            hipcomicId: id,
            url: new URL(href, location.origin).href.split(/[?#]/)[0],
            title: head || null,
            series: series || null,
            seriesYear: year ? Number(year) : null,
            issue: issue || null,
            variant: variant || null,
            keyIssue: key,
            starred,
            grade: gradeRaw,
            gradeLabel: gm ? gm[1] : null,
            gradeNumeric: gm ? Number(gm[2]) : null,
            fmv: m && m[3] !== '--' ? Number(m[3].replace(/[$,]/g, '')) : null,
            country: full ? rest[0] : null,
            publisherSlug: full ? rest[1] : null,
            seriesSlug: full ? rest[3] : null,
            issueSlug: full ? rest[4] : null,
            variantSlug: full && rest.length > 6 ? rest.slice(5, -1).join('/') : null,
            image: tileImage(a),
            rawText: text,
        };
    }

    function harvest(doc) {
        const items = [];
        for (const a of doc.querySelectorAll(TILE_SEL)) {
            const item = parseAnchor(a);
            if (item) items.push(item);
        }
        const m = (doc.body.innerText || '').match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/);
        return { items, total: m ? Number(m[1]) : null, missing: items.filter((i) => !i.image).length };
    }

    /* ------------------------------------------------- render one page in a frame */

    // Loads `url` in a hidden same-origin iframe. The frame sits inside the viewport (but is
    // invisible) because the site loads covers when a tile intersects the viewport. Each tile is
    // scrolled into view in turn and we wait until ITS cover has finished loading before moving on.
    async function renderPage(url) {
        const frame = document.createElement('iframe');
        frame.style.cssText =
            'position:fixed;left:0;top:0;width:1100px;height:900px;border:0;opacity:0;pointer-events:none;z-index:-1;';
        frame.src = url;
        document.body.appendChild(frame);
        try {
            const doc = await waitFor(() => {
                const d = frame.contentDocument;
                return d && d.readyState !== 'loading' && d.querySelectorAll(TILE_SEL).length ? d : null;
            }, PAGE_TIMEOUT_MS);
            if (!doc) return { items: [], total: null, missing: 0 };

            await sleep(300); // let the page finish adding its tiles
            const tiles = [...doc.querySelectorAll(TILE_SEL)];
            let slow = 0;
            for (const a of tiles) {
                if (tileImage(a)) continue; // already loaded
                a.scrollIntoView({ block: 'center' });
                const ok = await waitFor(() => tileImage(a), COVER_TIMEOUT_MS);
                if (!ok) slow++;
            }
            if (slow) console.log(`  ${slow} tile(s) never finished loading a cover (probably comics with no cover image)`);
            return harvest(doc);
        } catch (err) {
            console.warn('Frame error:', err);
            return { items: [], total: null, missing: 0 };
        } finally {
            frame.remove();
        }
    }

    function download(items) {
        const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'hipcomic-collection.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    /* ------------------------------------------------------------------- main */

    const all = new Map();
    let total = null;
    window.__hipcomicItems = []; // still reachable from the console if anything is interrupted

    try {
        for (let p = 1; p <= MAX_PAGES; p++) {
            if (total && all.size >= total) break;

            const url = new URL(location.href);
            url.searchParams.set(PAGE_PARAM, String(p));
            const page = await renderPage(url.href);
            if (total == null) total = page.total;

            let added = 0;
            for (const item of page.items) {
                const prev = all.get(item.hipcomicId);
                if (!prev) {
                    all.set(item.hipcomicId, item);
                    added++;
                } else if (!prev.image && item.image) {
                    prev.image = item.image;
                }
            }
            window.__hipcomicItems = [...all.values()];
            console.log(
                `Page ${p}: ${page.items.length} tiles, +${added} new, ${page.missing} without a cover ` +
                `(running total ${all.size}${total ? `/${total}` : ''})`,
            );

            if (!page.items.length) {
                console.warn(
                    `Page ${p} rendered no comic tiles. If this is page 1, the site may block framing: check the console ` +
                    `for a frame error and tell me what it says. Otherwise "${PAGE_PARAM}" may not be the pagination ` +
                    'parameter (click page 2 manually, look at the address bar, and update PAGE_PARAM).',
                );
                break;
            }
            if (!added) {
                console.warn(`No new items on page ${p}, stopping.`);
                break;
            }
            await sleep(PAGE_DELAY_MS);
        }
    } finally {
        const items = [...all.values()];
        const withImage = items.filter((i) => i.image).length;
        if (items.length) download(items);
        console.log(
            `Done: ${items.length}${total ? ` of ${total}` : ''} items` +
            `${items.length ? ' saved to hipcomic-collection.json' : ' (nothing to save)'} ` +
            `(${withImage} with an image, ${items.length - withImage} without)`,
        );
    }
})();
