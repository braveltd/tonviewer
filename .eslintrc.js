module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'standard',
    'next'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    semi: ['error', 'always', { omitLastInOneLineBlock: true }],
    'max-len': ['error', { code: 120 }],
    'multiline-ternary': 'off',
    'spaced-comment': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': 'off',
    'no-extra-boolean-cast': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/no-useless-constructor': ['error']
  }
};
