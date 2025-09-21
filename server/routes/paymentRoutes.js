const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const multer = require("multer");
const path = require("path");
const { uploadPayment, getPayments, getPaymentById, approvePayment, rejectPayment } = require("../controllers/paymentController");

// basic local storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/payments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Student uploads proof
router.post("/", verifyToken, authorizeRole("student"), upload.single("proof"), uploadPayment);

// role based listing
router.get("/", verifyToken, getPayments);
router.get("/:id", verifyToken, getPaymentById);

// Tutor approves/rejects
router.put("/:id/approve", verifyToken, authorizeRole("tutor"), approvePayment);
router.put("/:id/reject", verifyToken, authorizeRole("tutor"), rejectPayment);

module.exports = router;
