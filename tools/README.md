# Protobi Tools

Utility scripts for working with the Protobi API.

## Clone Project Tool

Clone complete Protobi projects between environments using only the REST API (no MongoDB access required).

### Features

- ✅ Clone dataset metadata
- ✅ Clone project elements (configuration)
- ✅ Clone data tables
- ✅ Config file support for reusable configurations
- ✅ Save configuration for future use
- ✅ Skip data files for faster metadata-only clones
- ✅ Works with any environment (production, staging, local)
- ✅ No MongoDB credentials needed - REST API only

### Quick Start

1. **Copy the example config:**
   ```bash
   cp tools/clone-config.example.json tools/my-clone-config.json
   ```

2. **Edit your config file:**
   ```json
   {
     "datasetId": "your-dataset-id-here",
     "source": {
       "host": "https://source.protobi.com",
       "apiKey": "your-source-api-key"
     },
     "dest": {
       "host": "http://localhost:5000",
       "apiKey": null
     },
     "skipFiles": false,
     "forceStreaming": false,
     "onError": "stop"
   }
   ```

3. **Run the clone:**
   ```bash
   node tools/clone-project.mjs --config tools/my-clone-config.json
   ```

### Usage Examples

**Clone from production to local:**
```bash
node tools/clone-project.mjs \
  --dataset-id 67d9963a842478fccb14da41 \
  --source-host https://globalstrategygroup.protobi.com \
  --source-api-key "your-api-key"
```

**Clone using config file:**
```bash
node tools/clone-project.mjs --config tools/my-clone-config.json
```

**Clone metadata only (no data files):**
```bash
node tools/clone-project.mjs --config tools/my-clone-config.json --skip-files
```

**Save configuration for reuse:**
```bash
node tools/clone-project.mjs \
  --dataset-id 67d9963a842478fccb14da41 \
  --source-api-key "your-key" \
  --save-config tools/my-clone-config.json
```

### Command Line Options

| Option | Description |
|--------|-------------|
| `--dataset-id <id>` | Dataset ID to clone (required) |
| `--config <file>` | Load configuration from JSON file |
| `--save-config <file>` | Save merged configuration to JSON file |
| `--source-host <url>` | Source API host (default: https://app.protobi.com) |
| `--source-api-key <key>` | Source API key |
| `--dest-host <url>` | Destination API host (default: http://localhost:5000) |
| `--dest-api-key <key>` | Destination API key (null = use cookies) |
| `--skip-files` | Skip data file transfers |
| `--data-tables <mode>` | Clone `primary` (default), `all`, or `none` data tables |
| `--force-streaming` | Force the destination server's streaming upload pipeline |
| `--on-error <action>` | Stop on the first table failure (`stop`, default) or attempt remaining tables (`continue`) |
| `--verbose, -v` | Show detailed progress output |
| `--help, -h` | Show help message |

### Environment Variables

You can also set these environment variables instead of passing API keys on command line:

- `PROTOBI_API_KEY_SOURCE` - Source environment API key
- `PROTOBI_API_KEY_DEST` - Destination environment API key

### Config File Format

See `clone-config.example.json` for a complete example.

```json
{
  "datasetId": "67d9963a842478fccb14da41",
  "source": {
    "host": "https://globalstrategygroup.protobi.com",
    "apiKey": "your-source-api-key"
  },
  "dest": {
    "host": "http://localhost:5000",
    "apiKey": null
  },
  "skipFiles": false,
  "forceStreaming": false,
  "onError": "stop"
}
```

### Notes

- **API Keys**: Source API key is required. Destination API key is optional (uses browser cookies if null).
- **Skip Files**: Use `--skip-files` to clone only metadata (dataset + elements) for faster operation.
- **Streaming Uploads**: Use `--force-streaming` to send `useStreaming=true` with every table upload. Without it, the destination chooses its normal upload pipeline.
- **Original Files**: The clone preserves the originally uploaded binary, filename, and MIME type when the source table has one. Legacy tables without an available original file fall back to their processed CSV representation.
- **Missing or Empty Data**: Table definitions are still cloned, but nonexistent and zero-byte source files/results are not uploaded. Process tables always use their processed CSV result when one exists.
- **Table Errors**: The clone stops on the first table failure by default. Use `--on-error continue` to attempt every table and receive a failure summary at the end.
- **Config Files**: CLI arguments override config file values, which override environment variables.
- **Multiple Configs**: Keep separate config files for different clone scenarios (prod→local, staging→prod, etc.)

### Troubleshooting

**Error: Source API key is required**
- Set `--source-api-key` or `PROTOBI_API_KEY_SOURCE` environment variable

**Error: Dataset not found**
- Verify dataset ID is correct
- Ensure API key has access to the dataset

**Error: Failed to clone table**
- Check network connectivity
- Verify API keys have necessary permissions
- Try with `--skip-files` to isolate the issue
