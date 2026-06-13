import type {Config} from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({dir: './'});

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {'^@/(.*)$': '<rootDir>/$1'},
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'store/**/*.ts',
    'hooks/**/*.ts',
    'components/**/*.tsx',
    '!**/*.d.ts',
  ],
};

export default createJestConfig(config);
