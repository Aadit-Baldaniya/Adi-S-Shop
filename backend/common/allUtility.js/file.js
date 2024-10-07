const path = require("path");
const fs = require("fs/promises");
const { checkPathDir } = require("../utility");
const { status200, status500, status400, status404 } = require("./response");
const Product = require("../../model/Product");

async function addFile(req, res, folderName, db) {
  try {
    const { body, files } = req;
    if (!files.images || !Array.isArray(files.images)) {
      return status400(res, "Please select minimum 2 Image");
    }
    const checkPath = path.join(__dirname, `../../uplodeImages/${folderName}`);
    await checkPathDir(checkPath);
    const images = [];
    for (const image of files.images) {
      const uniqueName = Date.now() + "-" + image.name;
      const uplodeImages = path.join(checkPath, uniqueName);
      await image.mv(uplodeImages);
      images.push(
        `${process.env.BASE_NAME}/uplodeImages/${folderName}/${uniqueName}`
      );
    }
    const product = await db.create({ ...body, images });
    status200(res, product);
  } catch (error) {
    status500(res, error.message);
  }
}
async function updateFile(req, res, folderName, db, populate) {
  try {
    const { body, files } = req;
    const { id } = req.params;

    const updateData = await db.findById(id);
    if (!updateData) {
      return status404(res, "Product Id Not Found");
    }

    if (body.images && !Array.isArray(body.images)) {
      body.images = [body.images];
    }
    // if (!body.price || !body.quantity) {
    //   return status400(res, "Please fill all fields");
    // }
    const checkPath = path.join(__dirname, `../../uplodeImages/${folderName}`);
    await checkPathDir(checkPath);
    const images = [];
    if (files?.images) {
      if (Array.isArray(files.images)) {
        for (const image of files.images) {
          const uniqueName = Date.now() + "-" + image.name;
          const uplodeImages = path.join(checkPath, uniqueName);
          await image.mv(uplodeImages);
          images.push(
            `${process.env.BASE_NAME}/uplodeImages/${folderName}/${uniqueName}`
          );
        }
      } else {
        const uniqueName = Date.now() + "-" + files.images.name;
        const uplodeImages = path.join(checkPath, uniqueName);
        await files.images.mv(uplodeImages);
        images.push(
          `${process.env.BASE_NAME}/uplodeImages/${folderName}/${uniqueName}`
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
    const updateId = await db.findByIdAndUpdate(id, {
      ...body,
      images: [...images, ...(body.images ? body.images : [])],
    });
    status200(res, updateId);
  } catch (error) {
    status500(res, error.message);
  }
}
async function deleteFile(req, res, db, folderName) {
  try {
    const { id } = req.params;
    const findId = await db.findById(id);
    if (!findId) {
      return status404(res, "Product not found");
    }

    const readPath = path.join(__dirname, `../../uplodeImages/${folderName}`);
    const readDir = await fs.readdir(readPath);
    for (const value of findId.images) {
      const obj = path.parse(value).base;
      if (readDir.includes(obj)) {
        await fs.unlink(path.join(readPath, obj));
      }
    }
    await db.findByIdAndDelete(id);
    status200(res, "Product Deleted Successfully!");
  } catch (error) {
    status500(res, error.message);
  }
}
async function deleteSingleFile(data, folderName) {
  const objPath = path.parse(data.images).base;
  const deleteImages = await fs.readdir(
    path.join(__dirname, `../../uplodeImages/${folderName}`)
  );
  if (deleteImages.includes(objPath)) {
    await fs.unlink(
      path.join(__dirname, `../../uplodeImages/${folderName}`, objPath)
    );
  }
}
module.exports = { addFile, updateFile, deleteFile, deleteSingleFile };
