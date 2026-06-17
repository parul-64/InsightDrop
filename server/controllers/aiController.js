const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateFeedbackSummary = async (req, res) => {
  try {
    const { feedbacks } = req.body;

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(400).json({
        message: "No feedbacks provided",
      });
    }

    const feedbackText = feedbacks
      .map((fb, index) => `${index + 1}. ${fb.message}`)
      .join("\n");

    const prompt = `
You are an assistant inside a feedback intelligence dashboard.

Analyze these user feedback messages.

Feedbacks:
${feedbackText}

Return plain text only.

Return in this exact format:

TOP KEYWORDS:
keyword1
keyword2
keyword3
keyword4
keyword5

AI INSIGHTS:
- Overall user sentiment: ...
- Main issue or appreciation pattern: ...
- Recommended next action: ...

Do not use markdown.
Do not use ** symbols.
Do not add extra explanations.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      summary: response.text,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI summary failed",
      error: error.message,
    });
  }
};

module.exports = {
  generateFeedbackSummary,
};