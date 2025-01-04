#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

// Set up the CLI metadata
program
  .name('testwand')
  .description('A CLI tool for Testwand')
  .version('1.0.0');

// Define commands
program
  .command('greet <name>')
  .description('Greet someone by name')
  .action((name: string) => {
    console.log(`Hello, ${name}!`);
  });

// Parse the command-line arguments
program.parse(process.argv);
