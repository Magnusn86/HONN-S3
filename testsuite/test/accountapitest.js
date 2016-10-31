var expect    = require("chai").expect;
var request = require("request");
var database = require("../database_layer");

describe(" Api test", function() {

    describe("Video Api", function() {

        var url = "http://localhost:5000/videos";

        it("User not authorized, returns status 401", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        });

    it("Returns a list of videos and status code 200", function(done) {
        request({
            url: url,
            headers: {
                'Authorization': "admin"
            }}, 
            function(error, response, body) {
            database.getAllVideos((err, res) => {
                expect(JSON.parse(body)).to.deep.equal(res);
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    it("Returns a list of videos in a given channel 4 and status code 200", function(done) {
        request({
            url: "http://localhost:5000/videos/channel/4",
            headers: {
                'Authorization': "admin"
            }}, 
            function(error, response, body) {
            database.getVideosByChannel(4, (err, res) => {
                expect(JSON.parse(body)).to.deep.equal(res);
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    it("Add a video to a channel returns status code 204", function(done) {
        //insertVideoReturnId
        request.post({
            url: "http://localhost:5000/videos/channel/4",
            headers: {
                'Authorization': "admin"
            },
            json: {
                field1: 'data',
                field2: 'data'
            }}, 
            function(error, response, body) {
            database.(4, (err, res) => {
                expect(JSON.parse(body)).to.deep.equal(res);
                expect(response.statusCode).to.equal(200);
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
