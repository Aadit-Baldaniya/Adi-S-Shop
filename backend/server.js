const express = require("express");
const connectDb = require("./db/connect");
const cors = require("cors");
const category = require("./Router/CategoriesRouter");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const srever = express();
srever.use("/uplodeImages", express.static("uplodeImages"));
srever.use(cors());
srever.use(express.json());
srever.use(fileUpload());
srever.use("/category", category);
const start = async () => {
  try {
    await connectDb();
    console.log("Database Connect Successfully...");
    srever.listen(process.env.PORT, () => {
      console.log("Srever Listen Port No. 1800...");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
