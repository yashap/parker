import * as path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      // Resolve @parker/test-utils to its TypeScript source: its compiled CommonJS output imports `expect` from
      // vitest, and vitest refuses to be require()d from CommonJS. Resolving to source lets vitest transform the
      // module, wiring `vitest` up to the running worker's instance. TODO(M6): replace this alias with a
      // `development` conditional export on @parker/test-utils.
      '@parker/test-utils': path.resolve(__dirname, '../test-utils/src/index.ts'),
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
