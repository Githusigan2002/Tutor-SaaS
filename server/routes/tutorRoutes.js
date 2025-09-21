const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const { getTutors, getTutorById, updateTutor } = require("../controllers/tutorController");

// Public: list tutors (students & guests)
router.get("/", getTutors);
router.get("/:id", getTutorById);

// Protected: tutor update own profile
router.put("/:id", verifyToken, authorizeRole("tutor", "admin"), updateTutor);

module.exports = router;
