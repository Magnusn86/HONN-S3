//Video Service: handles video registration and meta-data updates

const express = require("express");
const app = express();
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());

var file = "./rutube.db";
var db = new sqlite3.Database(file);


//Get - list of all videos
app.get("/", (req, res) => {

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        auth = req.headers.authorization;
        db.serialize(function () {
            db.get("SELECT token FROM Accounts Where token = '" + auth + "'", function (err, row) {
                if(err)
                    return res.status(500).json();
                if(row === undefined) {
                    return res.status(401).send("Not authorized");
                }
            });
        });

        db.serialize(function () {
        db.all("SELECT * FROM Videos", function (err, row) {
            if(err)
                return res.status(500).json();
            return res.status(200).json(row);
        });
    });
    }
    
});

//get list of videos in given channel
app.get("/:id", (req, res) => {

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        auth = req.headers.authorization;
        db.serialize(function () {
            db.get("SELECT token FROM Accounts Where token = '" + auth + "'", function (err, row) {
                if(err)
                    return res.status(500).json();
                if(row === undefined) {
                    return res.status(401).send("Not authorized");
                }
            });
        });

        channelID = req.params.id;
        console.log(channelID);
        db.serialize(function () {
        db.all("SELECT * FROM Videos WHERE videoID IN (SELECT c.videoid FROM ChannelVideos c WHERE c.ChannelID = " + channelID + ")", function (err, row) {
            console.log(row);
            console.log(err);
            if(err) {
                console.log("error");
                return res.status(500).json();
            }
            if(row === undefined || row.length === 0) {
                return res.status(404).send("Channel does not exist");
            }
            console.log("row: " + row);
            return res.status(200).json(row);
        });
    });
    }
    
});

//Post - Add a video to channel
app.post("/Add", (req, res) => {
    

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {

        if(req.body.videoURL === undefined || req.body.ChannelID === undefined) {
            return res.status(412).send("VideoURL and ChannelID must be defined in the body of the request.");
        }
        var videoURL = req.body.videoURL;
        var channelID = req.body.ChannelID;
        var description;
        if(req.body.Description === undefined) {
            description = null;
        } else {
            description = req.body.Description;
        }
        
        //check if the authorization token is in the accounts database
        auth = req.headers.authorization;
        console.log("else "  + req.headers.authorization);
        db.serialize(function () {
            db.get("SELECT token FROM Accounts Where token = '" + auth + "'", function (err, row) {
                if(err)
                    return res.status(500).json();
                console.log(row);
                console.log(this);
                if(row === undefined) {
                    return res.status(401).send("Not authorized");
                }
            });
        });

        //check if channel exists in database
        db.serialize(function () {
            db.get("SELECT * FROM Channels Where channelID = '" + channelID + "'", function (err, row) {
                if(err)
                    return res.status(500).json();
                console.log("row check" + row);
                if(row === undefined) {
                    return res.status(404).send("Channel is not in the database");
                }
            });
        });

        var videoIDofInserted;
        db.serialize(function () {
            db.run("INSERT INTO Videos (VideoID, Description, VideoURL) VALUES (NULL, '" + description + "','" + videoURL + "')", function (err, row) {
                if(err) {
                    console.log(err);
                    return res.status(500).json();
                }
                console.log(videoIDofInserted);
                console.log(this.lastID);
                videoIDofInserted =  this.lastID;
                console.log(videoIDofInserted);

                if(videoIDofInserted === undefined) {
                    return res.status(412).send("Could not add video")
                }

                //Add the video tho the channel
                db.serialize(function () {
                    db.run("INSERT INTO ChannelVideos (VideoID, ChannelId) VALUES (" + videoIDofInserted + "," + channelID + ")", function (err, row) {
                        if(err) {
                            console.log(err);
                            return res.status(500).json();
                        }

                        return res.status(201).json();
                
                    });
                });
            });
        });
    }
});

//Delete  - Video
app.delete("/", (req, res) => {

    if(req.body.videoID === undefined) {
        return res.status(412).send("VideoID must be defined in the body of the request.");
    }

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        
        //check if the authorization token is in the accounts database
        auth = req.headers.authorization;
        db.serialize(function () {
            db.get("SELECT token FROM Accounts Where token = '" + auth + "'", function (err, row) {
                if(err)
                    return res.status(500).json();
                console.log(row);
                console.log(this);
                if(row === undefined) {
                    return res.status(401).send("Not authorized");
                }
            });
        });

        var videoID = req.body.videoID;
        //delete the video from the database
        db.serialize(function () { 
            db.run("DELETE FROM Videos WHERE VideoID = '" + videoID + "'", function (err, row) {
                if(err)
                    return res.status(500).json();

                if(this.changes === 0) {
                    return res.status(404).json();
                }
                return res.status(204).json(row);
            });
        });

        //delete the video from the channels
        db.serialize(function () { 
            db.run("DELETE FROM ChannelVideos WHERE VideoID = '" + videoID + "'", function (err, row) {
                if(err)
                    return res.status(500).json();

                if(this.changes === 0) {
                    return res.status(404).json();
                }
                return res.status(204).json(row);
            });
        });
    }
});

module.exports = app;

