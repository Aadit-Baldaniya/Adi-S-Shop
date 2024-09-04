const mongoose = require("mongoose");
require("dotenv").config();

function connectDb() {
  return mongoose.connect(process.env.MONGO_URL);
}

module.exports = connectDb;
