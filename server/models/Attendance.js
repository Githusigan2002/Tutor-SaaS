const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent", "late"], default: "present" },
    note: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
