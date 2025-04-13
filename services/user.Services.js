const bcrypt = require("bcryptjs");
const User = require("../models/user.model"); // Adjust the path to your user model
const { signToken } = require("../middleware/authMiddleware");

const login = async (req) => {
  try {
    const user = req.user; // The user object would be set in middleware after authentication

    const token = signToken({ id: user._id, role: user.role });
    return token;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

const register = async (req) => {
  console.log("Đây service");

  const { email, password, username, role, passwordConfirm } = req.body;

  console.log("req.body", req.body);

  const newUser = await User.create({
    username,
    email,
    passwordConfirm,
    password: password,
    role: role || "customer", // gán mặc định nếu không có
  });

  const token = signToken({ id: newUser._id, role: newUser.role });
  return token;
};

module.exports = {
  login,
  register,
};
