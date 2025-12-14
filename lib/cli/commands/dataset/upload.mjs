import fs from 'fs-extra';
import path from 'path';
import { loadConfig } from '../../config-loader.mjs';
import { setOutputMode, success, info, spinner, addJsonData, outputJson } from '../../utils/output.mjs';
import { handleError, validateRequired } from '../../utils/errors.mjs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ProtobiAPI = require('../../../../js/protobi-rest-api.js');

/**
 * Dataset upload command
 */
export default async function uploadCommand(options) {
  try {
    // Set output mode
    if (options.json) setOutputMode('json');
    if (options.quiet) setOutputMode('quiet');

    // Load config with cascade
    const config = loadConfig(options);

    // Validate required options
    validateRequired(config, ['apiKey', 'host', 'datasetId', 'table', 'file']);

    const { apiKey, host, datasetId, table, file } = config;

    // Check if file exists
    if (!await fs.pathExists(file)) {
      throw new Error(`File not found: ${file}`);
    }

    // Read CSV file
    const csv = await fs.readFile(file, 'utf8');
    const filename = path.basename(file);

    // Create library instance
    const protobiApi = new ProtobiAPI(host, apiKey);

    // Upload data
    const spin = spinner(`Uploading ${filename} to ${datasetId}/${table}...`).start();

    try {
      const result = await protobiApi.uploadCsv(csv, datasetId, table, filename);
      spin.succeed('Upload successful');

      if (options.json) {
        addJsonData('success', true);
        addJsonData('datasetId', datasetId);
        addJsonData('table', table);
        addJsonData('file', file);
        addJsonData('bytes', csv.length);
        addJsonData('result', result);
        outputJson();
      } else {
        success(`Uploaded ${filename} (${(csv.length / 1024).toFixed(1)} KB)`);
        info(`Dataset: ${datasetId}, Table: ${table}`);
      }
    } catch (err) {
      spin.fail('Upload failed');
      throw err;
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
