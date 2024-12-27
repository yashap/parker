import baseConfig from '@parker/eslint-config/default.config.mjs'
import reactPlugin from 'eslint-plugin-react'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'

export default [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      // Allow only absolute imports, no relative imports
      'no-relative-import-paths/no-relative-import-paths': ['error', { allowSameFolder: false }],
      'react/jsx-key': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/ignore': ['react-native'],
    },
  },
]
