const express = require("express");
const router = express.Router();

const {
  generateFeedbackSummary,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

router.post("/summary", protect, generateFeedbackSummary);

module.exports = router;