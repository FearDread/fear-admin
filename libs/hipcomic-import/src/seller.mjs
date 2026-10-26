#!/usr/bin/env node
/**
 * hipcomic-import.mjs
 * Pulls a HipComic seller's PUBLIC listings and upserts them into MongoDB.
 *
 *   node hipcomic-import.mjs --seller YourUsername --mongo "mongodb://localhost:27017/efear"
 *   node hipcomic-import.mjs --store-url "https://www.hipcomic.com/<your store page>" --dry-run
 *   node hipcomic-import.mjs --urls listing-urls.txt --dry-run
 *
 * Every fetched page is cached under <out>/cache so parsing can be re-run
 * offline (and tweaked) without hitting the site again.
 */
import { parseArgs } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { MongoClient } from 'mongodb';

const BASE = 'https://www.hipcomic.com';
const UA = 'hipcomic-import/1.0 (personal inventory export)';
const LISTING_RE = /\/listing\/[^/?#]+\/(\d+)/;

const { values: opt } = parseArgs({
  options: {
    seller: { type: 'string' },
    'store-url': { type: 'string' },
    urls: { type: 'string' },
    mongo: { type: 'string', default: process.env.MONGODB_URI },
    db: { type: 'string' },
    collection: { type: 'string', default: 'hipcomic_items' },
    out: { type: 'string', default: './hipcomic-out' },
    delay: { type: 'string', default: '1500' },
    'max-pages': { type: 'string', default: '200' },
    'dry-run': { type: 'boolean', default: false },
    'include-closed': { type: 'boolean', default: false },
    refresh: { type: 'boolean', default: false },
  },
});

const delayMs = Number(opt.delay);
const maxPages = Number(opt['max-pages']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- fetching
let lastRequest = 0;
async function fetchText(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const wait = lastRequest + delayMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequest = Date.now();
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, accept: 'text/html' },
        redirect: 'follow',
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i === tries - 1) throw new Error(`${url}: ${err.message}`);
      await sleep(2000 * 2 ** i); // backoff on 429/5xx/network errors
    }
  }
  return null;
}

async function loadRobots() {
  const txt = await fetchText(`${BASE}/robots.txt`).catch(() => null);
  if (!txt) return () => true;
  const disallow = [];
  let applies = false;
  for (const raw of txt.split(/\r?\n/)) {
    const m = raw.split('#')[0].trim().match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') applies = val === '*';
    else if (applies && key === 'disallow' && val) disallow.push(val);
  }
  return (url) => {
    const p = new URL(url).pathname;
    return !disallow.some((rule) => p.startsWith(rule));
  };
}

// --------------------------------------------------------------- discovery
function listingLinks($, pageUrl) {
  const found = new Map();
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href');
    const m = href && href.match(LISTING_RE);
    if (m) found.set(m[1], new URL(href, pageUrl).href.split(/[?#]/)[0]);
  });
  return found;
}

function nextPageUrl($, pageUrl, pageNo) {
  const rel = $('a[rel="next"], link[rel="next"]').attr('href');
  if (rel) return new URL(rel, pageUrl).href;
  let next;
  $('a[href]').each((_, a) => {
    if (/^(next|next page|›|»|>)$/i.test($(a).text().trim())) {
      next = $(a).attr('href');
      return false;
    }
  });
  if (next && next !== '#') return new URL(next, pageUrl).href;
  const u = new URL(pageUrl);
  u.searchParams.set('page', String(pageNo + 1)); // last resort: ?page=N
  return u.href;
}

async function discover(startUrls, allowed) {
  for (const start of startUrls) {
    console.log(`Trying ${start}`);
    const found = new Map();
    const seen = new Set();
    let url = start;
    let pageNo = 1;
    while (url && pageNo <= maxPages && !seen.has(url)) {
      seen.add(url);
      if (!allowed(url)) {
        console.warn(`  robots.txt disallows ${url}, skipping`);
        break;
      }
      const html = await fetchText(url);
      if (!html) break;
      const $ = cheerio.load(html);
      const links = listingLinks($, url);
      const before = found.size;
      for (const [id, href] of links) found.set(id, href);
      console.log(`  page ${pageNo}: ${links.size} listing links, ${found.size - before} new`);
      if (found.size === before) break; // nothing new -> end of pagination
      url = nextPageUrl($, url, pageNo);
      pageNo++;
    }
    if (found.size) return found;
  }
  return new Map();
}

// ----------------------------------------------------------------- parsing
const FIELD_LABELS = [
  'Series Name', 'Issue Number', 'Publisher', 'Genre', 'Main Character',
  'Grade', 'Certification', 'Signed', 'Seller', 'Registered Since',
  'Feedback', 'Store', 'Item Location',
];
const STOP_LABELS = new Set([
  ...FIELD_LABELS, 'Ships To', 'Postage Calculator', 'Select Country',
  'Quantity', 'Item Weight', 'Returns Accepted', 'Returns Policy',
  'Zip/Post Code', 'Seller Information', 'Item Specifics', 'Item Description',
]);

/** Text of every "leaf" element, in document order. Label/value pairs sit next to each other. */
function leafTexts($) {
  const out = [];
  $('body *').each((_, el) => {
    if (['script', 'style', 'noscript'].includes(el.tagName)) return;
    if ($(el).children().not('br').length) return;
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t) out.push(t);
  });
  return out;
}

function jsonLdProduct($) {
  for (const el of $('script[type="application/ld+json"]').toArray()) {
    try {
      const data = JSON.parse($(el).contents().text());
      const nodes = Array.isArray(data) ? data : [data, ...(data['@graph'] ?? [])];
      const prod = nodes.find((n) => n && /Product/.test(String(n['@type'])));
      if (prod) return prod;
    } catch {
      /* ignore malformed JSON-LD */
    }
  }
  return null;
}

const money = (s) => {
  const m = String(s ?? '').match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
};

function parseListing(html, url) {
  const $ = cheerio.load(html);
  const hipcomicId = url.match(LISTING_RE)[1];
  const leaves = leafTexts($);
  const ld = jsonLdProduct($);

  const title =
    $('h1').first().text().replace(/\s+/g, ' ').trim() ||
    ld?.name ||
    $('meta[property="og:title"]').attr('content') ||
    '';

  // label -> value pairs ("Series Name" followed by "MAD (1952)")
  const spec = {};
  leaves.forEach((t, i) => {
    if (FIELD_LABELS.includes(t) && !(t in spec)) {
      const v = leaves[i + 1];
      if (v && !STOP_LABELS.has(v)) spec[t] = v;
    }
  });

  // price: JSON-LD first, then the dollar amounts right after the title
  const ti = leaves.indexOf(title);
  const nearby = (ti >= 0 ? leaves.slice(ti + 1, ti + 7) : leaves.slice(0, 40))
    .map(money)
    .filter((v) => v != null);
  const offer = Array.isArray(ld?.offers) ? ld.offers[0] : ld?.offers;
  const price = offer?.price != null ? Number(offer.price) : (nearby[0] ?? null);
  const listPrice = nearby[1] != null && price != null && nearby[1] > price ? nearby[1] : null;

  // description = leaves between "Item Description" and the next section
  let description = '';
  const di = leaves.indexOf('Item Description');
  if (di >= 0) {
    const parts = [];
    const sectionStops = new Set(['Offers History', 'Sales History', 'Bids History', 'Public Questions']);
    for (let i = di + 1; i < leaves.length; i++) {
      if (STOP_LABELS.has(leaves[i]) || sectionStops.has(leaves[i])) break;
      parts.push(leaves[i]);
    }
    description = parts.join('\n').slice(0, 5000);
  }

  const seriesRaw = spec['Series Name'] ?? '';
  const sm = seriesRaw.match(/^(.*?)\s*\((\d{4})\)\s*$/);
  const gm = (spec.Grade ?? '').match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

  const body = leaves.join(' ');
  const closed = /no longer available for sale|bidding has ended/i.test(body);

  const images = [
    ...new Set(
      [
        $('meta[property="og:image"]').attr('content'),
        ...$('[class*="gallery"] img, [class*="carousel"] img, [class*="slider"] img')
          .map((_, el) => $(el).attr('src') || $(el).attr('data-src'))
          .get(),
      ]
        .filter(Boolean)
        .map((u) => new URL(u, url).href),
    ),
  ];

  return {
    hipcomicId,
    url,
    title,
    series: sm ? sm[1] : seriesRaw || null,
    seriesYear: sm ? Number(sm[2]) : null,
    issue: spec['Issue Number'] ?? null,
    publisher: spec.Publisher ?? null,
    genre: spec.Genre ?? null,
    mainCharacter: spec['Main Character'] ?? null,
    grade: spec.Grade ?? null,
    gradeNumeric: gm ? Number(gm[1]) : null,
    gradeLabel: gm ? gm[2] || null : null,
    certification: spec.Certification ?? null,
    signed: spec.Signed ? /^yes/i.test(spec.Signed) : null,
    price,
    listPrice,
    listingType: leaves.includes('Bids History') ? 'auction' : 'fixed',
    status: closed ? 'closed' : 'active',
    seller: (spec.Seller ?? '').replace(/\s*\(\d+\)\s*$/, '') || null,
    store: spec.Store ?? null,
    location: spec['Item Location'] ?? null,
    description,
    images,
    specifics: spec, // untouched label/value pairs, in case you want fields not mapped above
  };
}

// ------------------------------------------------------------------ output
function toCsv(rows) {
  const cols = [
    'hipcomicId', 'title', 'series', 'seriesYear', 'issue', 'publisher', 'grade',
    'certification', 'signed', 'price', 'listPrice', 'listingType', 'status',
    'seller', 'store', 'location', 'url',
  ];
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

async function upsertMongo(items) {
  if (!opt.mongo) throw new Error('No Mongo URI. Pass --mongo or set MONGODB_URI (or use --dry-run).');
  const client = new MongoClient(opt.mongo);
  await client.connect();
  try {
    const col = client.db(opt.db).collection(opt.collection);
    await col.createIndex({ hipcomicId: 1 }, { unique: true });
    const now = new Date();
    const res = await col.bulkWrite(
      items.map((it) => ({
        updateOne: {
          filter: { hipcomicId: it.hipcomicId },
          update: { $set: { ...it, scrapedAt: now }, $setOnInsert: { firstSeenAt: now } },
          upsert: true,
        },
      })),
      { ordered: false },
    );
    console.log(`Mongo "${opt.collection}": ${res.upsertedCount} inserted, ${res.modifiedCount} updated.`);
  } finally {
    await client.close();
  }
}

// -------------------------------------------------------------------- main
async function main() {
  if (!opt.seller && !opt['store-url'] && !opt.urls) {
    console.error('Need --seller <username>, --store-url <url>, or --urls <file>. See header of this file.');
    process.exit(1);
  }
  const cacheDir = path.join(opt.out, 'cache');
  await mkdir(cacheDir, { recursive: true });
  const allowed = await loadRobots();

  // 1) find listing URLs
  let listings = new Map();
  if (opt.urls) {
    const lines = (await readFile(opt.urls, 'utf8')).split(/\r?\n/);
    for (const line of lines) {
      const m = line.trim().match(LISTING_RE);
      if (m) listings.set(m[1], new URL(line.trim(), BASE).href);
    }
  } else {
    const s = opt.seller ? encodeURIComponent(opt.seller) : null;
    const starts = opt['store-url']
      ? [opt['store-url']]
      : ['store', 'stores', 'seller', 'user', 'profile'].map((p) => `${BASE}/${p}/${s}`);
    listings = await discover(starts, allowed);
  }
  if (!listings.size) {
    console.error(
      'No listing URLs found. Open your store in a browser, copy its URL into --store-url, ' +
        'or save listing URLs to a text file and use --urls.',
    );
    process.exit(2);
  }
  console.log(`Found ${listings.size} listings. Fetching details...`);

  // 2) fetch + parse each listing (cached on disk)
  const items = [];
  let i = 0;
  for (const [id, url] of listings) {
    i++;
    const cacheFile = path.join(cacheDir, `${id}.html`);
    let html = null;
    if (!opt.refresh) html = await readFile(cacheFile, 'utf8').catch(() => null);
    if (!html) {
      if (!allowed(url)) {
        console.warn(`[${i}/${listings.size}] robots.txt disallows ${url}`);
        continue;
      }
      html = await fetchText(url);
      if (!html) {
        console.warn(`[${i}/${listings.size}] 404 ${url}`);
        continue;
      }
      await writeFile(cacheFile, html);
    }
    const item = parseListing(html, url);
    if (opt.seller && item.seller && item.seller.toLowerCase() !== opt.seller.toLowerCase()) continue; // sidebar/"recommended" noise
    if (item.status === 'closed' && !opt['include-closed']) continue;
    items.push(item);
    if (i % 25 === 0) console.log(`  ${i}/${listings.size}`);
  }

  // 3) write files + DB
  await writeFile(path.join(opt.out, 'inventory.json'), JSON.stringify(items, null, 2));
  await writeFile(path.join(opt.out, 'inventory.csv'), toCsv(items));
  console.log(`Parsed ${items.length} items -> ${opt.out}/inventory.json and inventory.csv`);

  const missing = items.filter((x) => x.price == null).length;
  if (missing) console.warn(`Warning: ${missing} items have no price parsed. Check the selectors in parseListing().`);

  if (opt['dry-run']) console.log('Dry run: skipped MongoDB.');
  else await upsertMongo(items);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
