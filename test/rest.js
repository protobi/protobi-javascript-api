var request = require('request')
var CSV  = require('csv')
var ProtobiAPI = require('..')
var env = require('dotenv').config()
var assert = require('assert')

describe("Protobi API", function () {
  var PROTOBI_API_KEY = process.env.PROTOBI_API_KEY; // e.g. from https://app.protobi.com/account
  var PROTOBI_URL = process.env.PROTOBI_URL;  // e.g. 'https://app.protobi.com'
  var DATASET_ID = "5d76746016c61700035f2490"
  var DATA_KEY = "car_sales"

  var protobiApi = new ProtobiAPI(PROTOBI_URL, PROTOBI_API_KEY)

  function handle(err) {
    throw err;
  }

  it("gets data using node sdk", function (done) {


    protobiApi.getData(DATASET_ID, DATA_KEY, function (err, rows) {
      if (err) return handle(err)
      assert.equal(rows.length, 157, 'Number of rows')
      assert.equal(rows[0].manufact, 'Acura', "First row value")
      done()
    })
  })

  it("gets data using request.js", function (done) {
    
    var args = {
      type: 'GET',
      url: `${PROTOBI_URL}/api/v3/dataset/${DATASET_ID}/data/${DATA_KEY}/csv?apiKey=${PROTOBI_API_KEY}`,
      gzip: true,
      json: true
    }
    console.log(args)
    request(args,
        function (err, response, body) {
          if (err) return handle(err)
          assert.equal(response.statusCode, 200)
          CSV.parse(body, {columns:true, header:true}, function(err, rows) {
            assert.equal(rows.length, 157, 'Number of rows')
            assert.equal(rows[0].manufact, 'Acura', "First row value")
            done()
          })
        })
  })
})