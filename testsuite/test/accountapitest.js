var expect    = require("chai").expect;
var request = require("request");
var database = require("../database_layer");

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
        request({
            url: url,
            headers: {
                'Authorization': "admin"
            }}, 
            function(error, response, body) {
            database.getAllVideos((err, res) => {
                console.log(err);
                console.log("inside");
                console.log(res);
                console.log(body);
                expect(JSON.parse(body)).to.deep.equal(res);
                done();
            });
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
