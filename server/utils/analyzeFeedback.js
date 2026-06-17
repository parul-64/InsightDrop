const analyzeFeedback = (message) => {
  const text = message.toLowerCase();

  let category = "General";
  let sentiment = "Neutral";
  let priority = "Low";

  const positiveWords = [
    "good",
    "great",
    "nice",
    "love",
    "amazing",
    "excellent",
    "beautiful",
    "awesome",
    "perfect",
    "best",
  ];

  const negativeWords = [
    "bad",
    "poor",
    "hate",
    "confusing",
    "problem",
    "issue",
    "broken",
    "difficult",
    "ugly",
    "worst",
  ];

  const isPositive = positiveWords.some((word) => text.includes(word));
  const isNegative = negativeWords.some((word) => text.includes(word));

  if (isPositive) sentiment = "Positive";
  if (isNegative) sentiment = "Negative";
  if (
  text.includes("not working") ||
  text.includes("bug") ||
  text.includes("error") ||
  text.includes("crash")
) {
  sentiment = "Negative";
}

  const talksAboutUI =
    text.includes("design") ||
    text.includes("ui") ||
    text.includes("layout") ||
    text.includes("color") ||
    text.includes("navbar") ||
    text.includes("interface");

  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("not working") ||
    text.includes("crash") ||
    text.includes("broken")
  ) {
    category = "Bug";
  } else if (
    text.includes("slow") ||
    text.includes("loading") ||
    text.includes("performance")
  ) {
    category = "Performance";
  } else if (isPositive && talksAboutUI) {
    category = "Appreciation";
  } else if (!isPositive && talksAboutUI) {
    category = "UI Issue";
  } else if (
    text.includes("add") ||
    text.includes("feature") ||
    text.includes("need") ||
    text.includes("want")
  ) {
    category = "Feature Request";
  } else if (isPositive) {
    category = "Appreciation";
  }

  if (
    text.includes("urgent") ||
    text.includes("critical") ||
    text.includes("crash") ||
    text.includes("not working")
  ) {
    priority = "High";
  } else if (
    text.includes("slow") ||
    text.includes("bug") ||
    text.includes("issue") ||
    text.includes("confusing")
  ) {
    priority = "Medium";
  }

  return {
    category,
    sentiment,
    priority,
  };
};

module.exports = analyzeFeedback;