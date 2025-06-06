const Category = require("../models/category.model");
const mongoose = require("mongoose");

const getAllCategoryController = async (req, res) => {
  try {
    const Categorys = await Category.find({});
    if (!Categorys) {
      return res.status(404).json({
        message: "Không thể lấy danh sách danh mục",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Danh sách danh mục",
      data: Categorys,
      success: true,
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách danh mục:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh sách danh mục",
      success: false,
    });
  }
};

const getOneCategoryController = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(id).populate("products");
    if (!category) {
      return res.status(404).json({
        message: "Không thể lấy danh mục này",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Thông tin danh mục",
      data: category,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh mục",
      success: false,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("idCate", id);

    const { title, description, products } = req.body;
    const Cate = { title, description, products };

    console.log("care", Cate);

    const Categorys = await Category.findByIdAndUpdate(id, { $set: Cate }, { new: true });
    if (!Categorys) {
      return res.status(404).json({
        message: "Không thể cập nhật danh mục",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: Categorys,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình cập nhật danh mục",
      success: false,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Nguyên nhân vô hiệu hóa không được để trống",
        success: false,
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        isActive: false,
        reason: reason || "",
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục này",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Vô hiệu danh mục thành công",
      success: true,
    });
  } catch (error) {
    console.log("Lỗi khi xóa danh mục:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình xóa danh mục",
      success: false,
    });
  }
};

const createCategoryController = async (req, res) => {
  try {
    const { title, description, products } = req.body;

    // cjeck coi là có hợp lệ không
    if (Array.isArray(products) && products.every((p) => mongoose.Types.ObjectId.isValid(p))) {
      const Cate = { title, description, products };

      console.log(Cate);

      const Categorys = await Category.create(Cate);

      if (!Categorys) {
        return res.status(404).json({
          message: "Không thể thêm danh mục này.",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Thêm danh mục thành công!",
        data: Categorys,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ. Vui lòng đảm bảo tất cả giá trị là ObjectId hợp lệ.",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi hệ thống. Vui lòng thử lại sau.",
      success: false,
    });
  }
};

const enableCategoryController = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findByIdAndUpdate(id, {
      isActive: true,
      reason: "",
    });

    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục này",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Khôi phục danh mục thành công.",
      success: true,
    });
  } catch (error) {
    console.log("Lỗi khi xóa danh mục:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình xóa danh mục",
      success: false,
    });
  }
};

module.exports = {
  getAllCategoryController,
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
  getOneCategoryController,
  enableCategoryController,
};
