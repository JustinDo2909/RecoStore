const Request = require("../models/request.model");

const createRequest = async (req, res) => {
  try {
    const user = req.user.id;
    const { type, status, message } = req.body;
    if (!type || !status || !user || !message) {
      return res
        .status(401)
        .json({ message: "Some thing missing", success: false });
    }
    const request = await Request.create({ type, status, user, message });
    if (!request) {
      return res.status(404).json({
        message: "can not add this request",
        success: false,
      });
    }
    return res.status(200).json({
      message: "request added",
      data: request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllRequest = async (req, res) => {
  try {
    const requests = await Request.find({}).populate("user").select("-password");
    if (!requests) {
      return res.status(404).json({
        message: "can not take all request",
        success: false,
      });
    }
    return res.status(200).json({
      message: "request list",
      data: requests,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getRequest = async (req, res) => {
  try {
    const user = req.user.id;
    const request = await Request.find({ user: user }).select("-user");
    if (!request) {
      return res.status(404).json({
        message: "can not find this request",
        success: false,
      });
    }
    return res.status(200).json({
      message: "request",
      data: request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({
        message: "can not find this request",
        success: false,
      });
    }
    return res.status(200).json({
      message: "request delete",
      data: request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user.id;
    if (!user) {
      return res.status(401).json({
        message: "Dont have user",
        success: false,
      });
    }
    const { type, status, message } = req.body;
    const request = await Request.findByIdAndUpdate(
      id,
      { $set: { type, status, user, message } },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({
        message: "can not find this request",
        success: false,
      });
    }
    return res.status(200).json({
      message: "request update",
      data: request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateStatusRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({
        message: "can not find this request",
        success: false,
      });
    }
    return res.status(200).json({
      message: "request update",
      data: request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createRequest, getAllRequest, deleteRequest, updateRequest , getRequest , updateStatusRequest};
