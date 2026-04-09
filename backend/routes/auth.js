// Import express to create routes
const express = require("express");

// Create router object
const router = express.Router();

// Import bcrypt for password hashing and password checking
const bcrypt = require("bcryptjs");

// Import jsonwebtoken for creating login token
const jwt = require("jsonwebtoken");

// Import User model
const User = require("../models/User");

// Import auth middleware
const authMiddleware = require("../middleware/authMiddleware");


// ==========================
// SIGNUP ROUTE
// ==========================

router.post("/signup", async (req, res) => {
  try {
    // Get user data from request body
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    // Remove extra spaces from username and email
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Username validation
    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long"
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists with same email
    const existingEmailUser = await User.findOne({ email: trimmedEmail });

    if (existingEmailUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    // Check if username is already taken
    const existingUsernameUser = await User.findOne({ username: trimmedUsername });

    if (existingUsernameUser) {
      return res.status(400).json({
        message: "Username is already taken"
      });
    }

    // Create salt for hashing password
    const salt = await bcrypt.genSalt(10);

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword
      // role defaults to "user"
    });

    // Save user in database
    await newUser.save();

    // Send success response
    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error during signup"
    });
  }
});


// ==========================
// LOGIN ROUTE
// ==========================

router.post("/login", async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    // Clean email before searching
    const trimmedEmail = email.trim().toLowerCase();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    // Find user by email
    const user = await User.findOne({ email: trimmedEmail });

    // If user does not exist
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password is wrong
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role // important for admin panel access
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Send login response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error during login"
    });
  }
});


// ==========================
// PROTECTED ROUTE
// ==========================

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Find current logged-in user using token data
    const user = await User.findById(req.user.userId).select("-password");

    // If user is not found
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Send response without password
    res.status(200).json({
      message: "Protected route accessed successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching user"
    });
  }
});

// Export router
module.exports = router;