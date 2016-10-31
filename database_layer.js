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
    db.serialize(function () {
        db.run("UPDATE Accounts SET password = '" + credentials.password +"' WHERE username = '" + credentials.username + "'", function (err, row) {
            if(err) {
                cb(err);
                return;
            }
            if(this.changes === 0) {
                cb(err);
            }
            return res.status(200).json();
        });
    });
}

module.exports = {
    addUser: addUser,
    getUser: getUser,
    updateUser: updateUser,
}