import { stringify, parse } from 'csv';
import { promisify } from 'util';
import { authError, notFoundError } from './utils/errors.mjs';

const stringifyAsync = promisify(stringify);
const parseAsync = promisify(parse);

/**
 * Protobi API client using native fetch
 * Replaces the deprecated request library
 */
export class ProtobiAPIClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl || 'https://app.protobi.com';
    this.apiKey = apiKey;

    // Ensure no trailing slash
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.slice(0, -1);
    }
  }

  /**
   * Build URL with API key
   * @param {string} path - API path
   * @returns {string} Full URL with API key
   */
  buildUrl(path) {
    const url = new URL(path, this.apiUrl);
    url.searchParams.set('apiKey', this.apiKey);
    return url.toString();
  }

  /**
   * Handle HTTP response
   * @param {Response} response
   * @returns {Promise<any>}
   */
  async handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
      throw authError('Authentication failed. Please check your API key.');
    }

    if (response.status === 404) {
      throw notFoundError('Resource not found');
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  /**
   * Upload elements (project configuration) to dataset
   * @param {Array} elements - Array of element objects
   * @param {string} datasetId - Dataset ID
   * @returns {Promise<object>}
   */
  async uploadElements(elements, datasetId) {
    const url = this.buildUrl(`/api/v3/dataset/${datasetId}/element`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elements)
    });

    return await this.handleResponse(response);
  }

  /**
   * Get elements (project configuration) from dataset
   * @param {string} datasetId - Dataset ID
   * @returns {Promise<Array>}
   */
  async getElements(datasetId) {
    const url = this.buildUrl(`/v3/datasets/${datasetId}/element`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    return await this.handleResponse(response);
  }

  /**
   * Upload CSV string to dataset
   * @param {string} csv - CSV string
   * @param {string} datasetId - Dataset ID
   * @param {string} dataKey - Data key (table name)
   * @param {string} filename - Filename
   * @returns {Promise<object>}
   */
  async uploadCsv(csv, datasetId, dataKey, filename) {
    const url = this.buildUrl(`/api/v3/dataset/${datasetId}/data/${dataKey}`);

    // Create FormData with file
    const formData = new FormData();
    formData.append('type', 'data');
    formData.append('file', new Blob([csv], { type: 'text/csv' }), filename);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    return await this.handleResponse(response);
  }

  /**
   * Download CSV from URL
   * @param {string} url - URL to download from
   * @param {object} options - Options (gzip, etc.)
   * @returns {Promise<string>}
   */
  async downloadCsv(url, options = {}) {
    const response = await fetch(url, {
      method: 'GET',
      headers: options.gzip ? { 'Accept-Encoding': 'gzip' } : {}
    });

    return await this.handleResponse(response);
  }

  /**
   * Scan all rows for column names (superset of keys)
   * @param {Array} rows - Array of objects
   * @returns {Array<string>}
   */
  accumulateKeys(rows) {
    const keySet = new Set();
    rows.forEach(row => Object.keys(row).forEach(key => keySet.add(key)));
    return Array.from(keySet);
  }

  /**
   * Upload data array to dataset (converts to CSV first)
   * @param {Array} rows - Array of objects
   * @param {string} datasetId - Dataset ID
   * @param {string} dataKey - Data key (table name)
   * @param {string} filename - Optional filename
   * @returns {Promise<object>}
   */
  async uploadData(rows, datasetId, dataKey, filename) {
    if (!filename) {
      filename = `${datasetId}_${dataKey}.csv`;
    }

    // Scan all rows for column names
    const colKeys = this.accumulateKeys(rows);

    // Convert to CSV
    const csv = await stringifyAsync(rows, { header: true, columns: colKeys });

    // Upload CSV
    return await this.uploadCsv(csv, datasetId, dataKey, filename);
  }

  /**
   * Get data from dataset (downloads CSV and parses to array)
   * @param {string} datasetId - Dataset ID
   * @param {string} dataKey - Data key (table name)
   * @returns {Promise<Array>}
   */
  async getData(datasetId, dataKey) {
    const url = this.buildUrl(`/api/v3/dataset/${datasetId}/data/${dataKey}/csv`);

    // Download CSV
    const csv = await this.downloadCsv(url, { gzip: true });

    // Parse CSV to array of objects
    const rows = await parseAsync(csv, { columns: true });

    return rows;
  }
}

/**
 * Create API client from config
 * @param {object} config - Configuration with host and apiKey
 * @returns {ProtobiAPIClient}
 */
export function createApiClient(config) {
  if (!config.apiKey) {
    throw authError('API key is required. Use --apiKey or run: protobi init');
  }

  const apiUrl = config.host ? `https://${config.host}` : 'https://app.protobi.com';
  return new ProtobiAPIClient(apiUrl, config.apiKey);
}
