const User = require("../models/User");

// GET /api/tutors?subject=&minRate=&maxRate=&q=
exports.getTutors = async (req, res) => {
  try {
    const { subject, q, minRate, maxRate, page = 1, limit = 20 } = req.query;
    const filter = { role: "tutor", status: "active" };
    if (subject) filter.subjects = { $in: [subject] };
    if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { bio: { $regex: q, $options: "i" } }];
    if (minRate || maxRate) {
      filter.rate = {};
      if (minRate) filter.rate.$gte = Number(minRate);
      if (maxRate) filter.rate.$lte = Number(maxRate);
    }

    const tutors = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({ total, page: Number(page), tutors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTutorById = async (req, res) => {
  try {
    const id = req.params.id;
    const tutor = await User.findById(id).select("-password");
    if (!tutor || tutor.role !== "tutor") return res.status(404).json({ message: "Tutor not found" });
    res.json({ tutor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTutor = async (req, res) => {
  try {
    const id = req.params.id;
    // Only allow tutor to update own profile unless admin
    if (req.user.role === "tutor" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, avatar, bio, subjects, rate, availability } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (bio) updates.bio = bio;
    if (subjects) updates.subjects = subjects;
    if (rate) updates.rate = rate;
    if (availability) updates.availability = availability;

    const updated = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select("-password");
    res.json({ message: "Tutor updated", tutor: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
