const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    value: { type: Number, required: true },

    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },

    code: { type: String, unique: true, sparse: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
