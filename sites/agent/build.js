#!/usr/bin/env node
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const ROOT = __dirname,
    SRC = path.join(ROOT, 'src'),
    PUB = path.join(ROOT, 'public'),
    OUT = path.join(ROOT, 'build');

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');
const entries = [{ entry: 'main.js', output: 'js/main.js' }];

// Files that get a content hash in their filename (production builds only)
const VERSIONED = ['css/app.css', ...entries.map((e) => e.output)];

const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function requireExists(p, hint) {
    if (!fs.existsSync(p)) throw new Error(`Missing ${path.relative(ROOT, p)} (${hint})`);
}
function cleanBuild() {
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });
}
function copyPublic() {
    fs.cpSync(PUB, OUT, { recursive: true });

    // Dev only: production CSS is stamped with its own content hash in versionAssets()
    if (!watch) return;
    const css = path.join(OUT, 'css', 'app.css');
    if (fs.existsSync(css)) {
        fs.writeFileSync(css, fs.readFileSync(css, 'utf-8').replace(/__BUILD__/g, Date.now().toString(36)));
    }
}
function updateBuildVersion() {
    const p = path.join(OUT, 'index.html');
    if (!fs.existsSync(p)) return;
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/__BUILD__/g, Date.now().toString(36)));
}
function copyFile(source) {
    const rel = path.relative(PUB, source), dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(source, dest);
    console.log(`Copied → public/${rel}`);
}
function removeBuildFile(source) {
    const dest = path.join(OUT, path.relative(PUB, source));
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
        console.log(`Removed → ${path.relative(ROOT, dest)}`);
    }
}
function watchPublic() {
    fs.watch(PUB, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        const source = path.join(PUB, filename);
        try {
            if (fs.existsSync(source) && fs.statSync(source).isFile()) {
                copyFile(source);
                if (filename === 'index.html') updateBuildVersion();
            } else if (eventType === 'rename') removeBuildFile(source);
        } catch (e) { console.error(`Public watch error: ${e.message}`); }
    });
}

/**
 * Rename each versioned asset to <name>.<hash>.<ext> and return
 * { 'css/app.css': 'css/app.1a2b3c4d.css', ... }
 *
 * CSS may contain the __BUILD__ placeholder. It is hashed *before* substitution and then
 * replaced with that same hash, so the filename only changes when the source changes.
 */
function versionAssets() {
    const manifest = {};

    for (const relPath of VERSIONED) {
        const file = path.join(OUT, relPath);
        if (!fs.existsSync(file)) { console.warn(`⚠ Skipping missing asset: ${relPath}`); continue; }

        const buf = fs.readFileSync(file);
        const h = hash(buf);
        const { dir, name, ext } = path.parse(relPath);
        const hashedRel = path.posix.join(dir, `${name}.${h}${ext}`);
        const hashedFile = path.join(OUT, hashedRel);

        if (ext === '.css') {
            fs.writeFileSync(hashedFile, buf.toString('utf8').replace(/__BUILD__/g, h));
            fs.rmSync(file);
        } else {
            fs.renameSync(file, hashedFile);
        }

        manifest[relPath] = hashedRel;
        console.log(`Versioned → ${relPath}  →  ${hashedRel}`);
    }

    return manifest;
}

/** Point index.html at the hashed files, dropping any old ?v=... query string. */
function rewriteIndex(manifest) {
    const p = path.join(OUT, 'index.html');
    if (!fs.existsSync(p)) return;

    let html = fs.readFileSync(p, 'utf8');

    for (const [original, hashed] of Object.entries(manifest)) {
        const re = new RegExp(escapeRe(original) + `(\\?[^"'\\s>]*)?`, 'g');
        if (!re.test(html)) { console.warn(`⚠ index.html has no reference to ${original}`); continue; }
        html = html.replace(re, hashed);
    }

    fs.writeFileSync(p, html);
}

function writeManifest(manifest) {
    fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
}

async function build() {
    requireExists(path.join(PUB, 'index.html'), 'SPA page shell');
    requireExists(path.join(SRC, 'main.js'), 'SPA bundle entry point');

    cleanBuild();
    copyPublic();

    const common = {
        bundle: true,
        minify: minify,
        sourcemap: watch,
        format: 'esm',
        target: 'es2022',
        platform: 'browser',
        logLevel: 'info',
    };

    if (watch) {
        const contexts = [];

        for (const { entry, output } of entries) {
            const context = await esbuild.context({
                ...common,
                entryPoints: [path.join(SRC, entry)],
                outfile: path.join(OUT, output)
            });

            await context.watch();
            contexts.push(context);
        }

        updateBuildVersion();
        watchPublic();

        console.log('\n✓ FEAR SPA development mode active\n  Watching src/ and public/\n  Press Ctrl+C to stop.');

        process.on('SIGINT', async () => {
            await Promise.all(contexts.map((c) => c.dispose()));
            process.exit(0);
        });
        return;
    }

    await Promise.all(entries.map(({ entry, output }) => esbuild.build({
        ...common,
        entryPoints: [path.join(SRC, entry)],
        outfile: path.join(OUT, output)
    })));

    const manifest = versionAssets();
    rewriteIndex(manifest);
    updateBuildVersion(); // any remaining __BUILD__ placeholders in index.html
    writeManifest(manifest);

    console.log(`\n✓ Built → ${path.relative(process.cwd(), OUT)}/`);
}

build().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
});