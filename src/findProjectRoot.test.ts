import * as fs from 'fs';
import * as path from 'path';
import { findProjectRoot } from './findProjectRoot';

jest.mock('fs');

describe('findProjectRoot', () => {
  const mockExistsSync = fs.existsSync as jest.MockedFunction<
    typeof fs.existsSync
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find the project root containing a package.json', async () => {
    // Arrange: Mock file system structure
    const startPath = '/home/user/project/src/file.ts';
    const projectRoot = '/home/user/project';
    const packageJsonPath = path.join(projectRoot, 'package.json');

    mockExistsSync.mockImplementation((filePath) => {
      return filePath === packageJsonPath;
    });

    // Act
    const result = await findProjectRoot(startPath);

    // Assert
    expect(result).toBe(projectRoot);
    expect(mockExistsSync).toHaveBeenCalledWith(packageJsonPath);
  });

  it('should move up the directory tree to find the package.json', async () => {
    // Arrange: Mock file system structure
    const startPath = '/home/user/project/src/file.ts';
    const projectRoot = '/home/user/project';
    const packageJsonPath = path.join(projectRoot, 'package.json');

    mockExistsSync.mockImplementation((filePath) => {
      return filePath === packageJsonPath;
    });

    // Act
    const result = await findProjectRoot(startPath);

    // Assert
    expect(result).toBe(projectRoot);
    expect(mockExistsSync).toHaveBeenCalledWith(packageJsonPath);
    expect(mockExistsSync).toHaveBeenCalledTimes(2); // src -> project
  });

  it('should throw an error if no package.json is found', async () => {
    // Arrange: Mock file system structure with no package.json
    const startPath = '/home/user/project/src/file.ts';

    mockExistsSync.mockImplementation(() => false);

    // Act & Assert
    await expect(findProjectRoot(startPath)).rejects.toThrow(
      'Unable to find project root containing a package.json'
    );
  });

  it('should stop at the filesystem root if no package.json is found', async () => {
    // Arrange: Mock file system structure
    const startPath = '/home/user/project/src/file.ts';

    mockExistsSync.mockImplementation(() => false);

    // Act & Assert
    await expect(findProjectRoot(startPath)).rejects.toThrow(
      'Unable to find project root containing a package.json'
    );

    expect(mockExistsSync).toHaveBeenCalled();
    expect(mockExistsSync).toHaveBeenCalledWith(
      '/home/user/project/src/package.json'
    );
    expect(mockExistsSync).toHaveBeenCalledWith(
      '/home/user/project/package.json'
    );
    expect(mockExistsSync).toHaveBeenCalledWith('/home/user/package.json');
    expect(mockExistsSync).toHaveBeenCalledWith('/home/package.json');
    expect(mockExistsSync).toHaveBeenCalledWith('/package.json');
  });

  it('should handle absolute and relative paths correctly', async () => {
    // Arrange: Mock file system structure
    const startPath = './src/file.ts';
    const absolutePath = path.resolve(startPath);
    const projectRoot = path.resolve('./');
    const packageJsonPath = path.join(projectRoot, 'package.json');

    mockExistsSync.mockImplementation((filePath) => {
      return filePath === packageJsonPath;
    });

    // Act
    const result = await findProjectRoot(startPath);

    // Assert
    expect(result).toBe(projectRoot);
    expect(mockExistsSync).toHaveBeenCalledWith(packageJsonPath);
    expect(mockExistsSync).toHaveBeenCalled();
  });
});
