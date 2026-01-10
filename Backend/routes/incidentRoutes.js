const express = require("express");
const router = express.Router();

const incidentController = require("../controllers/incidentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =======================
// STUDENT ROUTES
// =======================

// 🔒 Student creates an incident
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["student", "staff"]),
  incidentController.createIncident
);

// 🔒 Student views own incidents
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["student", "staff"]),
  incidentController.getMyIncidents
);

// =======================
// ADMIN ROUTES
// =======================

// 🔒 Admin view all incidents
router.get(
  "/all",
  authMiddleware,
  roleMiddleware(["admin"]),
  incidentController.getAllIncidents
);

module.exports = router;
