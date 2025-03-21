const mongoose = require("mongoose");
const db = {};
db.mongoose = mongoose;
db.user = require("./userModel")(mongoose);
db.board = require("./BoardModel")(mongoose);
db.team = require("./TeamModel")(mongoose); 

module.exports = db;  