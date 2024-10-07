const express = require("express");
const {
  getAllPage,
  getPage,
  addPage,
  updatePage,
  deletePage,
  getPageSlug,
} = require("../controller/Page");
const pageRouter = express.Router();
pageRouter.get("/", getAllPage);
pageRouter.get("/:id", getPage);
pageRouter.get("/slug/:id", getPageSlug);
pageRouter.post("/", addPage);
pageRouter.patch("/:id", updatePage);
pageRouter.delete("/:id", deletePage);

module.exports = pageRouter;
