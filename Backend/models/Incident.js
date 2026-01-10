const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    // ======================
    // SYSTEM GENERATED
    // ======================
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },

    // ======================
    // INCIDENT DETAILS
    // ======================
    incidentType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    dateTime: {
      type: Date,
      required: true,
    },

    // ======================
    // ACCUSED (NEVER ANONYMOUS)
    // ======================
    accused: {
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String, // Student / Staff / Unknown
        required: true,
      },
      department: {
        type: String,
        default: "",
      },
      relationship: {
        type: String,
        default: "",
      },
    },

    // ======================
    // REPORTER (CAN BE ANONYMOUS)
    // ======================
    isAnonymous: {
      type: Boolean,
      default: false,
    },

    // 🔐 JWT-based reporting user
    reportedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
      },
    },

    // ======================
    // STATUS & PRIORITY
    // ======================
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "In Review", "In Progress", "Closed"],
    },

    // ✅ NEW: Priority Level
    priority: {
      type: String,
      default: "Medium",
      enum: ["Low", "Medium", "High", "Critical"],
    },

    // ✅ NEW: Comments/Notes by Admin
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        addedBy: {
          type: String,
          default: "Admin",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ✅ NEW: Resolution Notes (when closing)
    resolution: {
      notes: {
        type: String,
        default: "",
      },
      resolvedAt: {
        type: Date,
      },
      resolvedBy: {
        type: String,
        default: "Admin",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);