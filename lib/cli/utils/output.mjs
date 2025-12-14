import chalk from 'chalk';
import ora from 'ora';

/**
 * Output utilities for CLI
 * Handles JSON mode, quiet mode, and formatted output
 */

let outputMode = 'default'; // 'default', 'json', 'quiet'
let jsonOutput = {};

/**
 * Set output mode
 * @param {string} mode - 'default', 'json', or 'quiet'
 */
export function setOutputMode(mode) {
  outputMode = mode;
}

/**
 * Check if running in TTY (interactive terminal)
 * @returns {boolean}
 */
export function isTTY() {
  return process.stdout.isTTY && !process.env.CI;
}

/**
 * Print success message
 * @param {string} message
 */
export function success(message) {
  if (outputMode === 'quiet' || outputMode === 'json') return;
  console.log(chalk.green('✓'), message);
}

/**
 * Print error message
 * @param {string} message
 */
export function error(message) {
  if (outputMode === 'json') return;
  console.error(chalk.red('✗'), message);
}

/**
 * Print info message
 * @param {string} message
 */
export function info(message) {
  if (outputMode === 'quiet' || outputMode === 'json') return;
  console.log(chalk.blue('ℹ'), message);
}

/**
 * Print warning message
 * @param {string} message
 */
export function warning(message) {
  if (outputMode === 'quiet' || outputMode === 'json') return;
  console.log(chalk.yellow('⚠'), message);
}

/**
 * Create a spinner (only in TTY mode)
 * @param {string} text - Spinner text
 * @returns {object} Spinner instance
 */
export function spinner(text) {
  if (outputMode === 'json' || outputMode === 'quiet' || !isTTY()) {
    // Return a mock spinner for non-interactive mode
    const mock = {
      start: function() { return this; },
      succeed: function() { return this; },
      fail: function() { return this; },
      stop: function() { return this; },
      text: ''
    };
    return mock;
  }
  return ora(text);
}

/**
 * Add data to JSON output
 * @param {string} key
 * @param {any} value
 */
export function addJsonData(key, value) {
  jsonOutput[key] = value;
}

/**
 * Output final JSON result (if in JSON mode)
 */
export function outputJson() {
  if (outputMode === 'json') {
    console.log(JSON.stringify(jsonOutput, null, 2));
    jsonOutput = {}; // Reset for next command
  }
}

/**
 * Format config value (mask API keys)
 * @param {string} key
 * @param {string} value
 * @returns {string}
 */
export function formatConfigValue(key, value) {
  if (key === 'apiKey' && value) {
    const visible = 4;
    if (value.length > visible * 2) {
      return value.substring(0, visible) + '...' + value.substring(value.length - visible);
    }
  }
  return value;
}

/**
 * Print table-like output
 * @param {object} data - Key-value pairs
 */
export function printTable(data) {
  if (outputMode === 'json') return;

  const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length));

  Object.entries(data).forEach(([key, value]) => {
    const paddedKey = key.padEnd(maxKeyLength);
    const displayValue = formatConfigValue(key, value);
    console.log(`${chalk.cyan(paddedKey)}: ${displayValue || chalk.gray('(not set)')}`);
  });
}
