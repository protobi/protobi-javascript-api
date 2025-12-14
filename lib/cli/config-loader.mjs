import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import merge from 'lodash.merge';

/**
 * Configuration loader with cascade priority (lowest to highest):
 * 1. Global config (~/.protobi.json) - personal/global config
 * 2. Local config (./.protobi.json or ./config.json) - project-specific config
 * 3. Custom config (--config file.json) - explicit override
 * 4. Environment variables (PROTOBI_*)
 * 5. Command-line options - highest priority
 */

const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.protobi.json');
const LOCAL_CONFIG_PATH = path.join(process.cwd(), '.protobi.json');
const LOCAL_CONFIG_PATH_ALT = path.join(process.cwd(), 'config.json');

/**
 * Load configuration from file
 * @param {string} configPath - Path to config file
 * @returns {object} Configuration object or empty object if not found
 */
function loadConfigFile(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      return fs.readJsonSync(configPath);
    }
  } catch (error) {
    console.error(`Warning: Failed to load config from ${configPath}: ${error.message}`);
  }
  return {};
}

/**
 * Load configuration from environment variables
 * Maps PROTOBI_* env vars to config keys
 * @returns {object} Configuration from environment
 */
function loadEnvConfig() {
  const config = {};

  if (process.env.PROTOBI_API_KEY) {
    config.apiKey = process.env.PROTOBI_API_KEY;
  }

  if (process.env.PROTOBI_HOST) {
    config.host = process.env.PROTOBI_HOST;
  }

  if (process.env.PROTOBI_DATASET_ID) {
    config.datasetId = process.env.PROTOBI_DATASET_ID;
  }

  return config;
}

/**
 * Save configuration to default config file
 * @param {object} config - Configuration to save
 * @returns {boolean} Success status
 */
export function saveDefaultConfig(config) {
  try {
    fs.writeJsonSync(GLOBAL_CONFIG_PATH, config, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Error: Failed to save config to ${GLOBAL_CONFIG_PATH}: ${error.message}`);
    return false;
  }
}

/**
 * Load merged configuration with cascade priority
 * @param {object} options - Command-line options
 * @returns {object} Merged configuration
 */
export function loadConfig(options = {}) {
  // 1. Load global config from ~/.protobi.json
  const globalConfig = loadConfigFile(GLOBAL_CONFIG_PATH);

  // 2. Load local project config from ./.protobi.json or ./config.json (if exists)
  //    Check .protobi.json first, then fall back to config.json
  let localConfig = loadConfigFile(LOCAL_CONFIG_PATH);
  if (Object.keys(localConfig).length === 0) {
    localConfig = loadConfigFile(LOCAL_CONFIG_PATH_ALT);
  }

  // 3. Load custom config if --config specified
  const customConfig = options.config ? loadConfigFile(options.config) : {};

  // 4. Load environment variables
  const envConfig = loadEnvConfig();

  // 5. Merge with priority: global < local < custom < env < CLI options
  const config = merge({}, globalConfig, localConfig, customConfig, envConfig, options);

  // Remove undefined values to avoid overriding
  Object.keys(config).forEach(key => {
    if (config[key] === undefined) {
      delete config[key];
    }
  });

  return config;
}

/**
 * Get the default config file path
 * @returns {string} Path to default config file
 */
export function getDefaultConfigPath() {
  return GLOBAL_CONFIG_PATH;
}

/**
 * Check if default config file exists
 * @returns {boolean} True if config file exists
 */
export function hasDefaultConfig() {
  return fs.existsSync(GLOBAL_CONFIG_PATH);
}

/**
 * Get the local config file path
 * @returns {string} Path to local config file
 */
export function getLocalConfigPath() {
  return LOCAL_CONFIG_PATH;
}

/**
 * Check if local config file exists
 * @returns {boolean} True if local config file exists
 */
export function hasLocalConfig() {
  return fs.existsSync(LOCAL_CONFIG_PATH);
}
