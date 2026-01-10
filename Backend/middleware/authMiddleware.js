const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER RECEIVED:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED JWT:", decoded);

    req.user = decoded; // { userId, role }

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Export as named export
module.exports = { verifyToken };

// ✅ If you also need default export for backward compatibility
// module.exports = verifyToken;
// module.exports.verifyToken = verifyToken;