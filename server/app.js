var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

var indexRouter = require("./routes/index");

const bodyParser = require("body-parser");
// var logger = require("./app/Logger2")
const logmeta = {
  service:"ServerAPI"
}
// logger = logger.GenerateHandler( logmeta)
// logger.info("============ API STARTED =============")
const cors = require("cors");
// return
// const Tools = require("./app/tools/Tools");
// Tools.setLoggerVal(logger)
// const db = require("./app/models");
// const loggerc = require("./app/Logger2");
// db.sequelize.sync();
// Tools.setDBVal(db)

const app = express();

var corsOptions = {
  // origin: "http://localhost:8081"
  // origin: "*"
};
app.use(express.json({limit: '6mb'}));
app.use(express.urlencoded({limit: '6mb'}));
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// const JPGStoreTasker = require("./app/Taskers/JPGStoreTasker");
// const JPGStoreTasker = require("./app/Taskers/JPGStoreTasker");

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.use("/", indexRouter);
app.get("/", (req, res) => {
  res.json({message: "Welcome to HouseFront API."});
});
// const PORT = 3000 || process.env.PORT || 8080;

module.exports = app;
