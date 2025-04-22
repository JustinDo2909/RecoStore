const mongoose = require("mongoose");
const discountService = require("../services/discount.Services");
const Product = require("../models/product.model");
const Discount = require("../models/discount.model");
const { calculateFinalPrice } = require("../utils/utils");

const getDiscountController = async (req, res) => {
  try {
    const data = await discountService.getAllDiscount(req);

    return res.status(200).json({ message: "Lấy danh sách mã thành công", success: true, data: data });
  } catch (error) {
    console.log(error);
  }
};

const getDiscountByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await discountService.getDiscountById(id);

    return res.status(200).json({ message: "Lấy mã thành công", success: true, data: data });
  } catch (error) {
    console.log(error);
  }
};

const createDiscountController = async (req, res) => {
  try {
    const result = await discountService.createDiscount(req);

    return res.status(200).json({
      message: "Tạo mã giảm giá thành công",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Tạo mã giảm giá thất bại",
      success: false,
    });
  }
};

const updateDiscountController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await discountService.updateDiscount(id, req);

    return res.status(200).json({
      message: "Cập nhật mã giảm giá thành công",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Tạo mã giảm giá thất bại",
      success: false,
    });
  }
};

const deactivateDiscountController = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log("reason", reason);

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Bạn phải cung cấp lý do đình chỉ",
        success: false,
      });
    }
    const result = await discountService.deactivateDiscount(id, reason);

    return res.status(200).json({
      message: "Đã đình chỉ thành công mã khuyến mãi",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Tạo mã giảm giá thất bại",
      success: false,
    });
  }
};

const activateDiscountController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await discountService.activateDiscount(id, req);

    return res.status(200).json({
      message: "Mã khuyến mãi đã hoạt động trở lại",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Tạo mã giảm giá thất bại",
      success: false,
    });
  }
};

const updateDiscountForProductController = async (req, res) => {
  const { productId, discountId } = req.body;

  if (!productId || !discountId) {
    return res.status(400).json({
      message: "Thiếu thông tin sản phẩm hoặc mã giảm giá",
      success: false,
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    const discount = await Discount.findById(discountId);
    if (!discount || !discount.isActive) {
      return res.status(404).json({
        message: "Mã giảm giá không hợp lệ hoặc đã hết hạn",
        success: false,
      });
    }

    product.currentDiscount = discountId;

    if (!discount.applicableProducts.includes(productId)) {
      discount.applicableProducts.push(productId);
      await discount.save();
    }
    const finalPrice = await calculateFinalPrice(product.price, discountId);
    product.finalPrice = finalPrice;
    await product.save();

    return res.status(200).json({
      message: "Cập nhật giảm giá thành công",
      success: true,
      data: {
        productId: product._id,
        finalPrice,
        currentDiscount: discountId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật giảm giá sản phẩm",
      success: false,
    });
  }
};

const removeDiscountForProductController = async (req, res) => {
  const { productId, discountId } = req.body;

  if (!productId || !discountId) {
    return res.status(400).json({
      message: "Thiếu thông tin sản phẩm hoặc mã giảm giá",
      success: false,
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    if (product.currentDiscount && product.currentDiscount.toString() !== discountId) {
      return res.status(400).json({
        message: "Mã giảm giá không đúng với sản phẩm",
        success: false,
      });
    }

    product.currentDiscount = null;
    const finalPrice = await calculateFinalPrice(product.price);
    product.finalPrice = finalPrice;
    await product.save();

    const discount = await Discount.findById(discountId);
    if (!discount) {
      return res.status(404).json({
        message: "Mã giảm giá không tồn tại",
        success: false,
      });
    }

    const productIndex = discount.applicableProducts.indexOf(productId);
    if (productIndex !== -1) {
      discount.applicableProducts.splice(productIndex, 1);
      await discount.save();
    }

    return res.status(200).json({
      message: "Đã bỏ mã giảm giá khỏi sản phẩm",
      success: true,
      data: {
        productId: product._id,
        finalPrice,
        currentDiscount: null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi bỏ mã giảm giá khỏi sản phẩm",
      success: false,
    });
  }
};

module.exports = {
  getDiscountController,
  getDiscountByIdController,
  createDiscountController,
  updateDiscountController,
  deactivateDiscountController,
  activateDiscountController,
  updateDiscountForProductController,
  removeDiscountForProductController,
};
