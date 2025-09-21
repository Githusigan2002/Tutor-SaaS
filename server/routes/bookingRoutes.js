const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const {
  createBooking,
  getBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking
} = require("../controllers/bookingController");

// Create booking (student)
router.post("/", verifyToken, authorizeRole("student"), createBooking);

// Get bookings (role-based)
router.get("/", verifyToken, getBookings);
router.get("/:id", verifyToken, getBookingById);

// Approve/reject (tutor)
router.put("/:id/approve", verifyToken, authorizeRole("tutor"), approveBooking);
router.put("/:id/reject", verifyToken, authorizeRole("tutor"), rejectBooking);

// Cancel (student OR tutor OR admin)
router.delete("/:id", verifyToken, cancelBooking);

module.exports = router;
