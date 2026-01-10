const Review = require("../models/Review");
const User = require("../models/User"); // ✅ Changed to User

// Submit a review (Student/Staff)
exports.submitReview = async (req, res) => {
  try {
    console.log("📝 Review submission request received");
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { review, rating } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!review || !rating) {
      console.log("❌ Missing review or rating");
      return res.status(400).json({ message: "Review and rating are required" });
    }

    if (review.length < 20 || review.length > 500) {
      console.log("❌ Review length invalid");
      return res.status(400).json({ message: "Review must be between 20 and 500 characters" });
    }

    // Get user details
    const user = await User.findById(userId); // ✅ Using User model
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("👤 Found user:", user);

    // Check if user already submitted a review
    const existingReview = await Review.findOne({ userId });
    if (existingReview) {
      console.log("❌ User already submitted review");
      return res.status(400).json({ message: "You have already submitted a review" });
    }

    // Determine userType based on role
    const userType = userRole === "student" ? "Student" : "Staff";

    // Create review
    const newReview = new Review({
      userId: userId,
      userType: userType,
      name: user.name,
      role: userRole,
      department: user.department || user.courseYear || "N/A",
      review: review,
      rating: rating,
      isApproved: false
    });

    await newReview.save();
    console.log("✅ Review saved:", newReview);

    res.status(201).json({
      message: "Review submitted successfully! It will be visible after admin approval.",
      review: newReview
    });
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all approved reviews (Public)
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      isApproved: true,
      isVisible: true
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews (Admin only)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve a review (Admin only)
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review approved successfully", review });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a review (Admin only)
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};