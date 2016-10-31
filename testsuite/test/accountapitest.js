var expect    = require("chai").expect;
var request = require("request");

describe("Videos Api test", function() {

  describe("User not authorized", function() {

    var url = "http://localhost:5000/videos";

    it("returns status 401", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      });
    });

    it("Returns a list of videos", function(done) {

    var options = {
        url: "http://localhost:5000/videos",
        headers: {
            'Authorization': 'admin'
        }
    };
 
    function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
    }
    }
 
    request(options, callback);
    
    });

  });

  describe("Hex to RGB conversion", function() {
    var url = "http://localhost:3000/hexToRgb?hex=00ff00";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns the color in RGB", function(done) {
      request(url, function(error, response, body) {
        expect(body).to.equal("[0,255,0]");
        done();
      });
    });
  });

});


/*
request.post is for POST request.
request.put is for PUT request.
request.delete is for DELETE request.
request.post is for GET request.
request.patch is for PATCH request.

request({
    url: 'https://modulus.io/contact/demo', //URL to hit
    qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
    headers: {
        'Content-Type': 'MyContentType',
        'Custom-Header': 'Custom Value'
    },
    body: 'Hello Hello! String body!' //Set the body as a string
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});



request({
    url: 'https://modulus.io/contact/demo', //URL to hit
    qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
    //Lets post the following key/values as form
    json: {
        field1: 'data',
        field2: 'data'
    }
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
}
});


*/
