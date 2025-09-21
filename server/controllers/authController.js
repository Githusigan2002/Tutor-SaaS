const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// SIGNUP
exports.SignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
    if (password.length < 6) return res.status(400).json({ message: "Password too short" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, role });
    await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).json({ message: "Incorrect credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Optionally save refreshToken in DB or cookie - for simplicity return in body
    res.json({
      message: "Login success",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT (optional)
exports.logout = async (req, res) => {
  // If using cookie-based refresh tokens, clear cookie here. For stateless tokens, client deletes token.
  res.json({ message: "Logout success" });
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Refresh token required" });
  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// RESET PASSWORD - SEND EMAIL
exports.resetPasswordSendMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpired = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Hi ${user.name || ""},\n\nYou requested a password reset. Use the link below or token:\n\n${resetUrl}\n\nToken: ${token}\n\nIf you did not request, ignore.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email send error", error: err.message });
  }
};

// RESET PASSWORD - APPLY
exports.ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: "Password min 6 chars" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpired: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save();

    res.json({ message: "Password reset success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// VIEW PROFILE
exports.ViewProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, bio, subjects, rate } = req.body;
    const allowedUpdates = {};
    if (name) allowedUpdates.name = name;
    if (avatar) allowedUpdates.avatar = avatar;
    if (bio) allowedUpdates.bio = bio;

    if (req.user.role === "tutor") {
      if (subjects) allowedUpdates.subjects = subjects;
      if (rate) allowedUpdates.rate = rate;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, { $set: allowedUpdates }, { new: true }).select("-password");
    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
