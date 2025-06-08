const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const cartItems = await Order.find({ userId });

    if (!cartItems.length) {
      return res.status(404).json({ success: false, message: "Không có order" });
    }

    return res.json({ success: true, data: cartItems, message: "Order" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const cartItems = await Order.find({});

    if (!cartItems.length) {
      return res.status(404).json({ success: false, message: "Không có order" });
    }

    return res.json({ success: true, data: cartItems, message: "Order" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

const addOrder = async (req, res) => {
  const userId = req.user.id;
  const statusOrder = "Processing";
  const { paymentMethod, statusPayment, feeShipping } = req.body;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại", success: false });
    }

    const cartItems = await Cart.find({ userId }).populate({
      path: "productId",
      select: "price name",
    });

    console.log("Cart Items:", cartItems);

    if (!cartItems.length) {
      return res.status(400).json({ message: "Giỏ hàng trống", success: false });
    }

    let totalPrice = 0;
    const items = [];

    for (const item of cartItems) {
      if (!item.productId || typeof item.productId.price !== "number") {
        console.log("Lỗi sản phẩm:", item);
        return res.status(400).json({ message: "Sản phẩm không hợp lệ", success: false });
      }

      totalPrice += item.productId.price * item.quantity + feeShipping;
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
      feeShipping,
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
    return res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};

//
const addOrderForOne = async (req, res) => {
  const userId = req.user.id;
  const statusOrder = "Processing";
  const { paymentMethod, statusPayment, feeShipping = 0, items } = req.body;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại", success: false });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không được rỗng", success: false });
    }

    const normalizedItems = items.map((item) => {
      if (typeof item === "string") return { productId: item, quantity: 1 };
      return item;
    });

    const productIds = normalizedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Có sản phẩm không tồn tại", success: false });
    }

    let totalPrice = 0;
    const validItems = [];

    for (const item of normalizedItems) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm với id ${item.productId} không tồn tại`, success: false });
      }

      const quantity = Number(item.quantity);
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: `Số lượng sản phẩm ${item.productId} không hợp lệ`, success: false });
      }

      const pricePerUnit = product.finalPrice || product.price || 0;
      totalPrice += pricePerUnit * quantity;

      validItems.push({ productId: product._id, quantity });
    }

    totalPrice += feeShipping;

    const order = new Order({
      userId,
      items: validItems,
      totalPrice,
      paymentMethod,
      statusPayment,
      statusOrder,
      feeShipping,
      finalPriceOrder: totalPrice,
    });

    const savedOrder = await order.save();
    console.log("Order đã lưu vào DB:", savedOrder);

    // Xóa giỏ hàng người dùng sau khi đặt hàng
    await Cart.deleteMany({ userId });

    return res.status(200).json({
      message: "Đặt hàng thành công",
      data: order,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};

const updatStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusOrder, reason } = req.body;

    if (statusOrder === "Cancel" && (!reason || reason.trim() === "")) {
      return res.status(400).json({
        message: "Phải cung cấp lý do khi hủy đơn hàng",
        success: false,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tìm thấy", success: false });
    }

    order.statusOrder = statusOrder;

    if (statusOrder === "Cancel") {
      order.reason = reason;
    } else {
      order.reason = "";
    }

    await order.save();

    return res.status(200).json({ message: "Cập nhật thành công", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

const getTopSellingProductsController = async (req, res) => {
  try {
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $sort: { totalSold: -1 },
      },

      {
        $project: {
          _id: 0,
          productId: "$_id",
          totalSold: 1,
          productName: "$productInfo.name",
          productPrice: "$productInfo.price",
          productImage: "$productInfo.picture",
          stock: "$productInfo.stock",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: topSellingProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm bán chạy nhất",
    });
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findOne({ _id: orderId })
      .populate({
        path: "items.productId",
        select: "name description price rating location picture stock categories currentDiscount finalPrice",
        populate: {
          path: "categories currentDiscount",
          select: "name code discountPercent",
        },
      })
      .populate({
        path: "currentDiscount",
        select: "code discountPercent",
      });

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại", success: false });
    }

    const itemsWithDetails = order.items.map((item) => {
      const product = item.productId;
      return {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        rating: product.rating,
        location: product.location,
        picture: product.picture,
        stock: product.stock,
        categories: product.categories,
        currentDiscount: product.currentDiscount,
        finalPrice: product.finalPrice,
        quantity: item.quantity,
        totalItemPrice: product.finalPrice * item.quantity,
      };
    });

    return res.status(200).json({
      message: "Lấy đơn hàng thành công",
      data: {
        ...order.toObject(),
        items: itemsWithDetails,
      },
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo ID:", error);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};

module.exports = {
  addOrder,
  getAllOrder,
  getOrder,
  updatStatusOrder,
  getTopSellingProductsController,
  getOrderById,
  addOrderForOne,
};
