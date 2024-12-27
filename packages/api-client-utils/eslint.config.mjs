import baseConfig from '@parker/eslint-config/default.config.mjs'

export default [
  ...baseConfig,
  {
    rules: {
      'no-relative-import-paths/no-relative-import-paths': 'off',
    },
  },
]
