//Account Service: handles signup, login and anything to do with access. Stores usernames and passwords (and nothing else)


//Get - með user og pass í body - skilar uuid token

//Update - með user og pass old og new í body - skilar uuid token

//Delete user

const express = require("express");
const app = express();
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());

var file = "./rutube.db";
var db = new sqlite3.Database(file);

//Post - create user return token -- uuid token
app.post("/create", (req, res) => {

    var exists = fs.existsSync(file);
    if(!exists) {
        return res.status(404).json();
    }

    if(req.body.username === undefined || req.body.password === undefined) {
        return res.status(412).send("Username and password must be defined in the body of the request.");
    }

    var username = req.body.username;
    var password = req.body.password;

    var token = uuid.v4();
  
  
    var stmt = db.prepare("INSERT INTO Accounts VALUES(NULL,?,?,?)");
    stmt.run(username, password, token); 
    stmt.finalize();

    return res.status(201).json(token);


});

//Get - með user og pass í body - skilar uuid token
app.get("/", (req, res) => {

    var exists = fs.existsSync(file);
    if(!exists) {
        return res.status(404).json();
    }

    if(req.query.username === undefined || req.query.password === undefined) {
        return res.status(412).send("Username and password must be defined in the body of the request.");
    } 

    var username = req.query.username;
    var password = req.query.password;

    var token;
    
    /*db.serialize(function () {
        db.each("SELECT username, password, token FROM Accounts", function (err, row) {
            console.log(row);
            console.log(row.token);
            token = row;
            if(row.username === username && row.password) {
                console.log("found");
            }
        });
    });*/

    var stmt = db.prepare("Select token from Accounts Where username = (?) and password = (?)");
    token = stmt.run(username, password); 
    stmt.finalize();


    if(token === undefined) {
        return res.status(404).json(token);
    } 
    return res.status(200).json(token);

});

module.exports = app;

//var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
//    stmt.run("Thing #" + rnd);
//stmt.finalize();
