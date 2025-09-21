const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const { markAttendance, getStudentAttendance, getTutorAttendance, updateAttendance } = require("../controllers/attendanceController");

router.post("/", verifyToken, authorizeRole("tutor"), markAttendance);
router.get("/student/:id", verifyToken, getStudentAttendance);
router.get("/tutor/:id", verifyToken, authorizeRole("tutor","admin"), getTutorAttendance);
router.put("/:id", verifyToken, authorizeRole("tutor","admin"), updateAttendance);

module.exports = router;
