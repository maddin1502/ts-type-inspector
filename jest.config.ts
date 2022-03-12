import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testMatch: [
    '<rootDir>/tests/code/**/*.test.ts'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js}'
  ],
  coverageReporters: [
    'html',
    'text',
    'cobertura'
  ],
  coverageDirectory: '<rootDir>/tests/reports/coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        'suiteName': 'jest tests',
        'outputDirectory': './tests/reports/result',
        'outputName': 'junit.xml',
        'classNameTemplate': '{classname}',
        'titleTemplate': '{title}',
        'ancestorSeparator': ' › '
      }
    ],
    [
      'jest-html-reporters',
      {
        'publicPath': './tests/reports/result',
        'filename': 'overview.html'
      }
    ]
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1'
  },
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  resetMocks: true,
  restoreMocks: true
};

export default config;
