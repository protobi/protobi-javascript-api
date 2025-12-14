#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get package.json for version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('protobi')
  .description('Protobi CLI - Command-line interface for Protobi REST API')
  .version(packageJson.version);

// Global options available to all commands
program
  .option('--config <path>', 'Path to config JSON file')
  .option('--apiKey <key>', 'API key (overrides config)')
  .option('--host <hostname>', 'API host (default: app.protobi.com)')
  .option('--datasetId <id>', 'Dataset ID (can be in config)')
  .option('--json', 'Output as JSON (machine-readable)')
  .option('--quiet', 'Quiet mode (errors only)')
  .option('--verbose', 'Verbose output');

// Import and register commands
// We'll dynamically import command modules to keep cli.js clean

// Config commands
program
  .command('config')
  .description('View current configuration')
  .action(async (options) => {
    const { default: configCommand } = await import('../lib/cli/commands/config.mjs');
    await configCommand(program.opts());
  });

program
  .command('init')
  .description('Interactive setup wizard')
  .action(async () => {
    const { default: initCommand } = await import('../lib/cli/commands/init.mjs');
    await initCommand();
  });

program
  .command('login')
  .description('Update API key')
  .action(async () => {
    const { default: loginCommand } = await import('../lib/cli/commands/login.mjs');
    await loginCommand();
  });

// Dataset commands
const dataset = program
  .command('dataset')
  .description('Dataset operations (data and elements)');

dataset
  .command('download')
  .description('Download data from dataset')
  .option('--datasetId <id>', 'Dataset ID')
  .option('--table <name>', 'Table/data key name')
  .option('--output <file>', 'Output CSV file (default: stdout or <table>.csv)')
  .option('--format <type>', 'Output format: csv or json', 'csv')
  .action(async (options) => {
    const { default: downloadCommand } = await import('../lib/cli/commands/dataset/download.mjs');
    const globalOpts = program.opts();
    await downloadCommand({ ...globalOpts, ...options });
  });

dataset
  .command('upload')
  .description('Upload data to dataset')
  .option('--datasetId <id>', 'Dataset ID')
  .option('--table <name>', 'Table/data key name')
  .requiredOption('--file <path>', 'CSV file to upload')
  .action(async (options) => {
    const { default: uploadCommand } = await import('../lib/cli/commands/dataset/upload.mjs');
    const globalOpts = program.opts();
    await uploadCommand({ ...globalOpts, ...options });
  });

dataset
  .command('get-elements')
  .description('Download project configuration (elements)')
  .option('--datasetId <id>', 'Dataset ID')
  .option('--output <file>', 'Output JSON file (default: elements.json)')
  .action(async (options) => {
    const { default: getElementsCommand } = await import('../lib/cli/commands/dataset/get-elements.mjs');
    const globalOpts = program.opts();
    await getElementsCommand({ ...globalOpts, ...options });
  });

dataset
  .command('upload-elements')
  .description('Upload project configuration (elements)')
  .option('--datasetId <id>', 'Dataset ID')
  .requiredOption('--file <path>', 'JSON file to upload')
  .action(async (options) => {
    const { default: uploadElementsCommand } = await import('../lib/cli/commands/dataset/upload-elements.mjs');
    const globalOpts = program.opts();
    await uploadElementsCommand({ ...globalOpts, ...options });
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
