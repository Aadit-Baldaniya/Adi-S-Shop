const mongoose = require("mongoose");

const subCategory = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  images: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  date: {
    type: Date,
    default: () => {
      const date = new Date();
      return date;
    },
  },
});

const SubCategoryModel = mongoose.model("SubCategory", subCategory);

module.exports = SubCategoryModel;
