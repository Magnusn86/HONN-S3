//User Service: handles the user profile and account

//ATH alltaf token í request-i requesti

const express = require("express");
const app = express();
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
const dbLayer = require("./database_layer");
const auth = require("./authorization");
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());

var file = "./rutube.db";
var db = new sqlite3.Database(file);

//Get favorite videos
app.get("/favorite", (req, res) => {

	if(req.headers.authorization === undefined){
		return res.status(401).send("Not Authorized");
	}

	var credentials = {
        token: req.headers.authorization
    };

	auth.getUserToken(credentials, (err, dbrs) => {
        if(err) {
            if(err.authError === undefined)
                return res.status(412).send(err.err);
            else
                return res.status(412).send(err.authError);
        } else {
        	dbLayer.getFavoriteVideo(credentials, (err, dbrs) => {
        		if(err)
        			return res.status(500).json()

        		return res.status(200).json(dbrs);
        	});
        }
    });
});

//Get friends - return list of id's'
app.get("/friends", (req, res) => {

	if(req.headers.authorization === undefined){
		return res.status(401).send("Not Authorized");
	}

    var credentials = {
        token: req.headers.authorization
    };

    auth.getUserToken(credentials, (err, dbrs) => {
        if(err) {
            if(err.authError === undefined)
                return res.status(412).send(err.err);
            else
                return res.status(412).send(err.authError);
        } else {
        	dbLayer.getUsersFriends(credentials, (err, dbrs) => {
        		if(err)
        			return res.status(500).json()
        		
        		return res.status(200).json(dbrs);
        	});
        }
    });
});
module.exports = app;

