#!/usr/bin/env node
/**
 * Bundles src/ (the SPA) into build/ — the directory FearServer.initialize()
 * was pointed at with { app: 'build', build: 'build' } in server.js.
 *
 * Two separate bundles, not one: vchat-client.js runs on the main thread and
 * imports e2ee.js directly; e2ee-worker.js runs in its own Worker context
 * and must not be merged into the main-thread bundle. e2ee.js's
 * `new URL("./e2ee-worker.js", import.meta.url)` still resolves correctly
 * after bundling because both output files land in the same build/ root.
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'build');
const watch = process.argv.includes('--watch');

async function build() {
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });

    const common = {
        bundle: true,
        minify: !watch,
        sourcemap: watch,
        format: 'esm',
        target: 'es2022',
        logLevel: 'info',
    };

    const builds = [
        esbuild.build({
            ...common,
            entryPoints: [path.join(SRC, 'vchat-client.js')],
            outfile: path.join(OUT, 'vchat-client.js'),
        }),
        esbuild.build({
            ...common,
            entryPoints: [path.join(SRC, 'e2ee-worker.js')],
            outfile: path.join(OUT, 'e2ee-worker.js'),
        }),
    ];

    await Promise.all(builds);

    fs.copyFileSync(path.join(SRC, 'index.html'), path.join(OUT, 'index.html'));

    console.log(`Built → ${path.relative(process.cwd(), OUT)}/`);
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});