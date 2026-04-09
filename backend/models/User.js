// Import mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Create a schema (structure) for users
const UserSchema = new mongoose.Schema(
  {
    // Username field
    username: {
      type: String,          // Data type is string
      required: true,        // User must provide username
      unique: true,          // No two users can have same username
      trim: true,            // Removes extra spaces from start/end
      minlength: 3           // Minimum 3 characters
    },

    // Email field
    email: {
      type: String,          // Email stored as string
      required: true,        // Email is mandatory
      unique: true,          // Prevent duplicate accounts
      trim: true,            // Removes extra spaces
      lowercase: true        // Stores email in lowercase
    },

    // Password field
    password: {
      type: String,          // Stored as string
      required: true,        // User must provide password
      minlength: 6           // Minimum password length
      // NOTE: This stores the hashed password, not plain text
    },

    // NEW: Role field for admin/user system
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true
  }
);

// Export the model so other files can use it
// "User" becomes the collection name in MongoDB
module.exports = mongoose.model("User", UserSchema);