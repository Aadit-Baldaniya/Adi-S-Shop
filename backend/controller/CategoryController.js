const Category = require("../model/Category");
const path = require("path");
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
    res.json({ success: true, data: "Patch" });
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
    await Category.findByIdAndDelete(id);
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
