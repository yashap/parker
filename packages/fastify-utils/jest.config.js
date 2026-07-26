// Jest config: https://jestjs.io/docs/configuration

// eslint-disable-next-line no-undef
module.exports = {
  // Automatically reset mock state before every test
  resetMocks: true,

  // Automatically restore mock state and implementation before every test
  restoreMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 5,
}
