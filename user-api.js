//User Service: handles the user profile and account

//ATH alltaf token í request-i requesti

//Get favorite videos

//Get friends - return list of id's'


const express = require("express");
const app = express();
//const entities = require("./entities");
//const uuid = require("node-uuid");
var bodyParser = require('body-parser');

app.use(bodyParser.json());



module.exports = app;


//var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
//    stmt.run("Thing #" + rnd);
//stmt.finalize();


//db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
//    console.log(row.id + ": " + row.thing);
//  });