const js = require('@eslint/js');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      '.next/**',
      'coverage/**',
      'node_modules/**',
      'out/**',
      'dist/**',
      'build/**',
      '.vercel/**',
      '.netlify/**',
      '*.config.js',
      '*.config.ts',
      'jest.setup.js',
      'jest.config.js',
      'postcss.config.js',
      'next.config.js',
      'tailwind.config.ts',
      'playwright.config.ts',
      'eslint.config.js'
    ],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
          languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true,
          },
        },
              globals: {
          console: 'readonly',
          process: 'readonly',
          Buffer: 'readonly',
          __dirname: 'readonly',
          __filename: 'readonly',
          module: 'readonly',
          require: 'readonly',
          global: 'readonly',
          window: 'readonly',
          document: 'readonly',
          navigator: 'readonly',
          fetch: 'readonly',
          React: 'readonly',
          URL: 'readonly',
        },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      // Basic rules for Phase 1
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Test files overrides
  {
    files: ['src/**/__tests__/**/*', 'src/**/*.test.*', 'src/**/*.spec.*', 'e2e/**/*'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  // Config files overrides
  {
    files: ['*.config.js', '*.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]; 