const { checkPathDir } = require("../common/utility");
const Product = require("../model/Product");
const path = require("path");
const fs = require("fs/promises");
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate(["category", "subCategory"]);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addProduct = async (req, res) => {
  try {
    const { body, files } = req;

    if (!files.images || !Array.isArray(files.images)) {
      return res
        .status(400)
        .json({ success: false, message: "Please select minimum 2 Image" });
    }
    const checkPath = path.join(__dirname, "../uplodeImages/products");
    await checkPathDir(checkPath);
    const images = [];

    for (const image of files.images) {
      const uniqueName = Date.now() + "-" + image.name;
      const uplodeImages = path.join(checkPath, uniqueName);
      await image.mv(uplodeImages);
      images.push(
        `${process.env.BASE_NAME}/uplodeImages/products/${uniqueName}`
      );
    }
    const product = await Product.create({ ...body, images });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { body, files } = req;
    const { id } = req.params;
    const updateData = await Product.findById(id).populate([
      "category",
      "subCategory",
    ]);
    if (!updateData) {
      return res.status(404).json({ message: "Product Id Not Found" });
    }

    if (body.images && !Array.isArray(body.images)) {
      body.images = [body.images];
    }
    if (!body.price || !body.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    const checkPath = path.join(__dirname, "../uplodeImages/products");
    await checkPathDir(checkPath);
    const images = [];
    if (files?.images) {
      if (Array.isArray(files.images)) {
        for (const image of files.images) {
          const uniqueName = Date.now() + "-" + image.name;
          const uplodeImages = path.join(checkPath, uniqueName);
          await image.mv(uplodeImages);
          images.push(
            `${process.env.BASE_NAME}/uplodeImages/products/${uniqueName}`
          );
        }
      } else {
        const uniqueName = Date.now() + "-" + files.images.name;
        const uplodeImages = path.join(checkPath, uniqueName);
        await files.images.mv(uplodeImages);
        images.push(
          `${process.env.BASE_NAME}/uplodeImages/products/${uniqueName}`
        );
      }
    }
    const readDir = await fs.readdir(checkPath);
    if (body.images) {
      for (const image of updateData.images) {
        if (!body?.images.includes(image)) {
          const obj = path.parse(image).base;
          if (readDir.includes(obj)) {
            await fs.unlink(path.join(checkPath, obj));
          }
        }
      }
    }
    const updateId = await Product.findByIdAndUpdate(id, {
      ...body,
      images: [...images, ...(body.images ? body.images : [])],
    });
    res.status(200).json({ success: true, data: updateId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await Product.findById(id);
    if (!findId) {
      return res.status(404).json({ message: "Product not found" });
    }

    const readPath = path.join(__dirname, "../uplodeImages/products");
    const readDir = await fs.readdir(readPath);
    for (const value of findId.images) {
      const obj = path.parse(value).base;
      if (readDir.includes(obj)) {
        await fs.unlink(path.join(readPath, obj));
      }
    }
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, data: "Product Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProduct,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
