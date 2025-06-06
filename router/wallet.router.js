const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { getWallet, getUserWithWallet } = require("../controller/wallet.controller");

const router = express.Router();

router.get("/", authenticateToken, getUserWithWallet);

module.exports = router;
