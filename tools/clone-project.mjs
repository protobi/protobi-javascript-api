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

// Allow self-signed certificates for localhost development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Protobi API from parent directory
const apiPath = path.resolve(__dirname, '../js/protobi-rest-api.js');
const ProtobiAPI = await import(apiPath).then(m => m.default || m);

/**
 * Parse command line arguments using commander
 */
function parseArgs() {
  const program = new Command();

  program
    .name('clone-project')
    .description('Clone Protobi projects between environments using REST API')
    .option('--dataset-id <id>', 'Dataset ID to clone (required)')
    .option('--dest-dataset-id <id>', 'Destination dataset ID (default: same as source)')
    .option('--config <file>', 'Load configuration from JSON file')
    .option('--save-config <file>', 'Save merged configuration to JSON file')
    .option('--source-host <url>', 'Source API host (default: https://app.protobi.com)')
    .option('--source-api-key <key>', 'Source API key (or set PROTOBI_API_KEY_SOURCE)')
    .option('--dest-host <url>', 'Destination API host (default: http://localhost:5000)')
    .option('--dest-api-key <key>', 'Destination API key (or set PROTOBI_API_KEY_DEST)')
    .option('--skip-files', 'Skip data file transfers')
    .option('--data-tables <mode>', 'Which tables to clone: "primary" (default) or "all"', 'primary')
    .option('-v, --verbose', 'Show detailed progress output')
    .parse();

  const opts = program.opts();

  return {
    datasetId: opts.datasetId || null,
    destDatasetId: opts.destDatasetId || null,
    configFile: opts.config || null,
    saveConfigFile: opts.saveConfig || null,
    sourceHost: opts.sourceHost || null,
    sourceApiKey: opts.sourceApiKey || null,
    destHost: opts.destHost || null,
    destApiKey: opts.destApiKey || null,
    skipFiles: opts.skipFiles || false,
    dataTables: opts.dataTables || 'primary',
    verbose: opts.verbose || false,
    help: opts.help || false
  };
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
  console.log(`✓ Configuration saved to ${configPath}`);
}

/**
 * Merge configurations (CLI args override config file)
 */
function mergeConfigs(fileConfig, cliArgs) {
  const config = {
    datasetId: cliArgs.datasetId || fileConfig?.datasetId || null,
    destDatasetId: cliArgs.destDatasetId || fileConfig?.destDatasetId || null,
    source: {
      host: cliArgs.sourceHost || fileConfig?.source?.host || 'https://app.protobi.com',
      apiKey: cliArgs.sourceApiKey || fileConfig?.source?.apiKey || process.env.PROTOBI_API_KEY_SOURCE
    },
    dest: {
      host: cliArgs.destHost || fileConfig?.dest?.host || 'http://localhost:5000',
      apiKey: cliArgs.destApiKey || fileConfig?.dest?.apiKey || process.env.PROTOBI_API_KEY_DEST || null
    },
    skipFiles: cliArgs.skipFiles || fileConfig?.skipFiles || false,
    dataTables: cliArgs.dataTables || fileConfig?.dataTables || 'primary',
    verbose: cliArgs.verbose || fileConfig?.verbose || false
  };

  return config;
}


/**
 * Clone dataset metadata
 */
async function cloneDataset(sourceAPI, destAPI, sourceDatasetId, destDatasetId, verbose) {
  // Use source ID as destination ID if not specified
  const targetDestId = destDatasetId || sourceDatasetId;

  if (verbose) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Step 1: Cloning Dataset Metadata');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.error(`Fetching dataset ${sourceDatasetId} from source...`);
  }

  // Get dataset from source
  let dataset;
  try {
    dataset = await sourceAPI.getDataset(sourceDatasetId);
  } catch (err) {
    throw new Error(`Failed to fetch dataset from SOURCE: ${err.message}`);
  }

  if (!dataset) {
    throw new Error(`Dataset ${sourceDatasetId} not found on source`);
  }

  if (verbose) {
    console.error(`✓ Found dataset: ${dataset.name || 'Unnamed'}`);
    if (targetDestId !== sourceDatasetId) {
      console.error(`✓ Cloning to different destination ID: ${targetDestId}`);
    }
    console.error('Creating/updating dataset on destination...');
  }

  // Set the target destination ID
  dataset._id = targetDestId;

  // Try to update existing dataset first
  let newDataset;
  try {
    if (verbose) {
      console.error(`Checking if dataset ${targetDestId} exists on destination...`);
    }
    newDataset = await destAPI.updateDataset(targetDestId, dataset);
    if (verbose) {
      console.error(`✓ Updated existing dataset`);
    }
  } catch (err) {
    // Dataset doesn't exist, try to create it
    if (err.message.includes('404')) {
        console.error(`Unable to update Dataset ${targetDestId} on destination`);
        console.error(err)
        process.exit(1)
      if (verbose) {
        console.error(`Dataset not found, creating new dataset with ID: ${targetDestId}`);
      }
      try {
        // POST to create dataset - include _id in body to request specific ID
        newDataset = await destAPI.createDataset(dataset);
        if (verbose) {
          const createdId = newDataset._id || newDataset.id;
          if (createdId !== targetDestId) {
            console.error(`⚠ Warning: Server created dataset with different ID`);
            console.error(`  Requested: ${targetDestId}`);
            console.error(`  Created:   ${createdId}`);
            console.error(`  This may indicate the server doesn't support custom IDs via POST`);
          }
        }
      } catch (createErr) {
        throw new Error(`Failed to create dataset on DEST: ${createErr.message}`);
      }
    } else {
      throw new Error(`Failed to update dataset on DEST: ${err.message}`);
    }
  }

  // Use the actual ID returned from the server (may differ from requested ID)
  const actualDestId = newDataset._id || newDataset.id || targetDestId;

  if (verbose) {
    console.error(`✓ Dataset created/updated with ID: ${actualDestId}`);
    if (actualDestId !== targetDestId) {
      console.error(`⚠ Note: Server assigned different ID (requested: ${targetDestId}, actual: ${actualDestId})`);
    }
  }

  return {
    sourceId: sourceDatasetId,
    destId: actualDestId,  // Use actual ID assigned by destination server
    name: dataset.name,
    dataset: dataset  // Include full dataset object for primary table info
  };
}

/**
 * Clone elements (project configuration)
 */
async function cloneElements(sourceAPI, destAPI, sourceDatasetId, destDatasetId, verbose) {
  if (verbose) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Step 2: Cloning Elements');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
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
      console.error('⚠ No elements found');
    }
    return;
  }

  if (verbose) {
    console.error(`✓ Found ${elements.length} elements`);
    console.error('Uploading elements to destination...');
  }

  // Upload elements to destination
  try {
    await destAPI.uploadElements(elements, destDatasetId);
  } catch (err) {
    throw new Error(`Failed to upload elements to DEST: ${err.message}`);
  }

  if (verbose) {
    console.error(`✓ Uploaded ${elements.length} elements`);
  }
}

/**
 * Clone data tables
 */
async function cloneDataTables(sourceAPI, destAPI, sourceDatasetId, destDatasetId, dataset, dataTables, skipFiles, verbose) {
  if (verbose) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Step 3: Cloning Data Tables');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  if (skipFiles) {
    if (verbose) {
      console.error('⚠ Skipping file transfers (--skip-files)');
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
      console.error('⚠ No data tables found');
    }
    return;
  }

  if (verbose) {
    console.error(`✓ Found ${tables.length} data tables`);
  }

  // Filter tables based on mode
  if (dataTables === 'primary') {
    const primaryTable = dataset.primary || dataset.primary_table;
    if (primaryTable) {
      tables = tables.filter(t => t.key === primaryTable);
      if (verbose) {
        console.error(`✓ Filtered to primary table: ${primaryTable}`);
      }
    } else if (verbose) {
      console.error('⚠ No primary table specified, cloning all tables');
    }
  }

  // Clone each table
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    if (verbose) {
      console.error(`\n[${i + 1}/${tables.length}] Cloning table: ${table.key || table.name}`);
    }

    try {
      // Step 1: Get full table definition from source (includes fn, properties, etc.)
      let fullTableDef;
      try {
        if (verbose) {
          console.error(`  → Getting full table definition from source`);
        }
        fullTableDef = await sourceAPI.getDataTable(sourceDatasetId, table.key);
        if (verbose) {
          console.error(`  → Got definition: type=${fullTableDef.type}, has fn=${!!fullTableDef.fn}, has properties=${!!fullTableDef.properties}`);
        }
      } catch (err) {
        throw new Error(`Failed to get table definition from SOURCE: ${err.message}`);
      }

      // Step 2: Create/update table definition on destination (preserves type, fn, properties, etc.)
      try {
        if (verbose) {
          console.error(`  → Putting table definition to destination`);
        }
        const putResult = await destAPI.putDataTable(destDatasetId, table.key, fullTableDef);
        if (verbose) {
          console.error(`  → Created table: type=${putResult.type}, has fn=${!!putResult.fn}`);
        }
      } catch (err) {
        throw new Error(`Failed to create table definition on DEST: ${err.message}`);
      }

      // Step 3: Download data from source
      let data;
      try {
        if (verbose) {
          console.error(`  → Downloading CSV data`);
        }
        data = await sourceAPI.downloadData(sourceDatasetId, table.key);
      } catch (err) {
        throw new Error(`Failed to download from SOURCE: ${err.message}`);
      }

      // Step 4: Upload data to destination
      try {
        if (verbose) {
          console.error(`  → Uploading CSV data`);
        }
        await destAPI.uploadCsvText(data, destDatasetId, table.key, table.filename);
      } catch (err) {
        throw new Error(`Failed to upload to DEST: ${err.message}`);
      }

      if (verbose) {
        console.error(`  ✓ Cloned table ${table.key}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed to clone table ${table.key}: ${err.message}`);
    }
  }

  if (verbose) {
    console.error(`\n✓ Cloned ${tables.length} data tables`);
  }
}

/**
 * Main execution
 */
async function main() {
  // Parse CLI arguments (commander handles --help automatically)
  const cliArgs = parseArgs();

  // Load config file if specified
  let fileConfig = null;
  if (cliArgs.configFile) {
    if (cliArgs.verbose) {
      console.error(`Loading configuration from ${cliArgs.configFile}...`);
    }
    fileConfig = await loadConfig(cliArgs.configFile);
    if (!fileConfig) {
      console.error(`✗ Config file not found: ${cliArgs.configFile}`);
      process.exit(1);
    }
    if (cliArgs.verbose) {
      console.error('✓ Configuration loaded\n');
    }
  }

  // Merge configurations
  const config = mergeConfigs(fileConfig, cliArgs);

  // Validate required parameters
  if (!config.datasetId) {
    console.error('✗ Error: Dataset ID is required');
    console.error('Use --dataset-id or specify in config file');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  if (!config.source.apiKey) {
    console.error('✗ Error: Source API key is required');
    console.error('\nUse --source-api-key or set PROTOBI_API_KEY_SOURCE');
    process.exit(1);
  }

  // Save config if requested
  if (cliArgs.saveConfigFile) {
    await saveConfig(cliArgs.saveConfigFile, config);
  }

  // Print configuration if verbose
  if (config.verbose) {
    console.error('\n🔄 Protobi Project Clone Tool (REST API)\n');
    console.error('Configuration:');
    console.error(`  Source ID:     ${config.datasetId}`);
    console.error(`  Dest ID:       ${config.destDatasetId || config.datasetId + ' (same)'}`);
    console.error(`  Source Host:   ${config.source.host}`);
    console.error(`  Source API:    ${config.source.apiKey ? '✓ Configured' : '✗ Missing'}`);
    console.error(`  Dest Host:     ${config.dest.host}`);
    console.error(`  Dest API:      ${config.dest.apiKey ? '✓ Configured' : 'None (cookies)'}`);
    console.error(`  Skip Files:    ${config.skipFiles}`);
    console.error(`  Data Tables:   ${config.dataTables}\n`);
  }

  // Initialize API clients
  const sourceAPI = ProtobiAPI(config.source.host, config.source.apiKey).initialize();
  const destAPI = ProtobiAPI(config.dest.host, config.dest.apiKey).initialize();

  try {
    // Clone dataset
    const datasetInfo = await cloneDataset(sourceAPI, destAPI, config.datasetId, config.destDatasetId, config.verbose);

    // Clone elements
    await cloneElements(sourceAPI, destAPI, datasetInfo.sourceId, datasetInfo.destId, config.verbose);

    // Clone data tables
    await cloneDataTables(sourceAPI, destAPI, datasetInfo.sourceId, datasetInfo.destId, datasetInfo.dataset, config.dataTables, config.skipFiles, config.verbose);

    // Success - output destination ID to stdout (for piping/scripting)
    console.log(datasetInfo.destId);

    // Verbose success message to stderr
    if (config.verbose) {
      console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('✓ Clone Complete!');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.error(`Project cloned successfully:`);
      console.error(`  Source:      ${datasetInfo.sourceId}`);
      console.error(`  Destination: ${datasetInfo.destId}`);
      console.error(`  URL:         ${config.dest.host}/v3/datasets/${datasetInfo.destId}\n`);
    }

  } catch (err) {
    console.error('\n✗ Clone Failed');
    console.error(err.message);
    if (config.verbose && err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// Run main function
main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
