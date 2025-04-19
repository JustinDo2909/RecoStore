const express = require("express");
const Wallet = require("../models/wallet.model");

const getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id })
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found", success: false });
        }
        return res.status(200).json({ wallet, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = {getWallet};