/**
 *
 * @param PROTOBI_API_URL
 * @param PROTOBI_API_KEY
 * @returns {
 * {
 *  upload_elements: upload_elements,
 *  uploadCsv: uploadCsv,
 *  upload_data: upload_data}
 *  }
 * @constructor
 */

var https = require('https');
var nodeFetch = require('node-fetch'); // For FormData uploads
var CSV = require('csv')
var Elements = require('./elements')

// Create an agent that accepts self-signed certificates for localhost testing
var httpsAgent = new https.Agent({
  rejectUnauthorized: false
});


function ProtobiAPI(PROTOBI_API_URL, PROTOBI_API_KEY, options) {
  options = options || {};
  var DEBUG_MODE = options.debug || false;

  function debugFetch(url, requestOptions) {
    if (DEBUG_MODE) {
      var method = requestOptions.method || 'GET';
      console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('DEBUG: First API Call (NOT EXECUTED)');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(`Method: ${method}`);
      console.error(`URL: ${url}`);
      if (requestOptions.headers) {
        console.error('Headers:', JSON.stringify(requestOptions.headers, null, 2));
      }
      if (requestOptions.body) {
        var bodyPreview = typeof requestOptions.body === 'string'
          ? requestOptions.body.substring(0, 500)
          : (requestOptions.body.constructor.name || 'Unknown');
        console.error('Body:', bodyPreview);
      }
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(0);
    }
    return nodeFetch(url, requestOptions);
  }

  return {

    initialize: function() {
      for (var key in this) {
        if (typeof this[key] == 'function') {
          this[key]= this[key].bind(this)
        }
      }
      return this;
    },


    /**
     * Save array of Element objects to a project
     * @param elements   Array of element objects
     * @param datasetId  Id of existing project
     * @param callback   function(err, elements)
     */
    uploadElements: function (elements, datasetId, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.uploadElements(elements, datasetId, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/element";
      url += "?apiKey=" + PROTOBI_API_KEY;

      debugFetch( url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PROTOBI_API_KEY
        },
        body: JSON.stringify(elements),
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },


    /**
     * Retrieve list of all datasets (admin only)
     * @param callback      function(err, datasets)
     */
    getDatasets: function (callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.getDatasets(function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Retrieve dataset metadata
     * @param datasetId     Id of existing project
     * @param callback      function(err, dataset)
     */
    getDataset: function (datasetId, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.getDataset(datasetId, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Retrieve list of data tables (csvtables) for a dataset
     * @param datasetId     Id of existing project
     * @param callback      function(err, tables)
     */
    getDataTables: function (datasetId, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.getDataTables(datasetId, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/tables";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Download raw CSV data for a table (for cloning)
     * @param datasetId     Id of existing project
     * @param dataKey       Key of data table to download
     * @param callback      function(err, csvText)
     */
    downloadData: function (datasetId, dataKey, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.downloadData(datasetId, dataKey, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey + "/csv";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.text();
      })
      .then(function(csvText) {
        callback(null, csvText);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Upload raw CSV text for a table (for cloning)
     * @param csvText       CSV text data
     * @param datasetId     Id of destination project
     * @param dataKey       Key of data table
     * @param filename      Original filename
     * @param callback      function(err, result)
     */
    uploadCsvText: function (csvText, datasetId, dataKey, filename, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.uploadCsvText(csvText, datasetId, dataKey, filename, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;

      var FormData = require('form-data');
      var form = new FormData();

      // Upload CSV as a file
      form.append('file', Buffer.from(csvText, 'utf-8'), {
        filename: filename || dataKey + '.csv',
        contentType: 'text/csv'
      });

      nodeFetch(url, {
        method: "POST",
        headers: {
          'x-api-key': PROTOBI_API_KEY,
          ...form.getHeaders()
        },
        body: form,
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Retrieve project configuration as an array of elements
     * @param datasetId     Id of existing project
     * @param callback      function(err, elements)
     */
    getElements: function (datasetId, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.getElements(datasetId, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/element";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Upload csv string to project data entry as a data file,
     * @method upload_csv
     */
    /**
     * Poll a task until complete or timeout
     * @param taskId     Task ID to poll
     * @param options    {timeout: 60000, interval: 1000} - timeout and poll interval in ms
     * @param callback   function(err, task)
     */
    pollTask: function (taskId, options, callback) {
      var self = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.pollTask(taskId, options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      var timeout = options.timeout || 60000; // 60 seconds default
      var interval = options.interval || 1000; // 1 second poll interval
      var startTime = Date.now();
      var checkUrl = PROTOBI_API_URL + "/api/v3/tasks/" + taskId + "/check?apiKey=" + PROTOBI_API_KEY;

      function poll() {
        nodeFetch(checkUrl, {
          method: "GET",
          headers: {
            'x-api-key': PROTOBI_API_KEY
          },
          agent: httpsAgent
        })
        .then(function(response) {
          if (response.status !== 200) {
            return response.text().then(function(text) {
              throw new Error('HTTP ' + response.status + ': ' + text);
            });
          }
          return response.json();
        })
        .then(function(task) {
          // Check if task completed
          if (task.complete) {
            if (task.error) {
              return callback(new Error(task.error));
            }
            return callback(null, task);
          }

          // Check if timeout exceeded
          if (Date.now() - startTime > timeout) {
            return callback(new Error('Task polling timeout after ' + timeout + 'ms'));
          }

          // Poll again after interval
          setTimeout(poll, interval);
        })
        .catch(function(err) {
          callback(err);
        });
      }

      poll();
    },

    uploadCsv: function (csv, datasetId, dataKey, filename, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.uploadCsv(csv, datasetId, dataKey, filename,  function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;

      // Create FormData for multipart upload
      var FormData = require('form-data');
      var form = new FormData();
      form.append('type', 'data');
      form.append('file', csv, {
        filename: filename,
        contentType: 'text/csv'
      });

      nodeFetch(url, {
        method: "POST",
        headers: {
          'x-api-key': PROTOBI_API_KEY,
          ...form.getHeaders()
        },
        body: form,
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();  // Changed from text() to json() to handle task response
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Download csv string to project data entry as a data file,
     * @method upload_csv
     */

    downloadCsv: function (url, options, callback) {
      var self = this;
      if (typeof options == 'function') {
        callback = options
        options = {}
      }
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.downloadCsv(url, options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      var headers = options.headers || {};
      // fetch handles gzip automatically via Accept-Encoding

      nodeFetch(url, {
        method: "GET",
        headers: headers,
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.text();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Scans through all objects in an array and returns the superset of keys.
     * This is useful when working with arrays that represent data files, as the first data row might not have entries for all data columns.
     * @param rows
     * @returns [String]
     */
    accumulate_keys: function(rows) {
      var keySet = new Set()
      rows.forEach(row=> Object.keys(row).forEach(key=>keySet.add(key)))
      return Array.from(keySet)
    },

    uploadData: function (rows, datasetId, dataKey, filename, callback) {

      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.uploadData(rows, datasetId, dataKey, filename,  function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      // the first row might not have all the columns, so scan all rows first
      var colKeys = self.accumulate_keys(rows)

      if (!filename) filename = datasetId + "_" + dataKey + ".csv";
      CSV.stringify(rows, {header: true, columns: colKeys}, function (err, csv) {
        if (err) return callback(err);
        return self.uploadCsv(csv, datasetId, dataKey, filename, callback)
      })
    },

    /**
     * Download
     * @param datasetId
     * @param dataKey
     * @param rows
     * @param filename
     * @param callback function(err, rows)
     */
    getData: function (datasetId, dataKey, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.getData(datasetId, dataKey, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey + "/csv";
      url += "?apiKey=" + PROTOBI_API_KEY;

      var self = this;
      // downloadCsv handles the request, add header there if needed
      self.downloadCsv(url, {gzip: true, headers: {'x-api-key': PROTOBI_API_KEY}}, function (err, csv) {
        CSV.parse(csv, {header: true, columns:true}, function (err, rows) {
          if (err) return callback(err);
          return callback(err, rows)
        })
      })
    },

    /**
     * List all datasets user has access to
     * @param callback function(err, datasets)
     */
    listDatasets: function (callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.listDatasets(function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Create a new dataset from a file
     * NOTE: Currently uses /v3/new/datafile/ which will soon require session auth.
     * TODO: Update to use /api/v3 endpoint when available
     * @param file      File path or Buffer
     * @param options   {name, description} - optional metadata
     * @param callback  function(err, dataset)
     */
    /**
     * Create a new dataset (metadata only, no data files)
     *
     * IMPORTANT: This method creates an EMPTY dataset with metadata only.
     * To upload data files to an existing dataset, use uploadData() instead.
     *
     * @param datasetObject   Dataset metadata object {name, description, etc}
     * @param options         Optional parameters (reserved for future use)
     * @param callback        function(err, dataset)
     */
    createDataset: function (datasetObject, options, callback) {
      var self = this;
      if (typeof options === 'function') {
        callback = options
        options = {}
      }
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.createDataset(datasetObject, options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      // Only support dataset objects - use API endpoint
      var url = PROTOBI_API_URL + "/api/v3/dataset";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PROTOBI_API_KEY
        },
        body: JSON.stringify(datasetObject),
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Update or create a dataset with a specific ID (for cloning)
     *
     * Uses PUT to either update existing dataset or create new one with specified ID.
     * This preserves the dataset ID when cloning between environments.
     *
     * @param datasetId         The dataset ID to use
     * @param datasetObject     Dataset metadata object {name, description, etc}
     * @param options           Optional parameters (reserved for future use)
     * @param callback          function(err, dataset)
     */
    updateDataset: function (datasetId, datasetObject, options, callback) {
      var self = this;
      if (typeof options === 'function') {
        callback = options
        options = {}
      }
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.updateDataset(datasetId, datasetObject, options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PROTOBI_API_KEY
        },
        body: JSON.stringify(datasetObject),
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Delete a dataset
     * @param datasetId  Dataset ID to delete
     * @param callback   function(err, result)
     */
    deleteDataset: function (datasetId, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.deleteDataset(datasetId, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "DELETE",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Delete a data table from a dataset
     * @param datasetId  Dataset ID
     * @param dataKey    Data key (table name)
     * @param callback   function(err, result)
     */
    deleteTable: function (datasetId, dataKey, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.deleteTable(datasetId, dataKey, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "DELETE",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Get full data table definition (including fn, properties, etc.)
     * @param datasetId  Dataset ID
     * @param dataKey    Table key
     * @param callback   function(err, table)
     */
    getDataTable: function (datasetId, dataKey, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.getDataTable(datasetId, dataKey, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Create or update a data table definition
     * @param datasetId    Dataset ID
     * @param dataKey      Table key
     * @param tableObject  Table definition object (with type, key, filename, fn, properties, etc.)
     * @param callback     function(err, table)
     */
    putDataTable: function (datasetId, dataKey, tableObject, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.putDataTable(datasetId, dataKey, tableObject, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PROTOBI_API_KEY
        },
        body: JSON.stringify(tableObject),
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Update the fn (JavaScript/SQL code) for a data process table
     * @param datasetId  Dataset ID
     * @param dataKey    Table key
     * @param fn         JavaScript or SQL code string
     * @param callback   function(err, table)
     */
    putDataTableFn: function (datasetId, dataKey, fn, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.putDataTableFn(datasetId, dataKey, fn, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      // Use the admin endpoint for setting fn
      var url = PROTOBI_API_URL + "/v3/datasets/" + datasetId + "/admin/data/" + dataKey + "/fn";
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PROTOBI_API_KEY
        },
        body: JSON.stringify({fn: fn}),
        agent: httpsAgent
      })
      .then(function(response) {
        if (!response.ok) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        callback(null, body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * List all data tables in a dataset
     * @param datasetId  Dataset ID
     * @param callback   function(err, tables)
     */
    listTables: function (datasetId, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.listTables(datasetId, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      // Note: There's no direct /api/v3 endpoint to list all tables.
      // We use GET /api/v3/dataset/:datasetId which returns the dataset with tables info
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId;
      url += "?apiKey=" + PROTOBI_API_KEY;

      nodeFetch(url, {
        method: "GET",
        headers: {
          'x-api-key': PROTOBI_API_KEY
        },
        agent: httpsAgent
      })
      .then(function(response) {
        if (response.status !== 200) {
          return response.text().then(function(text) {
            throw new Error('HTTP ' + response.status + ': ' + text);
          });
        }
        return response.json();
      })
      .then(function(body) {
        // Return the data tables from the dataset object
        callback(null, body.data || body);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    removeProxy: function () {
      delete process.env.http_proxy; //process.env.FIXIE_URL;  // per http://stackoverflow.com/a/36085330/645715
    }
  }.initialize()
}

ProtobiAPI.Elements = Elements;
module.exports = ProtobiAPI
