// getRelativePathForImport.ts
import path from 'path';

/**
 * Determines if the given path is a Windows-style path.
 *
 * @param filePath - The file path to check.
 * @returns `true` if the path is Windows-style, otherwise `false`.
 */
function isWindowsPath(filePath: string): boolean {
  return /^[a-zA-Z]:\\/.test(filePath);
}

/**
 * Computes the relative import path from one module to another,
 * handling both POSIX and Windows-style paths.
 *
 * @param fromPath - The absolute path of the importing module.
 * @param toPath - The absolute path of the module to import.
 * @returns The relative import path that can be used in an import statement.
 */
export function getRelativePathForImport(
  fromPath: string,
  toPath: string
): string {
  let relativePath: string;

  // Determine the path style
  const isFromWindows = isWindowsPath(fromPath);
  const isToWindows = isWindowsPath(toPath);

  if (isFromWindows !== isToWindows) {
    throw new Error(
      'Cannot compute relative paths between different path styles.'
    );
  }

  // Choose the appropriate path module based on the path style
  const pathModule = isFromWindows ? path.win32 : path.posix;

  // Get the directory of the importing module
  const fromDir = pathModule.dirname(fromPath);

  // Compute the relative path from the importing module's directory to the target module
  relativePath = pathModule.relative(fromDir, toPath);

  // Replace Windows backslashes with forward slashes for compatibility
  relativePath = relativePath.split(pathModule.sep).join('/');

  // If the relative path does not start with '.', add './' to make it a valid module path
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}
