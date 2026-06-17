import { useState } from "react";
import axios from "axios";

function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [projectKey, setProjectKey] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitFeedback = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("https://insightdrop.onrender.com/api/feedback", {
        projectKey,
        name,
        email,
        message,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setProjectKey("");
        setName("");
        setEmail("");
        setMessage("");
      }, 2500);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  if (loading) {
    return (
      <div className="feedback-box">
        <div className="loader"></div>
        <h2>Submitting Feedback...</h2>
        <p>Please wait while we save your response.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="feedback-box">
        <h1>✓ Feedback Submitted</h1>
        <p>Thank you for sharing your insight.</p>
      </div>
    );
  }

  return (
    <div className="feedback-box">
      <h1>Submit Feedback</h1>

      <form onSubmit={submitFeedback}>
        <input
          type="text"
          placeholder="Project Key"
          value={projectKey}
          onChange={(e) => setProjectKey(e.target.value)}
        />

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default FeedbackForm;