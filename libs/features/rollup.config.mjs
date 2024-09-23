import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.js",
  output: {
  file: "dist/index.js",
  format: "cjs",
},
plugins: [
  babel({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    exclude: "node_modules/**",
  }),
  commonjs(),
  resolve(),
  postcss({
    modules: true,
    }),
  ],
};