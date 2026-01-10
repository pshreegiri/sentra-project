const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Incident = require("../models/Incident");

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@sentra.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

// =======================
// ADMIN LOGIN
// =======================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        email: ADMIN_EMAIL, 
        role: "admin" 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        email: ADMIN_EMAIL,
        role: "admin"
      }
    });

  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// VERIFY ADMIN TOKEN
// =======================
exports.verifyAdmin = (req, res) => {
  res.json({ 
    message: "Token is valid", 
    user: req.user 
  });
};

// =======================
// GET ALL INCIDENTS
// =======================
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("reportedBy.userId", "name email role department")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    console.error("❌ Error fetching incidents:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET INCIDENT BY REFERENCE ID
// =======================
exports.getIncidentById = async (req, res) => {
  try {
    const { referenceId } = req.params;

    const incident = await Incident.findOne({ referenceId })
      .populate("reportedBy.userId", "name email role department courseYear");

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      success: true,
      incident
    });
  } catch (error) {
    console.error("❌ Error fetching incident:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPDATE INCIDENT STATUS
// =======================
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "In Review", "In Progress", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const incident = await Incident.findOneAndUpdate(
      { referenceId },
      { status },
      { new: true }
    ).populate("reportedBy.userId", "name email");

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      incident
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET INCIDENTS BY STATUS
// =======================
exports.getIncidentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const incidents = await Incident.find({ status })
      .populate("reportedBy.userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    console.error("❌ Error fetching incidents by status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET INCIDENT STATISTICS
// =======================
exports.getIncidentStats = async (req, res) => {
  try {
    const total = await Incident.countDocuments();
    const pending = await Incident.countDocuments({ status: "Pending" });
    const inReview = await Incident.countDocuments({ status: "In Review" });
    const inProgress = await Incident.countDocuments({ status: "In Progress" });
    const closed = await Incident.countDocuments({ status: "Closed" });

    // Count by type
    const typeStats = await Incident.aggregate([
      {
        $group: {
          _id: "$incidentType",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        byStatus: {
          pending,
          inReview,
          inProgress,
          closed
        },
        byType: typeStats
      }
    });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// DELETE INCIDENT (OPTIONAL)
// =======================
exports.deleteIncident = async (req, res) => {
  try {
    const { referenceId } = req.params;

    const incident = await Incident.findOneAndDelete({ referenceId });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      success: true,
      message: "Incident deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting incident:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPDATE INCIDENT PRIORITY
// =======================
exports.updateIncidentPriority = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const { priority } = req.body;

    // Validate priority
    const validPriorities = ["Low", "Medium", "High", "Critical"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const incident = await Incident.findOneAndUpdate(
      { referenceId },
      { priority },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      success: true,
      message: "Priority updated successfully",
      incident
    });
  } catch (error) {
    console.error("❌ Error updating priority:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ADD COMMENT TO INCIDENT
// =======================
exports.addComment = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const incident = await Incident.findOne({ referenceId });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Add new comment
    incident.comments.push({
      text: text.trim(),
      addedBy: "Admin",
      addedAt: new Date(),
    });

    await incident.save();

    res.json({
      success: true,
      message: "Comment added successfully",
      incident
    });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// DELETE COMMENT
// =======================
exports.deleteComment = async (req, res) => {
  try {
    const { referenceId, commentId } = req.params;

    const incident = await Incident.findOne({ referenceId });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Remove comment by ID
    incident.comments = incident.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await incident.save();

    res.json({
      success: true,
      message: "Comment deleted successfully",
      incident
    });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPDATE RESOLUTION NOTES
// =======================
exports.updateResolution = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const { notes } = req.body;

    if (!notes || notes.trim() === "") {
      return res.status(400).json({ message: "Resolution notes are required" });
    }

    const incident = await Incident.findOneAndUpdate(
      { referenceId },
      {
        "resolution.notes": notes.trim(),
        "resolution.resolvedAt": new Date(),
        "resolution.resolvedBy": "Admin",
      },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      success: true,
      message: "Resolution notes updated successfully",
      incident
    });
  } catch (error) {
    console.error("❌ Error updating resolution:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET INCIDENTS BY PRIORITY
// =======================
exports.getIncidentsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;

    const incidents = await Incident.find({ priority })
      .populate("reportedBy.userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    console.error("❌ Error fetching incidents by priority:", error);
    res.status(500).json({ message: "Server error" });
  }
};