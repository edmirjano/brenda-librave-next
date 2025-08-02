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
    // Core business logic only
    'src/app/api/health/**/*.{js,jsx,ts,tsx}',
    'src/app/api/exchange-rate/**/*.{js,jsx,ts,tsx}',
    'src/lib/auth/**/*.{js,jsx,ts,tsx}',
    'src/lib/currency/**/*.{js,jsx,ts,tsx}',
    'src/lib/validations/auth.ts',
    'src/lib/validations/book.ts',
    'src/lib/utils.ts',
    'src/hooks/**/*.{js,jsx,ts,tsx}',
    'src/components/ui/PriceDisplay.tsx',
    'src/components/ui/LiquidButton.tsx',
    'src/components/ui/GlassCard.tsx',
    
    // Exclude everything else
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/node_modules/**',
  ],

  coverageThreshold: {
    global: {
      // Realistic thresholds for tested business logic
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
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
