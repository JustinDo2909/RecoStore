const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getWallet,
  getUserWithWallet,
  payWithWalletController,
  getUserWithWalletController,
} = require("../controller/wallet.controller");

const router = express.Router();

router.get("/", authenticateToken, getUserWithWalletController);

router.get("/pay", authenticateToken, payWithWalletController);

module.exports = router;
