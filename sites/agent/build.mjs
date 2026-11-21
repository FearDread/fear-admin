// Builds src/ into build/, the folder server.js hands to FEARServer (`app: 'build', build: 'build'`).
//
//   npm run build            bundle + hash, no JS minification
//   npm run build -- --minify   also minify JS (see the note below before using it)
//
// Output (build/):
//   index.html                       rewritten to point at the hashed files
//   assets/app-<hash>.js             main.js + jquery_gui.js + all modules, one ES module
//   assets/app-<hash>.css            app.css with fonts.css inlined and minified
//   assets/jquery-<hash>.js          vendor jQuery (classic script, loaded before the module)
//   assets/jetbrains-mono-*.woff2    fonts, hashed
//
// Why hashed names: FEARServer serves .js/.css/.woff2 with `Cache-Control: immutable, max-age=1y`
// and index.html with no-cache. A new build therefore only reaches browsers if the filenames change.
//
// Why JS is not minified by default: jquery_gui.js decides whether a broker handler is "callback style" by
// reading fn.toString() for a "(a, b, c)" parameter list. Minifiers print `(req) => x` as `r=>x`, and the
// regex then falls through to the first parenthesis in the handler BODY. A --minify build passes this app's
// browser tests, but a future one-parameter handler whose body starts with a 3-argument call could silently
// hang, so minification is opt-in. (gzip already makes the unminified bundle small.)
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'build');
const ASSETS = path.join(OUT, 'assets');
const minifyJs = process.argv.includes('--minify');

const kb = (n) => (n / 1024).toFixed(1).padStart(7) + ' KB';
const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(ASSETS, { recursive: true });

// 1. JS: main.js pulls in the framework, the modules and (via the ./jquery shim) window.jQuery.
const js = await build({
  entryPoints: [path.join(SRC, 'js/main.js')],
  bundle: true,
  format: 'esm',
  target: 'es2020',
  outdir: ASSETS,
  entryNames: 'app-[hash]',
  minify: minifyJs,
  legalComments: 'none',
  metafile: true,
  logLevel: 'warning',
});

// 2. CSS: fonts.css is @imported by app.css; woff2 files are emitted next to it with hashed names.
const css = await build({
  entryPoints: [path.join(SRC, 'css/app.css')],
  bundle: true,
  minify: true,
  outdir: ASSETS,
  entryNames: 'app-[hash]',
  assetNames: '[name]-[hash]',
  loader: { '.woff2': 'file' },
  metafile: true,
  logLevel: 'warning',
});

// 3. Vendor jQuery: classic script, content-hashed copy.
const jq = fs.readFileSync(path.join(SRC, 'js/vendor/jquery.min.js'));
const jqName = `jquery-${hash(jq)}.js`;
fs.writeFileSync(path.join(ASSETS, jqName), jq);

const pick = (meta, ext) => {
  const hit = Object.keys(meta.outputs).find((o) => o.endsWith(ext) && meta.outputs[o].entryPoint);
  if (!hit) throw new Error(`build produced no ${ext} entry`);
  return path.basename(hit);
};
const jsName = pick(js.metafile, '.js');
const cssName = pick(css.metafile, '.css');

// 4. index.html: swap in the hashed files, drop the dev-only block (the import map: esbuild resolves ./jquery itself). Fail loudly if a pattern is missing.
let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const swap = (re, to, what) => {
  if (!re.test(html)) throw new Error(`src/index.html: could not find ${what}`);
  html = html.replace(re, to);
};
swap(/[ \t]*<!-- dev-only:start -->[\s\S]*?<!-- dev-only:end -->\s*\n?/, '', 'the dev-only block (import map)');
swap(/href="css\/app\.css"/, `href="assets/${cssName}"`, 'the app.css link');
swap(/src="js\/vendor\/jquery\.min\.js"/, `src="assets/${jqName}"`, 'the jquery script');
swap(/src="js\/main\.js"/, `src="assets/${jsName}"`, 'the main.js script');
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// 5. Report
console.log(`built ${rel(OUT)}/${minifyJs ? ' (JS minified)' : ''}`);
const files = [];
(function walk(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : files.push(path.join(d, e.name))));
})(OUT);
files.forEach((f) => console.log(`  ${kb(fs.statSync(f).size)}  ${rel(f).replace(/^build\//, '')}`));
