    // tsup.config.ts
    import { defineConfig } from 'tsup';

    export default defineConfig({
      entry: ['src/index.ts'],
      format: ['cjs', 'esm'],
      dts: true, // Generate declaration files
      clean: true, // Clean the dist folder before building
    });