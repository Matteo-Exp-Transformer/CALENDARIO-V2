/* eslint-env node */
// ESLint proprio della Console — indipendente da quello root di Matteo.
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react-refresh'],
  rules: {
    // Il logger della Console usa console.warn/error; console.log è vietato in produzione.
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  // supabase/ contiene Edge Functions Deno (non browser): esclusa come in tsconfig.json.
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts', 'supabase'],
}
