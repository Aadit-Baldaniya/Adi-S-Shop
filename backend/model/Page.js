const mongoose = require("mongoose");
const pagesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    minLength: 10,
  },
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        if (!Array.isArray(value) || value.length === 0) {
          return false;
        }
        return true;
      },
    },
    required: true,
  },
  date: {
    type: Date,
    default: () => {
      const date = new Date();
      return date;
    },
  },
  subCategories: { type: [mongoose.Types.ObjectId], ref: "SubCategory" },
});
const PageModle = mongoose.model("Page", pagesSchema);
module.exports = PageModle;
