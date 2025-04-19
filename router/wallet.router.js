const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { getWallet } = require("../controller/wallet.controller");

const router = express.Router();

router.get("/", authenticateToken, getWallet);

module.exports = router;
