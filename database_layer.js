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


const getFavoriteVideo = function(credentials , cb) {
    db.serialize(function () {
        db.get("SELECT UserID FROM Accounts Where token = '" + credentials.token + "'", function (err, row) {
            if(err)
                return cb(err);
            if(row === undefined) 
                return cb(err);

            var userID = row.UserID;

            db.all("SELECT * FROM Videos Where VideoID IN (SELECT u.VideoID FROM UserFavoriteVideos u WHERE u.UserID = " + userID + ")", function (err, rowV) {
                if(err)
                    return cb(err);
                if(row === undefined)
                    return cb(err);

                cb(null, rowV);
            });
        });
    });
}

const getUsersFriends = function(credentials , cb) {
    db.serialize(function () {
        db.get("SELECT UserID FROM Accounts Where token = '" + credentials.token + "'", function (err, row) {
            if(err)
                return cb(err);
            if(row === undefined) 
                return cb(err);

            var userID = row.UserID;

            db.all("SELECT UserFriendID FROM UserFriends Where UserID = '" + userID + "'", function (err, rowU) {
                if(err)
                    return cb(err);
                if(row === undefined)
                    return cb(err);
    
                cb(null, rowU);
            });
        });
    });
}



module.exports = {
    addUser: addUser,
    getUser: getUser,
    updateUser: updateUser,
    getFavoriteVideo: getFavoriteVideo,
    getUsersFriends: getUsersFriends,

}