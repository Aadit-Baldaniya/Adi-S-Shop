const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: () => {
      const date = new Date();
      return date;
    },
  },
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
