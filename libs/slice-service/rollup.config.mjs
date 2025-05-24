import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import polyfill from "rollup-plugin-polyfill-node";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from "./package.json" assert { type: 'json' };

export default [
	{
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