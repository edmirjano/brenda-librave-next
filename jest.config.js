const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // If using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // Path mapping to match tsconfig.json
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
  },

  testEnvironment: 'jest-environment-jsdom',

  // Test coverage configuration - Phase 2 focus
  collectCoverageFrom: [
    // Core Phase 1 & 2 files
    'src/app/page.tsx',
    'src/app/api/health/**/*.{js,jsx,ts,tsx}',
    'src/app/api/auth/**/*.{js,jsx,ts,tsx}',
    'src/app/api/books/**/*.{js,jsx,ts,tsx}',
    'src/app/api/categories/**/*.{js,jsx,ts,tsx}',
    'src/app/api/exchange-rate/**/*.{js,jsx,ts,tsx}',
    'src/app/api/user/**/*.{js,jsx,ts,tsx}',
    'src/components/auth/**/*.{js,jsx,ts,tsx}',
    'src/components/books/**/*.{js,jsx,ts,tsx}',
    'src/components/ui/**/*.{js,jsx,ts,tsx}',
    'src/components/layout/**/*.{js,jsx,ts,tsx}',
    'src/lib/auth/**/*.{js,jsx,ts,tsx}',
    'src/lib/currency/**/*.{js,jsx,ts,tsx}',
    'src/lib/services/**/*.{js,jsx,ts,tsx}',
    'src/lib/validations/auth.ts',
    'src/lib/validations/book.ts',
    'src/lib/logging/**/*.{js,jsx,ts,tsx}',
    'src/lib/db/**/*.{js,jsx,ts,tsx}',
    'src/lib/utils.ts',
    'src/types/**/*.{js,jsx,ts,tsx}',
    'src/hooks/**/*.{js,jsx,ts,tsx}',
    // Exclude everything else for Phase 2
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/node_modules/**',
    '!src/app/globals.css',
    '!src/app/layout.tsx',
    '!src/app/debug/**',
    '!src/app/about/**',
    '!src/app/contact/**',
    '!src/app/forum/**',
    '!src/app/gift/**',
    '!src/app/shop/**',
    '!src/app/auth/**',
    '!src/app/profile/**',
    '!src/app/books/**',
    '!src/middleware.ts',
    '!src/instrumentation.ts',
    '!src/sentry.client.config.ts',
    // Exclude Phase 3+ features
    '!src/components/admin/**',
    '!src/app/admin/**',
  ],

  coverageThreshold: {
    global: {
      // Focus on core business logic
      branches: 60,
      functions: 65,
      lines: 70,
      statements: 70,
    },
  },

  coverageReporters: ['text', 'lcov', 'html'],

  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/', // Playwright tests
  ],

  // Ignore specific file patterns
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/dist/'],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Handle CSS modules and assets
  // Note: moduleNameMapper already defined above with path mappings

  // Test timeout for async operations
  testTimeout: 10000,

  // Verbose output for better debugging
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
