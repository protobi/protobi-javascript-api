/**
 * Validation utilities for CLI inputs
 */

/**
 * Validate API key format
 * @param {string} apiKey
 * @returns {boolean}
 */
export function isValidApiKey(apiKey) {
  return typeof apiKey === 'string' && apiKey.length > 10;
}

/**
 * Validate dataset ID format
 * @param {string} datasetId
 * @returns {boolean}
 */
export function isValidDatasetId(datasetId) {
  // MongoDB ObjectId format (24 hex characters)
  return typeof datasetId === 'string' && /^[a-f0-9]{24}$/i.test(datasetId);
}

/**
 * Validate hostname format
 * @param {string} host
 * @returns {boolean}
 */
export function isValidHost(host) {
  return typeof host === 'string' && host.length > 0 && !host.includes('://');
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate table/data key name
 * @param {string} table
 * @returns {boolean}
 */
export function isValidTableName(table) {
  return typeof table === 'string' && table.length > 0 && /^[a-zA-Z0-9_-]+$/.test(table);
}

/**
 * Sanitize filename (remove invalid characters)
 * @param {string} filename
 * @returns {string}
 */
export function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}
