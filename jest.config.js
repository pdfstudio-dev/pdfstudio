module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/platform/browser/**',
    '!src/utils/SVGPathParser.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 55,
      lines: 50,
      statements: 50,
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
};
