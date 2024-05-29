/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    transform: {
        '^.+\\.ts?$': 'babel-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/__tests__/unit/*.test.ts'],
};

// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     transform: {
//       '^.+\\.tsx?$': 'babel-jest',
//     },
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   };
