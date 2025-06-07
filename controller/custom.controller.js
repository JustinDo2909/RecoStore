const Custom = require("../models/custom.model");
const User = require("../models/user.model");

const getAllCustomController = async (req, res) => {
  try {
    const customs = await Custom.find({});
    if (!customs) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách custom",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Danh sách custom",
      data: customs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình lấy danh sách dịch vụ",
      success: false,
    });
  }
};

const createCustomController = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "Thiếu ID người dùng",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
        success: false,
      });
    }

    const customeData = {
      user: user._id,
      ...req.body,
    };

    const custom = await customService(customeData, req.file);

    return res.status(200).json({
      message: "Sản phẩm đã được thêm thành công",
      data: custom,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return res.status(400).json({
      message: error.message || "Thêm sản phẩm thất bại",
      success: false,
    });
  }
};

module.exports = {
  getAllCustomController,

  createCustomController,
};
