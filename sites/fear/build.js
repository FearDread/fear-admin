#!/usr/bin/env node
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname, SRC = path.join(ROOT, 'src'), PUB = path.join(ROOT, 'public'), OUT = path.join(ROOT, 'build');
const watch = process.argv.includes('--watch');
const entries = [{ entry: 'spa/main.js', output: 'js/main.js' }];
function requireExists(p, hint) { if (!fs.existsSync(p)) throw new Error(`Missing ${path.relative(ROOT, p)} (${hint})`); }
function cleanBuild() { fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true }); }
function copyPublic() { fs.cpSync(PUB, OUT, { recursive: true }); }
function updateBuildVersion() { const p = path.join(OUT, 'index.html'); if (!fs.existsSync(p)) return; fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/__BUILD__/g, Date.now().toString(36))); }
function copyFile(source) { const rel = path.relative(PUB, source), dest = path.join(OUT, rel); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(source, dest); console.log(`Copied → public/${rel}`); }
function removeBuildFile(source) { const dest = path.join(OUT, path.relative(PUB, source)); if (fs.existsSync(dest)) { fs.rmSync(dest, { recursive: true, force: true }); console.log(`Removed → ${path.relative(ROOT, dest)}`); } }
function watchPublic() { fs.watch(PUB, { recursive: true }, (eventType, filename) => { if (!filename) return; const source = path.join(PUB, filename); try { if (fs.existsSync(source) && fs.statSync(source).isFile()) { copyFile(source); if (filename === 'index.html') updateBuildVersion(); } else if (eventType === 'rename') removeBuildFile(source); } catch (e) { console.error(`Public watch error: ${e.message}`); } }); }
async function build() {
    requireExists(path.join(PUB, 'index.html'), 'SPA page shell');
    requireExists(path.join(SRC, 'spa/main.js'), 'SPA bundle entry point');
    cleanBuild(); copyPublic();
    const common = { bundle: true, minify: !watch, sourcemap: watch, format: 'esm', target: 'es2022', platform: 'browser', logLevel: 'info' };
    if (watch) {
        const contexts = [];
        for (const { entry, output } of entries) { const context = await esbuild.context({ ...common, entryPoints: [path.join(SRC, entry)], outfile: path.join(OUT, output) }); await context.watch(); contexts.push(context); }
        updateBuildVersion(); watchPublic(); console.log('\n✓ FEAR SPA development mode active\n  Watching src/ and public/\n  Press Ctrl+C to stop.');
        process.on('SIGINT', async () => { await Promise.all(contexts.map((c) => c.dispose())); process.exit(0); });
        return;
    }
    await Promise.all(entries.map(({ entry, output }) => esbuild.build({ ...common, entryPoints: [path.join(SRC, entry)], outfile: path.join(OUT, output) })));
    updateBuildVersion(); console.log(`\n✓ Built → ${path.relative(process.cwd(), OUT)}/`);
}
build().catch((err) => { console.error(err.message || err); process.exit(1); });
