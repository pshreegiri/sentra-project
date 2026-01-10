const express = require("express");
const router = express.Router();

const incidentController = require("../controllers/incidentController");
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ Changed
const roleMiddleware = require("../middleware/roleMiddleware");

// =======================
// STUDENT ROUTES
// =======================

// 🔒 Student creates an incident
router.post(
  "/",
  verifyToken, // ✅ Changed
  roleMiddleware(["student", "staff"]),
  incidentController.createIncident
);

// 🔒 Student views own incidents
router.get(
  "/my",
  verifyToken, // ✅ Changed
  roleMiddleware(["student", "staff"]),
  incidentController.getMyIncidents
);

// =======================
// ADMIN ROUTES
// =======================

// 🔒 Admin view all incidents
router.get(
  "/all",
  verifyToken, // ✅ Changed
  roleMiddleware(["admin"]),
  incidentController.getAllIncidents
);

module.exports = router;