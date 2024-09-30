const express = require("express");
const {
  getAllProduct,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productsCntroller");
const productsRouter = express.Router();

productsRouter.get("/", getAllProduct);
productsRouter.get("/:id", getProduct);
productsRouter.post("/", addProduct);
productsRouter.patch("/:id", updateProduct);
productsRouter.delete("/:id", deleteProduct);

module.exports = productsRouter;
