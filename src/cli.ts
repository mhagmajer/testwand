#!/usr/bin/env node
process.emitWarning = () => {}; // Deprecation working suppression until openai v5 with native fetch

import { Command } from 'commander';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';
import packageJson from '../package.json';
import { findProjectRoot } from './findProjectRoot';
import { generateJestTestPaths } from './generateJestTestPaths';
import { generateTestCodeForTypeScriptFunctions } from './generateTestCodeForTypeScriptFunctions';
import { getJestConfig } from './getJestConfig';
import { getTypeScriptFunctionsForFilePath } from './getTypeScriptFunctionsForFilePath';
import { isJestTestFile } from './isJestTestFile';

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

    const projectRoot = await findProjectRoot(filePath);
    const jestConfig = await getJestConfig(projectRoot);
    const possibleTestPaths = generateJestTestPaths(filePath);
    if (possibleTestPaths.length === 0) {
      throw new Error(`No possible test paths for ${filePath}`);
    }

    const testPath =
      possibleTestPaths.find(
        (path) => fs.existsSync(path) && isJestTestFile(jestConfig, path)
      ) ?? possibleTestPaths[0];

    const code = await generateTestModule(filePath);

    if (!code) {
      return;
    }

    await writeFile(testPath, code, { encoding: 'utf-8' });

    console.log('Test code written to', testPath);
  });

program.parse(process.argv);

async function generateTestModule(modulePath: string) {
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

  const code = await generateTestCodeForTypeScriptFunctions(signatures);
  return code;
}
