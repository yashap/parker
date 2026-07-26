import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Resolve workspace deps (e.g. @parker/test-utils) to their TS source via the `development` export condition,
    // so vitest transforms them itself. Critically, @parker/test-utils imports `expect` from vitest, and vitest
    // refuses to be require()d from a pre-compiled module - resolving to source wires it to the running worker.
    conditions: ['development', 'import', 'node'],
  },
  test: {
    include: ['src/**/*.{spec,test}.ts'],
    setupFiles: ['./src/test/setup.ts'],
    passWithNoTests: true,
    mockReset: true,
    restoreMocks: true,
  },
})
