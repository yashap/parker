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
    setupFiles: ['./src/test/setup.ts'],
    passWithNoTests: true,
    mockReset: true,
    restoreMocks: true,
  },
})
