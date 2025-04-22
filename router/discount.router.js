const express = require("express");
const {
  getDiscountController,
  createDiscountController,
  updateDiscountController,
  deactivateDiscountController,
  reactivateDiscountController,
  activateDiscountController,
  getDiscountByIdController,
  updateDiscountForProductController,
  removeDiscountForProductController,
} = require("../controller/discount.controller");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const { validateDiscount } = require("../middleware/RequestMiddleware/discount.middleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRole("admin"), getDiscountController);

router.get("/:id", authenticateToken, authorizeRole("admin"), getDiscountByIdController);

router.post("/create", authenticateToken, authorizeRole("admin"), validateDiscount, createDiscountController);

router.put("/update/:id", authenticateToken, authorizeRole("admin"), validateDiscount, updateDiscountController);

// xóa mềm
router.patch("/deactivate/:id", authenticateToken, authorizeRole("admin"), deactivateDiscountController);

router.patch("/activate/:id", authenticateToken, authorizeRole("admin"), activateDiscountController);

// cậpk nhạt mã sản phẩmphẩm
router.patch("/discountProduct", authenticateToken, authorizeRole("admin"), updateDiscountForProductController);

router.patch(
  "/removeDiscountFromProduct",
  authenticateToken,
  authorizeRole("admin"),
  removeDiscountForProductController
);

module.exports = router;
