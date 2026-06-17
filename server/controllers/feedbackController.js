const Feedback = require("../models/Feedback");
const Project = require("../models/Project");
const analyzeFeedback = require("../utils/analyzeFeedback");

const submitFeedback = async (req, res) => {
  try {
    const { projectKey, name, email, message } = req.body;

    if (!projectKey || !name || !email || !message) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const project = await Project.findOne({ projectKey });

    if (!project) {
      return res.status(404).json({ message: "Invalid project key" });
    }

    const analysis = analyzeFeedback(message);

    const feedback = await Feedback.create({
      project: project._id,
      name,
      email,
      message,
      category: analysis.category,
      sentiment: analysis.sentiment,
      priority: analysis.priority,
    });

  if (req.headers.accept && req.headers.accept.includes("text/html")) {
  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Feedback Submitted</title>
        <meta http-equiv="refresh" content="2;url=http://127.0.0.1:5500/test.html">
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0f172a;
            color: white;
            font-family: Arial, sans-serif;
          }
          .box {
            background: #111827;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            border: 1px solid #334155;
          }
          h1 {
            color: #22c55e;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Feedback Submitted Successfully!</h1>
          <p>Thank you for sharing your feedback.</p>
        </div>
      </body>
    </html>
  `);
}

res.status(201).json({
  message: "Feedback submitted successfully",
  feedback,
});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getProjectFeedbacks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const feedbacks = await Feedback.find({
      project: projectId,
    }).sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.deleteOne();

    res.status(200).json({
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
  getProjectFeedbacks,
  deleteFeedback,
};