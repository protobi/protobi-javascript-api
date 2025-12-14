import fs from 'fs-extra';
import { loadConfig } from '../../config-loader.mjs';
import { setOutputMode, success, info, spinner, addJsonData, outputJson } from '../../utils/output.mjs';
import { handleError, validateRequired } from '../../utils/errors.mjs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ProtobiAPI = require('../../../../js/protobi-rest-api.js');

/**
 * Get elements command - Download project configuration
 */
export default async function getElementsCommand(options) {
  try {
    // Set output mode
    if (options.json) setOutputMode('json');
    if (options.quiet) setOutputMode('quiet');

    // Load config with cascade
    const config = loadConfig(options);

    // Validate required options
    validateRequired(config, ['apiKey', 'host', 'datasetId']);

    const { apiKey, host, datasetId } = config;
    const output = options.output || 'elements.json';

    // Create library instance
    const protobiApi = new ProtobiAPI(host, apiKey);

    // Download elements
    const spin = spinner(`Downloading elements from ${datasetId}...`).start();

    let elements;
    try {
      elements = await protobiApi.getElements(datasetId);
      spin.succeed(`Downloaded ${elements.length} elements`);
    } catch (err) {
      spin.fail('Download failed');
      throw err;
    }

    // Write to file
    const outputData = JSON.stringify(elements, null, 2);
    await fs.writeFile(output, outputData, 'utf8');

    if (options.json) {
      addJsonData('success', true);
      addJsonData('datasetId', datasetId);
      addJsonData('elementsCount', elements.length);
      addJsonData('file', output);
      addJsonData('bytes', outputData.length);
      outputJson();
    } else {
      success(`Saved to: ${output}`);
      info(`Downloaded ${elements.length} elements (${(outputData.length / 1024).toFixed(1)} KB)`);
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
