const express = require("express");
const { isAuthenticated, isAuthorizedRole } = require("../middleware/auth.js");

const {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  getuserDetail,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController.js");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logOut);

router.route("/password/reset/:token").put(resetPassword);

router.route("/password/forgot").post(forgotPassword);
router.route("/me").get(isAuthenticated, getuserDetail);

router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/me/update").put(isAuthenticated, updateProfile);

router
  .route("/admin/user")
  .get(isAuthenticated, isAuthorizedRole("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, isAuthorizedRole("admin"), getSingleUser)
  .put(isAuthenticated, isAuthorizedRole("admin"), updateUser)
  .delete(isAuthenticated, isAuthorizedRole("admin"), deleteUser);

module.exports = router;
