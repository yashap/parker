import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.{spec,test}.ts'],
    passWithNoTests: true,
    mockReset: true,
    restoreMocks: true,
  },
})
