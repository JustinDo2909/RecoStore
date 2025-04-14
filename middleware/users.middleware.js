const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const LoginValidator = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("req", req.body);

  console.log("password type", typeof password);

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  // Tìm người dùng trong cơ sở dữ liệu theo email
  const user = await User.findOne({ email });

  console.log("user", user);

  console.log("userpassword type", typeof user.password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  if (typeof password !== "string" || typeof user.password !== "string") {
    return res.status(400).json({ message: "Invalid password format." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log("isMatch", isMatch);

  // Nếu mật khẩu không khớp
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  req.user = user;
  // If successful
  next();
};

const RegisterValidator = async (req, res, next) => {
  console.log("vào đây");

  // Lấy các giá trị từ body request
  const { email, password, passwordConfirm, username, role } = req.body;

  // Kiểm tra xem các trường cần thiết có bị bỏ trống không
  if (!email || !password || !passwordConfirm || !username) {
    return res.status(401).json({
      message: "All fields are required: email, password, passwordConfirm, username.",
      success: false,
    });
  }

  // Kiểm tra xem mật khẩu và mật khẩu xác nhận có khớp không
  if (password !== passwordConfirm) {
    return res.status(401).json({
      message: "Passwords do not match",
      success: false,
    });
  }

  // Gán giá trị mặc định cho role là 'customer' nếu không có trong request
  const userRole = role || "customer";

  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(401).json({
      message: "Email already registered",
      success: false,
    });
  }

  // Kiểm tra xem username đã tồn tại chưa
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(401).json({
      message: "Username already taken",
      success: false,
    });
  }

  // Gắn lại giá trị role vào request.body để sử dụng trong phần tiếp theo
  req.body.role = userRole;

  // Nếu không có lỗi, gọi next() để tiếp tục đến userSignup
  next();
};

module.exports = {
  LoginValidator,
  RegisterValidator,
};
