import baseConfig from '@parker/eslint-config/default.config.mjs'

export default [
  ...baseConfig,
  {
    ignores: ['drizzle.config.ts'],
  },
]
