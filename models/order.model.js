const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  feeShipping: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["QR", "Cash", "Stripe"],
    required: true,
  },
  statusPayment: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  statusOrder: {
    type: String,
    enum: ["Processing","Shipping", "Done", "Refund Approved", "Cancel", "Refund Requested", "Refund Rejected"],
    default: "Processing",
  },
  currentDiscount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
  createdAt: { type: Date, default: Date.now },
  finalPriceOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
