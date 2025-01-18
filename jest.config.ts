/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}], // Escape the dot to match only TypeScript files
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
