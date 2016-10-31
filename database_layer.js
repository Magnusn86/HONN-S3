//Connects with the database and manipulates the data
const uuid = require("node-uuid");
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var file = "./rutube.db";
var db = new sqlite3.Database(file);

const passwordUpdated = "Password Successfully updated";
const userNotFound = "User Not Found";
const channelNotFound = "Channel does not exist";
const videoNotFound = "Video not found";

// Adds a user to the database with the given username(must be unique)
// Returns the login token for the user
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

// Updates password in the database for the given credentials = {username, password} password is the new password
// Returns the login token for the user
const updatePassword = function(credentials, cb) {
    db.serialize(function () {
        db.run("UPDATE Accounts SET password = '" + credentials.password +"' WHERE username = '" + credentials.username + "'", function (err, row) {
            var error = {
                err: err,
                userNotFound: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            if(this.changes === 0) {
                error.userNotFound = userNotFound;
                cb(error);
                return;
            }
            cb(null, passwordUpdated);
        });
    });
}

//Deletes user from the database with the given username
const deleteUser = function(username, cb) {

    db.serialize(function () { 
        db.run("DELETE FROM Accounts WHERE username = '" + username + "'", function (err, row) {
            var error = {
                err: err,
                userNotFound: undefined
            };
            if(err) {
                cb(error);
                return;
            } 
            if(this.changes === 0) {
                error.userNotFound = userNotFound;
                cb(error);
                return;
            }
            cb(null, row);
        });
    });
}

const getAllVideos = function(cb) {
    db.serialize(function () {
            db.all("SELECT * FROM Videos", function (err, row) {
                if(err) {
                    cb(err);
                    return;
                }
                cb(null,row);
            });
        });
}

const getVideosByChannel = function (channelId, cb) {

    db.serialize(function () {
        db.all("SELECT * FROM Videos WHERE videoID IN (SELECT c.videoid FROM ChannelVideos c WHERE c.ChannelID = " + channelID + ")", function (err, row) {
            var error = {
                err: err,
                channelNotFound: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            if(row === undefined || row.length === 0) {
                error.channelNotFound = channelNotFound;
                cb(error);
                return;
            }
            cb(null, row);
        });
    });
}

const getChannelById = function(channelId, cb) {

    db.serialize(function () {
        db.get("SELECT * FROM Channels Where channelID = '" + channelId + "'", function (err, row) {
            var error = {
                err: err,
                channelNotFound: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            if(row === undefined || row.length === 0) {
                error.channelNotFound = channelNotFound;
                cb(error);
                return;
            }
            cb(null, row);
        });
    });
}

const insertVideoReturnId = function(video, cb) {
    db.serialize(function () {
        db.run("INSERT INTO Videos (VideoID, Description, VideoURL) VALUES (NULL, '" + video.description + "','" + video.videoURL + "')", function (err, row) {
            var error = {
                err: err,
                couldNotAddVideo: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            var videoIDofInserted =  this.lastID;

            if(videoIDofInserted === undefined) {
                cb(error);
                return;
            }
            cb(null, videoIDofInserted);
        });
    });
}

const insertVideoToChannel = function(data, cb) {
    db.serialize(function () {
        db.run("INSERT INTO ChannelVideos (VideoID, ChannelId) VALUES (" + data.videoIDofInserted + "," + data.channelID + ")", function (err, row) {
            if(err) {
                console.log(err);
                cb(err);
                return;
            }
            cb(null, row);    
        });
    });
}

const deleteVideoFromChannelByVideoID = function(videoID, cb) {
    db.serialize(function () { 
        db.run("DELETE FROM ChannelVideos WHERE VideoID = '" + videoID + "'", function (err, row) {
            var error = {
                err: err,
                videoNotFound: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            if(this.changes === 0) {
                error.videoNotFound = videoNotFound;
                cb(error);
                return;
            }
            cb(null, row);
        });
    });
}

const deleteVideoById = function(videoID, cb) {
    db.serialize(function () { 
        db.run("DELETE FROM Videos WHERE VideoID = '" + videoID + "'", function (err, row) {
            var error = {
                err: err,
                videoNotFound: undefined
            };
            if(err) {
                cb(error);
                return;
            }
            if(this.changes === 0) {
                error.videoNotFound = videoNotFound;
                cb(error);
                return;
            }
            cb(null, row);
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
    updatePassword: updatePassword,
    deleteUser: deleteUser,
    getAllVideos: getAllVideos,
    getVideosByChannel: getVideosByChannel,
    getChannelById: getChannelById,
    insertVideoReturnId: insertVideoReturnId,
    insertVideoToChannel: insertVideoToChannel,
    deleteVideoFromChannelByVideoID: deleteVideoFromChannelByVideoID,
    deleteVideoById: deleteVideoById,
    getFavoriteVideo: getFavoriteVideo,
    getUsersFriends: getUsersFriends,
}