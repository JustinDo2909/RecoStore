const express = require("express");
const { getAllProduct, createProduct, updateProduct, deleteProduct } = require("../controller/product.controller");
const { authenticateToken } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.get("/", getAllProduct);
router.post("/create", authenticateToken, upload.single("profilePicture"), createProduct);
router.put("/update/:id", authenticateToken, updateProduct);
router.delete("/delete/:id", authenticateToken, deleteProduct);

module.exports = router; //
