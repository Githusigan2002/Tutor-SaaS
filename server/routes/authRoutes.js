const express = require("express");
const router = express.Router();
const {
  SignUp,
  login,
  logout,
  resetPasswordSendMail,
  ResetPassword,
  ViewProfile,
  updateProfile,
  refreshToken
} = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

// Public
router.post("/signup", SignUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/reset-password", resetPasswordSendMail);
router.post("/reset-password/:token", ResetPassword);

// Protected
router.get("/me", verifyToken, ViewProfile);
router.put("/me", verifyToken, updateProfile);

module.exports = router;
