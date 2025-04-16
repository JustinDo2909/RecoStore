const Order = require("../models/order.model");
const Request = require("../models/request.model");
const Service = require("../models/service.model");

const createRefundRequest = async (req, res) => {
  try {
    const user = req.user.id;
    const status = "Pending";
    const { type, message, order } = req.body;
    console.log(req.body, req.user.id);

    if (!type || !user || !message || !order) {
      return res
        .status(401)
        .json({ message: "Some thing missing", success: false });
    }
    const request = await Request.create({
      type,
      status,
      user,
      message,
      order,
    });
    if (!request) {
      return res.status(404).json({
        message: "can not add this request",
        success: false,
      });
    }
    const orders = await Order.findById(order);
    orders.statusOrder = "Refund Requested";
    await orders.save();
    return res.status(200).json({
      message: "request added",
      data: request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const createServiceRequest = async (req, res) => {
  try {
    const user = req.user.id;
    const { type, message, service } = req.body;
    const status = "Pending";
    if (!type || !status || !user || !message || !service) {
      return res
        .status(401)
        .json({ message: "Some thing missing", success: false });
    }
    const request = await Request.create({
      type,
      status,
      user,
      message,
      service,
    });

    if (!request) {
      return res.status(404).json({
        message: "can not add this request",
        success: false,
        error: error.message,
      });
    }
    const services = await Service.findById(service);
    services.statusService = "Service Requested";
    await services.save();
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
    const requests = await Request.find({})
      .populate("user")
      .select("-password");
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
    const { id } = req.params;
    const { status } = req.body;
    console.log(id, status);
    
    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    console.log(request);
    
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        success: false,
      });
    }

    const updateRefundStatus = (doc, type) => {
      if (status === "Approved") {
        doc[type] = "Refund Approved";
      } else if (status === "Rejected") {
        doc[type] = "Refund Rejected";
      }
    };

    if (request.type === "Service" && request.service) {
      const service = await Service.findById(request.service);
      if (service) {
        updateRefundStatus(service, "statusService");
        await service.save();
      }
    } else if (request.order) {
      const order = await Order.findById(request.order);
      if (order) {
        updateRefundStatus(order, "statusOrder");
        await order.save();
      }
    }

    return res.status(200).json({
      message: "Request updated successfully",
      data: request,
      success: true,
    });
  } catch (error) {
    console.error("Update Request Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};


module.exports = {
  createServiceRequest,
  createRefundRequest,
  getAllRequest,
  deleteRequest,
  updateRequest,
  getRequest,
  updateStatusRequest,
};
