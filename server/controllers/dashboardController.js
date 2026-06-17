const Feedback = require("../models/Feedback");

const getDashboardStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const totalFeedbacks = await Feedback.countDocuments({
      project: projectId,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayFeedbacks = await Feedback.countDocuments({
      project: projectId,
      createdAt: { $gte: today },
    });

    res.status(200).json({
      totalFeedbacks,
      todayFeedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};