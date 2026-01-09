const Incident = require("../models/Incident");
const generateReferenceId = require("../utils/generateReferenceId");

// ================= CREATE INCIDENT (STUDENT) =================
exports.createIncident = async (req, res) => {
  try {
    // 🔐 Ensure JWT middleware ran
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const {
      incidentType,
      description,
      location,
      dateTime,
      accusedName,
      accusedDetails,
      isAnonymous,
    } = req.body;

    if (!incidentType || !description || !location || !dateTime) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const referenceId = generateReferenceId();

    const incident = await Incident.create({
      referenceId,
      incidentType,
      description,
      location,
      dateTime: new Date(dateTime),
      accusedName,
      accusedDetails,
      isAnonymous,
      reportedBy: isAnonymous
        ? null
        : {
            userId: req.user.userId,
            role: req.user.role,
          },
    });

    res.status(201).json({
      message: "Incident submitted successfully",
      referenceId,
    });
  } catch (error) {
    console.error("INCIDENT ERROR:", error);
    res.status(500).json({ message: "Error submitting incident" });
  }
};

// ================= GET STUDENT'S OWN INCIDENTS =================
exports.getMyIncidents = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const incidents = await Incident.find({
      "reportedBy.userId": req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(incidents);
  } catch (error) {
    console.error("FETCH MY INCIDENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your incidents" });
  }
};

// ================= GET ALL INCIDENTS (STAFF / ADMIN) =================
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.status(200).json(incidents);
  } catch (error) {
    console.error("FETCH ALL INCIDENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
};
