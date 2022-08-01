module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  testPathIgnorePatterns: ['<rootDir>/src/ignored_tests/'],
};
