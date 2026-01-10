const jwt = require("jsonwebtoken");

exports.verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("🔍 ADMIN AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔍 DECODED ADMIN TOKEN:", decoded);

    // Check if role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Admin auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};