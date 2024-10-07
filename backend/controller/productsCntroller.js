const { checkPathDir } = require("../common/utility");
const Product = require("../model/Product");
const path = require("path");
const fs = require("fs/promises");
const {
  status200,
  status500,
  status404,
} = require("../common/allUtility.js/response");
const {
  addFile,
  updateFile,
  deleteFile,
} = require("../common/allUtility.js/file");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate(["category", "subCategory"]);
    status200(res, products);
  } catch (error) {
    status500(res, error.message);
  }
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate([
      "category",
      "subCategory",
    ]);
    if (!product) {
      return status404(res, "Product not found");
    }
    status200(res, product);
  } catch (error) {
    status500(res, error.message);
  }
};
const addProduct = async (req, res) => {
  addFile(req, res, "products", Product);
};
const updateProduct = async (req, res) => {
  updateFile(req, res, "products", Product);
};
const deleteProduct = async (req, res) => {
  deleteFile(req, res, Product, "products");
};

module.exports = {
  getAllProduct,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
