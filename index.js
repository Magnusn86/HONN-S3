const express = require("express");
const app = express();
const userApi = require("./user-api");
const port = 4000;



var fs = require("fs");
var file = "./rutube.db";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    if(!exists) {
        console.log("creating databases");
        db.run('CREATE TABLE `Accounts` (' +
        '`UserID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
        '`Username` VARCHAR(50) NOT NULL UNIQUE,' +
        '`Password` VARCHAR(50) NOT NULL,' +
        '`Token` VARCHAR(50) NOT NULL);');

        db.run("CREATE TABLE `Videos`" +
        "(`VideoID`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,"+ 
        "`Description`	TEXT);");

        db.run('CREATE TABLE `UserFavoriteVideos` (' +
        '`UserID` INTEGER NOT NULL,' +
        '`VideoID` INTEGER NOT NULL,' +
        'FOREIGN KEY(VideoID) REFERENCES Videos(VideoID),' +
        'FOREIGN KEY(UserID) REFERENCES Accounts(UserID));');

        db.run('CREATE TABLE `UserFriends` (' +
        '`UserID` INTEGER NOT NULL,' +
        '`VideoID` VARCHAR(50) NOT NULL UNIQUE,' +
        'FOREIGN KEY(VideoID) REFERENCES Videos(VideoID));');

        db.run('CREATE TABLE `Channels` (' +
        '`ChannelID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
        '`Description` TEXT,' +
        '`OwnerID` INTEGER NOT NULL,' +
        'FOREIGN KEY(OwnerID) REFERENCES Accounts(UserID));');

        db.run('CREATE TABLE `ChannelVideos` (' +
        '`VideoID` INTEGER NOT NULL,' +
        '`ChannelID` INTEGER NOT NULL,' +
        'FOREIGN KEY(VideoID) REFERENCES Videos(VideoID),' +
        'FOREIGN KEY(ChannelID) REFERENCES Channels(ChannelID));');
    }

});

db.close();


app.use('/user-api', userApi);
