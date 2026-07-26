import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.{spec,test}.ts'],
    setupFiles: ['./src/test/setupEnv.ts', './src/test/setup.ts'],
    sequence: { concurrent: false },
    fileParallelism: false,
    passWithNoTests: true,
    mockReset: true,
    restoreMocks: true,
  },
})
