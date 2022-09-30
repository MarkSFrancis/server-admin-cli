module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['jest'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
  },
}
