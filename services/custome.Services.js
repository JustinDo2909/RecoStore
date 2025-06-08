import Custom from "../models/custom.model";
import { cloudinary } from "../utils/cloudinary";

const customService = async (customeData, file) => {
  try {
    const { user } = customeData;
    const customePicture = file;

    if (!customePicture) {
      throw new Error("Không thể thêm ảnh sản phẩm.");
    }

    // Chuyển file thành data URI và upload lên Cloudinary
    const fileUri = getDataUri(customePicture);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const image = cloudResponse.secure_url; // dùng secure_url an toàn hơn

    const dataSave = {
      user,
      image,
      isActive: true,
      createdAt: new Date(), // đảm bảo có createdAt
    };

    const custom = await Custom.create(dataSave);
    return custom;
  } catch (error) {
    console.error("Lỗi khi tạo custom service:", error);
    throw new Error("Không thể tạo sản phẩm tuỳ chỉnh.");
  }
};

module.exports = {
  customService,
};
