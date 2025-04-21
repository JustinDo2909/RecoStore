const category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { createProductService, updateProductService } = require("../services/product.Services");
const { cloudinary } = require("../utils/cloudinary");
const { getDataUri } = require("../utils/datauri");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({
        message: "can not take all product",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product list",
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({
      message: "Không có ID sản phẩm",
      success: false,
    });
  }
  try {
    const products = await Product.findById(id);
    if (!products) {
      return res.status(404).json({
        message: "Không thể tìm thấy sản phẩm",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Danh sách sản phẩm",
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy sản phẩm",
      success: false,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    console.log("userId", req.user.id);

    const userId = req.user.id;

    const updatedProduct = await updateProductService(id, productData, userId, req.file);

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Lỗi máy chủ, vui lòng thử lại",
      success: false,
    });
  }
};

const deactivateProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Vui lòng cung cấp lý do vô hiệu hóa",
        success: false,
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
        success: false,
      });
    }

    if (product.isActive === false) {
      return res.status(400).json({
        message: "Sản phẩm này đã bị vô hiệu hóa rồi",
        success: false,
      });
    }

    product.isActive = false;
    product.deactivationReason = reason;

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Sản phẩm đã được vô hiệu hóa thành công",
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi vô hiệu hóa sản phẩm",
      success: false,
    });
  }
};

const reactivateProductController = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
        success: false,
      });
    }

    if (product.isActive === true) {
      return res.status(400).json({
        message: "Sản phẩm này đã hoạt động rồi",
        success: false,
      });
    }

    product.isActive = true;
    product.deactivationReason = "";
    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Sản phẩm đã được khôi phục thành công",
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi khôi phục sản phẩm",
      success: false,
    });
  }
};

const createProductController = async (req, res) => {
  try {
    const productData = req.body;
    const product = await createProductService(productData, req.file);

    return res.status(200).json({
      message: "Sản phẩm đã được thêm thành công",
      data: product,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Thêm sản phẩm thất bại",
      success: false,
    });
  }
};

module.exports = {
  getAllProduct,
  createProductController,
  deactivateProductController,
  updateProduct,
  reactivateProductController,
  getProductById,
};
