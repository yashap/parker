import baseConfig from '@parker/eslint-config/default.config.mjs'
import reactPlugin from 'eslint-plugin-react'

export default [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    rules: {
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
