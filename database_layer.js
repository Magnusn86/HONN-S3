const uuid = require("node-uuid");
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var file = "./rutube.db";
var db = new sqlite3.Database(file);

const addUser = function(credentials, cb) {

    var username = credentials.username;
    var password = credentials.password;
    var token = uuid.v4();

    db.serialize(function () {
            db.run("INSERT INTO Accounts (UserID, Username, Password, Token) VALUES (NULL, '" 
                    + username + "','" + password + "','" + token + "')", function (err, row) {
                if(err) {
                    console.log(err);
                    cb(err);
                    return;
                }
                console.log(row);
                cb(null, token);
            });
        });
}

const getUser = function(credentials, cb) {
    return;
}

const updateUser = function(credentials, cd) {
    
}

module.exports = {
    addUser: addUser,
    getUser: getUser,
}