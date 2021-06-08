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

var request = require('request');
var CSV = require('csv')
var Elements = require('./elements')


function ProtobiAPI(PROTOBI_API_URL, PROTOBI_API_KEY) {

  return {


    /**
     * Save array of Element objects to a project
     * @param elements   Array of element objects
     * @param datasetId  Id of existing project
     * @param callback   function(err, elements)
     */
    uploadElements: function (elements, datasetId, callback) {
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/element";
      url += "?apiKey=" + PROTOBI_API_KEY;
      console.log(elements.length)
      console.log(url)
      request({
            url: url,
            method: "POST",
            body: elements,
            json: true,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
          },
          function (err, response, body) {
            if (err) return callback(err);
            console.log(response.statusCode)
            return callback(err, body);
          })
    },


    /**
     * Retrieve project configuration as an array of elements
     * @param datasetId     Id of existing project
     * @param callback      function(err, elements)
     */
    getElements: function (datasetId, callback) {
      var url = PROTOBI_API_URL + "/v3/datasets/" + datasetId + "/element";
      url += "?apiKey=" + PROTOBI_API_KEY;
      request({
            url: url,
            method: "GET",
            json: true,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
          },
          function (err, response, body) {
            if (err) return callback(err);
            return callback(err, body);
          })
    },

    /**
     * Upload csv string to project data entry as a data file,
     * @method upload_csv
     */
    uploadCsv: function (csv, datasetId, dataKey, filename, callback) {
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey;
      url += "?apiKey=" + PROTOBI_API_KEY;
      console.log(url)

      var req = request.post({
        url: url,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
      }, function (err, response, body) {
        if (err) return callback(err);

        if (response.statusCode != 200) {
          return callback(response.statusCode, body)
        }
        return callback(err, body)
      });
      var form = req.form();
      form.append('type', 'data')
      form.append('file', csv, {
        filename: filename,
        contentType: 'text/csv'
      });
    },

    /**
     * Download csv string to project data entry as a data file,
     * @method upload_csv
     */

    downloadCsv: function (url, options, callback) {
      if (typeof options == 'function') {
        callback = options
        options = {}
      }
      var req = request.get({
            url: url,
            rejectUnauthorized: false,
            gzip: options.gzip,
            requestCert: true,
            agent: false
          },
          function (err, response, body) {
            if (err) return callback(err);
            if (response.statusCode != 200) return callback(response.statusCode, body)
            return callback(err, body)
          });
    },

    uploadData: function (rows, datasetId, dataKey, filename, callback) {
      var self = this;
      if (!filename) filename = datasetId + "_" + dataKey + ".csv";
      CSV.stringify(rows, {header: true}, function (err, csv) {
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
     * @param callback
     */
    getData: function (datasetId, dataKey, callback) {
      var url = PROTOBI_API_URL + "/api/v3/dataset/" + datasetId + "/data/" + dataKey + "/csv";
      url += "?apiKey=" + PROTOBI_API_KEY;

      var self = this;
      self.downloadCsv(url, {gzip: true}, function (err, csv) {
        CSV.parse(csv, {header: true, columns:true}, function (err, rows) {
          if (err) return callback(err);
          return callback(err, rows)
        })
      })
    },

    removeProxy: function () {
      delete process.env.http_proxy; //process.env.FIXIE_URL;  // per http://stackoverflow.com/a/36085330/645715
    }
  }
}

ProtobiAPI.Elements = Elements;
module.exports = ProtobiAPI
