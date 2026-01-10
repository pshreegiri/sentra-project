const express = require("express");
const router = express.Router();
const {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview
} = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");
const { verifyAdminToken } = require("../middleware/adminMiddleware");

// Public route
router.get("/approved", getApprovedReviews);

// Protected routes
router.post("/submit", verifyToken, submitReview);

// Admin routes
router.get("/all", verifyAdminToken, getAllReviews);
router.put("/:id/approve", verifyAdminToken, approveReview);
router.delete("/:id", verifyAdminToken, deleteReview);

module.exports = router;