import inquirer from 'inquirer';
import { saveDefaultConfig, getDefaultConfigPath, hasDefaultConfig, loadConfig } from '../config-loader.mjs';
import { success, error, info, spinner } from '../utils/output.mjs';
import { handleError } from '../utils/errors.mjs';
import { createApiClient } from '../api-client.mjs';

/**
 * Init command - Interactive setup wizard
 */
export default async function initCommand() {
  try {
    console.log('Welcome to Protobi CLI!\n');

    // Load existing config if any
    const existingConfig = hasDefaultConfig() ? loadConfig() : {};

    // Prompt for configuration
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key:',
        default: existingConfig.apiKey,
        mask: '*',
        validate: (input) => input.length > 0 || 'API key is required'
      },
      {
        type: 'input',
        name: 'host',
        message: 'Host:',
        default: existingConfig.host || 'app.protobi.com',
        validate: (input) => input.length > 0 || 'Host is required'
      },
      {
        type: 'input',
        name: 'datasetId',
        message: 'Default Dataset ID (optional):',
        default: existingConfig.datasetId || ''
      }
    ]);

    // Remove empty values
    if (!answers.datasetId) delete answers.datasetId;

    // Test connection
    const spin = spinner('Testing connection...').start();

    try {
      const client = createApiClient(answers);

      // Try to verify the API key by making a simple request
      // If datasetId provided, try getElements; otherwise just verify credentials
      if (answers.datasetId) {
        await client.getElements(answers.datasetId);
      }

      spin.succeed('Connection successful!');
    } catch (err) {
      spin.fail('Connection failed');
      error(`Error: ${err.message}`);
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Save configuration anyway?',
          default: false
        }
      ]);

      if (!proceed) {
        process.exit(1);
      }
    }

    // Save configuration
    if (saveDefaultConfig(answers)) {
      success(`Configuration saved to ${getDefaultConfigPath()}`);
      console.log('');
      info("You're all set! Try: protobi dataset download --table main");
    } else {
      error('Failed to save configuration');
      process.exit(1);
    }
  } catch (err) {
    handleError(err);
  }
}
