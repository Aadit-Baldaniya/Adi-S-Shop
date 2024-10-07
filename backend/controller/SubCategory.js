const SubCategoryModel = require("../model/SubCategory");
const path = require("path");
const fs = require("fs/promises");
const Product = require("../model/Product");
const { deleteSingleFile } = require("../common/allUtility.js/file");
const {
  status200,
  status500,
  status404,
  status400,
} = require("../common/allUtility.js/response");
const getAllSubCategory = async (req, res) => {
  try {
    const data = await SubCategoryModel.find().populate("categoryId");
    status200(res, data);
  } catch (error) {
    status500(res, error.message);
  }
};
const getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) {
      return status404(res, "SubCategory not found");
    }
    status200(res, subCategory);
  } catch (error) {
    status500(res, error.message);
  }
};
const getCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.find({
      categoryId: id,
    }).populate("categoryId");
    if (!subCategory) {
      return status404(res, "SubCategory not found");
    }
    status200(res, subCategory);
  } catch (error) {
    status500(res, error.message);
  }
};
const addSubCategory = async (req, res) => {
  try {
    const image = req.files.images;
    if (!image) {
      return status400(res, "Please upload an image");
    }
    const uniqueName = Date.now() + image.name;
    const filePath = path.join(
      __dirname,
      "../uplodeImages/subcategory",
      uniqueName
    );
    await image.mv(filePath);
    const data = await SubCategoryModel.create({
      ...req.body,
      images: `${process.env.BASE_NAME}/uplodeImages/subcategory/${uniqueName}`,
    });
    status200(res, data);
  } catch (error) {
    status500(res, error.message);
  }
};
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;
    const findId = await SubCategoryModel.findById(id);
    if (!findId) {
      return status404(res, "SubCategory not found");
    }
    if (req.files) {
      const image = req.files.images;
      const objPath = path.parse(findId.images).base;
      const readDir = await fs.readdir(
        path.join(__dirname, "../uplodeImages/subcategory")
      );
      if (readDir.includes(objPath)) {
        await fs.unlink(
          path.join(__dirname, "../uplodeImages/subcategory", objPath)
        );
      }
      const uniqueName = Date.now + "-" + image.name;
      const uploadPath = path.join(
        path.join(__dirname, "../uplodeImages/subcategory", uniqueName)
      );
      await image.mv(uploadPath);
      body = {
        ...req.body,
        images: `${process.env.BASE_NAME}/uplodeImages/subcategory/${uniqueName}`,
      };
    }
    const data = await SubCategoryModel.findByIdAndUpdate(id, body);
    status200(res, data);
  } catch (error) {
    status500(res, error.message);
  }
};
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await SubCategoryModel.findById(id);
    if (!findId) {
      return status400(res, "Id Not Found");
    }
    const subCategoryId = await Product.findOne({ subCategory: id });
    if (subCategoryId) {
      return status404(
        res,
        "Category is used in Product And SubCategry  First To Remove Data From Product and SubCategory Data"
      );
    }
    await deleteSingleFile(findId, "subcategory");
    await SubCategoryModel.findByIdAndDelete(id);
    status200(res, "id Deleted!");
  } catch (error) {
    status500(res, error.message);
  }
};

module.exports = {
  getSubCategory,
  getAllSubCategory,
  getCategoryId,
  updateSubCategory,
  addSubCategory,
  deleteSubCategory,
};
