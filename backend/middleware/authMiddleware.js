// Import jsonwebtoken package
const jwt = require("jsonwebtoken");

// Middleware to protect normal logged-in routes
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization");

    // If token is missing, block access
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    // Remove "Bearer " if frontend sends token in Bearer format
    const actualToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    // Verify token using secret key
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Save decoded token data in req.user
    req.user = decoded;

    // Continue to next middleware / route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// Export middleware
module.exports = authMiddleware;