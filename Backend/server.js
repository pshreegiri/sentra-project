const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const incidentRoutes = require("./routes/incidentRoutes");
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api/incidents", incidentRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("👉 Connected DB:", mongoose.connection.name);
  })
  .catch((err) => console.log("❌ MongoDB error:", err));


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
