// Load environment variables
require("dotenv").config();

// Import required libraries
const express = require("express");
const cors = require("cors");

// Import MongoDB connection
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");

// Create express app
const app = express();

// Connect database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// ==========================
// ROUTES
// ==========================

// Auth routes
app.use("/api/auth", authRoutes);

// Post routes
app.use("/api/posts", postRoutes);


// ==========================
// TEST ROUTE
// ==========================

app.get("/", (req, res) => {
  res.send("dsalksj Gaming Platform 🎮 Backend Running");
});


// ==========================
// START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});