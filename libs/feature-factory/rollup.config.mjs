import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import polyfill from "rollup-plugin-polyfill-node";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript'
import pkg from "./package.json" assert { type: 'json' };
import dts from 'rollup-plugin-dts'
const config = [
  {
    input: 'src/index.js',
    output: {
      file: 'refactory.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['axios', 'os', 'url'],
    plugins: [typescript()]
  }, {
    input: 'src/index.d.ts',
    output: {
      file: 'refactory.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];

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
				format: "esm",
        		exports: 'named',
				sourcemap: true,
			},
		  	{
				file: 'dist/bundle.min.js',
				format: 'iife',
				name: 'version',
				plugins: [terser()]
			}
		],
		plugins: [
			peerDepsExternal(),
      		resolve({
        		browser: true,
        		preferBuiltins: false,
      		}),
			commonjs(),
      		json(),
			terser()
		]
	},  
];

export default jsconfig;
/*
export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.js',
				format: 'cjs',
        		exports: 'named',
				sourcemap: true,
			},
			{
				file: 'dist/index.esm.js',
				format: "esm",
        		exports: 'named',
				sourcemap: true,
			},
		  	{
				file: 'dist/bundle.min.js',
				format: 'iife',
				name: 'version',
				plugins: [terser()]
			}
		],
		plugins: [
			peerDepsExternal(),
      		resolve({
        		browser: true,
        		preferBuiltins: false,
      		}),
			commonjs(),
      		json(),
			terser(),
			typescript()
		]
	},  
];
*/