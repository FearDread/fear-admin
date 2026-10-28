// hipcomic-collection-export.js  (rendered-frame version)
// Same output as collection.mjs, but loads each collection page in a hidden frame and scrolls it so
// the site draws every cover before reading it. Slower, use it if collection.mjs reports covers missing.
//
// Run in YOUR browser on your collection page: F12 -> Console -> paste -> Enter.
// It runs as you, in your real browser session, so there is no scraping client for the site to block.


(async () => {
    const PAGE_PARAM = 'page';        // if the URL changes to something else when you click page 2, change this
    const PAGE_DELAY_MS = 800;        // pause between collection pages
    const PAGE_TIMEOUT_MS = 20000;    // max wait for one page to render and load its covers
    const TICK_MS = 300;              // how often the hidden frame is checked / scrolled
    const SCROLL_STEP_PX = 500;       // scroll distance per tick (covers load lazily as tiles come into view)
    const SETTLE_MS = 2500;           // at the bottom with no new covers for this long = done (some comics have no cover)
    const MAX_PAGES = 300;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Each comic is <a class="my-comic-tile"> containing .v-image__image whose CSS
    // background-image is the cover. Vuetify only creates that div once the tile scrolls into view.
    const TILE_SEL = 'a.my-comic-tile, a[href*="/collection/"][href*="/comic/"]';
    const BG_RE = /url\((['"]?)(.*?)\1\)/i;
    const SKIP_IMG = /(^data:|nxt-static|hipicon|placeholder|favicon|\.svg(\?|$))/i;

    /* ------------------------------------------------------------ image helpers */

    function bgUrl(el) {
        console.log('Selected el = ', el);
        const view = el.ownerDocument.defaultView;
        const computed = view ? view.getComputedStyle(el).backgroundImage : '';
        const m = (computed || '').match(BG_RE) || (el.getAttribute('style') || '').match(BG_RE);
        return m ? m[2] : null;
    }

    function tileImage(a) {
        const candidates = [];
        const bg = a.querySelector('.v-image__image');
        if (bg) candidates.push(bgUrl(bg));
        const img = a.querySelector('img');
        if (img) candidates.push(img.getAttribute('src') || img.getAttribute('data-src'));
        for (const u of candidates) {
            if (!u || SKIP_IMG.test(u)) continue;
            try {
                return new URL(u, location.origin).href;
            } catch { /* ignore bad URL */ }
        }
        return null;
    }

    /* ------------------------------------------------------------- tile parsing */

    function parseAnchor(a) {
        console.log('selected anchor = ', a);
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

    // Everything we want from one rendered collection page
    function harvest(doc) {
        console.log('harvesting document :: ', doc);
        const items = [];
        for (const a of doc.querySelectorAll(TILE_SEL)) {
            const item = parseAnchor(a);
            if (item) items.push(item);
        }
        const m = (doc.body.innerText || '').match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/);
        return { items, total: m ? Number(m[1]) : null, missing: items.filter((i) => !i.image).length };
    }

    /* ------------------------------------------------- render one page in a frame */

    // Loads `url` in a hidden same-origin iframe, scrolls it so every tile's cover loads,
    // then harvests the rendered DOM. The frame sits inside the viewport (but invisible)
    // because lazy loading is triggered by intersection with the viewport.
    function renderPage(url) {
        return new Promise((resolve) => {
            const frame = document.createElement('iframe');
            frame.style.cssText =
                'position:fixed;left:0;top:0;width:1100px;height:900px;border:0;opacity:0;pointer-events:none;z-index:-1;';
            const started = Date.now();
            let lastWithImage = -1;
            let lastChange = Date.now();

            const done = () => {
                clearInterval(timer);
                let out = { items: [], total: null, missing: 0 };
                try {
                    out = harvest(frame.contentDocument);
                } catch { /* frame blocked or unreadable */ }
                frame.remove();
                resolve(out);
            };

            const timer = setInterval(() => {
                let doc, win;
                try {
                    doc = frame.contentDocument;
                    win = frame.contentWindow;
                } catch {
                    return done();
                }
                if (!doc || !win || doc.readyState === 'loading') return;

                const tiles = [...doc.querySelectorAll(TILE_SEL)];
                const withImage = tiles.filter((a) => a.querySelector('.v-image__image')).length;
                if (withImage !== lastWithImage) {
                    lastWithImage = withImage;
                    lastChange = Date.now();
                }

                const atBottom = win.scrollY + win.innerHeight >= doc.documentElement.scrollHeight - 5;
                if (tiles.length && withImage === tiles.length) return done();
                if (tiles.length && atBottom && Date.now() - lastChange > SETTLE_MS) return done();
                if (Date.now() - started > PAGE_TIMEOUT_MS) return done();

                win.scrollBy(0, SCROLL_STEP_PX);
            }, TICK_MS);

            frame.src = url;
            document.body.appendChild(frame);
        });
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
