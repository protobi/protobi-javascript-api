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
var fetch = require('node-fetch'); // For FormData uploads
var CSV = require('csv')
var Elements = require('./elements')

// Create an agent that accepts self-signed certificates for localhost testing
var httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Normalize transport failures once for all REST methods. HTTP response and
// JSON parsing errors are handled by the methods themselves.
function nodeFetch(url, options) {
  return fetch(url, options).catch(function(err) {
    if (err.type !== 'system' && err.type !== 'request-timeout') throw err;

    var server = new URL(url).origin;
    var code = err.code || err.errno;
    var reasons = {
      ECONNREFUSED: 'Connection refused. Check that the server is running and the host and port are correct.',
      ENOTFOUND: 'Server hostname could not be resolved.',
      EAI_AGAIN: 'Server hostname could not be resolved temporarily.',
      ETIMEDOUT: 'Connection timed out.',
      ECONNRESET: 'Connection was reset by the server.',
      EHOSTUNREACH: 'Server host is unreachable.',
      ENETUNREACH: 'Network is unreachable.',
      EPERM: 'Connection blocked by system permissions.',
      EACCES: 'Connection blocked by system permissions.'
    };
    var reason = reasons[code] || (err.type === 'request-timeout'
      ? 'Connection timed out.'
      : 'The network request failed. Check server availability and connection settings.');
    // Do not include the fetch message: its request URL can contain an API key.
    var error = new Error('Unable to connect to server ' + server +
      (code ? ' [' + code + ']' : '') + ': ' + reason);
    error.code = err.code;
    error.errno = err.errno;
    error.type = err.type;
    throw error;
  });
}


function ProtobiAPI(PROTOBI_API_URL, PROTOBI_API_KEY, options) {
  options = options || {};
  var DEBUG_MODE = options.debug || false;
  var TASK_POLL_INTERVAL_MS = options.taskPollIntervalMs || 1000;
  var TASK_TIMEOUT_MS = options.taskTimeoutMs || 30 * 60 * 1000;
  var TASK_POLL_MAX_ERRORS = options.taskPollMaxErrors || 5;

  function describeRequestError(err) {
    var message = err && err.message ? err.message : String(err || 'Unknown request error');
    var code = err && (err.code || err.errno || err.type);
    return code && message.indexOf(String(code)) === -1
      ? message + ' [' + code + ']'
      : message;
  }

  /**
   * Wait for an asynchronous server task to finish.
   *
   * Upload endpoints return a task descriptor before storage/processing has
   * completed. Treating that initial HTTP 200 as success hides failures such as
   * rejected S3 writes.
   */
  function waitForTask(task, callback) {
    if (!task || !task.id || task.complete !== false) {
      if (task && task.error) {
        return callback(new Error('Task ' + (task.id || 'unknown') + ' failed: ' + task.error));
      }
      return callback(null, task);
    }

    var startedAt = Date.now();
    var consecutivePollErrors = 0;

    function poll() {
      if (Date.now() - startedAt >= TASK_TIMEOUT_MS) {
        return callback(new Error('Task ' + task.id + ' did not complete within ' + Math.round(TASK_TIMEOUT_MS / 1000) + ' seconds'));
      }

      var url = PROTOBI_API_URL + '/api/v3/tasks/' + encodeURIComponent(task.id) + '/check';
      nodeFetch(url, {
        method: 'GET',
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
      .then(function(currentTask) {
        consecutivePollErrors = 0;
        if (!currentTask) {
          return callback(new Error('Task ' + task.id + ' was not found while waiting for completion'));
        }
        if (currentTask.complete) {
          if (currentTask.error) {
            return callback(new Error('Task ' + task.id + ' failed: ' + currentTask.error));
          }
          return callback(null, currentTask);
        }

        var serverDelay = Number(currentTask.delay);
        var delay = Number.isFinite(serverDelay) && serverDelay > 0
          ? serverDelay
          : TASK_POLL_INTERVAL_MS;
        setTimeout(poll, delay);
      })
      .catch(function(err) {
        consecutivePollErrors++;
        if (consecutivePollErrors >= TASK_POLL_MAX_ERRORS || Date.now() - startedAt >= TASK_TIMEOUT_MS) {
          return callback(new Error(
            'Unable to check task ' + task.id + ' after ' + consecutivePollErrors +
            ' consecutive attempts: ' + describeRequestError(err)
          ));
        }

        var retryDelay = Math.min(
          TASK_POLL_INTERVAL_MS * Math.pow(2, consecutivePollErrors - 1),
          10000
        );
        console.error(
          '  ⚠ Unable to check task ' + task.id + ': ' + describeRequestError(err) +
          '; retrying in ' + Math.round(retryDelay / 1000) + ' seconds (' +
          consecutivePollErrors + '/' + TASK_POLL_MAX_ERRORS + ')'
        );
        setTimeout(poll, retryDelay);
      });
    }

    setTimeout(poll, TASK_POLL_INTERVAL_MS);
  }

  function getDownloadFilename(response, fallback) {
    var disposition = response.headers.get('content-disposition') || '';
    var utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    var basicMatch = disposition.match(/filename\s*=\s*"?([^";]+)"?/i);
    var encoded = utf8Match && utf8Match[1];
    if (encoded) {
      try {
        return decodeURIComponent(encoded);
      } catch (err) {
        return encoded;
      }
    }
    return basicMatch ? basicMatch[1].trim() : fallback;
  }

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
          var err = new Error('HTTP ' + response.status + ': ' + response.statusText);
          err.status = response.status;
          throw err;
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
     * Download the originally uploaded binary for a table.
     * @param datasetId       Id of source project
     * @param dataKey         Key of data table
     * @param fallbackName    Filename to use if the response omits one
     * @param callback        function(err, { data, filename, contentType })
     */
    downloadOriginalData: function (datasetId, dataKey, fallbackName, callback) {
      var self = this;
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.downloadOriginalData(datasetId, dataKey, fallbackName, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + encodeURIComponent(dataKey) + "/raw";
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
            var err = new Error('HTTP ' + response.status + ': ' + text);
            err.status = response.status;
            throw err;
          });
        }
        return response.buffer().then(function(data) {
          return {
            data: data,
            filename: getDownloadFilename(response, fallbackName || dataKey),
            contentType: (response.headers.get('content-type') || 'application/octet-stream').split(';')[0]
          };
        });
      })
      .then(function(file) {
        callback(null, file);
      })
      .catch(function(err) {
        callback(err);
      });
    },

    /**
     * Upload a binary file and wait for the server task to complete.
     */
    uploadFile: function (fileData, datasetId, dataKey, filename, contentType, options, callback) {
      var self = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.uploadFile(fileData, datasetId, dataKey, filename, contentType, options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }

      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;

      var FormData = require('form-data');
      var form = new FormData();
      if (options.forceStreaming) {
        form.append('useStreaming', 'true');
      }
      form.append('file', Buffer.isBuffer(fileData) ? fileData : Buffer.from(fileData), {
        filename: filename || dataKey,
        contentType: contentType || 'application/octet-stream'
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
        waitForTask(body, callback);
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
     * @param options       Optional upload options ({ forceStreaming: true })
     * @param callback      function(err, result)
     */
    uploadCsvText: function (csvText, datasetId, dataKey, filename, options, callback) {
      var self = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.uploadCsvText(csvText, datasetId, dataKey, filename, options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
      }
      self.uploadFile(
        Buffer.from(csvText, 'utf-8'),
        datasetId,
        dataKey,
        filename || dataKey + '.csv',
        'text/csv',
        options,
        callback
      );
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
      options = options || {}

      // Preserve the previous file-based signature while allowing the clone
      // tool to pass a plain metadata object.
      if (typeof datasetObject === 'string' ||
          Buffer.isBuffer(datasetObject) ||
          (datasetObject && typeof datasetObject.pipe === 'function')) {
        return self.createDatasetFromFile(datasetObject, options, callback)
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
     * Create a new dataset from a file.
     * @param file      File path, Buffer, or readable stream
     * @param options   {name, description, filename, contentType}
     * @param callback  function(err, dataset)
     */
    createDatasetFromFile: function (file, options, callback) {
      var self = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      if (!callback) {
        return new Promise(function(resolve, reject) {
          self.createDatasetFromFile(file, options, function (err, result) {
            if (err) reject(err);
            else resolve(result);
          });
        });
      }

      var url = PROTOBI_API_URL + "/v3/new/datafile/?apiKey=" + PROTOBI_API_KEY;
      var FormData = require('form-data');
      var form = new FormData();

      if (typeof file === 'string') {
        form.append('file', require('fs').createReadStream(file));
      } else {
        form.append('file', file, {
          filename: options.filename || 'data.csv',
          contentType: options.contentType || 'text/csv'
        });
      }
      if (options.name) form.append('name', options.name);
      if (options.description) form.append('description', options.description);

      nodeFetch(url, {
        method: "POST",
        headers: form.getHeaders(),
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
