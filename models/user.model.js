const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add username"],
      unique: true,
      trim: true,
      minlength: 3, // Sửa minlenght -> minlength
      maxlength: 30, // Sửa maxlenght -> maxlength
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    role: {
      type: String,
      required: [true, "Please provide role"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
      // select: false, // Cẩn thận khi chọn select: true cho password
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],

      select: false, // Ẩn passwordConfirm khỏi kết quả truy vấn
    },
    loginLocations: [
      {
        location: String,
        timestamp: { type: Date, default: Date.now },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function name(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
