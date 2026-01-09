const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// REGISTER USER
// =======================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      department,
      courseYear,
      password,
      role,
    } = req.body;

    // -----------------------
    // COMMON VALIDATION
    // -----------------------
    if (!name || !email || !mobile || !department || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // -----------------------
    // ROLE-BASED VALIDATION
    // -----------------------
    if (role === "student" && !courseYear) {
      return res
        .status(400)
        .json({ message: "Course/Year is required for students" });
    }

    // -----------------------
    // CHECK EXISTING USER
    // -----------------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // -----------------------
    // HASH PASSWORD
    // -----------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // -----------------------
    // CREATE USER
    // -----------------------
    const user = await User.create({
      name,
      email,
      mobile,
      department,
      courseYear: role === "student" ? courseYear : undefined,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Registration successful",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// LOGIN USER + JWT
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // -----------------------
    // VALIDATION
    // -----------------------
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // -----------------------
    // FIND USER
    // -----------------------
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // -----------------------
    // CHECK PASSWORD
    // -----------------------
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // -----------------------
    // CREATE JWT TOKEN
    // -----------------------
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // -----------------------
    // RESPONSE
    // -----------------------
    res.status(200).json({
      message: "Login successful",
      token, // 🔐 IMPORTANT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        courseYear: user.courseYear,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// EXPORTS
// =======================
module.exports = {
  registerUser,
  loginUser,
};
