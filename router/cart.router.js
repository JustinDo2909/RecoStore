const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { addToCart, getCart, deleteCart, updateCart } = require("../controller/cart.controller");

const router = express.Router();

router.get("/", authenticateToken,getCart);
router.post("/add", authenticateToken,addToCart);
router.put("/update", authenticateToken, updateCart);
router.delete("/delete", authenticateToken, deleteCart);

module.exports = router;
