const Cart = require("../models/cart.model");

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const cartItems = await Cart.find({ userId }).populate("productId");

    if (!cartItems.length) {
      return res
        .status(404)
        .json({ success: false, message: "Không có sản phẩm trong giỏ hàng" });
    }

    return res.json({ success: true, data: cartItems, message: "Giỏ hàng" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, action } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    let cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    if (action === "increase") {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else if (action === "decrease") {
      cartItem.quantity -= quantity;
      if (cartItem.quantity <= 0) {
        await Cart.deleteOne({ userId, productId });
        return res.json({
          success: true,
          message: "Product removed from cart",
        });
      } else {
        await cartItem.save();
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    return res.json({
      success: true,
      data: cartItem,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const cartItems = await Cart.deleteMany({ userId });

    return res.json({
      success: true,
      data: cartItems,
      message: "Da Xoa Giỏ hàng",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Danh sách sản phẩm không hợp lệ" });
    }

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await Cart.create({ userId, productId, quantity });
    }

    return res.json({
      success: true,
      message: "Sản phẩm đã thêm vào giỏ hàng",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

module.exports = { addToCart, getCart, deleteCart ,updateCart};
