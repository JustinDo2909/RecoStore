const category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { cloudinary } = require("../utils/cloudinary");
const { getDataUri } = require("../utils/datauri");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({
        message: "can not take all product",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product list",
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductById = async (req, res) => {
  const id = req.params.id
  if(!id){
    return res.status(404).json({
      message: "Dont have id Product",
      success: false,
    });
  }
  try {
    const products = await Product.find(id);
    if (!products) {
      return res.status(404).json({
        message: "can not take all product",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product list",
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateProduct = async (req, res) => {
  try {
    const userEdit = await User.findById(req.user.id).select("-password");
    console.log(userEdit.username, "updaye");
    if (!userEdit) {
      return res.status(404).json({
        message: "Dont have this user",
        success: false,
      });
    }
    const id = req.params.id;
    const { name, decription, price, categorys } = req.body;

    const data = {
      name,
      decription,
      price,
      categorys,
      editby: userEdit.username,
    };

    const products = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!products) {
      return res.status(404).json({
        message: "can not update product",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product",
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const products = await Product.findByIdAndDelete(id);
    if (!products) {
      return res.status(404).json({
        message: "can not find this product",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product delete sucess",
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    // const idCate = req.body.categorys;
    const { name, decription, price, rating, location, stock, categorys } =
      req.body;
    const profilePicture = req.file;
    console.log(profilePicture);

    if (!profilePicture) {
      return res.status(404).json({
        message: "can not add this pic",
        success: false,
      });
    }
    const fileUri = getDataUri(profilePicture);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const picture = cloudResponse.url
    const dataSave = {
      name,
      decription,
      price,
      rating,
      location,
      picture,
      stock,
      categorys,
    };
    const products = await Product.create(dataSave);
    if (!products) {
      return res.status(404).json({
        message: "can not add this product",
        success: false,
      });
    }
    if(categorys){
    const Cate = await category.findById(categorys);
      Cate.products.push(products._id);
      if (!Cate) {
        return res.status(404).json({
          message: "Category not found",
          success: false,
        });
      }
      await Cate.save();
    }
    return res.status(200).json({
      message: "product add sucess",
      data: products,
      success: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: ` 'The product name "${error.keyValue.name} " is already taken`,
      });
    }
    console.log(error);
  }
};

module.exports = { getAllProduct, createProduct, deleteProduct, updateProduct };
