const express = require("express");
const router = express.Router();
const {
  adminLogin,
  verifyAdmin,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus,
  getIncidentsByStatus,
  getIncidentStats,
  deleteIncident,
  updateIncidentPriority,      // ✅ NEW
  addComment,                    // ✅ NEW
  deleteComment,                 // ✅ NEW
  updateResolution,              // ✅ NEW
  getIncidentsByPriority         // ✅ NEW
} = require("../controllers/adminController");
const { verifyAdminToken } = require("../middleware/adminMiddleware");

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post("/login", adminLogin);

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================
router.get("/verify", verifyAdminToken, verifyAdmin);

// Incident Management
router.get("/incidents", verifyAdminToken, getAllIncidents);
router.get("/incidents/stats", verifyAdminToken, getIncidentStats);
router.get("/incidents/status/:status", verifyAdminToken, getIncidentsByStatus);
router.get("/incidents/priority/:priority", verifyAdminToken, getIncidentsByPriority); // ✅ NEW
router.get("/incidents/:referenceId", verifyAdminToken, getIncidentById);
router.put("/incidents/:referenceId/status", verifyAdminToken, updateIncidentStatus);

// ✅ NEW ROUTES
router.put("/incidents/:referenceId/priority", verifyAdminToken, updateIncidentPriority);
router.post("/incidents/:referenceId/comments", verifyAdminToken, addComment);
router.delete("/incidents/:referenceId/comments/:commentId", verifyAdminToken, deleteComment);
router.put("/incidents/:referenceId/resolution", verifyAdminToken, updateResolution);

// Optional: Delete incident
router.delete("/incidents/:referenceId", verifyAdminToken, deleteIncident);

module.exports = router;