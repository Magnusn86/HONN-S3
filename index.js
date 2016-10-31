const express = require("express");
const app = express();
//REST api's
const userApi = require("./user-api");
const accountApi = require("./account-api");
const videoApi = require("./video-api");
//Database initialization
const database = require("./databaseInit");
//Port that we user
const port = 5000;

//Initialize the database
database.databaseInitialization();

app.listen(port, function() {
    console.log("Web server started on port: " + port);
});

database.closeDatabase();

app.use('/users', userApi);
app.use('/accounts', accountApi);
app.use('/videos', videoApi);

module.exports = app;
