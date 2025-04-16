const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const {
  getAllOrder,
  addOrder,
  getOrder,
  updatStatusOrder,

} = require("../controller/order.controller");

const router = express.Router();

router.get("/", authenticateToken, getOrder);
router.get("/all", authenticateToken,authorizeRole('admin') ,  getAllOrder);
router.post("/create", authenticateToken, addOrder);
router.put("/updateStatus/:id", authenticateToken, updatStatusOrder);
// router.put("/update/:id", authenticateToken, updateOrder);
// router.delete("/delete/:id", authenticateToken, deleteOrderById);

module.exports = router;
