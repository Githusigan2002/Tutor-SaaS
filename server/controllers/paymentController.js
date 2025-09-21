const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

exports.uploadPayment = async (req, res) => {
  try {
    const { bookingId, amount, currency } = req.body;
    if (!bookingId || !req.file) return res.status(400).json({ message: "Booking and proof required" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const payment = new Payment({
      booking: bookingId,
      student: req.user._id,
      tutor: booking.tutor,
      amount: amount || 0,
      currency: currency || "USD",
      proofUrl: req.file.path,
      status: "pending"
    });
    await payment.save();
    res.status(201).json({ message: "Payment uploaded", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const user = req.user;
    const filter = {};
    if (user.role === "student") filter.student = user._id;
    if (user.role === "tutor") filter.tutor = user._id;
    // admin gets all

    const payments = await Payment.find(filter)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .populate("booking");

    res.json({ payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking student tutor");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    // auth checks similar to booking
    res.json({ payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.tutor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    payment.status = "verified";
    payment.tutorComment = req.body.comment || "";
    await payment.save();
    res.json({ message: "Payment verified", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.tutor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    payment.status = "rejected";
    payment.tutorComment = req.body.comment || "";
    await payment.save();
    res.json({ message: "Payment rejected", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
