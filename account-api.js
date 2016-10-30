//Account Service: handles signup, login and anything to do with access. Stores usernames and passwords (and nothing else)

const express = require("express");
const app = express();
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());

var file = "./rutube.db";
var db = new sqlite3.Database(file);

const adminToken = "admin";

//TODO add admin token to these functions



//Post - create user return token -- uuid token
app.post("/create", (req, res) => {

    if(req.headers.authorization !== adminToken) {
        return res.status(401).send("Not authorized!");
    } else {
    
        if(req.body.username === undefined || req.body.password === undefined) {
            return res.status(412).send("Username and password must be defined in the body of the request.");
        }

        var username = req.body.username;
        var password = req.body.password;

        var token = uuid.v4();
        db.serialize(function () {
            db.run("INSERT INTO Accounts (UserID, Username, Password, Token) VALUES (NULL, '" + username + "','" + password + "','" + token + "')", function (err, row) {
                if(err) {
                    console.log(err);
                    if(err.errno === 19)
                        return res.status(412).send("Username already exists in database");
                    return res.status(500).json(err);
                }
                return res.status(201).json(token);
            });
        });
    }
});

//Get - með user og pass í body - skilar uuid token
app.get("/", (req, res) => {

    if(req.query.username === undefined || req.query.password === undefined) {
        return res.status(412).send("Username and password must be defined in the parameters of the request.");
    } 

    var username = req.query.username;
    var password = req.query.password;

    db.serialize(function () {
        db.get("SELECT token FROM Accounts Where username = '" + username + "' and password = '" + password + "'", function (err, row) {
            if(err)
                return res.status(500).json();

            if(row === undefined) {
                return res.status(404).json();
            }
            return res.status(200).json(row);
        });
    });
});

//Update - með user og pass old og new í body
app.put("/", (req, res) => {

    if(req.body.username === undefined || req.body.password === undefined) {
        return res.status(412).send("Username and password must be defined in the body of the request.");
    }

    var username = req.body.username;
    var newPassword = req.body.password;

    db.serialize(function () {
        db.run("UPDATE Accounts SET password = '" + newPassword +"' WHERE username = '" + username + "'", function (err, row) {
            if(err)
                return res.status(500).json();

            if(this.changes === 0) {
                return res.status(404).json();
            }
            return res.status(200).json();
        });
    });
});

//Delete user with given username in the body of the request
app.delete("/", (req, res) => {

    if(req.body.username === undefined) {
        return res.status(412).send("Username and password must be defined in the body of the request.");
    }

    var username = req.body.username;

    db.serialize(function () { 
        db.run("DELETE FROM Accounts WHERE username = '" + username + "'", function (err, row) {
            if(err)
                return res.status(500).json();

            if(this.changes === 0) {
                return res.status(404).json();
            }
            return res.status(204).json(row);
        });
    });
});

module.exports = app;

