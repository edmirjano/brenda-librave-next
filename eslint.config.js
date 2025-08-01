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
      'eslint.config.js',
      // Ignore test files temporarily
      'src/**/__tests__/**',
      'src/**/*.test.*',
      'src/**/*.spec.*',
      'e2e/**',
      'test-results/**',
      'playwright-report/**',
      'prisma/seed.ts',
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
        // Browser APIs
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',
        console: 'readonly',

        // DOM APIs
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDivElement: 'readonly',
        MouseEvent: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FileList: 'readonly',

        // Node.js APIs
        NodeJS: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        NextFetchEvent: 'readonly',

        // Global variables
        process: 'readonly',

        // Web APIs
        fetch: 'readonly',
        URL: 'readonly',
        window: 'readonly',
        React: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
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
          // Ignore unused vars in interfaces, types, and function signatures
          ignoreRestSiblings: true,
          // Don't check interface properties and type definitions
          args: 'after-used',
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // Disable base no-unused-vars rule in favor of TypeScript version
      'no-unused-vars': 'off',
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
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests for flexibility
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
