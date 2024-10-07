const express = require("express");
const {
  getAllSubCategory,
  getSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getCategoryId,
} = require("../controller/SubCategory");

const subCategory = express.Router();

subCategory.get("/", getAllSubCategory);
subCategory.get("/:id", getSubCategory);
subCategory.get("/category/:id", getCategoryId);
subCategory.post("/", addSubCategory);
subCategory.patch("/:id", updateSubCategory);
subCategory.delete("/:id", deleteSubCategory);

module.exports = subCategory;
