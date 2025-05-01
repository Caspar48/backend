export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};