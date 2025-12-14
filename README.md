# Protobi REST API, Node.js SDK, and CLI

This package provides three ways to interact with the Protobi REST API:

1. **Command-Line Interface (CLI)** - For scripting and automation
2. **Node.js Library** - For programmatic access from Node.js
3. **REST API** - Direct HTTP access from any language/platform

## Installation

```bash
npm install github:protobi/protobi-javascript-api
```

---

## Command-Line Interface (CLI)

The Protobi CLI enables scripting and automation of data operations.

### Quick Start

1. **Configure credentials** (one-time setup):
   ```bash
   # Create local config file
   cp .protobi.json.example .protobi.json
   # Edit and add your API key
   ```

   Or set environment variables:
   ```bash
   export PROTOBI_API_KEY="your-api-key-here"
   export PROTOBI_HOST="https://app.protobi.com"
   ```

2. **Use the CLI**:
   ```bash
   # Download data
   protobi dataset download --datasetId <id> --table main --output data.csv

   # Upload data
   protobi dataset upload --datasetId <id> --table main --file data.csv

   # Download project configuration
   protobi dataset get-elements --datasetId <id> --output elements.json

   # Upload project configuration
   protobi dataset upload-elements --datasetId <id> --file elements.json
   ```

### CLI Configuration

Configuration cascade (lowest to highest priority):
1. Global config: `~/.protobi.json`
2. Local config: `./.protobi.json` or `./config.json`
3. Environment variables: `PROTOBI_API_KEY`, `PROTOBI_HOST`, `PROTOBI_DATASET_ID`
4. Command-line flags: `--apiKey`, `--host`, `--datasetId`

Example `.protobi.json`:
```json
{
  "apiKey": "your-api-key-here",
  "host": "https://app.protobi.com",
  "datasetId": "default-dataset-id",
  "table": "main"
}
```

### CLI Commands

**Dataset Download**
```bash
protobi dataset download \
  --datasetId <id> \
  --table <key> \
  --output data.csv \
  --format csv|json
```

**Dataset Upload**
```bash
protobi dataset upload \
  --datasetId <id> \
  --table <key> \
  --file data.csv
```

**Get Elements (Download Configuration)**
```bash
protobi dataset get-elements \
  --datasetId <id> \
  --output elements.json
```

**Upload Elements (Upload Configuration)**
```bash
protobi dataset upload-elements \
  --datasetId <id> \
  --file elements.json
```

### Output Modes

- **Default**: Human-readable output with colors and spinners
- **JSON**: Machine-readable output with `--json` flag
- **Quiet**: Suppress output with `--quiet` flag

### Scripting Example

```bash
#!/bin/bash
# Batch download data from multiple datasets

for DATASET_ID in dataset1 dataset2 dataset3; do
  protobi dataset download \
    --datasetId "$DATASET_ID" \
    --table main \
    --output "data_${DATASET_ID}.csv"
done
```

For detailed CLI documentation, see [wiki/usage.md](wiki/usage.md).

### API Reference

The API supports operations for:
- **Datasets** - Create, clone, list, permissions
- **Data Tables** - Upload, download, manage tables
- **Elements** - Project configuration, questions, labels
- **Tasks** - Monitor async operations

See [docs/api-spec.json](docs/api-spec.json) for the complete OpenAPI specification (internal reference)

---


## REST API

### Authentication
Authenticate either by secure cookie or API Key.   
To login via API key, append `?apiKey=<YOUR_API_KEY>` to the URL as a query parameter. 

Your API key can be obtained at https://app.protobi.com/account  
(or if you have Protobi Enterprise, use https://yourdomain.protobi.com/account ).


Keep the API confidential, it provides access to your projects as if you had logged in.
    

### Download data file

* Method: `GET`
* URL: `https://app.protobi.com/v3/datasets/:datasetId/data/:key/:type`
* @param: `datasetId`  unique identifier for dataset
* @param: `key`  data key, e.g. 'main'
* @param: `type`, e.g. `csv`, `sav`, or `raw` to return the original file.
* Returns:  Data file in CSV text format

#### Example (jQuery):  

      $.ajax({
            type: "GET",
            url: "/api/v3/dataset/<DATASETID>/data/<FILEKEY>?apiKey=<APIKEY>",
            success: function (csv, status, xhr) {
                ...
            },
            error: function (xhr, status, err) {
                ...
            }
      })

### Upload data file
* Method: `POST`
* URL: `https://app.protobi.com/v3/datasets/:datasetId/data/:key/:type`
* @param: `datasetId`  unique identifier for dataset
* @param: `key`  data key, e.g. 'main'

Send the data as form data under attribute `file` with subattributes `filename` and `content-type`. 
To upload CSV data, use `content-type: "text/csv"`.
To upload SAV data, use `content-type: "'application/octet-stream'"`

#### Example
        var boundary = '-----------------------------7da24f2e50046'//arbitrary
        $.ajax({
            type: "POST",
            url: "/api/v3/dataset/<DATASETID>/data/<FILEKEY>?apiKey=<APIKEY>",
            contentType: "multipart/form-data; boundary=" + boundary
            data: boundary + '\r\n'
              + 'Content-Disposition: form-data; name="file";'
              + 'filename="' + filename + '"\r\n'
              + 'Content-type: text/csv\r\n\r\n'
              + csv + '\r\n'
              + boundary,
            success: function (data, status, xhr) {
                ...
            },
            error: function (xhr, status, err) {
                ...
            }
        });

### Download elements 

* Method: `GET`
* URL: `https://app.protobi.com/v3/datasets/:datasetId/element`
* @param: `datasetId`  unique identifier for dataset
* Returns:  Elements configuration in JSON format

#### Example (jQuery):   

      $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v3/dataset/<DATASETID>/element",
            success: function (csv, status, xhr) {
                ...
            },
            error: function (xhr, status, err) {
                ...
            }
      })
      
#### Example (Node.js)
    
     

### Upload elements


* Method: `POST`
* URL: `https://app.protobi.com/v3/datasets/:datasetId/element`
* @param: `datasetId`  unique identifier for dataset
* Returns:  Elements configuration in JSON format

#### Example (jQuery):  

      $.ajax({
            type: "POST",
            url: "/api/v3/dataset/<DATASETID>/element",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(elements),
            success: function (data, status, xhr) {
                ...
            },
            error: function (xhr, status, err) {
                ...
            }
      })



## Node.js API 


In Node.js require the library and initialize it for a specific host and API key

    var ProtobiAPI = require('./js/protobi-javascript-api')

    var PROTOBI_URL = "https://app.protobi.com"
    var PROTOBI_API_KEY = "c1001580-56f4-400e-a210-212d03309e80"
    
    var protobiAPI = new ProtobiAPI(PROTOBI_URL, PROTOBI_API_KEY)





## Node.js API


```js
/**
 * Save array of Element objects to a project
 * @param elements
 * @param datasetId
 * @param callback
 */
uploadElements: function ( elements, datasetId, callback) {...},


/**
 * Retrieve project configuration as an array of elements
 * @param datasetId
 * @param elements
 * @param callback
 */
getElements: function (datasetId, elements, callback) {...},

/**
 * Upload csv string to project data entry as a data file,
 * @method upload_csv
 */
uploadCsv: function (csv, datasetId, dataKey, filename, callback) {...},

/**
 * Download csv string to project data entry as a data file,
 * @method upload_csv
 */

downloadCsv: function (url, callback) {...},

uploadData: function (rows, datasetId, dataKey,  filename, callback) { ... },

/**
 * Download
 * @param datasetId
 * @param dataKey
 * @param rows
 * @param filename
 * @param callback function(err, rows)
 */
getData: function (datasetId, dataKey, callback) {...},
```    




## Node.js API examples

#### Upload elements
```js
var elements = [
   {
        key: "$root",
        children: ["fruit","color"]
   },
   {
        key: "fruit",
        title: "Name of fruit",
        type: "string"
   },
   {
        key: "color",
        title: "Color",
        type: "string"
   }
}

protobiAPI.uploadElements(elements, PROTOBI_PROJECT_ID, function (err) {
  if (err) return callback(err);
  console.log("ELEMENTS uploaded")   
})
```  
    
#### Upload data
    
```js
// example data
var data = [
   { fruit: "Apple", "color": "red",
     fruit: "Banana", "color": "yellow",
     fruit: "Cherry", "color": "red",
     fruit: "Date", "color": "brown"
   }
]


protobiAPI.uploadData(data, PROTOBI_PROJECT_ID, "main", null, function (err) {
  if (err) return callback(err);
  console.log("DATA uploaded")
})
```


## Update
All functions return a Promise if no callback method is specified.
This allows functions to be used with **async await**.

