import fs from 'fs-extra';
import path from 'path';
import { loadConfig } from '../../config-loader.mjs';
import { setOutputMode, success, info, spinner, addJsonData, outputJson } from '../../utils/output.mjs';
import { handleError, validateRequired } from '../../utils/errors.mjs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ProtobiAPI = require('../../../../js/protobi-rest-api.js');

/**
 * Upload elements command - Upload project configuration
 */
export default async function uploadElementsCommand(options) {
  try {
    // Set output mode
    if (options.json) setOutputMode('json');
    if (options.quiet) setOutputMode('quiet');

    // Load config with cascade
    const config = loadConfig(options);

    // Validate required options
    validateRequired(config, ['apiKey', 'host', 'datasetId', 'file']);

    const { apiKey, host, datasetId, file } = config;

    // Check if file exists
    if (!await fs.pathExists(file)) {
      throw new Error(`File not found: ${file}`);
    }

    // Read JSON file
    const elements = await fs.readJson(file);
    const filename = path.basename(file);

    if (!Array.isArray(elements)) {
      throw new Error('Elements file must contain a JSON array');
    }

    // Create library instance
    const protobiApi = new ProtobiAPI(host, apiKey);

    // Upload elements
    const spin = spinner(`Uploading ${filename} to ${datasetId}...`).start();

    try {
      const result = await protobiApi.uploadElements(elements, datasetId);
      spin.succeed('Upload successful');

      if (options.json) {
        addJsonData('success', true);
        addJsonData('datasetId', datasetId);
        addJsonData('file', file);
        addJsonData('elementsCount', elements.length);
        addJsonData('result', result);
        outputJson();
      } else {
        success(`Uploaded ${elements.length} elements from ${filename}`);
        info(`Dataset: ${datasetId}`);
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
