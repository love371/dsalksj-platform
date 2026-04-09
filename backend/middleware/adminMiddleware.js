// Import jsonwebtoken package
const jwt = require("jsonwebtoken");

// Middleware to protect admin-only routes
const adminMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization");

    // If token is missing, block access
    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // Remove "Bearer " if frontend sends Bearer token
    const actualToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Check admin role inside token
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    // Save decoded data in request
    req.user = decoded;

    // Continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// Export middleware
module.exports = adminMiddleware;