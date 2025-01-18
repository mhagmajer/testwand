#!/usr/bin/env node
process.emitWarning = () => {}; // Deprecation working suppression until openai v5 with native fetch

import { Command } from 'commander';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import yoctoSpinner from 'yocto-spinner';
import { findProjectRoot } from './findProjectRoot.js';
import { generateJestTestPaths } from './generateJestTestPaths.js';
import { generateTestCodeForTypeScriptFunctions } from './generateTestCodeForTypeScriptFunctions.js';
import { getJestConfig } from './getJestConfig.js';
import { getTypeScriptFunctionsForFilePath } from './getTypeScriptFunctionsForFilePath.js';
import { isJestTestFile } from './isJestTestFile.js';
import { packageJson } from './packageJson.js';
import { stripMarkdownCodeBlock } from './utils/stripMarkdownCodeBlock.js';
import { getRelativePathForImport } from './utils/getRelativePathForImport.js';

const program = new Command();

// Set up the CLI metadata
program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

// Define commands
program
  .command('greet <name>')
  .description('Greet someone by name')
  .action((name: string) => {
    console.log(`Hello, ${name}!`);
  });

// Default action for handling a single argument (path to module)
program
  .argument('[path]', 'Path to the TypeScript module for generating tests')
  .action(async (filePath: string | undefined) => {
    if (!filePath) {
      program.outputHelp();
      return;
    }

    const modulePath = path.resolve(filePath);
    const projectRoot = await findProjectRoot(modulePath);
    const jestConfig = await getJestConfig(projectRoot);
    const possibleTestPaths = generateJestTestPaths(modulePath);
    if (possibleTestPaths.length === 0) {
      throw new Error(`No possible test paths for ${modulePath}`);
    }

    const testPath =
      possibleTestPaths.find(
        (path) => fs.existsSync(path) && isJestTestFile(jestConfig, path)
      ) ?? possibleTestPaths[0];

    const spinner = yoctoSpinner({
      text: 'Generating tests with AI...',
    }).start();
    try {
      const code = await generateTestModule({ modulePath, testPath });

      if (!code) {
        throw new Error('Generated code is empty');
      }

      await writeFile(testPath, code, { encoding: 'utf-8' });

      spinner.success(`Test code written to ${testPath}`);
    } catch (e) {
      spinner.error(String(e));
    } finally {
      spinner.stop();
    }
  });

program.parse(process.argv);

async function generateTestModule({
  modulePath,
  testPath,
}: {
  modulePath: string;
  testPath: string;
}) {
  if (!fs.existsSync(modulePath)) {
    console.error(`Error: Module file ${modulePath} not found.`);
    process.exit(1);
  }

  const signatures = getTypeScriptFunctionsForFilePath(modulePath);
  if (!signatures.length) {
    console.warn(
      `No functions found in ${modulePath}. Skipping test generation.`
    );
    return;
  }

  const code = stripMarkdownCodeBlock(
    await generateTestCodeForTypeScriptFunctions({
      testPath,
      modulePath,
      signatures,
    })
  );

  return code;
}
