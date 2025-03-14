const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { signToken, getIp } = require("../middleware/authMiddleware");
const { blacklist } = require("../middleware/authMiddleware");
const { default: axios } = require("axios");

const userSignup = async (req, res) => {
  try {
    const { email, password, passwordConfirm, username, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        message: "Email already registerd",
        success: false,
      });
    }
    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
      role,
    });
    const token = await signToken({ id: newUser._id, role: newUser.role });
    if (!token) {
      return res.status(404).json({
        message: "Get Token false",
        success: false,
      });
    } else {
      return res.status(201).json({
        message: "Get Token ok",
        data: token,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};


const userLogin = async (req, res) => {
  try {
    const { username, password, address } = req.body; 
    console.log("Login Request:", username, password, address);

    if (!username || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Thêm address vào loginLocations
    if (address) {
      user.loginLocations.push({ location: address });
    }

    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    return res.json({
      message: `Welcome back ${user.username}`,
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};



const userLogout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ message: "No token provided", success: false });
    }

    blacklist.add(token);
    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const userGetMy = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
  

    const Finduser = await User.findById(req.user.id).select("-password");
    if (!Finduser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
   
    res.json({
      message: "User retrieved successfully",
      success: true,
      Finduser,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
const userUpdateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticatedc",
        success: false,
      });
    }
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(401).json({
        message: "Some thing missing",
        success: false,
      });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        email,
        username,
      },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Update success",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const userUpdateProfileById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticatedc",
        success: false,
      });
    }
    const idUser = req.params.id
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(401).json({
        message: "Some thing missing",
        success: false,
      });
    }
    const user = await User.findByIdAndUpdate(
      idUser,
      {
        email,
        username,
      },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Update success",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const user = await User.find({}).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Dont have infomation",
        success: false,
      });
    }
    return res.status(201).json({
      data: user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        message: "Dont have id",
        success: false,
      });
    }
    const user = await User.findById(id);
    if (user.role === "admin") {
      return res.status(401).json({
        message: "Cant not delete admin",
        success: false,
      });
    }
    const userDelete = await User.findByIdAndDelete(id);
    return res.status(200).json({
      message: `Delete user : ${userDelete.username} success`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const refreshToken = async (req, res) => {
  const authHeaer = req.headers["authorization"];
  const token = authHeaer && authHeaer.split(" ")[1];
  if (!req.user) {
    return res.status(401).json({
      message: "Dont have token",
      success: false,
    });
  }
  const user = await User.findById(req.user.id);
  const refreshToken = signToken({ id: user.id, role: user.role });
  blacklist.add(token);
  return res.status(200).json({
    message: "refreshToken create success",
    refreshToken: refreshToken,
    success: true,
  });
};




module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userGetMy,
  userUpdateProfile,
  getAllUser,
  deleteUserById,
  refreshToken,
  userUpdateProfileById
};
