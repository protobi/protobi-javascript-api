# Protobi REST API for Node.js

This library provides helper functions for the Protobi REST API.
These also provide examples that can be adapted to other languages
that allow web calls, such as Python and R.


## Installation
`npm install github:protobi/protobi-node-sdk`


## Use
```js
var ProtobiAPI = require('./js/protobi-rest-api')

// example elements configuration
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


// example data
var data = [
   { fruit: "Apple", "color": "red",
     fruit: "Banana", "color": "yellow",
     fruit: "Cherry", "color": "red",
     fruit: "Date", "color": "brown"
   }
]


var PROTOBI_URL = "https://app.protobi.com"
var PROTOBI_API_KEY = "SECRET KEY" // @see https://app.protobi.com/account 
var PROTOBI_PROJECT_ID = "PROJECT ID" // create a project

protobiAPI.uploadElements(elements, PROTOBI_PROJECT_ID, function (err) {
  if (err) return callback(err);
  console.log("ELEMENTS uploaded")   
})
 
protobiAPI.uploadData(data, PROTOBI_PROJECT_ID, "main", null, function (err) {
  if (err) return callback(err);
  console.log("DATA uploaded")
})
```


## API



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
     * @param callback
     */
    getData: function (datasetId, dataKey, rows, filename, callback) {...},
    
    removeProxy:function() {...}
  }
}


