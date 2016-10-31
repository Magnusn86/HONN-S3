//Video Service: handles video registration and meta-data updates

const express = require("express");
const app = express();
var bodyParser = require('body-parser');
const dbLayer = require("./database_layer");
const auth = require("./authorization");

app.use(bodyParser.json());

/**
 * Get - Gets a list of all videos - authorization user or admin
 * Returns a list of all videos if valid user or admin
 */
app.get("/", (req, res) => {

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        auth.authorizeUser(req.headers.authorization, (err, dbrs) => {
            if(err) {
                return res.status(401).send(err);
            } else {
                dbLayer.getAllVideos((err1, dbrs1) => {
                    if(err)
                        return res.status(500).json();
                    else
                        return res.status(200).json(dbrs1);
                });
            }
        });
    }
});
/**
 * Get - Gets a list of videos in given channel - Must be a user or admin
 * Returns a list of all videos in the given channel given by id in the URL
 */
app.get("/channel/:id", (req, res) => {

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        auth.authorizeUser(req.headers.authorization, (err, dbrs) => {
            if(err) {
                return res.status(401).send(err);
            } else {
                channelID = req.params.id;
                dbLayer.getVideosByChannel(channelID, (err1, dbrs1) => {
                    if(err) {
                        if(err1.channelNotFound === undefined) {
                            return res.status(500).json();
                        }
                        return res.status(404).json(err1.channelNotFound);
                    } else {
                        return res.status(200).json(dbrs1);
                    }
                });
            }
        });
    }    
});

/**
 * Post - Add a video to channel - must be a user or admin
 * Must have a correct Channel id in the URL as parameter and videoURL and description(optional) in the request body
 * Returns status code 201 if successful
 */ 
app.post("/channel/:id", (req, res) => {
    

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        auth.authorizeUser(req.headers.authorization, (err, dbrs) => {
            if(err) {
                return res.status(401).send(err);
            } else {
                if(req.body.videoURL === undefined || req.params.id === undefined) {
                    return res.status(412).send("VideoURL and ChannelID must be defined in the body of the request.");
                }
                var videoURL = req.body.videoURL;
                var channelID = req.params.id;
                var description;
                console.log(req.body.description);
                if(req.body.description === undefined) {
                    description = null;
                } else {
                    description = req.body.description;
                }  

                dbLayer.getChannelById(channelID, (err1, dbrs1) => {
                    if(err) {
                        if(err1.channelNotFound === undefined)
                            return res.status(500).json();
                        return res.status(404).json(err.channelNotFound);
                    } else {
                         var video = {
                            videoURL: videoURL,
                            description: description
                        };
                        dbLayer.insertVideoReturnId(video, (err2, dbrs2) => {
                            if(err){
                                return res.status(500).json();
                            } else {
                                var videoIDofInserted = dbrs2;
                                var data = {
                                    videoIDofInserted: videoIDofInserted,
                                    channelID: channelID
                                };
                                dbLayer.insertVideoToChannel(data, (err3, dbrs3) => {
                                    if(err3) {
                                        if(err3.couldNotAddVideo === undefined)
                                            return res.status(500).json(err.err);
                                        return res.status(412).json(err.couldNotAddVideo);
                                    } else {
                                        return res.status(201).json(dbrs3);
                                    }
                                });
                            }
                        })
                    }
                });
            }
        });
    }
});

/**
 * Delete - Video - must be user or admin to user this function
 * Must have the videoID in the body of the request.
 * Returns status code 204 if successful
 */
app.delete("/", (req, res) => {

    if(req.body.videoID === undefined) {
        return res.status(412).send("VideoID must be defined in the body of the request.");
    }

    if(req.headers.authorization === undefined) {
        return res.status(401).send("Not authorized!");
    } else {
        auth = req.headers.authorization;
        auth.authorizeUser(req.headers.authorization, (err, dbrs) => {
            if(err) {
                return res.status(401).send(err);
            } else {
                var videoID = req.body.videoID;
                dbLayer.deleteVideoById(videoID, (err1, dbrs1) => {
                    if(err1) {
                        if(err1.videoNotFound == undefined)
                            return res.status(500).send(err1.err);
                        else 
                            return res.status(404).send(err1.videoNotFound);
                    } else {
                        dbLayer.deleteVideoFromChannelByVideoID(videoID, (err2, dbrs2) => {
                            if(err2) {
                                if(err2.videoNotFound == undefined)
                                    return res.status(500).json(err2.err);
                                else 
                                    return res.status(404).send(err2.videoNotFound);
                            } else {
                                return res.status(204).json();
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = app;

