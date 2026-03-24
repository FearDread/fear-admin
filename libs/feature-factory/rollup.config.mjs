import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// Shared globals map — used by the IIFE bundle to locate peer deps
// on the global scope instead of trying to require() them at runtime.
const globals = {
  'react':              'React',
  'react-dom':          'ReactDOM',
  'react-native':       'ReactNative',
  'react-redux':        'ReactRedux',
  '@reduxjs/toolkit':   'ReduxToolkit',
  'rsuite':             'RSuite',
  'axios':              'axios',
  'qs':                 'Qs',
};

const jsconfig = [{
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.min.js',
      format: 'iife',
      name: 'FeatureFactory',           // exposes the bundle as window.MyLib
      globals,                 // tells Rollup which globals map to which peer dep
      plugins: [terser()],
    },
  ],
  plugins: [
    peerDepsExternal(),        // marks all peerDependencies as external
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    json(),
    terser(),
  ],
  context: 'this',
}];

export default jsconfig;