import * as path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Make absolute `src/...` imports work in vitest tests (replaces jest's moduleNameMapper)
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['src/**/*.{spec,test}.ts'],
    passWithNoTests: true,
    mockReset: true,
    restoreMocks: true,
  },
})
