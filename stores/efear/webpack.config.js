/**
 * webpack.config.js  (project root)
 *
 * Exports both the client and server configurations as an array.
 * Webpack runs them in parallel and names them 'client' and 'server'
 * so output and errors are clearly labelled in the terminal.
 *
 * CLI usage
 * ─────────────────────────────────────────────────────────────────
 *  Build both bundles (production):
 *    NODE_ENV=production npx webpack --config webpack.config.js
 *
 *  Build only the client:
 *    npx webpack --config webpack/webpack.client.js
 *
 *  Build only the server:
 *    npx webpack --config webpack/webpack.server.js
 *
 *  Watch mode (development — rebuilds on file change):
 *    npx webpack --config webpack.config.js --watch
 *
 * The npm scripts in package.json wrap these commands — see README.
 */

'use strict';

const clientConfig = require('./webpack/webpack.client');
const serverConfig = require('./webpack/webpack.server');

// Exporting an array tells webpack to compile both configs in a single
// invocation.  Each config has a `name` field ('client' / 'server') that
// webpack uses to label the output and allows --config-name filtering.
module.exports = [clientConfig, serverConfig];