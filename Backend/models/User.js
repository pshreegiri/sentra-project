const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    // ✅ Required ONLY for students
    courseYear: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
