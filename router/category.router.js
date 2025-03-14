const express = require("express");
const {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getOneCategory,
} = require("../controller/category.controller");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getAllCategory);
router.post("/create", authenticateToken, createCategory);
router.put("/update/:id", authenticateToken, updateCategory);
router.delete("/delete/:id", authenticateToken, deleteCategory);
router.route("/:id").get(authenticateToken, getOneCategory);

module.exports = router;
