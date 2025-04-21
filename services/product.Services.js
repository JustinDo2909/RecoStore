const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { cloudinary } = require("../utils/cloudinary");
const { getDataUri } = require("../utils/datauri");

const createProductService = async (productData, file) => {
  try {
    const { name, decription, price, rating, location, stock, categorys } = productData;
    const profilePicture = file;

    if (!profilePicture) {
      throw new Error("Không thể thêm ảnh sản phẩm.");
    }

    const fileUri = getDataUri(profilePicture);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const picture = cloudResponse.url;

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

    const product = await Product.create(dataSave);

    if (categorys) {
      const category = await Category.findById(categorys);
      if (!category) {
        throw new Error("Danh mục không tìm thấy.");
      }

      category.products.push(product._id);
      await category.save();
    }

    return product;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error(`Tên sản phẩm "${error.keyValue.name}" đã tồn tại.`);
    }

    throw error;
  }
};

const updateProductService = async (productId, productData, userId, file) => {
  try {
    const userEdit = await User.findById(userId).select("-password");

    console.log("userEdit", userEdit);

    if (!userEdit) {
      throw new Error("Không tìm thấy người dùng này");
    }

    const { name, decription, price, rating, location, stock, categorys } = productData;
    const profilePicture = file;

    if (!profilePicture) {
      throw new Error("Không thể thêm ảnh sản phẩm.");
    }

    const fileUri = getDataUri(profilePicture);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const picture = cloudResponse.url;

    const dataSave = {
      name,
      decription,
      price,
      rating,
      location,
      picture,
      stock,
      categorys,
      editby: userEdit.username,
    };

    const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: dataSave }, { new: true });
    if (!updatedProduct) {
      throw new Error("Không thể cập nhật sản phẩm");
    }

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProductService,
  updateProductService,
};
