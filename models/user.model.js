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
      minlenght: 3,
      maxlenght: 30,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please Provide a vaild Email"],
    },
    role: {
      type: String,
      required: [true, "Please provide role"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlenght: 8,
      select: true,
    },
    passwordConfirm: {
      type: String,
      required: function () {
        return this.isNew;
      },
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
      select: false,
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
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
