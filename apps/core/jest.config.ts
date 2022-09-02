/* eslint-disable */
export default {
  displayName: 'core',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/core',
  setupFiles: ['<rootDir>/src/test/jestHooks/setEnvVars.ts'],
  globalTeardown: '<rootDir>/src/test/jestHooks/globalTeardown.ts',
}
