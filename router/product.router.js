const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductController,
  deactivateProduct,
  deactivateProductController,
  reactivateProductController,
  getProductById,
} = require("../controller/product.controller");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multer");
const productValidator = require("../middleware/RequestMiddleware/product.middleware");

const router = express.Router();

router.get("/", getAllProduct);

router.get("/:id", getProductById);

router.post(
  "/create",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("profilePicture"),
  productValidator,
  createProductController
);

router.put(
  "/update/:id",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("profilePicture"),
  productValidator,
  updateProduct
);

router.patch("/deactivate/:id", authenticateToken, authorizeRole("admin"), deactivateProductController);

router.patch("/reactivate/:id", authenticateToken, authorizeRole("admin"), reactivateProductController);

module.exports = router; //
