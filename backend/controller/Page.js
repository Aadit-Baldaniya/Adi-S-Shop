const PageModle = require("../model/Page");
const fs = require("fs/promises");
const path = require("path");
const { checkPathDir } = require("../common/utility");
const {
  status200,
  status500,
  status404,
} = require("../common/allUtility.js/response");
const { error } = require("console");
const {
  addFile,
  updateFile,
  deleteFile,
} = require("../common/allUtility.js/file");
const getAllPage = async (req, res) => {
  try {
    const page = await PageModle.find();
    status200(res, page);
  } catch (error) {
    status500(res, error.message);
  }
};
const getPage = async (req, res) => {
  try {
    const id = req.params.id;
    const page = await PageModle.findById(id).populate("subCategories");
    if (!page) {
      return status404(res, "Page not found");
    }
    status200(res, page);
  } catch (error) {
    status500(res, error.message);
  }
};
const getPageSlug = async (req, res) => {
  try {
    const id = req.params.id;
    const page = await PageModle.findOne({ slug: id }).populate(
      "subCategories"
    );
    if (!page) {
      return status404(res, "Page not found");
    }
    status200(res, page);
  } catch (error) {
    status500(res, error.message);
  }
};
const addPage = async (req, res) => {
  addFile(req, res, "page", PageModle);
};
const updatePage = async (req, res) => {
  updateFile(req, res, "page", PageModle, "subCategories");
  // try {
  //   const { id } = req.params;
  //   const { files, body } = req;
  //   const pageId = PageModle.findById(id);
  //   console.log("pageId", pageId);
  //   if (!pageId) {
  //     return status404(res, "Page Is Not Found");
  //   }
  //   if (body.images || !Array.isArray(body.images)) {
  //     body.images = [body.images];
  //   }
  //   const image = [];
  //   if (files?.images) {
  //     if (Array.isArray(files.images)) {
  //       for (const file of files.images) {
  //         const uniqueName = Date.now() + "" + file.name;
  //         const uploadPath = path.join(
  //           __dirname,
  //           "../uplodeImages/page",
  //           uniqueName
  //         );
  //         await file.mv(uploadPath);
  //         image.push(
  //           `${process.env.BASE_NAME}/uplodeImages/page/${uniqueName}`
  //         );
  //       }
  //     } else {
  //       const uniqueName = Date.now() + "" + files.images.name;
  //       const uploadPath = path.join(
  //         __dirname,
  //         "../uplodeImages/page",
  //         uniqueName
  //       );
  //       await files.images.mv(uploadPath);
  //       image.push(`${process.env.BASE_NAME}/uplodeImages/page/${uniqueName}`);
  //     }
  //   }
  //   const chechPath = path.join(__dirname, "../uplodeImages/page");
  //   const readDir = fs.readdir(chechPath);
  //   if ((body.images = null)) {
  //     for (const image of pageId.images) {
  //       if (!body.images.includes(image)) {
  //         const obj = path.parse(image).base;
  //         if (readDir.includes(obj)) {
  //           const filePath = path.join(chechPath, obj);
  //           await fs.unlink(filePath);
  //         }
  //       }
  //     }
  //   }
  //   const updateId = await PageModle.findByIdAndUpdate(id, {
  //     ...body,
  //     images: [...image, ...(body.images ? body.images : [])],
  //   }).populate("subCategories");
  //   status200(res, updateId);
  // } catch (error) {
  //   status500(res, error.message);
  // }
};
const deletePage = async (req, res) => {
  deleteFile(req, res, PageModle, "page");
};

module.exports = {
  getAllPage,
  getPage,
  getPageSlug,
  addPage,
  updatePage,
  deletePage,
};
