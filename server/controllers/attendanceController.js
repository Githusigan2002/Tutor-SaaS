const Attendance = require("../models/Attendance");
const Booking = require("../models/Booking");

exports.markAttendance = async (req, res) => {
  try {
    const { bookingId, records } = req.body;
    if (!bookingId || !Array.isArray(records)) return res.status(400).json({ message: "bookingId and records array required" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.tutor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    // records = [{ studentId, status, note }]
    const created = [];
    for (const r of records) {
      const at = new Attendance({
        booking: bookingId,
        tutor: req.user._id,
        student: r.studentId,
        date: r.date || booking.date,
        status: r.status || "present",
        note: r.note
      });
      await at.save();
      created.push(at);
    }
    res.status(201).json({ message: "Attendance recorded", created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (req.user.role === "student" && req.user._id.toString() !== studentId) return res.status(403).json({ message: "Forbidden" });

    const records = await Attendance.find({ student: studentId }).populate("tutor", "name").populate("booking");
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTutorAttendance = async (req, res) => {
  try {
    const tutorId = req.params.id;
    if (req.user.role === "tutor" && req.user._id.toString() !== tutorId) return res.status(403).json({ message: "Forbidden" });

    const records = await Attendance.find({ tutor: tutorId }).populate("student", "name").populate("booking");
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, note } = req.body;
    const rec = await Attendance.findById(id);
    if (!rec) return res.status(404).json({ message: "Not found" });
    if (req.user.role === "tutor" && rec.tutor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    if (status) rec.status = status;
    if (note) rec.note = note;
    await rec.save();
    res.json({ message: "Attendance updated", rec });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
