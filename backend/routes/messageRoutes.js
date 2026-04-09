const express = require("express");

// Import controller
const { getMessage } = require("../controllers/messageController");

const router = express.Router();

// Route for API
router.get("/message", getMessage);

module.exports = router;