# Protobi CLI Guide

> **Command-Line Interface for Protobi REST API**
> Last updated: 2025-12-14

The Protobi CLI enables scripting and automation of data operations from the command line.

## Installation

```bash
npm install -g protobi-javascript-api
```

Or use locally in a project:

```bash
npm install protobi-javascript-api
npx protobi --help
```

## Quick Start

### 1. Configure Credentials

Create a configuration file with your API credentials:

```bash
# Copy example config
cp .protobi.json.example .protobi.json

# Edit with your credentials
nano .protobi.json
```

Example `.protobi.json`:

```json
{
  "apiKey": "your-api-key-here",
  "host": "https://app.protobi.com",
  "datasetId": "default-dataset-id",
  "table": "main"
}
```

Get your API key from: https://app.protobi.com/account

### 2. Use the CLI

```bash
# Download data
protobi dataset download --datasetId <id> --table main --output data.csv

# Upload data
protobi dataset upload --datasetId <id> --table main --file data.csv

# Download configuration
protobi dataset get-elements --datasetId <id> --output config.json

# Upload configuration
protobi dataset upload-elements --datasetId <id> --file config.json
```

## Configuration

The CLI uses a configuration cascade (lowest to highest priority):

1. **Global config**: `~/.protobi.json`
2. **Local config**: `./.protobi.json` or `./config.json`
3. **Environment variables**: `PROTOBI_API_KEY`, `PROTOBI_HOST`, `PROTOBI_DATASET_ID`
4. **Command-line flags**: `--apiKey`, `--host`, `--datasetId`

### Configuration File Format

```json
{
  "apiKey": "your-api-key-here",
  "host": "https://app.protobi.com",
  "datasetId": "default-dataset-id",
  "table": "main"
}
```

### Environment Variables

```bash
export PROTOBI_API_KEY="your-api-key"
export PROTOBI_HOST="https://app.protobi.com"
export PROTOBI_DATASET_ID="default-dataset-id"
export PROTOBI_TABLE_KEY="main"
```

## Commands

### `dataset download`

Download data from a dataset table.

**Usage:**

```bash
protobi dataset download [options]
```

**Options:**

- `--datasetId <id>` - Dataset ID (required)
- `--table <key>` - Table key (required, default: "main")
- `--output <file>` - Output file path (optional, defaults to stdout)
- `--format <format>` - Output format: csv or json (default: csv)
- `--json` - Output operation result as JSON
- `--quiet` - Suppress output except errors

**Examples:**

```bash
# Download to file
protobi dataset download \
  --datasetId abc123 \
  --table main \
  --output data.csv

# Download as JSON
protobi dataset download \
  --datasetId abc123 \
  --table main \
  --output data.json \
  --format json

# Output to stdout (for piping)
protobi dataset download \
  --datasetId abc123 \
  --table main > data.csv

# JSON output for scripting
protobi dataset download \
  --datasetId abc123 \
  --table main \
  --output data.csv \
  --json
# Outputs: {"success":true,"datasetId":"abc123","rowsDownloaded":157,...}
```

---

### `dataset upload`

Upload data to a dataset table.

**Usage:**

```bash
protobi dataset upload [options]
```

**Options:**

- `--datasetId <id>` - Dataset ID (required)
- `--table <key>` - Table key (required, default: "main")
- `--file <path>` - CSV file to upload (required)
- `--json` - Output operation result as JSON
- `--quiet` - Suppress output except errors

**Examples:**

```bash
# Upload CSV file
protobi dataset upload \
  --datasetId abc123 \
  --table main \
  --file data.csv

# Upload to new table
protobi dataset upload \
  --datasetId abc123 \
  --table new_table \
  --file import.csv

# JSON output for scripting
protobi dataset upload \
  --datasetId abc123 \
  --table main \
  --file data.csv \
  --json
# Outputs: {"success":true,"taskId":"12345",...}
```

**Note:** Upload operations are asynchronous and return a task ID. The operation may continue processing after the command completes.

---

### `dataset get-elements`

Download project configuration (questions, labels, settings).

**Usage:**

```bash
protobi dataset get-elements [options]
```

**Options:**

- `--datasetId <id>` - Dataset ID (required)
- `--output <file>` - Output JSON file (optional, defaults to stdout)
- `--json` - Output operation result as JSON
- `--quiet` - Suppress output except errors

**Examples:**

```bash
# Download configuration
protobi dataset get-elements \
  --datasetId abc123 \
  --output config.json

# Output to stdout
protobi dataset get-elements \
  --datasetId abc123 > config.json

# JSON output for scripting
protobi dataset get-elements \
  --datasetId abc123 \
  --output config.json \
  --json
# Outputs: {"success":true,"elementCount":42,...}
```

---

### `dataset upload-elements`

Upload project configuration (questions, labels, settings).

**Usage:**

```bash
protobi dataset upload-elements [options]
```

**Options:**

- `--datasetId <id>` - Dataset ID (required)
- `--file <path>` - JSON file with elements configuration (required)
- `--json` - Output operation result as JSON
- `--quiet` - Suppress output except errors

**Examples:**

```bash
# Upload configuration
protobi dataset upload-elements \
  --datasetId abc123 \
  --file config.json

# JSON output for scripting
protobi dataset upload-elements \
  --datasetId abc123 \
  --file config.json \
  --json
# Outputs: {"success":true,"elementCount":42,...}
```

---

## Output Modes

### Human-Readable (Default)

Default mode with colors, spinners, and progress indicators:

```bash
protobi dataset download --datasetId abc123 --table main --output data.csv
# Output:
# ✓ Downloaded 157 rows to data.csv
```

### JSON Output Mode

Machine-readable JSON output for scripting:

```bash
protobi dataset download --datasetId abc123 --table main --output data.csv --json
# Output:
# {"success":true,"datasetId":"abc123","table":"main","rowsDownloaded":157,"file":"data.csv","bytes":47455}
```

### Quiet Mode

Suppress all output except errors:

```bash
protobi dataset download --datasetId abc123 --table main --output data.csv --quiet
# (no output unless error)
```

## Scripting Examples

### Bash Script - Download Multiple Datasets

```bash
#!/bin/bash
# Download data from multiple datasets

DATASETS=("dataset1" "dataset2" "dataset3")

for DATASET_ID in "${DATASETS[@]}"; do
  echo "Downloading ${DATASET_ID}..."

  protobi dataset download \
    --datasetId "${DATASET_ID}" \
    --table main \
    --output "data_${DATASET_ID}.csv"

  if [ $? -eq 0 ]; then
    echo "✓ Downloaded ${DATASET_ID}"
  else
    echo "✗ Failed to download ${DATASET_ID}"
    exit 1
  fi
done

echo "All downloads complete!"
```

### Bash Script - Backup Configuration

```bash
#!/bin/bash
# Backup dataset configuration

DATASET_ID="abc123"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="backups"

mkdir -p "${OUTPUT_DIR}"

# Download configuration
protobi dataset get-elements \
  --datasetId "${DATASET_ID}" \
  --output "${OUTPUT_DIR}/config_${TIMESTAMP}.json"

# Download data
protobi dataset download \
  --datasetId "${DATASET_ID}" \
  --table main \
  --output "${OUTPUT_DIR}/data_${TIMESTAMP}.csv"

echo "Backup saved to ${OUTPUT_DIR}/"
```

### PowerShell Script - Batch Upload

```powershell
# Batch upload CSV files to datasets

$files = Get-ChildItem -Path "data/*.csv"

foreach ($file in $files) {
    $datasetId = $file.BaseName

    Write-Host "Uploading $($file.Name) to $datasetId..."

    protobi dataset upload `
      --datasetId $datasetId `
      --table main `
      --file $file.FullName `
      --json

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Uploaded $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to upload $($file.Name)" -ForegroundColor Red
        exit 1
    }
}

Write-Host "All uploads complete!"
```

### Node.js Script - Automated Workflow

```javascript
const { execSync } = require('child_process');

// Configuration
const DATASET_ID = 'abc123';
const TABLE = 'main';

function runCommand(cmd) {
  try {
    const output = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Download data
console.log('Downloading data...');
const downloadResult = runCommand(`protobi dataset download \
  --datasetId ${DATASET_ID} \
  --table ${TABLE} \
  --output temp.csv \
  --json`);

console.log(`Downloaded ${downloadResult.rowsDownloaded} rows`);

// Process data (add your processing logic here)
// ...

// Upload modified data
console.log('Uploading modified data...');
const uploadResult = runCommand(`protobi dataset upload \
  --datasetId ${DATASET_ID} \
  --table processed \
  --file temp_processed.csv \
  --json`);

console.log(`Upload task ID: ${uploadResult.taskId}`);
```

## Exit Codes

The CLI uses exit codes for scripting:

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Authentication error
- `4` - Not found (dataset, table, file)

**Example:**

```bash
protobi dataset download --datasetId abc123 --table main --output data.csv
if [ $? -eq 0 ]; then
  echo "Success!"
else
  echo "Failed with exit code $?"
fi
```

## Troubleshooting

### Authentication Errors

If you get authentication errors:

1. Check your API key is correct: https://app.protobi.com/account
2. Verify the key is in your config file or environment
3. Try passing the key explicitly: `--apiKey YOUR_KEY`

### File Not Found

If dataset or table not found:

1. Verify the dataset ID is correct
2. Check you have permission to access the dataset
3. Confirm the table key exists in the dataset

### Network Errors

If you get connection errors:

1. Check your internet connection
2. Verify the host URL is correct (default: https://app.protobi.com)
3. Check for firewall or proxy issues

## Getting Help

```bash
# General help
protobi --help

# Command-specific help
protobi dataset --help
protobi dataset download --help
protobi dataset upload --help
protobi dataset get-elements --help
protobi dataset upload-elements --help
```

## Related Documentation

- [REST API Documentation](REST_API.md) - Direct REST API endpoint reference
- [JavaScript API Documentation](JS_API.md) - Node.js library reference
- [GitHub Repository](https://github.com/protobi/protobi-javascript-api-cli)

---

**Need more help?** Report issues at: https://github.com/protobi/protobi-javascript-api-cli/issues
