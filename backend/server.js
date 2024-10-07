const express = require("express");
const connectDb = require("./db/connect");
const cors = require("cors");
const category = require("./Router/CategoriesRouter");
const fileUpload = require("express-fileupload");
const subCategory = require("./router/SubCategory");
const productsRouter = require("./router/productsRouter");
const pageRouter = require("./router/Page");
require("dotenv").config();
const srever = express();
srever.use("/uplodeImages", express.static("uplodeImages"));
srever.use(cors());
srever.use(express.json());
srever.use(fileUpload());
srever.use("/category", category);
srever.use("/subcategory", subCategory);
srever.use("/products", productsRouter);
srever.use("/page", pageRouter);
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
