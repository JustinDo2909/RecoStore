const express = require("express");
const Wallet = require("../models/wallet.model");
const User = require("../models/user.model");

const getUserWithWalletController = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Token không hợp lệ", success: false });
    }

    const user = await User.findById(userId).select("-password -passwordConfirm");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng", success: false });
    }

    const wallet = await Wallet.findOne({ userId: user.id });
    const walletAmount = wallet ? wallet.amount : 0;

    return res.status(200).json({
      message: "Thông tin người dùng cùng số dư ví",
      success: true,
      data: {
        ...user.toObject(),
        wallet: walletAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server có lỗi", success: false });
  }
};

const payWithWalletController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Số tiền thanh toán không hợp lệ" });
    }

    // Tìm ví của user
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Không tìm thấy ví của user" });
    }

    if (wallet.amount < amount) {
      return res.status(400).json({ message: "Số dư trong ví không đủ để thanh toán" });
    }

    wallet.amount -= amount;
    await wallet.save();

    return res.status(200).json({
      message: "Thanh toán thành công bằng ví",
      data: wallet.amount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server khi thanh toán" });
  }
};

module.exports = { getUserWithWalletController, payWithWalletController };
