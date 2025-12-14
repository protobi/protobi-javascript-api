var CSV  = require('csv')
var ProtobiAPI = require('..')
var env = require('dotenv').config()
var assert = require('assert')

describe("Protobi API", function () {
  var PROTOBI_API_KEY = process.env.PROTOBI_API_KEY; // e.g. from https://app.protobi.com/account
  var PROTOBI_URL = process.env.PROTOBI_URL;  // e.g. 'https://app.protobi.com'
  var DATASET_ID = process.env.PROTOBI_DATASET_ID || "6925fbd91ce9830fdb840901"
  var DATA_KEY = process.env.PROTOBI_TABLE_KEY || "main"

  var protobiApi = new ProtobiAPI(PROTOBI_URL, PROTOBI_API_KEY)

  function handle(err) {
    throw err;
  }

  it("gets data using node sdk", function (done) {


    protobiApi.getData(DATASET_ID, DATA_KEY, function (err, rows) {
      if (err) return handle(err)
      assert(Array.isArray(rows), 'Should return array of rows')
      assert(rows.length > 0, 'Should have at least one row')
      console.log(`Retrieved ${rows.length} rows from ${DATA_KEY}`)
      if (rows.length > 0) {
        console.log('First row keys:', Object.keys(rows[0]))
      }
      done()
    })
  })

  it("gets elements from dataset", function (done) {
    protobiApi.getElements(DATASET_ID, function (err, elements) {
      if (err) return handle(err)
      assert(Array.isArray(elements), 'Should return array of elements')
      console.log(`Retrieved ${elements.length} elements`)
      if (elements.length > 0) {
        console.log('First element:', elements[0].key)
      }
      done()
    })
  })

  it("uploads data array as CSV", function (done) {
    var testData = [
      { id: 1, name: 'Test 1', value: 100 },
      { id: 2, name: 'Test 2', value: 200 }
    ]
    var testKey = 'test_upload_' + Date.now()

    protobiApi.uploadData(testData, DATASET_ID, testKey, 'test.csv', function (err, result) {
      if (err) return handle(err)
      console.log('Upload result:', result)
      done()
    })
  })
})