import * as fs from 'fs';
import * as path from 'path';

/**
 * Find the nearest directory containing a package.json,
 * starting from `startPath` and moving upward.
 */
export async function findProjectRoot(startPath: string): Promise<string> {
  let currentPath = path.resolve(path.dirname(startPath));

  // Keep moving up until we find package.json or reach the filesystem root.
  while (true) {
    const packageJsonPath = path.join(currentPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      // We have reached the root of the file system
      throw new Error('Unable to find project root containing a package.json');
    }
    currentPath = parentPath;
  }
}
