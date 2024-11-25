import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'], // Optional: For test-specific setup
  roots: ['./src'] //ensure only the test in src are executed
};

export default config;