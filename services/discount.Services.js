const Discount = require("../models/discount.model");
const User = require("../models/user.model");
const getAllDiscount = (req) => {
  try {
    const list = Discount.find({});

    if (!list) {
      return res.status(404).json({
        message: "Không được danh sách khuyến mãi",
        success: false,
      });
    }
    return list;
  } catch (error) {
    throw new Error(error);
  }
};

const getDiscountById = async (id) => {
  try {
    const discount = await Discount.findById({ _id: id });

    console.log("discount", discount);

    if (!discount) {
      return res.status(404).json({
        message: "Không được danh sách khuyến mãi",
        success: false,
      });
    }
    return discount;
  } catch (error) {
    throw new Error(error);
  }
};

const createDiscount = async (req, res) => {
  const { name, description, discountType, value, applicableProducts, startDate, endDate, code } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tìm thấy",
        success: false,
      });
    }
    const newDiscount = new Discount({
      name,
      description,
      discountType,
      value,
      applicableProducts,
      startDate,
      endDate,
      code,
      createdBy: user.username,
    });
    await Discount.create(newDiscount);

    return newDiscount;
  } catch (error) {
    throw new Error(error);
  }
};

const updateDiscount = async (id, req, res) => {
  const { name, description, discountType, value, applicableProducts, startDate, endDate, code } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tìm thấy",
        success: false,
      });
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      {
        name,
        description,
        discountType,
        value,
        applicableProducts,
        startDate,
        endDate,
        code,
        editBy: user.username,
      },
      { new: true }
    );

    if (!updatedDiscount) {
      return res.status(404).json({
        message: "Giảm giá không tồn tại",
        success: false,
      });
    }

    return updatedDiscount;
  } catch (error) {
    console.log(error);
  }
};

const deactivateDiscount = async (id, reason) => {
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      throw new Error("Không tìm thấy khuyến mãi");
    }

    discount.isActive = false;
    discount.reason = reason;

    await discount.save();
    return discount;
  } catch (error) {
    throw new Error(error.message || "Đã xảy ra lỗi khi đình chỉ khuyến mãi");
  }
};

const activateDiscount = async (id, res) => {
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({
        message: "Không tìm thấy khuyến mãi",
        success: false,
      });
    }

    discount.isActive = true;
    discount.reason = null;
    await discount.save();
    return discount;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllDiscount,
  createDiscount,
  updateDiscount,
  deactivateDiscount,
  activateDiscount,
  getDiscountById,
};
