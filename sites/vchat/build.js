#!/usr/bin/env node
/**
 * src/    -> bundled by esbuild (vchat-client.js, e2ee-worker.js)
 * public/ -> copied as-is (index.html, assets/, favicon, anything else)
 * build/  -> output; this is the directory server.js serves.
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const PUB = path.join(__dirname, 'public');
const OUT = path.join(__dirname, 'build');
const watch = process.argv.includes('--watch');

const entries = [
    ['client/vchat-client.js', 'vchat-client.js'],
    ['e2ee/e2ee-worker.js', 'e2ee-worker.js'],
];

function requireExists(p, hint) {
    if (!fs.existsSync(p)) {
        throw new Error(`Missing ${path.relative(__dirname, p)} (${hint})`);
    }
}

async function build() {
    requireExists(path.join(PUB, 'index.html'), 'page shell');
    entries.forEach(([entry]) => requireExists(path.join(SRC, entry), 'bundle entry point'));

    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });

    // 1. Static files first, so the bundles below always win on a name clash.
    fs.cpSync(PUB, OUT, { recursive: true });

    // 2. Bundles. Both land in the build root, which keeps
    //    new URL("./e2ee-worker.js", import.meta.url) resolving after bundling.
    const common = {
        bundle: true,
        minify: !watch,
        sourcemap: watch,
        format: 'esm',
        target: 'es2022',
        logLevel: 'info',
    };

    await Promise.all(
        entries.map(([entry, out]) =>
            esbuild.build({
                ...common,
                entryPoints: [path.join(SRC, entry)],
                outfile: path.join(OUT, out),
            })
        )
    );

    // 3. server.js caches .css/.js for a year (immutable). Replace __BUILD__ in
    //    index.html with a timestamp, e.g. /assets/css/styles.css?v=__BUILD__,
    //    so each build gets a fresh URL. No token present = no change.
    const indexPath = path.join(OUT, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    fs.writeFileSync(indexPath, html.replace(/__BUILD__/g, Date.now().toString(36)));

    console.log(`Built → ${path.relative(process.cwd(), OUT)}/`);
}

build().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
});