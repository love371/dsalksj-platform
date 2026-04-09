// Import mongoose library
const mongoose = require("mongoose");

// Function to connect MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    // Check if URI exists (important for debugging)
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Atlas connected successfully 🚀");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;