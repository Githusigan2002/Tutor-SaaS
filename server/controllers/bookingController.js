const Booking = require("../models/Booking");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    const { tutorId, subject, date, startTime, duration, notes } = req.body;
    if (!tutorId || !date) return res.status(400).json({ message: "Missing fields" });
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== "tutor") return res.status(404).json({ message: "Tutor not found" });

    const booking = new Booking({
      student: req.user._id,
      tutor: tutorId,
      subject,
      date,
      startTime,
      duration,
      notes
    });
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const user = req.user;
    const { status, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (user.role === "student") filter.student = user._id;
    else if (user.role === "tutor") filter.tutor = user._id;
    // admin gets all

    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("student", "name email")
      .populate("tutor", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Authorization: student, tutor, or admin
    if (
      req.user.role === "student" &&
      booking.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (
      req.user.role === "tutor" &&
      booking.tutor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.tutor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    booking.status = "approved";
    await booking.save();
    res.json({ message: "Booking approved", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.tutor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    booking.status = "rejected";
    await booking.save();
    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Students can cancel their own, tutors can cancel their own, admin can cancel any
    if (
      req.user.role === "student" &&
      booking.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (
      req.user.role === "tutor" &&
      booking.tutor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
