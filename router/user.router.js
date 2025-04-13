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
} = require("../controller/user.controller");
const { RegisterValidator, LoginValidator } = require("../middleware/users.middleware");

const router = express.Router();

router.post("/signup", RegisterValidator, userSignup);
router.post("/login", LoginValidator, userLogin);
router.route("/logout").post(userLogout);
router.get("/me", authenticateToken, userGetMy);
router.put("/update", authenticateToken, userUpdateProfile);
router.post("/refreshToken", authenticateToken, refreshToken);

router.put("/update/:id", authenticateToken, authorizeRole("admin"), userUpdateProfileById);
router.get("/users", authenticateToken, authorizeRole("admin"), getAllUser);
router.delete("/deleteUser/:id", authenticateToken, authorizeRole("admin"), deleteUserById);
module.exports = router;
