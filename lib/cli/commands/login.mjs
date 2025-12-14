import inquirer from 'inquirer';
import { saveDefaultConfig, getDefaultConfigPath, hasDefaultConfig, loadConfig } from '../config-loader.mjs';
import { success, error, spinner } from '../utils/output.mjs';
import { handleError } from '../utils/errors.mjs';
import { createApiClient } from '../api-client.mjs';

/**
 * Login command - Update API key
 */
export default async function loginCommand() {
  try {
    // Load existing config
    const existingConfig = hasDefaultConfig() ? loadConfig() : {};

    // Prompt for API key
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key:',
        mask: '*',
        validate: (input) => input.length > 0 || 'API key is required'
      }
    ]);

    // Test API key
    const spin = spinner('Validating credentials...').start();

    try {
      const testConfig = { ...existingConfig, ...answers };
      createApiClient(testConfig);

      // If we have a datasetId, try a test request
      if (testConfig.datasetId) {
        const client = createApiClient(testConfig);
        await client.getElements(testConfig.datasetId);
      }

      spin.succeed('Login successful!');
    } catch (err) {
      spin.fail('Validation failed');
      error(`Error: ${err.message}`);
      process.exit(1);
    }

    // Merge with existing config and save
    const newConfig = { ...existingConfig, ...answers };

    if (saveDefaultConfig(newConfig)) {
      success(`API key saved to ${getDefaultConfigPath()}`);
    } else {
      error('Failed to save configuration');
      process.exit(1);
    }
  } catch (err) {
    handleError(err);
  }
}
