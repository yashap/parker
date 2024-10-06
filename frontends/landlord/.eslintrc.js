// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: ['@parker/eslint-config/default.js', 'plugin:react/recommended'],
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
}
