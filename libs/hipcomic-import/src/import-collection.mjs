#!/usr/bin/env node
/**
 * import-collection.mjs
 * Loads hipcomic-collection.json (from collection.mjs) into MongoDB.
 *
 * By default the target collection is CLEARED first, then filled with the contents of the
 * file, so the table always mirrors the export exactly. Pass --no-clear to upsert instead
 * (existing documents updated in place, nothing deleted).
 *
 *   node import-collection.mjs hipcomic-collection.json --mongo "mongodb://localhost:27017/efear"
 *   node import-collection.mjs hipcomic-collection.json --dry-run
 *   node import-collection.mjs hipcomic-collection.json --no-clear
 *
 * The file is read and validated BEFORE anything is deleted, and the JSON export stays on
 * disk, so a failed run can simply be repeated.
 */
import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { MongoClient } from 'mongodb';

const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    mongo: { type: 'string', default: process.env.MONGODB_URI },
    db: { type: 'string' }, // defaults to the database named in the URI
    collection: { type: 'string', default: 'hipcomic_collection' },
    'dry-run': { type: 'boolean', default: false },
    'no-clear': { type: 'boolean', default: false },
  },
});

const file = positionals[0] ?? 'hipcomic-collection.json';
const raw = JSON.parse(await readFile(file, 'utf8'));
if (!Array.isArray(raw) || !raw.length) {
  console.error(`No items found in ${file}, nothing was changed.`);
  process.exit(1);
}

// One document per hipcomicId (the unique key); ignore anything without one
const byId = new Map();
for (const it of raw) {
  if (it && it.hipcomicId && !byId.has(it.hipcomicId)) byId.set(it.hipcomicId, it);
}
const items = [...byId.values()];
if (!items.length) {
  console.error(`No items with a hipcomicId in ${file}, nothing was changed.`);
  process.exit(1);
}
const skipped = raw.length - items.length;
console.log(`Read ${raw.length} items from ${file}` + (skipped ? ` (${skipped} duplicates or invalid, ignored)` : ''));

const clear = !opt['no-clear'];
if (opt['dry-run']) {
  console.log(`Dry run: would ${clear ? 'CLEAR the collection, then insert' : 'upsert'} ${items.length} documents into "${opt.collection}". Sample document:\n`, items[0]);
  process.exit(0);
}
if (!opt.mongo) {
  console.error('Pass --mongo "<connection string>" or set MONGODB_URI.');
  process.exit(1);
}

const client = new MongoClient(opt.mongo);
await client.connect();
try {
  const db = client.db(opt.db);
  const col = db.collection(opt.collection);
  await col.createIndex({ hipcomicId: 1 }, { unique: true });
  await col.createIndex({ series: 1, issue: 1 });
  const now = new Date();

  if (clear) {
    const del = await col.deleteMany({});
    console.log(`${db.databaseName}.${opt.collection}: cleared ${del.deletedCount} existing documents`);
    const res = await col.insertMany(
      items.map((it) => ({ ...it, importedAt: now, firstImportedAt: now })),
      { ordered: false },
    );
    console.log(`${db.databaseName}.${opt.collection}: inserted ${res.insertedCount} documents`);
  } else {
    const res = await col.bulkWrite(
      items.map((it) => ({
        updateOne: {
          filter: { hipcomicId: it.hipcomicId },
          update: { $set: { ...it, importedAt: now }, $setOnInsert: { firstImportedAt: now } },
          upsert: true,
        },
      })),
      { ordered: false },
    );
    console.log(
      `${db.databaseName}.${opt.collection}: ${res.upsertedCount} inserted, ${res.modifiedCount} updated, ` +
        `${items.length - res.upsertedCount - res.modifiedCount} unchanged`,
    );
  }
} finally {
  await client.close();
}
