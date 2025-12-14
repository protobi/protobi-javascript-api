/**
 * CLI integration tests
 * Tests the CLI by spawning child processes and checking output
 * Requires credentials in .env file and localhost:5000 running
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
require('dotenv').config();

const CLI_PATH = path.join(__dirname, '../bin/cli.mjs');
const TEST_DIR = path.join(__dirname, 'cli-test-output');

// Helper to run CLI command
function runCLI(args, options = {}) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      NODE_TLS_REJECT_UNAUTHORIZED: '0' // Accept self-signed certs
    };

    const child = spawn('node', [CLI_PATH, ...args], {
      env,
      cwd: options.cwd || process.cwd()
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr
      });
    });

    child.on('error', reject);
  });
}

describe("CLI Integration Tests", function () {
  this.timeout(30000); // Allow 30s for CLI operations

  const DATASET_ID = process.env.PROTOBI_DATASET_ID || "6925fbd91ce9830fdb840901";
  const TABLE_KEY = process.env.PROTOBI_TABLE_KEY || "main";

  before(function() {
    // Create test output directory
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR);
    }
  });

  after(function() {
    // Clean up test output directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe("dataset download", function() {
    it("should download data to CSV file", async function() {
      const outputFile = path.join(TEST_DIR, 'download-test.csv');

      const result = await runCLI([
        'dataset', 'download',
        '--datasetId', DATASET_ID,
        '--table', TABLE_KEY,
        '--output', outputFile
      ]);

      // Check exit code
      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');

      // Check output message
      assert(result.stdout.includes('Saved to:'), 'Should show save message');
      assert(result.stdout.includes('Downloaded'), 'Should show download count');

      // Check file was created
      assert(fs.existsSync(outputFile), 'Output file should exist');

      // Check file content
      const content = fs.readFileSync(outputFile, 'utf8');
      const lines = content.trim().split('\n');
      assert(lines.length > 1, 'Should have header + data rows');
      assert(lines[0].includes(','), 'Should be CSV format');

      console.log(`✓ Downloaded ${lines.length - 1} rows to ${outputFile}`);
    });

    it("should download data in JSON format", async function() {
      const outputFile = path.join(TEST_DIR, 'download-test.json');

      const result = await runCLI([
        'dataset', 'download',
        '--datasetId', DATASET_ID,
        '--table', TABLE_KEY,
        '--output', outputFile,
        '--format', 'json'
      ]);

      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');
      assert(fs.existsSync(outputFile), 'Output file should exist');

      // Parse JSON to verify format
      const content = fs.readFileSync(outputFile, 'utf8');
      const data = JSON.parse(content);
      assert(Array.isArray(data), 'Should be JSON array');
      assert(data.length > 0, 'Should have data');

      console.log(`✓ Downloaded ${data.length} rows as JSON`);
    });

    it("should output to stdout when no --output specified", async function() {
      const result = await runCLI([
        'dataset', 'download',
        '--datasetId', DATASET_ID,
        '--table', TABLE_KEY
      ]);

      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');
      assert(result.stdout.length > 100, 'Should output CSV to stdout');
      assert(result.stdout.includes(','), 'Should be CSV format');
    });
  });

  describe("dataset get-elements", function() {
    it("should download elements to JSON file", async function() {
      const outputFile = path.join(TEST_DIR, 'elements-test.json');

      const result = await runCLI([
        'dataset', 'get-elements',
        '--datasetId', DATASET_ID,
        '--output', outputFile
      ]);

      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');
      assert(result.stdout.includes('Saved to:'), 'Should show save message');
      assert(fs.existsSync(outputFile), 'Output file should exist');

      // Parse JSON to verify format
      const content = fs.readFileSync(outputFile, 'utf8');
      const elements = JSON.parse(content);
      assert(Array.isArray(elements), 'Should be JSON array');

      console.log(`✓ Downloaded ${elements.length} elements to ${outputFile}`);
    });
  });

  describe("dataset upload", function() {
    it("should upload CSV file", async function() {
      // Create test CSV file
      const testFile = path.join(TEST_DIR, 'upload-test.csv');
      const testData = 'id,name,value\n1,Test1,100\n2,Test2,200\n3,Test3,300';
      fs.writeFileSync(testFile, testData);

      const testTableKey = 'cli_test_' + Date.now();

      const result = await runCLI([
        'dataset', 'upload',
        '--datasetId', DATASET_ID,
        '--table', testTableKey,
        '--file', testFile
      ]);

      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');
      assert(result.stdout.includes('Uploaded'), 'Should show upload message');

      console.log(`✓ Uploaded test data to table ${testTableKey}`);
    });
  });

  describe("dataset upload-elements", function() {
    it("should upload elements from JSON file", async function() {
      // First download current elements
      const downloadFile = path.join(TEST_DIR, 'elements-download.json');
      await runCLI([
        'dataset', 'get-elements',
        '--datasetId', DATASET_ID,
        '--output', downloadFile
      ]);

      // Now upload them back
      const result = await runCLI([
        'dataset', 'upload-elements',
        '--datasetId', DATASET_ID,
        '--file', downloadFile
      ]);

      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');
      assert(result.stdout.includes('Uploaded'), 'Should show upload message');

      console.log(`✓ Uploaded elements from ${downloadFile}`);
    });
  });

  describe("error handling", function() {
    it("should handle invalid dataset ID gracefully", async function() {
      const outputFile = path.join(TEST_DIR, 'invalid-dataset.csv');
      const result = await runCLI([
        'dataset', 'download',
        '--datasetId', 'invalid-id-12345',
        '--table', TABLE_KEY,
        '--output', outputFile
      ]);

      // After fetch migration, library correctly returns error for invalid dataset
      assert.notStrictEqual(result.code, 0, 'CLI should exit with non-zero code for invalid dataset');
      assert(result.stderr || result.stdout.includes('error') || result.stdout.includes('Error'),
             'Should show error message');
      console.log('✓ Invalid dataset returns error as expected');
    });

    it("should fail when file not found for upload", async function() {
      const result = await runCLI([
        'dataset', 'upload',
        '--datasetId', DATASET_ID,
        '--table', TABLE_KEY,
        '--file', '/nonexistent/file.csv'
      ]);

      assert.notStrictEqual(result.code, 0, 'CLI should exit with non-zero code');
      assert(result.stderr.includes('not found') || result.stdout.includes('not found'),
             'Should show file not found error');
    });
  });

  describe("JSON output mode", function() {
    it("should output JSON with --json flag", async function() {
      const outputFile = path.join(TEST_DIR, 'json-output-test.csv');

      const result = await runCLI([
        'dataset', 'download',
        '--datasetId', DATASET_ID,
        '--table', TABLE_KEY,
        '--output', outputFile,
        '--json'
      ]);

      assert.strictEqual(result.code, 0, 'CLI should exit with code 0');

      // Parse JSON output
      const output = JSON.parse(result.stdout);
      assert.strictEqual(output.success, true, 'Should have success: true');
      assert(output.datasetId, 'Should have datasetId');
      assert(output.rowsDownloaded > 0, 'Should have rowsDownloaded');

      console.log(`✓ JSON output: ${JSON.stringify(output, null, 2)}`);
    });
  });
});
