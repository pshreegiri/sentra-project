const Incident = require("../models/Incident");
const generateReferenceId = require("../utils/generateReferenceId");

// ================= CREATE INCIDENT (STUDENT / STAFF) =================
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
      accusedRole,
      accusedDept,
      relationship,
      isAnonymous,
    } = req.body;

    // -----------------------
    // VALIDATION
    // -----------------------
    if (
      !incidentType ||
      !description ||
      !location ||
      !dateTime ||
      !accusedName ||
      !accusedRole
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const referenceId = generateReferenceId();

    const incident = await Incident.create({
      referenceId,
      incidentType,
      description,
      location,
      dateTime: new Date(dateTime),

      // ✅ ACCUSED (never anonymous)
      accused: {
        name: accusedName,
        role: accusedRole,
        department: accusedDept || "",
        relationship: relationship || "",
      },

      // 🔐 Reporter anonymity flag
      isAnonymous,

      // 🔐 Always store reporter internally
      reportedBy: {
        userId: req.user.userId,
        role: req.user.role,
      },
    });

    res.status(201).json({
      message: "Incident submitted successfully",
      referenceId,
    });
  } catch (error) {
    console.error("❌ INCIDENT ERROR:", error);
    res.status(500).json({ message: "Error submitting incident" });
  }
};

// ================= GET MY INCIDENTS (STUDENT / STAFF) =================
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
    console.error("❌ FETCH MY INCIDENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your incidents" });
  }
};

// ================= GET ALL INCIDENTS (ADMIN ONLY) =================
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });

    // 🔐 Hide reporter identity for anonymous reports
    const sanitizedIncidents = incidents.map((incident) => {
      const obj = incident.toObject();

      if (obj.isAnonymous) {
        obj.reportedBy = null;
      }

      return obj;
    });

    res.status(200).json(sanitizedIncidents);
  } catch (error) {
    console.error("❌ FETCH ALL INCIDENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
};
