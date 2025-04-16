const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const cartItems = await Order.find({ userId });

    if (!cartItems.length) {
      return res
        .status(404)
        .json({ success: false, message: "Không có order" });
    }

    return res.json({ success: true, data: cartItems, message: "Order" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const cartItems = await Order.find({});

    if (!cartItems.length) {
      return res
        .status(404)
        .json({ success: false, message: "Không có order" });
    }

    return res.json({ success: true, data: cartItems, message: "Order" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

const addOrder = async (req, res) => {
  const userId = req.user.id;
  const statusOrder = "Shipping";
  const { paymentMethod, statusPayment } = req.body;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User không tồn tại", success: false });
    }

    const cartItems = await Cart.find({ userId }).populate({
      path: "productId",
      select: "price name",
    });

    console.log("Cart Items:", cartItems);

    if (!cartItems.length) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng trống", success: false });
    }

    let totalPrice = 0;
    const items = [];

    for (const item of cartItems) {
      if (!item.productId || typeof item.productId.price !== "number") {
        console.log("Lỗi sản phẩm:", item);
        return res
          .status(400)
          .json({ message: "Sản phẩm không hợp lệ", success: false });
      }

      totalPrice += item.productId.price * item.quantity;
      items.push({ productId: item.productId._id, quantity: item.quantity });
    }

    console.log("Items trước khi tạo đơn hàng:", items);
    console.log("Tổng tiền:", totalPrice);

    const order = new Order({
      userId,
      items,
      totalPrice,
      paymentMethod,
      statusPayment,
      statusOrder,
    });

    await order.save();

    await Cart.deleteMany({ userId });

    return res.status(200).json({
      message: "Đặt hàng thành công",
      data: order,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", success: false, error: error.message });
  }
};
const updatStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusOrder } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    order.statusOrder = statusOrder;
    await order.save();
    return res
      .status(200)
      .json({ message: "Update status order successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false, error: error.message });
  }
};

module.exports = { addOrder, getAllOrder, getOrder , updatStatusOrder};
