// @ts-check
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import nextPlugin from '@next/eslint-plugin-next'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Base JS rules
  js.configs.recommended,

  // Ignore patterns
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'public/**', 'next-env.d.ts'],
  },

  // CommonJS config files (e.g. postcss.config.js) use `module`, `require`, etc.
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
  },

  // TypeScript + Next.js files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-require-imports': 'error',

      // Next.js core web vitals
      ...nextPlugin.configs['core-web-vitals'].rules,

      // General
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Disable base rule in favour of TS version
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
]

export default eslintConfig
