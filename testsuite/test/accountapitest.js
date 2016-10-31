var expect    = require("chai").expect;
var request = require("request");
var database = require("../database_layer");

describe(" Api test", function() {

    describe("Account Api", function() {

        var url = "http://localhost:5000/accounts";

        it("Create user and get authentication token with status code 201", function(done) {
            request.post({
                url: url,
                json: {
                    username: "Mocha User",
                    password: "Moooocha"
                }}, 
                function(error, response, body) {
                    expect(body).to.not.equal(undefined);
                    expect(response.statusCode).to.equal(201);
                    done();
            });
        });

        it("Create user with a username that already exitst and get status code 412", function(done) {
            request.post({
                url: url,
                json: {
                    username: "Mocha User",
                    password: "Moooocha"
                }}, 
                function(error, response, body) {
                    expect(body).to.not.equal(undefined);
                    expect(response.statusCode).to.equal(412);
                    done();
            });
        });

        it("Try to update user password with wrong password and returns status code 401", function(done) {
            request.put({
                url: url,
                json: {
                    username: "Mocha User",
                    oldpassword: "NOT Moooocha",
                    newpassword: "Moooocha?"
                }}, 
                function(error, response, body) {
                    expect(body).to.equal("Cannot authenticate user");
                    expect(response.statusCode).to.equal(401);
                    done();
            });
        });

        it("Try to update user password with right password and user and returns status code 200", function(done) {
            request.put({
                url: url,
                json: {
                    username: "Mocha User",
                    oldpassword: "Moooocha",
                    newpassword: "Moooocha?"
                }}, 
                function(error, response, body) {
                    expect(body).to.not.equal(undefined);
                    expect(response.statusCode).to.equal(200);
                    done();
            });
        });

        it("Try to delete user returns with wrong password and returns status code 401", function(done) {
            request.delete({
                url: url,
                json: {
                    username: "Mocha User",
                    password: "Moooocha"
                }}, 
                function(error, response, body) {
                    expect(body).to.not.equal(undefined);
                    expect(response.statusCode).to.equal(401);
                    done();
            });
        });

        it("Delete user and returns status code 204", function(done) {
            request.delete({
                url: url,
                headers: {
                    'Authorization': "admin"
                },
                json: {
                    username: "Mocha User",
                    password: "Moooocha?"
                }}, 
                function(error, response, body) {
                    expect(body).to.equal(undefined);
                    expect(response.statusCode).to.equal(204);
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
