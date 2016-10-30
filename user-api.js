//User Service: handles the user profile and account

//ATH alltaf token í request-i requesti

const express = require("express");
const app = express();
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
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
	else{
		var token = req.headers.authorization;

	    db.serialize(function () {
	        db.get("SELECT UserID FROM Accounts Where token = '" + token + "'", function (err, row) {
	            if(err)
	                return res.status(500).json();
	            if(row === undefined) {
	                return res.status(404).json();
	            }
	            var userID = row.UserID;

	            db.all("SELECT * FROM Videos Where VideoID IN (SELECT u.VideoID FROM UserFavoriteVideos u WHERE u.UserID = " + userID + ")", function (err, rowV) {
	            	if(err)
	            		return res.status(500).json();
	            	if(row === undefined){
	            		return res.status(404).json();
	            	}
	            	return res.status(200).json(rowV);
	            });
	        });
	    });
    }
});

//Get friends - return list of id's'
app.get("/friends", (req, res) => {

    var exists = fs.existsSync(file);
    if(!exists) {
        return res.status(404).json();
    }

    if(req.headers.authorization === undefined){
		return res.status(401).send("Not Authorized");
	}
	else{
		var token = req.headers.authorization;

	    db.serialize(function () {
	        db.get("SELECT UserID FROM Accounts Where token = '" + token + "'", function (err, row) {
	            if(err)
	                return res.status(500).json();
	            if(row === undefined) {
	                return res.status(404).json();
	            }
	            var userID = row.UserID;

	            db.all("SELECT UserFriendID FROM UserFriends Where UserID = '" + userID + "'", function (err, rowU) {
	            	if(err)
	            		return res.status(500).json();
	            	if(row === undefined){
	            		return res.status(404).json();
	            	}
	            	return res.status(200).json(rowU);
	            });
	        });
	    });
    }
});
module.exports = app;

