const express = require("express");
const router = express.Router();

const incidentController = require("../controllers/incidentController");
const { verifyToken } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); // ✅ ADDED

// =======================
// STUDENT/STAFF ROUTES
// =======================

// 🔒 Student creates an incident (with file upload)
router.post(
  "/",
  verifyToken,
  roleMiddleware(["student", "staff"]),
  upload.array("evidence", 5), // ✅ ADDED
  incidentController.createIncident
);

// 🔒 Student views own incidents
router.get(
  "/my",
  verifyToken,
  roleMiddleware(["student", "staff"]),
  incidentController.getMyIncidents
);

// =======================
// ADMIN ROUTES
// =======================

// 🔒 Admin view all incidents
router.get(
  "/all",
  verifyToken,
  roleMiddleware(["admin"]),
  incidentController.getAllIncidents
);

module.exports = router;