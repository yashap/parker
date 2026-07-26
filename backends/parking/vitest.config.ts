import * as path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      // Make absolute `src/...` imports work in vitest tests (replaces jest's moduleNameMapper)
      src: path.resolve(__dirname, 'src'),
      // Resolve @parker/test-utils to its TypeScript source: its compiled CommonJS output imports `expect` from
      // vitest, and vitest refuses to be require()d from CommonJS. Resolving to source lets vitest transform the
      // module, wiring `vitest` up to the running worker's instance. TODO(M6): replace this alias with a
      // `development` conditional export on @parker/test-utils.
      '@parker/test-utils': path.resolve(__dirname, '../../packages/test-utils/src/index.ts'),
      // @js-temporal/polyfill is a dual CJS/ESM package. Code transformed by vitest imports it (getting the ESM
      // build), while externalized CommonJS workspace deps like @parker/drizzle-utils require() it (getting the
      // CJS build) - two copies of the Temporal classes, breaking instanceof checks and toEqual comparisons.
      // Pin everything to the CJS build, which Node shares with require(). TODO(M6): remove once the repo is ESM.
      '@js-temporal/polyfill': path.resolve(__dirname, 'node_modules/@js-temporal/polyfill/dist/index.cjs'),
    },
  },
  test: {
    include: ['src/**/*.{spec,test}.ts'],
    setupFiles: ['./src/test/setupEnv.ts', './src/test/setup.ts'],
    sequence: { concurrent: false },
    fileParallelism: false,
    passWithNoTests: true,
    mockReset: true,
    restoreMocks: true,
    server: {
      deps: {
        // pg-pool ships an ESM wrapper that exports its class as `default`. Vite picks that ESM
        // entrypoint, and then pg's internal `require('pg-pool')` resolves to a Module object
        // rather than the Pool class — `class extends [object Module]` blows up. Inlining these
        // forces them through Vite's CJS-to-ESM transform, which unwraps the default export.
        inline: ['pg', 'pg-pool', 'pg-types', 'pg-protocol', 'pg-int8', /^drizzle-orm/],
      },
    },
  },
})
