const express = require("express");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  userSignup,
  userLogout,
  userLogin,
  userGetMy,
  userUpdateProfile,
  getAllUser,
  deleteUserById,
  refreshToken,
  userUpdateProfileById
} = require("../controller/user.controller");

const router = express.Router();

router.route("/signup").post(userSignup);
router.post("/login", userLogin);
router.route("/logout").post(userLogout);
router.get("/me", authenticateToken, userGetMy);
router.put("/update", authenticateToken, userUpdateProfile);
router.post("/refreshToken", authenticateToken, refreshToken);



router.put(
  "/update/:id",
  authenticateToken,
  authorizeRole("admin"),
  userUpdateProfileById
);
router.get("/users", authenticateToken, authorizeRole("admin"), getAllUser);
router.delete(
  "/deleteUser/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteUserById
);
module.exports = router;
