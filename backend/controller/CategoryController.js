const Category = require("../model/Category");
const path = require("path");
const fs = require("fs/promises");
const { log } = require("console");
const Product = require("../model/Product");
const SubCategoryModel = require("../model/SubCategory");
const { deleteSingleFile } = require("../common/allUtility.js/file");
const {
  status200,
  status500,
  status404,
} = require("../common/allUtility.js/response");
const getAllCategory = async (req, res) => {
  try {
    const data = await Category.find();
    status200(res, data);
  } catch (error) {
    status500(res, error.message);
  }
};
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      status404(res, "Category not found");
    }
    status200(res, category);
  } catch (error) {
    status500(res, error.message);
  }
};
const addCategory = async (req, res) => {
  try {
    const image = req.files.images;
    if (!image) {
      return status404(res, "Image Is Reqiured!");
    }
    const uniqueName = Date.now() + "-" + image.name;
    const uploadPath = path.join(
      __dirname,
      "../uplodeImages/category",
      uniqueName
    );
    await image.mv(uploadPath);
    const data = await Category.create({
      ...req.body,
      images: `${process.env.BASE_NAME}/uplodeImages/category/${uniqueName}`,
    });
    status200(res, data);
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const patchCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;
    const category = await Category.findById(id);

    if (!category) {
      return status404(res, "Category not found");
    }

    if (req.files) {
      const image = req.files.images;
      const objData = path.parse(category.images).base;
      const filesInCategories = await fs.readdir(
        path.join(__dirname, "../uplodeImages/category")
      );
      if (filesInCategories.includes(objData)) {
        await fs.unlink(
          path.join(__dirname, "../uplodeImages/category", objData)
        );
      }
      const uniqueName = Date.now() + "-" + image.name;
      const uploadPath = path.join(
        __dirname,
        "../uplodeImages/category",
        uniqueName
      );
      await image.mv(uploadPath);
      body = {
        ...req.body,
        images: `${BASE_NAME}/uplodeImages/category/${uniqueName}`,
      };
    }
    const findByIdAndupdate = await Category.findByIdAndUpdate(id, body);
    status200(res, findByIdAndupdate);
  } catch (error) {
    status500(res, error.message);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Category.findById(id);
    if (!data) {
      return status404(res, "Category Not Found");
    }
    const categoryId = await Product.findOne({ category: id });
    const subCategoryId = await SubCategoryModel.findOne({ categoryId: id });

    if (categoryId || subCategoryId) {
      return status404(
        res,
        "Category is used in Product And SubCategry  First To Remove Data From Product and SubCategory Data"
      );
    }
    await deleteSingleFile(data, "category");
    await Category.findByIdAndDelete(id);
    status200(res, "category Deleted");
  } catch (error) {
    status500(res, error.message);
  }
};
module.exports = {
  getAllCategory,
  getCategory,
  addCategory,
  patchCategory,
  deleteCategory,
};
