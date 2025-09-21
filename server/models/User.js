const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "tutor", "admin"], default: "student" },
    avatar: { type: String },
    bio: { type: String },
    subjects: [{ type: String }],
    rate: { type: Number },
    availability: [
      {
        day: String,
        slots: [
          {
            start: String,
            end: String
          }
        ]
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpired: Date,
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
