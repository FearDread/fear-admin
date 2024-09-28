import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from "./package.json" assert { type: 'json' };

export default [
	{
		input: 'src/index.js',
		output: [
			{
				file: 'dist/index.js',
				format: 'cjs',
				sourcemap: true,
			},
			{
				file: 'dist/index.esm.js',
				format: "esm",
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
			resolve(),
			commonjs(),
      json(),
			postcss(),
			terser()
		]
	}
  /*
	{
    
		input: "dist/esm/types/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "esm" }],
		plugins: [dts()],
		external: [/\.(css|less|scss)$/],
	},
  */
];