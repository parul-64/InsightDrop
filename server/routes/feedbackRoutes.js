const express = require("express");
const router = express.Router();

const {
  submitFeedback,
  getProjectFeedbacks,
  deleteFeedback,
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");

router.post("/", submitFeedback);
router.get("/:projectId", protect, getProjectFeedbacks);
router.delete("/:feedbackId", protect, deleteFeedback);

module.exports = router;