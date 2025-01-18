// getRelativePathForImport.test.ts
import { getRelativePathForImport } from './getRelativePathForImport';

describe('getRelativePathForImport', () => {
  it('should return correct relative path for same directory', () => {
    const from = '/dev/src/__tests__/moduleA.test.ts';
    const to = '/dev/src/__tests__/moduleB.ts';
    expect(getRelativePathForImport(from, to)).toBe('./moduleB.ts');
  });

  it('should return correct relative path for parent directory', () => {
    const from = '/dev/src/__tests__/moduleA.test.ts';
    const to = '/dev/src/moduleB.ts';
    expect(getRelativePathForImport(from, to)).toBe('../moduleB.ts');
  });

  it('should return correct relative path for child directory', () => {
    const from = '/dev/src/moduleA.ts';
    const to = '/dev/src/__tests__/moduleB.test.ts';
    expect(getRelativePathForImport(from, to)).toBe(
      './__tests__/moduleB.test.ts'
    );
  });

  it('should handle absolute paths correctly', () => {
    const from = '/dev/src/utils/helpers.ts';
    const to = '/dev/src/components/Button.tsx';
    expect(getRelativePathForImport(from, to)).toBe('../components/Button.tsx');
  });

  it('should handle same file path', () => {
    const from = '/dev/src/module.ts';
    const to = '/dev/src/module.ts';
    expect(getRelativePathForImport(from, to)).toBe('./module.ts');
  });

  it('should handle importing from root directory', () => {
    const from = '/dev/src/moduleA.ts';
    const to = '/dev/index.ts';
    expect(getRelativePathForImport(from, to)).toBe('../index.ts');
  });

  it('should handle Windows-style paths by converting to forward slashes', () => {
    const from = 'C:\\dev\\src\\__tests__\\moduleA.test.ts';
    const to = 'C:\\dev\\src\\moduleB.ts';
    expect(getRelativePathForImport(from, to)).toBe('../moduleB.ts');
  });

  it('should add ./ prefix if the relative path does not start with ../ or ./', () => {
    const from = '/dev/src/moduleA.ts';
    const to = '/dev/src/moduleB.ts';
    expect(getRelativePathForImport(from, to)).toBe('./moduleB.ts');
  });

  it('should handle complex nested paths', () => {
    const from = '/dev/src/components/buttons/__tests__/button.test.ts';
    const to = '/dev/src/utils/helpers.ts';
    expect(getRelativePathForImport(from, to)).toBe(
      '../../../utils/helpers.ts'
    );
  });
});
