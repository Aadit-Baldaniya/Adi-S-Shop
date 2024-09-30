const SubCategoryModel = require("../model/SubCategory");
const path = require("path");
const fs = require("fs/promises");
const Product = require("../model/Product");
const getAllSubCategory = async (req, res) => {
  try {
    const data = await SubCategoryModel.find().populate("categoryId");
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json({ success: true, data: subCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addSubCategory = async (req, res) => {
  try {
    const image = req.files.images;
    if (!image) {
      return res.status(400).json({ message: "Please upload an image" });
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
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;
    const findId = await SubCategoryModel.findById(id);
    if (!findId) {
      return res.status(404).json({ message: "SubCategory not found" });
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
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await SubCategoryModel.findById(id);
    if (!findId) {
      return res.status(404).json({ message: "Id Not Found" });
    }
    const subCategoryId = await Product.findOne({ subCategory: id });
    if (subCategoryId) {
      return res.status(400).json({
        success: false,
        msg: "Category is used in Product And SubCategry  First To Remove Data From Product and SubCategory Data",
      });
    }

    const objPath = path.parse(findId.images).base;
    const deleteImages = await fs.readdir(
      path.join(__dirname, "../uplodeImages/subcategory")
    );
    if (deleteImages.includes(objPath)) {
      await fs.unlink(
        path.join(__dirname, "../uplodeImages/subcategory", objPath)
      );
    }
    await SubCategoryModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, mes: "delete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubCategory,
  getAllSubCategory,
  updateSubCategory,
  addSubCategory,
  deleteSubCategory,
};
