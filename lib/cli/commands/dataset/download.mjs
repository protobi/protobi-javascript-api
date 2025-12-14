import fs from 'fs-extra';
import { loadConfig } from '../../config-loader.mjs';
import { setOutputMode, success, info, spinner, addJsonData, outputJson } from '../../utils/output.mjs';
import { handleError, validateRequired } from '../../utils/errors.mjs';
import { stringify } from 'csv';
import { promisify } from 'util';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ProtobiAPI = require('../../../../js/protobi-rest-api.js');
const stringifyAsync = promisify(stringify);

/**
 * Dataset download command
 */
export default async function downloadCommand(options) {
  try {
    // Set output mode
    if (options.json) setOutputMode('json');
    if (options.quiet) setOutputMode('quiet');

    // Load config with cascade
    const config = loadConfig(options);

    // Validate required options
    validateRequired(config, ['apiKey', 'host', 'datasetId', 'table']);

    const { apiKey, host, datasetId, table, output, format } = config;

    // Create library instance
    const protobiApi = new ProtobiAPI(host, apiKey);

    // Download data
    const spin = spinner(`Downloading data from ${datasetId}/${table}...`).start();

    let rows;
    try {
      rows = await protobiApi.getData(datasetId, table);
      spin.succeed(`Downloaded ${rows.length} rows`);
    } catch (err) {
      spin.fail('Download failed');
      throw err;
    }

    // Determine output format
    const outputFormat = format || 'csv';
    let outputData;

    if (outputFormat === 'json') {
      outputData = JSON.stringify(rows, null, 2);
    } else {
      // CSV format
      outputData = await stringifyAsync(rows, { header: true });
    }

    // Write output
    if (output) {
      // Write to file
      await fs.writeFile(output, outputData, 'utf8');

      if (options.json) {
        addJsonData('success', true);
        addJsonData('datasetId', datasetId);
        addJsonData('table', table);
        addJsonData('rowsDownloaded', rows.length);
        addJsonData('file', output);
        addJsonData('bytes', outputData.length);
        outputJson();
      } else {
        success(`Saved to: ${output}`);
        info(`Downloaded ${rows.length} rows (${(outputData.length / 1024).toFixed(1)} KB)`);
      }
    } else {
      // Write to stdout
      if (options.json) {
        addJsonData('success', true);
        addJsonData('datasetId', datasetId);
        addJsonData('table', table);
        addJsonData('rowsDownloaded', rows.length);
        outputJson();
      }

      // Output data to stdout (for piping)
      console.log(outputData);
    }
  } catch (error) {
    if (options.json) {
      addJsonData('success', false);
      addJsonData('error', error.message);
      outputJson();
      process.exit(1);
    }
    handleError(error);
  }
}
