import { loadConfig, getDefaultConfigPath, hasDefaultConfig, getLocalConfigPath, hasLocalConfig } from '../config-loader.mjs';
import { setOutputMode, printTable, info, addJsonData, outputJson } from '../utils/output.mjs';
import { handleError } from '../utils/errors.mjs';

/**
 * Config command - View current configuration
 */
export default async function configCommand(options) {
  try {
    // Set output mode
    if (options.json) setOutputMode('json');
    if (options.quiet) setOutputMode('quiet');

    // Load config
    const config = loadConfig(options);

    // Prepare display
    const defaultConfigPath = getDefaultConfigPath();
    const localConfigPath = getLocalConfigPath();
    const hasDefault = hasDefaultConfig();
    const hasLocal = hasLocalConfig();

    if (options.json) {
      addJsonData('defaultConfigPath', defaultConfigPath);
      addJsonData('localConfigPath', localConfigPath);
      addJsonData('hasDefaultConfig', hasDefault);
      addJsonData('hasLocalConfig', hasLocal);
      addJsonData('config', {
        host: config.host || 'app.protobi.com',
        apiKey: config.apiKey ? '****' : null,
        datasetId: config.datasetId || null
      });
      outputJson();
    } else {
      info(`Default config: ${defaultConfigPath} ${hasDefault ? '(exists)' : '(not found)'}`);
      info(`Local config:   ${localConfigPath} ${hasLocal ? '(exists)' : '(not found)'}`);
      console.log('');

      printTable({
        Host: config.host || 'app.protobi.com',
        'API Key': config.apiKey,
        'Dataset ID': config.datasetId
      });

      if (!config.apiKey) {
        console.log('');
        info('No API key configured. Run: protobi init');
      } else {
        console.log('');
        info('Config cascade: ~/.protobi.json → ./config.json → --config → env vars → CLI flags');
      }
    }
  } catch (error) {
    handleError(error);
  }
}
