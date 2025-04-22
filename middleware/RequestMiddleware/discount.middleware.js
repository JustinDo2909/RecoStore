const { body, validationResult } = require("express-validator");
const Discount = require("../../models/discount.model");

const validateDiscount = [
  body("name").notEmpty().withMessage("Tên là bắt buộc"),
  body("description").optional().isString(),
  body("discountType").optional().isIn(["percentage", "fixed"]).withMessage("Loại giảm giá không hợp lệ"),
  body("value").isFloat({ gt: 0 }).withMessage("Giá trị giảm giá phải lớn hơn 0"),
  body("applicableProducts").optional().isArray().withMessage("Danh sách sản phẩm không hợp lệ"),
  body("applicableProducts.*").optional().isMongoId().withMessage("ID sản phẩm không hợp lệ"),
  body("startDate").isISO8601().withMessage("Ngày bắt đầu không hợp lệ"),
  body("endDate").isISO8601().withMessage("Ngày kết thúc không hợp lệ"),
  body("isActive").optional().isBoolean(),
  body("code")
    .optional()
    .matches(/^[a-zA-Z0-9\-]+$/)
    .isLength({ min: 3, max: 20 })
    .withMessage("Mã code không hợp lệ"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        details: errors.array().map((e) => e.msg),
        success: false,
      });
    }

    const { startDate, endDate, code } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
        success: false,
      });
    }

    if (code) {
      const exists = await Discount.findOne({ code });
      if (exists) {
        return res.status(400).json({
          message: "Mã giảm giá đã tồn tại",
          success: false,
        });
      }
    }

    next();
  },
];

module.exports = { validateDiscount };
