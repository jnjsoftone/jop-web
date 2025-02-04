/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = require('./jest.config.js');

module.exports = {
  ...config,
  testMatch: ['**/tests/unit/**/*.test.ts']
}; 