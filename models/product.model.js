const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    decription: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number },
    location: { type: String },
    picture: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    categorys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    editby: {
      type: String,
    },
    
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
