const { createDefaultPreset } = require('ts-jest');

const tsJestPreset = createDefaultPreset({
  tsconfig: '<rootDir>/tsconfig.json',
});

module.exports = {
  ...tsJestPreset,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  clearMocks: true,
};
