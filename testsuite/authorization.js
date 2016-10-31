// Connects to the database and authenticates users 
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var file = "../rutube.db";
var db = new sqlite3.Database(file);

const adminToken = "admin";
const authMissing = "Authentication header missing";
const authError = "Cannot authenticate user";
const authSuccess = "User authenticated";
const authAdmin = "Admin authenticated";

const authorizeUser = function(auth, cb) {

    //console.log(auth);
    if(auth === adminToken) {
        //console.log("Logged in as admin");
        cb(null, authSuccess);
        return;
    } else if ( auth === undefined ){
        cb(authMissing);
        return;
    } else {
        db.serialize(function () {
            db.get("SELECT token FROM Accounts Where token = '" + auth + "'", function (dberr, dbrow) {
                if(dberr) {
                    cb(dberr);
                    return;
                }
                if(dbrow === undefined) {
                    //console.log("Could not find login token in database");
                    cb(authError);
                    return;
                } else {
                    cb(null, authSuccess);
                }
            });
        });
    }
}


const getToken = function(auth, cb) {
    //console.log(auth);
    db.serialize(function () {
        db.get("SELECT token FROM Accounts Where username = '" + auth.username + "' and password = '" + auth.password + "'", function (err, row) {
            var error = {
                err: err,
                authError: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            //console.log(this.lastID);
            if(row === undefined) {
                error.authError = authError;
                cb(error);
                return;
            }
            cb(null, row);
        });
    });
}

const authenticateAdmin = function(auth, cb) {
    if(auth === adminToken) {
        cb(null, authenticateAdmin);
        return;
    } else {
        cb(authError);
        return;
    }
}
const getUserToken = function(auth, cb) {
    db.serialize(function () {
        db.get("SELECT UserID FROM Accounts Where token = '" + auth.token + "'", function (err, row) {
            var error = {
                err: err,
                authError: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            if(row === undefined) {
                error.authError = authError;
                cb(error);
                return;
            }
            cb(null, row);
        });
    });
}

module.exports = {
    getToken: getToken,
    getUserToken : getUserToken,
    authorizeUser: authorizeUser,
    authenticateAdmin: authenticateAdmin,
}