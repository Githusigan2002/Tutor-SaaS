const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String },
    duration: { type: Number, default: 60 }, // minutes
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending"
    },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
