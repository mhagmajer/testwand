import path from 'path';

/**
 * Generates an array of potential Jest test file paths for a given TypeScript module path.
 *
 * @param modulePath - The absolute or relative path to the TypeScript module.
 * @returns An array of possible Jest test file paths.
 */
export function generateJestTestPaths(modulePath: string): string[] {
  // Resolve the module path to an absolute path
  const absoluteModulePath = path.resolve(modulePath);

  // Extract directory, filename, and extension
  const dir = path.dirname(absoluteModulePath);
  const ext = path.extname(absoluteModulePath);
  const baseName = path.basename(absoluteModulePath, ext);

  // Define possible test file suffixes
  const testSuffixes = ['.test', '.spec'];

  // Define possible test directory names
  const testDirNames = ['__tests__'];

  // Define the list to collect potential test paths
  const potentialTestPaths: string[] = [];

  // Generate test file names with suffixes in the same directory
  testSuffixes.forEach((suffix) => {
    potentialTestPaths.push(path.join(dir, `${baseName}${suffix}${ext}`));
  });

  // allow no extension in case of test inside directory
  testSuffixes.push('');

  // Generate test file names within each test directory
  testDirNames.forEach((testDir) => {
    testSuffixes.forEach((suffix) => {
      potentialTestPaths.push(
        path.join(dir, testDir, `${baseName}${suffix}${ext}`)
      );
    });
  });

  return potentialTestPaths;
}
