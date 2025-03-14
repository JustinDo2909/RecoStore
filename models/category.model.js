const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, require: true, unique: true },
    decription: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
