const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔍 STEP 3 DEBUG
    console.log("AUTH HEADER RECEIVED:", authHeader);

    // Expect: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 STEP 3 DEBUG
    console.log("DECODED JWT:", decoded);

    // attach decoded user info to request
    req.user = decoded; // { userId, role }

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
