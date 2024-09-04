const mongoose = require("mongoose");

const product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 300,
  },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 100 },
  desc: { type: String, required: true, minLength: 200, maxLength: 2500 },
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
  },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  numberOfReviews: {
    type: Number,
    min: 0,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  taxPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  shippingFee: {
    type: Number,
    min: 0,
    default: 0,
  },
  qty: {
    type: Number,
    // validate: {
    //   validator: function (value) {
    //     if (value.length >= 1) {
    //       return true;
    //     }
    //     return false;
    //   },
    // },
    min: 0,
    default: 0,
  },
  // word: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
  subCategory: {
    type: mongoose.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
});

const Product = mongoose.model("product", product);

module.exports = Product;
