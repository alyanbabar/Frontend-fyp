import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// ESLint checks code quality and catches common mistakes before runtime.
export default defineConfig([
  // Skip generated build output.
  globalIgnores(['dist']),
  {
    // Apply these rules to JavaScript and JSX source files.
    files: ['**/*.{js,jsx}'],
    extends: [
      // Base JavaScript recommended rules.
      js.configs.recommended,
      // Validates correct Hook usage (`useState`, `useEffect`, etc.).
      reactHooks.configs.flat.recommended,
      // Helps keep React Fast Refresh working in development.
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Allow intentionally unused constants written like `MY_CONST`.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
