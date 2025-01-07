#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import packageJson from '../package.json';

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
  .action((modulePath: string | undefined) => {
    if (modulePath) {
      generateTests(modulePath);
    } else {
      program.outputHelp();
    }
  });

// Parse the command-line arguments
program.parse(process.argv);

// Function to handle test generation logic
function generateTests(modulePath: string) {
  if (fs.existsSync(modulePath)) {
    console.log(`Generating tests for module: ${modulePath}`);
    // Add your test generation logic here
  } else {
    console.error(`Error: Module file ${modulePath} not found.`);
    process.exit(1);
  }
}
