const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    proofUrl: { type: String },
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    tutorComment: String,
    adminComment: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
