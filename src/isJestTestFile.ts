import { Config } from '@jest/types';
import micromatch from 'micromatch';
import path from 'path';

/**
 * Determines if a given file path is a Jest test file based on the provided Jest configuration.
 *
 * @param config - The Jest configuration object containing specific fields.
 * @param testFilePath - The absolute or relative path to the file to check.
 * @returns `true` if the file is recognized as a Jest test file, `false` otherwise.
 */
export function isJestTestFile(
  config: Config.ProjectConfig,
  testFilePath: string
): boolean {
  const {
    testMatch,
    testRegex,
    testPathIgnorePatterns,
    modulePathIgnorePatterns,
    rootDir,
  } = config;

  // Resolve the absolute path of the test file and normalize with forward slashes
  const absoluteTestFilePath = path
    .resolve(rootDir, testFilePath)
    .split(path.sep)
    .join('/');

  // Function to check if the file matches any of the ignore patterns (regex)
  const isIgnored = (): boolean => {
    // Check testPathIgnorePatterns
    if (testPathIgnorePatterns) {
      for (const pattern of testPathIgnorePatterns) {
        const regex = isRegExp(pattern) ? pattern : new RegExp(pattern);

        if (regex.test(absoluteTestFilePath)) {
          return true;
        }
      }
    }

    // Check modulePathIgnorePatterns
    if (modulePathIgnorePatterns) {
      for (const pattern of modulePathIgnorePatterns) {
        const regex = isRegExp(pattern) ? pattern : new RegExp(pattern);
        if (regex.test(absoluteTestFilePath)) {
          return true;
        }
      }
    }

    return false;
  };

  if (isIgnored()) {
    return false;
  }

  // Function to check if the file matches any of the testMatch patterns (glob)
  const matchesTestMatch = (): boolean => {
    if (testMatch && testMatch.length > 0) {
      return micromatch.isMatch(absoluteTestFilePath, testMatch, { dot: true });
    }

    return false;
  };

  // Function to check if the file matches any of the testRegex patterns (regex)
  const matchesTestRegex = (): boolean => {
    if (testRegex) {
      const regexPatterns: RegExp[] = Array.isArray(testRegex)
        ? testRegex.map((pattern) =>
            isRegExp(pattern) ? pattern : new RegExp(pattern)
          )
        : [isRegExp(testRegex) ? testRegex : new RegExp(testRegex)];

      return regexPatterns.some((regex) => regex.test(absoluteTestFilePath));
    }

    return false;
  };

  // Determine if the file matches testMatch or testRegex
  if (matchesTestMatch()) {
    return true;
  }

  if (matchesTestRegex()) {
    return true;
  }

  // If neither testMatch nor testRegex matched, it's not a test file
  return false;
}

/**
 * Determines whether the given value is a RegExp object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a RegExp, otherwise `false`.
 */
function isRegExp(value: unknown): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}
