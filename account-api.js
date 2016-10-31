//Account Service: handles signup, login and anything to do with access. Stores usernames and passwords (and nothing else)

const express = require("express");
const app = express();
const uuid = require("node-uuid");
const dbLayer = require("./database_layer");
const auth = require("./authorization");
var bodyParser = require('body-parser');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());

var file = "./rutube.db";
var db = new sqlite3.Database(file);

const adminToken = "admin";

//TODO add admin token to these functions


/**
 * Post - create user return token - No authorization required
 * Username must be unique
 * Returns a token which must be used as credentials to use other functions on the api
 * Returns token if creating user was successful
 */
app.post("/", (req, res) => {
    
    if(req.body.username === undefined || req.body.password === undefined) {
        return res.status(412).send("Username and password must be defined in the body of the request.");
    }

    var credentials = {
        username: req.body.username,
        password: req.body.password 
    }
    
    dbLayer.addUser(credentials, (err, dbrs) => {
        if(err) {
            if(err.errno === undefined) {
                return res.status(412).send(err);
            } else {
                return res.status(412).send("Username already exists, please choose another username");
            }
        } else {
            return res.status(200).json(dbrs);
        } 
    });
});

/** 
 * Get - Login token - No authorization required
 * Retrieves login token for a given username and password, both must be defined in as parameters in the url
 * Returns token if password and username is correct
*/
app.get("/", (req, res) => {

    if(req.query.username === undefined || req.query.password === undefined) {
        return res.status(412).send("Username and password must be defined in the parameters of the request.");
    } 

    var credentials = {
        username: req.query.username,
        password: req.query.password
    };
    
    auth.getToken(credentials, (err, dbrs) => {
        if(err) {
            if(err.authError === undefined) {
                return res.status(412).send(err.err);
            } else {
                return res.status(412).send(err.authError);
            }
        } else {
            return res.status(200).json(dbrs);
        }
    });
});

/**
 * Update - Updates password for user - No authorization required but username and password must be correct
 * Must specify username, oldpassword and newpassword in the body of the request
 * return the login token for the user if successful
 */
app.put("/", (req, res) => {
 
    if(req.body.username === undefined || req.body.newpassword === undefined || req.body.oldpassword === undefined) {
        return res.status(412).send("Username and both passwords must be defined in the body of the request.");
    }

    var username = req.body.username;
    var newPassword = req.body.newpassword;
    var oldPassword = req.body.oldpassword;

    var credentials = {
        username: username,
        password: oldPassword
    }
    auth.getToken(credentials, (authErr, authSuccess) => {
        if(authErr) {
            return res.status(401).send(authErr.authError);
        } else {
            console.log(authSuccess);
            credentials.password = newPassword;
            dbLayer.updatePassword( credentials, (err, dbrs) => {
                if(err) {
                    if(err.userNotFound === undefined)
                        return res.status(500).json(err.err);
                    else
                        return res.status(404).json(err.userNotFound);
                } else {
                    return res.status(200).json(authSuccess);
                }
            });
        }
    });
});

/**
 * Delete - deletes the user - authorization admin or correct username and password
 * The username and password must be given in the request body or logged in as admin
 * Returns status code 204 if successful
 */
app.delete("/", (req, res) => {

    //if the 
    if(req.headers.authorization === undefined) {
        if(req.body.username === undefined || req.body.password === undefined) {
            return res.status(412).send("Username and password must be defined in the body of the request.");
        }
        
        var credentials = {
            username: req.body.username,
            password: req.body.password
        }

        auth.getToken(credentials, (authErr, authSuccess) => {
            if(authErr) {
                return res.status(401).send(authErr.authError);
            } else {
                console.log(authSuccess);
                dbLayer.deleteUser( credentials.username, (err, dbrs) => {
                    if(err) {
                        if(err.userNotFound === undefined)
                            return res.status(500).json(err.err);
                        else
                            return res.status(404).json(err.userNotFound);
                    } else {
                        return res.status(204).json(dbrs);
                    }
                });
            }
        });

    } else {
        if(req.body.username === undefined) {
            return res.status(412).send("Username must be defined in the body of the request.");
        }

        auth.authenticateAdmin(req.headers.authorization, (err, dbrs) => {
            dbLayer.deleteUser( req.body.username, (err, dbrs) => {
                if(err) {
                    return res.status(401).send("You are not an admin you cannot access this function.");
                } else {
                    return res.status(204).json(dbrs);
                }
            });
        })
    }

    
});

module.exports = app;

