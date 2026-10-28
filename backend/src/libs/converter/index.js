// services/hipcomicToProduct.js
// Turns a HipComic collection entry into a store Product.
//
//   const { convertHipcomicItem, convertMany } = require("./services/hipcomicToProduct");
//   await convertHipcomicItem("699abd96cf144402fe054f9a", { priceMultiplier: 1.15 });
//   await convertMany({ keyIssue: true }, { priceMultiplier: 1.2, defaultPrice: 4.99 });
//
// Re-runs are safe: every product made here carries a "hipcomic-<id>" tag, and an item that
// already has a product is left alone. The marker lives on the Product (not on the HipComic
// document), so re-importing / clearing the HipComic table never loses track of what was converted.

const Product = require("../../models/product");
const HipcomicItem = require("../../models/hipcomic");

const DEFAULTS = {
    category: "Comics",    // string, or (item) => string. Product.category is a String ref.
    brand: null,           // string, or (item) => string. null = publisher name from the item
    priceMultiplier: 1,    // price = FMV * priceMultiplier
    minPrice: 0.99,        // floor applied to the computed price
    defaultPrice: null,    // price for items with no FMV; null = skip those items
    quantity: 1,
    discount: 0,
    uploadImage: null,     // async (url, item) => ({ public_id, url }), e.g. a Cloudinary upload.
    // null = link straight to the HipComic image URL
};

const GRADE_NAMES = {
    GM: "Gem Mint", MT: "Mint", NM: "Near Mint", VF: "Very Fine", FN: "Fine",
    VG: "Very Good", G: "Good", FR: "Fair", PR: "Poor",
};

/* ------------------------------------------------------------------ helpers */

const marker = (id) => `hipcomic-${String(id).toLowerCase()}`;
const round2 = (n) => Math.round(n * 100) / 100;

const slugify = (s) =>
    String(s)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const publisherName = (slug) =>
    slug
        ? slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
            .replace(/\bDc\b/, "DC")
        : null;

// "NM+" -> "Near Mint+", "VF/NM" -> "Very Fine/Near Mint"
const gradeName = (label) =>
    label
        ? label
            .split("/")
            .map((part) => {
                const m = part.match(/^([A-Z]+)([+-]?)$/);
                return m && GRADE_NAMES[m[1]] ? GRADE_NAMES[m[1]] + m[2] : part;
            })
            .join("/")
        : null;

function buildDescription(item, publisher) {
    const lines = [`${item.title}${publisher ? ` from ${publisher}` : ""}.`];
    if (item.variant) lines.push(`Variant: ${item.variant}.`);
    if (item.grade) {
        const name = gradeName(item.gradeLabel);
        lines.push(`Condition: ${name ? `${name} (${item.grade})` : item.grade}.`);
    }
    if (item.keyIssue) lines.push("Key issue.");
    return lines.join(" ");
}

function buildTags(item, publisher) {
    const tags = ["comic", marker(item.hipcomicId)];
    if (item.series) tags.push(item.series);
    if (publisher) tags.push(publisher);
    if (item.gradeLabel) tags.push(item.gradeLabel);
    if (item.keyIssue) tags.push("key issue");
    if (item.variant) tags.push("variant");
    if (item.seriesYear) tags.push(`${Math.floor(item.seriesYear / 10) * 10}s`);
    return [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
}

function buildPrice(item, o) {
    if (item.fmv != null && Number(item.fmv) > 0) {
        return round2(Math.max(o.minPrice, Number(item.fmv) * o.priceMultiplier));
    }
    return o.defaultPrice != null ? round2(Number(o.defaultPrice)) : null;
}

/* --------------------------------------------------------------- pure mapper */

/**
 * HipComic item -> plain object shaped for `new Product(...)`. No database access.
 * Returns { data } on success or { reason } when the item can't become a product.
 */
function hipcomicToProductData(rawItem, options = {}) {
    const item = rawItem && typeof rawItem.toObject === "function" ? rawItem.toObject() : rawItem;
    const o = { ...DEFAULTS, ...options };

    if (!item || !item.hipcomicId || !item.title) return { reason: "missing hipcomicId or title" };

    const price = buildPrice(item, o);
    if (price == null) return { reason: "no FMV and no defaultPrice" };

    const publisher = publisherName(item.publisherSlug);
    const resolve = (v) => (typeof v === "function" ? v(item) : v);
    const brand = resolve(o.brand) ?? publisher;
    const category = resolve(o.category);

    const data = {
        title: item.title,
        slug: `${slugify(item.title)}-${String(item.hipcomicId).slice(-8).toLowerCase()}`,
        description: buildDescription(item, publisher),
        price,
        discount: o.discount,
        quantity: o.quantity,
        isFeatured: false,
        tags: buildTags(item, publisher),
        images: item.image ? [{ public_id: `hipcomic/${item.hipcomicId}`, url: item.image }] : [],
    };
    if (category) data.category = category;
    if (brand) data.brand = brand;

    return { data };
}

/* ------------------------------------------------------------ DB-backed APIs */

/**
 * Convert one HipComic entry (a document, a plain object, or a hipcomicId string) into a Product.
 * Resolves to { status: "created" | "exists" | "skipped" | "error", product?, reason?, hipcomicId }.
 */
async function convertHipcomicItem(itemOrId, options = {}) {
    const o = { ...DEFAULTS, ...options };

    const item =
        typeof itemOrId === "string"
            ? await HipcomicItem.findOne({ hipcomicId: itemOrId }).lean()
            : itemOrId;
    if (!item) return { status: "skipped", reason: "HipComic item not found", hipcomicId: String(itemOrId) };

    const { data, reason } = hipcomicToProductData(item, o);
    if (!data) return { status: "skipped", reason, hipcomicId: item.hipcomicId };

    // Already converted?
    const existing = await Product.findOne({ tags: marker(item.hipcomicId) });
    if (existing) return { status: "exists", product: existing, hipcomicId: item.hipcomicId };

    // The slug is unique; on the (unlikely) clash with an unrelated product use the full id
    if (await Product.exists({ slug: data.slug })) {
        data.slug = `${slugify(item.title)}-${String(item.hipcomicId).toLowerCase()}`;
    }

    // Optionally host the cover on your own CDN instead of linking to HipComic
    if (o.uploadImage && item.image) {
        try {
            data.images = [await o.uploadImage(item.image, item)];
        } catch (err) {
            console.warn(`Image upload failed for ${item.hipcomicId}, keeping the HipComic link: ${err.message}`);
        }
    }

    try {
        const product = await Product.create(data);
        return { status: "created", product, hipcomicId: item.hipcomicId };
    } catch (err) {
        return { status: "error", reason: err.message, hipcomicId: item.hipcomicId };
    }
}

/**
 * Convert every HipComic item matching `filter`.
 * `run` is optional: { limit, onProgress(done, result) }.
 * Resolves to counts plus a list of problems.
 */
async function convertMany(filter = {}, options = {}, run = {}) {
    const summary = { created: 0, exists: 0, skipped: 0, error: 0, problems: [] };
    let query = HipcomicItem.find(filter).lean();
    if (run.limit) query = query.limit(run.limit);

    let done = 0;
    for await (const item of query.cursor()) {
        const result = await convertHipcomicItem(item, options);
        summary[result.status] += 1;
        if (result.status === "skipped" || result.status === "error") {
            summary.problems.push({ hipcomicId: item.hipcomicId, title: item.title, reason: result.reason });
        }
        done += 1;
        if (run.onProgress) run.onProgress(done, result);
    }
    return summary;
}

module.exports = { convertHipcomicItem, convertMany, hipcomicToProductData, marker };