#!/usr/bin/env node

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
            entryPoints: [path.join(SRC, 'client', 'vchat-client.js')],
            outfile: path.join(OUT, 'vchat-client.js'),
        }),
        esbuild.build({
            ...common,
            entryPoints: [path.join(SRC, 'e2ee', 'e2ee-worker.js')],
            outfile: path.join(OUT, 'e2ee-worker.js'),
        }),
    ];

    await Promise.all(builds);

    ['index.html', 'styles.css'].forEach((file) => {
        fs.copyFileSync(path.join(SRC, file), path.join(OUT, file));
    });

    console.log(`Built → ${path.relative(process.cwd(), OUT)}/`);
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});