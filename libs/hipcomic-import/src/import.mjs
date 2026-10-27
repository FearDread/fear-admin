#!/usr/bin/env node
/**
 * import-collection.mjs
 * Upserts hipcomic-collection.json (from hipcomic-collection-export.js) into MongoDB.
 *
 *   node import-collection.mjs hipcomic-collection.json --mongo "mongodb://localhost:27017/efear"
 *   node import-collection.mjs hipcomic-collection.json --dry-run
 *
 * Re-running is safe: documents are keyed on hipcomicId, so existing ones are
 * updated in place and new ones are inserted.
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
  },
});

const file = positionals[0] ?? 'hipcomic-collection.json';
const items = JSON.parse(await readFile(file, 'utf8'));
if (!Array.isArray(items) || !items.length) {
  console.error(`No items found in ${file}`);
  process.exit(1);
}
console.log(`Read ${items.length} items from ${file}`);

if (opt['dry-run']) {
  console.log('Dry run, sample document:\n', items[0]);
  process.exit(0);
}
if (!opt.mongo) {
  console.error('Pass --mongo "<connection string>" or set MONGODB_URI.');
  process.exit(1);
}

const client = new MongoClient(opt.mongo);
await client.connect();
try {
  const col = client.db(opt.db).collection(opt.collection);
  await col.createIndex({ hipcomicId: 1 }, { unique: true });
  await col.createIndex({ series: 1, issue: 1 });

  const now = new Date();
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
    `${client.db(opt.db).databaseName}.${opt.collection}: ` +
      `${res.upsertedCount} inserted, ${res.modifiedCount} updated, ` +
      `${items.length - res.upsertedCount - res.modifiedCount} unchanged.`,
  );
} finally {
  await client.close();
}
