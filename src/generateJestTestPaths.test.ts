import path from 'path';
import { generateJestTestPaths } from './generateJestTestPaths';

describe('generateJestTestPaths', () => {
  it('should generate test paths with .test and .spec suffixes in the same directory', () => {
    const modulePath = '/project/src/components/Button.ts';
    const expected = [
      '/project/src/components/Button.test.ts',
      '/project/src/components/Button.spec.ts',
      '/project/src/components/__tests__/Button.test.ts',
      '/project/src/components/__tests__/Button.spec.ts',
      '/project/src/components/__tests__/Button.ts',
    ];
    const result = generateJestTestPaths(modulePath);
    expect(result).toEqual(expected);
  });

  it('should handle .tsx files correctly', () => {
    const modulePath = '/project/src/App.tsx';
    const expected = [
      '/project/src/App.test.tsx',
      '/project/src/App.spec.tsx',
      '/project/src/__tests__/App.test.tsx',
      '/project/src/__tests__/App.spec.tsx',
      '/project/src/__tests__/App.tsx',
    ];
    const result = generateJestTestPaths(modulePath);
    expect(result).toEqual(expected);
  });

  it('should handle index files correctly', () => {
    const modulePath = '/project/src/index.ts';
    const expected = [
      '/project/src/index.test.ts',
      '/project/src/index.spec.ts',
      '/project/src/__tests__/index.test.ts',
      '/project/src/__tests__/index.spec.ts',
      '/project/src/__tests__/index.ts',
    ];
    const result = generateJestTestPaths(modulePath);
    expect(result).toEqual(expected);
  });

  it('should handle relative paths correctly', () => {
    const modulePath = './src/utils/helpers.ts';
    const absolutePath = path.resolve(modulePath);
    const expected = [
      path.join(path.dirname(absolutePath), 'helpers.test.ts'),
      path.join(path.dirname(absolutePath), 'helpers.spec.ts'),
      path.join(path.dirname(absolutePath), '__tests__', 'helpers.test.ts'),
      path.join(path.dirname(absolutePath), '__tests__', 'helpers.spec.ts'),
      path.join(path.dirname(absolutePath), '__tests__', 'helpers.ts'),
    ];
    const result = generateJestTestPaths(modulePath);
    expect(result).toEqual(expected);
  });

  it('should generate correct paths for deeply nested modules', () => {
    const modulePath = '/project/src/features/user/profile/Profile.ts';
    const expected = [
      '/project/src/features/user/profile/Profile.test.ts',
      '/project/src/features/user/profile/Profile.spec.ts',
      '/project/src/features/user/profile/__tests__/Profile.test.ts',
      '/project/src/features/user/profile/__tests__/Profile.spec.ts',
      '/project/src/features/user/profile/__tests__/Profile.ts',
    ];
    const result = generateJestTestPaths(modulePath);
    expect(result).toEqual(expected);
  });

  it('should handle module paths with multiple dots correctly', () => {
    const modulePath = '/project/src/utils/date.helper.ts';
    const expected = [
      '/project/src/utils/date.helper.test.ts',
      '/project/src/utils/date.helper.spec.ts',
      '/project/src/utils/__tests__/date.helper.test.ts',
      '/project/src/utils/__tests__/date.helper.spec.ts',
      '/project/src/utils/__tests__/date.helper.ts',
    ];
    const result = generateJestTestPaths(modulePath);
    expect(result).toEqual(expected);
  });
});
