const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const {
  createRequest,
  updateRequest,
  deleteRequest,
  getAllRequest,
  getRequest,
} = require("../controller/request.controller");
const router = express.Router();

router.get("/", authenticateToken, getRequest);
router.get("/all", authenticateToken, authorizeRole('admin'),getAllRequest);
router.post("/create", authenticateToken, createRequest);
router.put("/update/:id", authenticateToken, authorizeRole('admin'), updateRequest);
router.delete("/delete/:id", authenticateToken,authorizeRole('admin'), deleteRequest);
router.put("/updateStatus/:id", authenticateToken, authorizeRole('admin'), updateRequest);

module.exports = router;
