#!/usr/bin/env node
// scripts/convertHipcomic.js
// Converts HipComic collection items into store products. Run it through npm:
//
//   npm run hipcomic:convert                                   convert everything
//   npm run hipcomic:convert -- --dry-run                      preview, writes nothing
//   npm run hipcomic:convert -- --multiplier 1.15 --key-only   key issues at FMV + 15%
//   npm run hipcomic:convert -- --id 699abd96cf144402fe054f9a  one comic
//
// (the bare `--` is required so npm passes the flags on to this script)

try {
    require("dotenv").config(); // optional: picks up MONGODB_URI from .env if dotenv is installed
} catch {
    /* dotenv not installed, use real environment variables */
}
const { parseArgs } = require("node:util");
const mongoose = require("mongoose");
const Product = require("../backend/src/models/product");
const HipcomicItem = require("../backend/src/models/hipcomic");
const {
    convertHipcomicItem,
    convertMany,
    hipcomicToProductData,
    marker,
} = require("../backend/src/libs/converter");

const USAGE = `Usage: npm run hipcomic:convert -- [options]

  --dry-run              show what would happen, write nothing
  --id <hipcomicId>      convert a single comic
  --publisher <slug>     only this publisher, e.g. marvel or dc-comics
  --key-only             only key issues
  --limit <n>            stop after n comics (handy for a first test)
  --multiplier <n>       price = FMV x n            (default 1)
  --min-price <n>        price floor                (default 0.99)
  --default-price <n>    price for comics with no FMV (default: skip them)
  --quantity <n>         stock per product          (default 1)
  --category <text>      Product.category           (default "Comics")
  --brand <text>         Product.brand              (default: the publisher)
  --mongo <uri>          connection string (else MONGODB_URI / MONGO_URI from the environment)
`;

function fail(message) {
    const err = new Error(message);
    err.usage = true;
    throw err;
}

const num = (value, name) => {
    if (value == null) return undefined;
    const n = Number(value);
    if (!Number.isFinite(n)) fail(`--${name} must be a number`);
    return n;
};

async function dryRun(filter, options, limit) {
    let query = HipcomicItem.find(filter).lean();
    if (limit) query = query.limit(limit);
    const items = await query;

    const markers = items.map((i) => marker(i.hipcomicId));
    const existing = new Set(
        (await Product.find({ tags: { $in: markers } }).select("tags").lean()).flatMap((p) => p.tags),
    );

    const summary = { wouldCreate: 0, exists: 0, skipped: 0, problems: [] };
    let sample = null;
    for (const item of items) {
        const { data, reason } = hipcomicToProductData(item, options);
        if (!data) {
            summary.skipped += 1;
            summary.problems.push({ hipcomicId: item.hipcomicId, title: item.title, reason });
        } else if (existing.has(marker(item.hipcomicId))) {
            summary.exists += 1;
        } else {
            summary.wouldCreate += 1;
            sample = sample || data;
        }
    }
    return { summary, sample };
}

function printProblems(problems) {
    if (!problems.length) return;
    console.log(`\nNot converted (${problems.length}):`);
    for (const p of problems.slice(0, 10)) console.log(`  ${p.title || p.hipcomicId}: ${p.reason}`);
    if (problems.length > 10) console.log(`  ...and ${problems.length - 10} more`);
}

async function main(argv = process.argv.slice(2)) {
    const { values: a } = parseArgs({
        args: argv,
        options: {
            mongo: { type: "string" },
            id: { type: "string" },
            publisher: { type: "string" },
            "key-only": { type: "boolean", default: false },
            limit: { type: "string" },
            multiplier: { type: "string" },
            "min-price": { type: "string" },
            "default-price": { type: "string" },
            quantity: { type: "string" },
            category: { type: "string" },
            brand: { type: "string" },
            "dry-run": { type: "boolean", default: false },
            help: { type: "boolean", default: false },
        },
    });
    if (a.help) {
        console.log(USAGE);
        return 0;
    }

    const options = {};
    const set = (key, value) => value !== undefined && (options[key] = value);
    set("priceMultiplier", num(a.multiplier, "multiplier"));
    set("minPrice", num(a["min-price"], "min-price"));
    set("defaultPrice", num(a["default-price"], "default-price"));
    set("quantity", num(a.quantity, "quantity"));
    set("category", a.category);
    set("brand", a.brand);
    const limit = num(a.limit, "limit");

    const filter = {};
    if (a.id) filter.hipcomicId = a.id;
    if (a.publisher) filter.publisherSlug = a.publisher;
    if (a["key-only"]) filter.keyIssue = true;

    const uri = a.mongo || process.env.DB_LINK || process.env.MONGO_URI;
    if (!uri) fail("No database URL. Set DB_LINK (or MONGO_URI) in .env, or pass --mongo <uri>.");

    await mongoose.connect(uri);
    try {
        if (a["dry-run"]) {
            const { summary, sample } = await dryRun(filter, options, limit);
            console.log(`Dry run: ${summary.wouldCreate} would be created, ${summary.exists} already have a product, ${summary.skipped} skipped.`);
            if (sample) console.log("\nFirst product that would be created:\n", JSON.stringify(sample, null, 2));
            printProblems(summary.problems);
            return 0;
        }

        if (a.id) {
            const r = await convertHipcomicItem(a.id, options);
            console.log(`${a.id}: ${r.status}${r.reason ? ` (${r.reason})` : ""}`);
            if (r.product) console.log(`  ${r.product.title}, $${r.product.price}, slug ${r.product.slug}`);
            return r.status === "error" ? 1 : 0;
        }

        const summary = await convertMany(filter, options, {
            limit,
            onProgress: (done) => done % 50 === 0 && console.log(`  ...${done} processed`),
        });
        console.log(`Done: ${summary.created} created, ${summary.exists} already existed, ${summary.skipped} skipped, ${summary.error} errors.`);
        printProblems(summary.problems);
        return summary.error ? 1 : 0;
    } finally {
        await mongoose.disconnect();
    }
}

if (require.main === module) {
    main().then(
        (code) => process.exit(code),
        (err) => {
            console.error(err.usage ? `${err.message}\n\n${USAGE}` : err);
            process.exit(1);
        },
    );
}

module.exports = { main };