#!/usr/bin/env node

/**
 * Clone Project Tool - REST API version
 *
 * Clones a complete Protobi project (dataset + elements + data) between environments
 * using only the REST API (no MongoDB access required).
 *
 * Usage:
 *   node tools/clone-project.mjs --dataset-id <id> [options]
 *   node tools/clone-project.mjs --config tools/clone-config.example.json
 *   node tools/clone-project.mjs --dataset-id <id> --save-config my-clone.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Protobi API from parent directory
const apiPath = path.resolve(__dirname, '../js/protobi-rest-api.js');
const ProtobiAPI = await import(apiPath).then(m => m.default || m);

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    datasetId: null,
    configFile: null,
    saveConfigFile: null,
    sourceHost: null,
    sourceApiKey: null,
    destHost: null,
    destApiKey: null,
    skipFiles: false,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--dataset-id':
        options.datasetId = next;
        i++;
        break;
      case '--config':
        options.configFile = next;
        i++;
        break;
      case '--save-config':
        options.saveConfigFile = next;
        i++;
        break;
      case '--source-host':
        options.sourceHost = next;
        i++;
        break;
      case '--source-api-key':
        options.sourceApiKey = next;
        i++;
        break;
      case '--dest-host':
        options.destHost = next;
        i++;
        break;
      case '--dest-api-key':
        options.destApiKey = next;
        i++;
        break;
      case '--skip-files':
        options.skipFiles = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Load configuration from file
 */
async function loadConfig(configPath) {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null; // File doesn't exist
    }
    throw new Error(`Failed to load config from ${configPath}: ${err.message}`);
  }
}

/**
 * Save configuration to file
 */
async function saveConfig(configPath, config) {
  const content = JSON.stringify(config, null, 2);
  await fs.writeFile(configPath, content, 'utf-8');
  console.log(chalk.green(`✓ Configuration saved to ${configPath}`));
}

/**
 * Merge configurations (CLI args override config file)
 */
function mergeConfigs(fileConfig, cliArgs) {
  const config = {
    datasetId: cliArgs.datasetId || fileConfig?.datasetId || null,
    source: {
      host: cliArgs.sourceHost || fileConfig?.source?.host || 'https://app.protobi.com',
      apiKey: cliArgs.sourceApiKey || fileConfig?.source?.apiKey || process.env.PROTOBI_API_KEY_SOURCE
    },
    dest: {
      host: cliArgs.destHost || fileConfig?.dest?.host || 'http://localhost:5000',
      apiKey: cliArgs.destApiKey || fileConfig?.dest?.apiKey || process.env.PROTOBI_API_KEY_DEST || null
    },
    skipFiles: cliArgs.skipFiles || fileConfig?.skipFiles || false,
    verbose: cliArgs.verbose || fileConfig?.verbose || false
  };

  return config;
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
${chalk.bold('Clone Project Tool')} - Clone Protobi projects between environments using REST API

${chalk.bold('Usage:')}
  node tools/clone-project.mjs --dataset-id <id> [options]
  node tools/clone-project.mjs --config <config-file>
  node tools/clone-project.mjs --dataset-id <id> --save-config <config-file>

${chalk.bold('Required:')}
  --dataset-id <id>           Dataset ID to clone

${chalk.bold('Options:')}
  --config <file>             Load configuration from JSON file
  --save-config <file>        Save merged configuration to JSON file
  --source-host <url>         Source API host (default: https://app.protobi.com)
  --source-api-key <key>      Source API key (or set PROTOBI_API_KEY_SOURCE)
  --dest-host <url>           Destination API host (default: http://localhost:5000)
  --dest-api-key <key>        Destination API key (or set PROTOBI_API_KEY_DEST)
  --skip-files                Skip data file transfers
  --help, -h                  Show this help message

${chalk.bold('Config File Format:')} (see tools/clone-config.example.json)
  {
    "datasetId": "67d9963a842478fccb14da41",
    "source": {
      "host": "https://globalstrategygroup.protobi.com",
      "apiKey": "your-source-api-key"
    },
    "dest": {
      "host": "http://localhost:5000",
      "apiKey": "your-dest-api-key-or-null-for-cookies"
    },
    "skipFiles": false
  }

${chalk.bold('Examples:')}
  # Clone from production to local with API key
  node tools/clone-project.mjs --dataset-id 67d9963a842478fccb14da41 \\
    --source-api-key "cc5e9dba-37f0-48bf-ba41-2ea5953c7805"

  # Use config file
  node tools/clone-project.mjs --config tools/clone-config.example.json

  # Save configuration for reuse
  node tools/clone-project.mjs --dataset-id 67d9963a842478fccb14da41 \\
    --source-host https://globalstrategygroup.protobi.com \\
    --source-api-key "your-key" \\
    --save-config my-clone-config.json

  # Clone without data files (faster, metadata only)
  node tools/clone-project.mjs --config my-clone-config.json --skip-files
`);
}

/**
 * Clone dataset metadata
 */
async function cloneDataset(sourceAPI, destAPI, datasetId, verbose) {
  if (verbose) {
    console.error(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.error(chalk.blue('Step 1: Cloning Dataset Metadata'));
    console.error(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    console.error(`Fetching dataset ${datasetId} from source...`);
  }

  // Get dataset from source
  let dataset;
  try {
    dataset = await sourceAPI.getDataset(datasetId);
  } catch (err) {
    throw new Error(`Failed to fetch dataset from SOURCE: ${err.message}`);
  }

  if (!dataset) {
    throw new Error(`Dataset ${datasetId} not found on source`);
  }

  if (verbose) {
    console.error(chalk.green(`✓ Found dataset: ${dataset.name || 'Unnamed'}`));
    console.error('Creating dataset on destination...');
  }

  // Create dataset on destination
  let newDataset;
  try {
    newDataset = await destAPI.createDataset(dataset);
  } catch (err) {
    throw new Error(`Failed to create dataset on DEST: ${err.message}`);
  }

  if (verbose) {
    console.error(chalk.green(`✓ Dataset created with ID: ${newDataset._id || newDataset.id}`));
  }

  return {
    sourceId: datasetId,
    destId: newDataset._id || newDataset.id,
    name: dataset.name
  };
}

/**
 * Clone elements (project configuration)
 */
async function cloneElements(sourceAPI, destAPI, sourceDatasetId, destDatasetId, verbose) {
  if (verbose) {
    console.error(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.error(chalk.blue('Step 2: Cloning Elements'));
    console.error(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    console.error('Fetching elements from source...');
  }

  // Get elements from source
  let elements;
  try {
    elements = await sourceAPI.getElements(sourceDatasetId);
  } catch (err) {
    throw new Error(`Failed to fetch elements from SOURCE: ${err.message}`);
  }

  if (!elements || elements.length === 0) {
    if (verbose) {
      console.error(chalk.yellow('⚠ No elements found'));
    }
    return;
  }

  if (verbose) {
    console.error(chalk.green(`✓ Found ${elements.length} elements`));
    console.error('Uploading elements to destination...');
  }

  // Upload elements to destination
  try {
    await destAPI.uploadElements(elements, destDatasetId);
  } catch (err) {
    throw new Error(`Failed to upload elements to DEST: ${err.message}`);
  }

  if (verbose) {
    console.error(chalk.green(`✓ Uploaded ${elements.length} elements`));
  }
}

/**
 * Clone data tables
 */
async function cloneDataTables(sourceAPI, destAPI, sourceDatasetId, destDatasetId, skipFiles, verbose) {
  if (verbose) {
    console.error(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.error(chalk.blue('Step 3: Cloning Data Tables'));
    console.error(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  if (skipFiles) {
    if (verbose) {
      console.error(chalk.yellow('⚠ Skipping file transfers (--skip-files)'));
    }
    return;
  }

  if (verbose) {
    console.error('Fetching data table list from source...');
  }

  // Get list of data tables from source
  let tables;
  try {
    tables = await sourceAPI.getDataTables(sourceDatasetId);
  } catch (err) {
    throw new Error(`Failed to fetch data tables from SOURCE: ${err.message}`);
  }

  if (!tables || tables.length === 0) {
    if (verbose) {
      console.error(chalk.yellow('⚠ No data tables found'));
    }
    return;
  }

  if (verbose) {
    console.error(chalk.green(`✓ Found ${tables.length} data tables`));
  }

  // Clone each table
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    if (verbose) {
      console.error(`\n[${i + 1}/${tables.length}] Cloning table: ${table.key || table.name}`);
    }

    try {
      // Download data from source
      let data;
      try {
        data = await sourceAPI.downloadData(sourceDatasetId, table.key);
      } catch (err) {
        throw new Error(`Failed to download from SOURCE: ${err.message}`);
      }

      // Upload data to destination
      try {
        await destAPI.uploadCsvText(data, destDatasetId, table.key, table.filename);
      } catch (err) {
        throw new Error(`Failed to upload to DEST: ${err.message}`);
      }

      if (verbose) {
        console.error(chalk.green(`  ✓ Cloned table ${table.key}`));
      }
    } catch (err) {
      console.error(chalk.red(`  ✗ Failed to clone table ${table.key}: ${err.message}`));
    }
  }

  if (verbose) {
    console.error(chalk.green(`\n✓ Cloned ${tables.length} data tables`));
  }
}

/**
 * Main execution
 */
async function main() {
  // Parse CLI arguments
  const cliArgs = parseArgs();

  if (cliArgs.help) {
    printUsage();
    process.exit(0);
  }

  // Load config file if specified
  let fileConfig = null;
  if (cliArgs.configFile) {
    if (cliArgs.verbose) {
      console.error(`Loading configuration from ${cliArgs.configFile}...`);
    }
    fileConfig = await loadConfig(cliArgs.configFile);
    if (!fileConfig) {
      console.error(chalk.red(`✗ Config file not found: ${cliArgs.configFile}`));
      process.exit(1);
    }
    if (cliArgs.verbose) {
      console.error(chalk.green('✓ Configuration loaded\n'));
    }
  }

  // Merge configurations
  const config = mergeConfigs(fileConfig, cliArgs);

  // Validate required parameters
  if (!config.datasetId) {
    console.error(chalk.red('✗ Error: Dataset ID is required'));
    console.error('\nUse --dataset-id or specify in config file');
    printUsage();
    process.exit(1);
  }

  if (!config.source.apiKey) {
    console.error(chalk.red('✗ Error: Source API key is required'));
    console.error('\nUse --source-api-key or set PROTOBI_API_KEY_SOURCE');
    process.exit(1);
  }

  // Save config if requested
  if (cliArgs.saveConfigFile) {
    await saveConfig(cliArgs.saveConfigFile, config);
  }

  // Print configuration if verbose
  if (config.verbose) {
    console.error(chalk.bold('\n🔄 Protobi Project Clone Tool (REST API)\n'));
    console.error(chalk.bold('Configuration:'));
    console.error(`  Dataset ID:    ${config.datasetId}`);
    console.error(`  Source Host:   ${config.source.host}`);
    console.error(`  Source API:    ${config.source.apiKey ? '✓ Configured' : '✗ Missing'}`);
    console.error(`  Dest Host:     ${config.dest.host}`);
    console.error(`  Dest API:      ${config.dest.apiKey ? '✓ Configured' : 'None (cookies)'}`);
    console.error(`  Skip Files:    ${config.skipFiles}\n`);
  }

  // Initialize API clients
  const sourceAPI = ProtobiAPI(config.source.host, config.source.apiKey).initialize();
  const destAPI = ProtobiAPI(config.dest.host, config.dest.apiKey).initialize();

  try {
    // Clone dataset
    const datasetInfo = await cloneDataset(sourceAPI, destAPI, config.datasetId, config.verbose);

    // Clone elements
    await cloneElements(sourceAPI, destAPI, datasetInfo.sourceId, datasetInfo.destId, config.verbose);

    // Clone data tables
    await cloneDataTables(sourceAPI, destAPI, datasetInfo.sourceId, datasetInfo.destId, config.skipFiles, config.verbose);

    // Success - output destination ID to stdout (for piping/scripting)
    console.log(datasetInfo.destId);

    // Verbose success message to stderr
    if (config.verbose) {
      console.error(chalk.green.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.error(chalk.green.bold('✓ Clone Complete!'));
      console.error(chalk.green.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      console.error(`Project cloned successfully:`);
      console.error(`  Source:      ${datasetInfo.sourceId}`);
      console.error(`  Destination: ${datasetInfo.destId}`);
      console.error(`  URL:         ${config.dest.host}/v3/datasets/${datasetInfo.destId}\n`);
    }

  } catch (err) {
    console.error(chalk.red.bold('\n✗ Clone Failed'));
    console.error(chalk.red(err.message));
    if (config.verbose && err.stack) {
      console.error(chalk.gray(err.stack));
    }
    process.exit(1);
  }
}

// Run main function
main().catch(err => {
  console.error(chalk.red('Unexpected error:'), err);
  process.exit(1);
});
