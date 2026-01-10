const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType"
    },
    userType: {
      type: String,
      required: true,
      enum: ["Student", "Staff"]
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "staff"]
    },
    department: {
      type: String,
      required: true
    },
    review: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);