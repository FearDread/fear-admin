// hipcomic-collection-export.js
// Run this in YOUR browser, on your own collection page:
//   1. Open https://www.hipcomic.com/myc/@<you>/collection (sign in if needed)
//   2. F12 -> Console -> paste this whole file -> Enter
//   3. It walks every page of your collection, then opens each comic's own page
//      to read its cover image URL, and downloads hipcomic-collection.json
//
// It runs as you, in your real browser session, so there is no scraping
// client for the site to block.

(async () => {
    const PAGE_PARAM = 'page';       // if the URL changes to something else when you click page 2, change this
    const DELAY_MS = 1200;           // pause between collection pages
    const DETAIL_DELAY_MS = 500;     // pause after each comic page (per worker)
    const CONCURRENCY = 2;           // comic pages loaded at once
    const IFRAME_TIMEOUT_MS = 10000; // per-comic wait in iframe mode
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    /* ------------------------------------------------------------ image helpers */

    const BG_RE = /url\((['"]?)(.*?)\1\)/i;
    const SKIP_IMG = /(^data:|nxt-static|hipicon|placeholder|favicon|\/logo|\.svg(\?|$))/i;

    // Vuetify draws images as a div with a CSS background-image, not an <img>
    function bgUrl(el) {
        const view = el.ownerDocument.defaultView;
        const computed = view ? view.getComputedStyle(el).backgroundImage : '';
        const m = (computed || '').match(BG_RE) || (el.getAttribute('style') || '').match(BG_RE);
        return m ? m[2] : null;
    }

    // All candidate cover URLs on a comic page, best guess first
    function extractImages(doc) {
        const found = [];
        const add = (u) => {
            if (!u || SKIP_IMG.test(u)) return;
            try {
                const abs = new URL(u, location.origin).href;
                if (!found.includes(abs)) found.push(abs);
            } catch { /* ignore bad URLs */ }
        };
        doc.querySelectorAll('.v-image__image, [style*="background-image"]').forEach((el) => add(bgUrl(el)));
        doc.querySelectorAll('img').forEach((img) => add(img.getAttribute('src') || img.getAttribute('data-src')));
        add(doc.querySelector('meta[property="og:image"]')?.getAttribute('content'));
        return found;
    }

    // Mode 1: fetch the comic page's HTML (fast, works if the image is in the server-rendered HTML)
    async function imagesViaFetch(url) {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return extractImages(new DOMParser().parseFromString(await res.text(), 'text/html'));
    }

    // Mode 2: load the comic page in a hidden iframe and wait for the page's JS to draw the image
    function imagesViaIframe(url) {
        return new Promise((resolve, reject) => {
            const frame = document.createElement('iframe');
            frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:1024px;height:768px;opacity:0;pointer-events:none;';
            const started = Date.now();
            const finish = (fn, val) => { clearInterval(timer); frame.remove(); fn(val); };
            const timer = setInterval(() => {
                try {
                    const doc = frame.contentDocument;
                    if (doc && doc.readyState !== 'loading') {
                        const imgs = extractImages(doc);
                        if (imgs.length) return finish(resolve, imgs);
                    }
                } catch (err) {
                    return finish(reject, err);
                }
                if (Date.now() - started > IFRAME_TIMEOUT_MS) finish(resolve, []);
            }, 300);
            frame.src = url;
            document.body.appendChild(frame);
        });
    }

    let useIframe = false;
    async function fillImage(item) {
        try {
            const imgs = useIframe ? await imagesViaIframe(item.url) : await imagesViaFetch(item.url);
            item.image = imgs[0] || null;
            item.images = imgs;
            delete item.imageError;
        } catch (err) {
            item.image = null;
            item.images = [];
            item.imageError = String(err.message || err);
        }
    }

    /* ------------------------------------------------------------- list parsing */

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
            image: null,   // filled from each comic's own page below
            images: [],
            rawText: text,
        };
    }

    const all = new Map();
    function addFrom(root) {
        let added = 0;
        for (const a of root.querySelectorAll('a[href*="/collection/"]')) {
            const item = parseAnchor(a);
            if (item && !all.has(item.hipcomicId)) {
                all.set(item.hipcomicId, item);
                added++;
            }
        }
        return added;
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

    /* --------------------------------------------------- 1) walk the list pages */

    addFrom(document);
    const totalMatch = document.body.innerText.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/);
    const total = totalMatch ? Number(totalMatch[1]) : null;
    console.log(`Page 1: ${all.size} items${total ? ` (collection total ${total})` : ''}`);

    for (let p = 2; p <= 300; p++) {
        if (total && all.size >= total) break;
        await sleep(DELAY_MS);
        const url = new URL(location.href);
        url.searchParams.set(PAGE_PARAM, String(p));
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) {
            console.warn(`Page ${p}: HTTP ${res.status}, stopping.`);
            break;
        }
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const added = addFrom(doc);
        console.log(`Page ${p}: +${added} (running total ${all.size}${total ? `/${total}` : ''})`);
        if (!added) {
            console.warn(
                `No new items on page ${p}. Either "${PAGE_PARAM}" is not the pagination parameter, or the list is ` +
                'rendered client-side. Click page 2 manually, look at the address bar, and update PAGE_PARAM.',
            );
            break;
        }
    }

    const items = [...all.values()];
    window.__hipcomicItems = items; // still reachable from the console if anything below is interrupted

    /* ------------------------------------ 2) visit each comic's page for its image */

    try {
        console.log(`Reading cover images for ${items.length} comics...`);
        const PROBE = Math.min(5, items.length);

        // Probe a few first: if the fetched HTML has no image, the page draws it with JS, so switch to iframes
        for (const item of items.slice(0, PROBE)) {
            await fillImage(item);
            await sleep(DETAIL_DELAY_MS);
        }
        if (PROBE && items.slice(0, PROBE).every((i) => !i.image)) {
            console.warn('No image in the fetched HTML, so the page is drawn by JavaScript. Switching to hidden-iframe mode (slower).');
            useIframe = true;
            for (const item of items.slice(0, PROBE)) await fillImage(item);
        }

        let next = PROBE;
        let done = PROBE;
        const worker = async () => {
            while (next < items.length) {
                const item = items[next++];
                await fillImage(item);
                done++;
                if (done % 25 === 0 || done === items.length) console.log(`Images: ${done}/${items.length}`);
                await sleep(DETAIL_DELAY_MS);
            }
        };
        await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    } finally {
        const withImage = items.filter((i) => i.image).length;
        download(items);
        console.log(
            `Done: ${items.length}${total ? ` of ${total}` : ''} items saved to hipcomic-collection.json ` +
            `(${withImage} with an image, ${items.length - withImage} without)`,
        );
        if (withImage === 0 && items.length) {
            console.warn('No images found. Open one comic page, inspect its cover in DevTools, and send me that element\'s HTML.');
        }
    }
})();
