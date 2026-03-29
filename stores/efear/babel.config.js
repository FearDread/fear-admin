/**
 * babel.config.js
 *
 * Babel configuration consumed by both webpack configs via babel-loader.
 * Having it as a file (rather than inline in webpack) lets Jest, Storybook,
 * and other tools pick it up automatically.
 *
 * The actual preset options (browser targets vs Node targets) are passed
 * per-bundle from webpack/shared.js via babel-loader's `options` field,
 * which MERGES with (and takes precedence over) this file.
 * This file therefore only sets defaults that apply when Babel is run
 * outside of webpack (e.g. by Jest with babel-jest).
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }, // safe default for Jest
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic', // no `import React` needed in source files
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-nullish-coalescing-operator',
  ],
};