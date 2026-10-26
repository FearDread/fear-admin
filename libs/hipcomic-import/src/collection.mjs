// hipcomic-collection-export.js
// Run this in YOUR browser, on your own collection page:
//   1. Open https://www.hipcomic.com/myc/@<you>/collection (sign in if needed)
//   2. F12 -> Console -> paste this whole file -> Enter
//   3. It walks every page of your collection and downloads hipcomic-collection.json
//
// It runs as you, in your real browser session, so there is no scraping
// client for the site to block.

(async () => {
    const PAGE_PARAM = 'page'; // if the URL changes to something else when you click page 2, change this
    const DELAY_MS = 1200;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'hipcomic-collection.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    console.log(`Done: ${items.length}${total ? ` of ${total}` : ''} items saved to hipcomic-collection.json`);
})();