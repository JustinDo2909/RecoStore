const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const {
  userSignup,
  userLogout,
  userLogin,
  userGetMy,
  userUpdateProfile,
  getAllUser,
  deleteUserById,
  refreshToken,
  userUpdateProfileById,
  userSignupController,
  userLoginController,
  userLogoutController,
  userGetMyController,
  userUpdateProfileControler,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} = require("../controller/user.controller");
const {
  registerValidator,
  loginValidator,
  updateValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  passwordChangeValidator,
} = require("../middleware/users.middleware");

const router = express.Router();

router.post("/login", loginValidator, userLoginController);

router.post("/signup", registerValidator, userSignupController);

router.post("/logout", userLogoutController);
router.get("/me", authenticateToken, userGetMyController);
router.put("/update", authenticateToken, updateValidator, userUpdateProfileControler);

//  thêm forgotPasswod, thêm changePassword
router.post("/forgot-password", forgotPasswordValidator, forgotPasswordController);
router.post("/reset-password/:resetToken", resetPasswordValidator, resetPasswordController);
router.put("/changePassword", authenticateToken, passwordChangeValidator, changePasswordController);

router.post("/refreshToken", authenticateToken, refreshToken);

router.put("/update/:id", authenticateToken, authorizeRole("admin"), userUpdateProfileById);
router.get("/users", authenticateToken, authorizeRole("admin"), getAllUser);
router.patch("/deleteUser/:id", authenticateToken, authorizeRole("admin"), deleteUserById);

module.exports = router;
