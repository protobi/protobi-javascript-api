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
import { Command } from 'commander';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Protobi API from parent directory
const apiPath = path.resolve(__dirname, '../js/protobi-rest-api.js');
const ProtobiAPI = await import(apiPath).then(m => m.default || m);

const RATE_LIMIT_RETRY_DELAY_MS = 60_000;
const RATE_LIMIT_MAX_RETRIES = 5;

// Which data tables to clone: just the primary one, every one, or none at all
// (dataset metadata and elements only).
const DATA_TABLE_MODES = ['primary', 'all', 'none'];

function isRateLimitError(err) {
  return /(?:HTTP\s*)?429\b|too many requests/i.test(err?.message || '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCsvUploadFilename(filename, tableKey) {
  const original = filename || `${tableKey}.csv`;
  const withoutGzip = original.replace(/\.gz$/i, '');
  const extension = path.extname(withoutGzip);
  return extension
    ? `${withoutGzip.slice(0, -extension.length)}.csv`
    : `${withoutGzip}.csv`;
}

function getOriginalUploadFilename(filename, contentType) {
  const normalizedContentType = (contentType || '').toLowerCase().split(';')[0].trim();
  const compatibleExtensions = {
    'text/javascript': ['.js', '.mjs', '.cjs'],
    'application/javascript': ['.js', '.mjs', '.cjs'],
    'text/ecmascript': ['.js', '.mjs', '.cjs'],
    'application/ecmascript': ['.js', '.mjs', '.cjs'],
    'application/json': ['.json'],
    'text/json': ['.json']
  }[normalizedContentType];

  // Some process tables have legacy metadata such as "script.js.csv" even
  // though their raw artifact and MIME type are JavaScript. The destination
  // validates MIME type against the final extension, so remove only that
  // known, generated CSV suffix when the preceding extension matches the MIME.
  if (compatibleExtensions && /\.csv$/i.test(filename || '')) {
    const withoutCsv = filename.slice(0, -4);
    if (compatibleExtensions.includes(path.extname(withoutCsv).toLowerCase())) {
      return withoutCsv;
    }
  }

  return filename;
}

export function hasFileData(fileData) {
  if (fileData == null) return false;
  return Buffer.isBuffer(fileData)
    ? fileData.length > 0
    : Buffer.byteLength(String(fileData)) > 0;
}

export function isNotFoundError(err) {
  return err?.status === 404 || /(?:HTTP\s*)?404\b/i.test(err?.message || '');
}

export function hasOriginalSourceFile(tableDefinition) {
  return tableDefinition?.type !== 'process' && !!tableDefinition?.s3path;
}

/**
 * Retry a request when the server's rate limiter asks us to slow down.
 *
 * The REST client currently exposes only the response status/body in its
 * errors, not the Retry-After header, so use the one-minute interval stated by
 * the API's 429 response.
 */
async function withRateLimitRetry(operation, description) {
  for (let retry = 0; ; retry++) {
    try {
      return await operation();
    } catch (err) {
      if (!isRateLimitError(err) || retry >= RATE_LIMIT_MAX_RETRIES) {
        throw err;
      }

      const seconds = RATE_LIMIT_RETRY_DELAY_MS / 1000;
      console.error(
        `  ⚠ Rate limited while ${description}; waiting ${seconds} seconds before retry ${retry + 1}/${RATE_LIMIT_MAX_RETRIES}`
      );
      await sleep(RATE_LIMIT_RETRY_DELAY_MS);
    }
  }
}

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
    .option('--data-tables <mode>', 'Which tables to clone: "primary" (default), "all" or "none"', 'primary')
    .option('--force-streaming', 'Force the destination to use its streaming upload pipeline')
    .option('--on-error <action>', 'Table error policy: "stop" (default) or "continue"')
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
    forceStreaming: opts.forceStreaming || false,
    onError: opts.onError || null,
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
    forceStreaming: cliArgs.forceStreaming || fileConfig?.forceStreaming || false,
    onError: cliArgs.onError || fileConfig?.onError || 'stop',
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
async function cloneDataTables(sourceAPI, destAPI, sourceDatasetId, destDatasetId, dataset, dataTables, skipFiles, forceStreaming, onError, verbose) {
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

  if (dataTables === 'none') {
    if (verbose) {
      console.error('⚠ Skipping all data tables (--data-tables none)');
    }
    return;
  }

  if (verbose) {
    console.error('Fetching data table list from source...');
  }

  // Get list of data tables from source
  let tables;
  try {
    tables = await withRateLimitRetry(
      () => sourceAPI.getDataTables(sourceDatasetId),
      'fetching the table list from SOURCE'
    );
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

  let clonedCount = 0;
  const failures = [];

  // Clone each table
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    console.error(`${verbose ? '\n' : ''}[${i + 1}/${tables.length}] Cloning table: ${table.key || table.name}`);

    try {
      // Step 1: Get full table definition from source (includes fn, properties, etc.)
      let fullTableDef;
      try {
        if (verbose) {
          console.error(`  → Getting full table definition from source`);
        }
        fullTableDef = await withRateLimitRetry(
          () => sourceAPI.getDataTable(sourceDatasetId, table.key),
          `getting ${table.key} from SOURCE`
        );
        if (verbose) {
          console.error(`  → Got definition: type=${fullTableDef.type}, has fn=${!!fullTableDef.fn}, has properties=${!!fullTableDef.properties}`);
        }
      } catch (err) {
        throw new Error(`Failed to get table definition from SOURCE: ${err.message}`);
      }

      // Process cards own code plus an optional materialized CSV result. Their
      // result must come from the processed-data endpoint, never from s3path.
      const hasOriginalFile = hasOriginalSourceFile(fullTableDef);
      const destinationTableDef = { ...fullTableDef };
      for (const storageField of ['s3path', 's3csv', 's3metadata', 's3md']) {
        delete destinationTableDef[storageField];
      }

      // Step 2: Create/update table definition on destination (preserves type, fn, properties, etc.)
      try {
        if (verbose) {
          console.error(`  → Putting table definition to destination`);
        }
        const putResult = await withRateLimitRetry(
          () => destAPI.putDataTable(destDatasetId, table.key, destinationTableDef),
          `creating ${table.key} on DEST`
        );
        if (verbose) {
          console.error(`  → Created table: type=${putResult.type}, has fn=${!!putResult.fn}`);
        }
      } catch (err) {
        throw new Error(`Failed to create table definition on DEST: ${err.message}`);
      }

      // Step 3: Prefer the originally uploaded file. Older tables may only
      // have a processed CSV representation, so retain that as a fallback.
      let uploadFile;
      try {
        const sourceFilename = fullTableDef.filename || table.filename;
        if (hasOriginalFile) {
          try {
            if (verbose) {
              console.error(`  → Downloading original file ${sourceFilename || table.key}`);
            }
            uploadFile = await withRateLimitRetry(
              () => sourceAPI.downloadOriginalData(sourceDatasetId, table.key, sourceFilename),
              `downloading the original ${table.key} file from SOURCE`
            );
            const compatibleFilename = getOriginalUploadFilename(
              uploadFile.filename,
              uploadFile.contentType
            );
            if (verbose && compatibleFilename !== uploadFile.filename) {
              console.error(
                `  → Correcting legacy filename ${uploadFile.filename} to ${compatibleFilename} for ${uploadFile.contentType}`
              );
            }
            uploadFile.filename = compatibleFilename;
          } catch (err) {
            if (err.status !== 404) throw err;
            if (verbose) {
              console.error(`  ⚠ Original file not found; falling back to processed CSV`);
            }
          }
        }

        if (!uploadFile) {
          if (verbose) {
            console.error(`  → Downloading processed CSV data`);
          }
          try {
            const csvText = await withRateLimitRetry(
              () => sourceAPI.downloadData(sourceDatasetId, table.key),
              `downloading ${table.key} CSV from SOURCE`
            );
            uploadFile = {
              data: Buffer.from(csvText, 'utf-8'),
              filename: getCsvUploadFilename(sourceFilename, table.key),
              contentType: 'text/csv'
            };
          } catch (err) {
            if (!isNotFoundError(err)) throw err;
            if (verbose) {
              console.error(`  → No source file or processed data found`);
            }
          }
        }
      } catch (err) {
        throw new Error(`Failed to download from SOURCE: ${err.message}`);
      }

      // Step 4: Upload the original artifact (or CSV fallback) to destination.
      // A table may have a definition but no attached file or materialized
      // data. In that case the definition cloned above is the complete source
      // state.
      try {
        const shouldUpload = hasFileData(uploadFile?.data);
        if (!shouldUpload && verbose) {
          console.error(`  → No non-empty data to upload`);
        } else if (verbose) {
          console.error(`  → Uploading ${uploadFile.filename} (${uploadFile.contentType})`);
        }
        if (shouldUpload) {
          await withRateLimitRetry(
            () => destAPI.uploadFile(
              uploadFile.data,
              destDatasetId,
              table.key,
              uploadFile.filename,
              uploadFile.contentType,
              { forceStreaming }
            ),
            `uploading ${table.key} to DEST`
          );
        }
      } catch (err) {
        throw new Error(`Failed to upload to DEST: ${err.message}`);
      }

      if (verbose) {
        console.error(`  ✓ Cloned table ${table.key}`);
      }
      clonedCount++;
    } catch (err) {
      console.error(`  ✗ Failed to clone table ${table.key}: ${err.message}`);
      failures.push({ key: table.key, error: err });
      if (onError === 'stop') {
        throw new Error(`Stopped after table ${table.key} failed: ${err.message}`);
      }
    }
  }

  if (verbose) {
    console.error(`\n${failures.length === 0 ? '✓' : '⚠'} Cloned ${clonedCount}/${tables.length} data tables`);
  }

  if (failures.length > 0) {
    const failedKeys = failures.map(failure => failure.key).join(', ');
    throw new Error(`Failed to clone ${failures.length}/${tables.length} data tables: ${failedKeys}`);
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

  if (!['stop', 'continue'].includes(config.onError)) {
    console.error(`✗ Error: Invalid --on-error value "${config.onError}"`);
    console.error('Use --on-error stop or --on-error continue');
    process.exit(1);
  }

  if (!DATA_TABLE_MODES.includes(config.dataTables)) {
    console.error(`✗ Error: Invalid --data-tables value "${config.dataTables}"`);
    console.error(`Use one of: ${DATA_TABLE_MODES.join(', ')}`);
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
    console.error(`  Data Tables:   ${config.dataTables}`);
    console.error(`  Force Stream:  ${config.forceStreaming}`);
    console.error(`  On Error:      ${config.onError}\n`);
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
    await cloneDataTables(sourceAPI, destAPI, datasetInfo.sourceId, datasetInfo.destId, datasetInfo.dataset, config.dataTables, config.skipFiles, config.forceStreaming, config.onError, config.verbose);

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

// Run main function when invoked as a command, while allowing focused unit
// tests to import the cloning decisions without executing the CLI.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}
