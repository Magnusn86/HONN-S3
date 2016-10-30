const mongoose = require("mongoose");
const app = express();
const api = require("./rest-api");
const port = 4000;


app.use('/rest-api', api);

mongoose.connect("localhost/punchapi");
mongoose.connection.once("open", () => {
    console.log("Connected to database!");
    app.listen(port, function() {
        console.log("Web server started on port: " + port);
    });
});  
