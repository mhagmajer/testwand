import { Config } from '@jest/types';
import { isJestTestFile } from './isJestTestFile';

describe('isJestTestFile', () => {
  const mockConfig = {
    testMatch: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    testRegex: ['(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    modulePathIgnorePatterns: ['/ignored/'],
    rootDir: '/home/user/project',
  } as Config.ProjectConfig;

  it('should return true for a file matching testMatch glob pattern', () => {
    const filePath = '/home/user/project/src/__tests__/example.test.ts';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(true);
  });

  it('should return true for a file matching testRegex pattern', () => {
    const filePath = '/home/user/project/src/components/Button.spec.jsx';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(true);
  });

  it('should return false for a file in ignored testPath', () => {
    const filePath =
      '/home/user/project/node_modules/__tests__/example.test.ts';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(false);
  });

  it('should return false for a file in ignored modulePath', () => {
    const filePath = '/home/user/project/ignored/components/Button.test.js';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(false);
  });

  it('should return false for a non-test file', () => {
    const filePath = '/home/user/project/src/components/Button.tsx';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(false);
  });

  it('should handle relative file paths correctly', () => {
    const filePath = './src/__tests__/relative.test.ts';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(true);
  });

  it('should return false if file matches ignore patterns even if it matches test patterns', () => {
    const filePath =
      '/home/user/project/node_modules/__tests__/ignored.test.js';
    const result = isJestTestFile(mockConfig, filePath);
    expect(result).toBe(false);
  });

  it('should return true if testMatch is defined and matches', () => {
    const configWithOnlyTestMatch = {
      ...mockConfig,
      testRegex: [],
    } as Config.ProjectConfig;
    const filePath = '/home/user/project/tests/example.test.ts';
    const result = isJestTestFile(configWithOnlyTestMatch, filePath);
    expect(result).toBe(true);
  });

  it('should return true if testRegex is defined and matches', () => {
    const configWithOnlyTestRegex = {
      ...mockConfig,
      testMatch: [],
    } as Config.ProjectConfig;
    const filePath = '/home/user/project/tests/example.spec.tsx';
    const result = isJestTestFile(configWithOnlyTestRegex, filePath);
    expect(result).toBe(true);
  });

  it('should return false if neither testMatch nor testRegex is defined', () => {
    const configWithNoTestPatterns = {
      ...mockConfig,
      testMatch: [],
      testRegex: [],
    } as Config.ProjectConfig;
    const filePath = '/home/user/project/tests/example.tsx';
    const result = isJestTestFile(configWithNoTestPatterns, filePath);
    expect(result).toBe(false);
  });
});
