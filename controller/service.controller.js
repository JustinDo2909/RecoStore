const Service = require("../models/service.model");

const getService = async (req, res) => {
  try {
    const services = await Service.find({});
    if (!services) {
      return res.status(404).json({
        message: "can not take all service",
        success: false,
      });
    }
    return res.status(200).json({
      message: "service list",
      data: services,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, description } = req.body;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        message: "can not find this service",
        success: false,
      });
    }
    const updateService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: { name, price, description } },
      { new: true }
    );
    return res.status(200).json({
      message: "update service",
      data: updateService,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({
        message: "can not find this service",
        success: false,
      });
    }
    return res.status(200).json({
      message: "delete service",
      data: service,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const createService = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const service = await Service.create({ name, price, description });
    if (!service) {
      return res.status(404).json({
        message: "can not create this service",
        success: false,
      });
    }
    return res.status(200).json({
      message: "create service",
      data: service,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getService, updateService, deleteService, createService };
