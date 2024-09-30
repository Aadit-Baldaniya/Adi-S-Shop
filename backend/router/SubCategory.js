const express = require("express");
const {
  getAllSubCategory,
  getSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/SubCategory");

const subCategory = express.Router();

subCategory.get("/", getAllSubCategory);
subCategory.get("/:id", getSubCategory);
subCategory.post("/", addSubCategory);
subCategory.patch("/:id", updateSubCategory);
subCategory.delete("/:id", deleteSubCategory);

module.exports = subCategory;
