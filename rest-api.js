const app = express();
const entities = require("./entities");
//const uuid = require("node-uuid");
var bodyParser = require('body-parser');

app.use(bodyParser.json());



module.exports = app;
