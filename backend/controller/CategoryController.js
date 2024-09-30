const Category = require("../model/Category");
const path = require("path");
const fs = require("fs/promises");
const { log } = require("console");
const Product = require("../model/Product");
const SubCategoryModel = require("../model/SubCategory");
const getAllCategory = async (req, res) => {
  try {
    const data = await Category.find();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, msg: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const addCategory = async (req, res) => {
  try {
    const image = req.files.images;
    if (!image) {
      return res
        .status(404)
        .json({ success: false, msg: "Image Is Reqiured!" });
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
    res.json({ success: true, data: data });
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
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
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
    res.json({ success: true, data: findByIdAndupdate });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Category.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }
    const categoryId = await Product.findOne({ category: id });
    const subCategoryId = await SubCategoryModel.findOne({ categoryId: id });

    if (categoryId || subCategoryId) {
      return res.status(400).json({
        success: false,
        msg: "Category is used in Product And SubCategry  First To Remove Data From Product and SubCategory Data",
      });
    }

    const fileBaseName = path.parse(data.images).base;
    const filePath = await fs.readdir(
      path.join(__dirname, "../uplodeImages/category")
    );
    if (filePath.includes(fileBaseName)) {
      await fs.unlink(
        path.join(__dirname, "../uplodeImages/category", fileBaseName)
      );
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, msg: "category Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
module.exports = {
  getAllCategory,
  getCategory,
  addCategory,
  patchCategory,
  deleteCategory,
};
