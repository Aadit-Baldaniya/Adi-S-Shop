const express = require("express");
const {
  getAllCategory,
  getCategory,
  addCategory,
  patchCategory,
  deleteCategory,
} = require("../Controller/CategoryController");

const category = express.Router();

category.get("/", getAllCategory);
category.get("/:id", getCategory);
category.post("/", addCategory);
category.patch("/:id", patchCategory);
category.delete("/:id", deleteCategory);

module.exports = category;
