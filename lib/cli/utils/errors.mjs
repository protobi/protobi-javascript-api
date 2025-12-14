import { error } from './output.mjs';

/**
 * Error handling utilities for CLI
 * Provides standard exit codes and error formatting
 */

// Standard exit codes
export const EXIT_CODES = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  INVALID_ARGUMENTS: 2,
  AUTH_ERROR: 3,
  NOT_FOUND: 4
};

/**
 * Custom CLI Error class
 */
export class CLIError extends Error {
  constructor(message, exitCode = EXIT_CODES.GENERAL_ERROR) {
    super(message);
    this.name = 'CLIError';
    this.exitCode = exitCode;
  }
}

/**
 * Handle error and exit
 * @param {Error} err - Error object
 */
export function handleError(err) {
  if (err instanceof CLIError) {
    error(err.message);
    process.exit(err.exitCode);
  } else {
    error(`Error: ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }
}

/**
 * Validate required options
 * @param {object} options - Command options
 * @param {string[]} required - Required option names
 * @throws {CLIError} If required options are missing
 */
export function validateRequired(options, required) {
  const missing = required.filter(key => {
    const value = options[key];
    // Consider missing if: undefined, null, or empty string
    // But 0 and false are valid values
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new CLIError(
      `Missing required option${missing.length > 1 ? 's' : ''}: ${missing.map(k => `--${k}`).join(', ')}`,
      EXIT_CODES.INVALID_ARGUMENTS
    );
  }
}

/**
 * Create auth error
 * @param {string} message
 * @returns {CLIError}
 */
export function authError(message = 'Authentication failed. Please check your API key.') {
  return new CLIError(message, EXIT_CODES.AUTH_ERROR);
}

/**
 * Create not found error
 * @param {string} resource
 * @returns {CLIError}
 */
export function notFoundError(resource) {
  return new CLIError(`Not found: ${resource}`, EXIT_CODES.NOT_FOUND);
}

/**
 * Create invalid arguments error
 * @param {string} message
 * @returns {CLIError}
 */
export function invalidArgumentsError(message) {
  return new CLIError(message, EXIT_CODES.INVALID_ARGUMENTS);
}
