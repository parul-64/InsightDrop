import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="dashboard-box">
      <Navbar />

        <div className="hero">


        <p>
          InsightDrop is a developer-friendly feedback collection platform
          designed to help teams gather, manage, and analyze user feedback
          from any website using a unique project key.
        </p>
      </div>

      <div className="card">
        <h2>What You Can Do</h2>

        <ul className="about-list">
          <li>Create and manage multiple feedback projects.</li>
          <li>Generate unique project keys.</li>
          <li>Collect feedback from external websites.</li>
          <li>Automatically categorize feedback.</li>
          <li>Detect sentiment and priority levels.</li>
          <li>Visualize feedback through analytics dashboards.</li>
          <li>Generate AI-powered insights using Gemini.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Why InsightDrop?</h2>

        <p>
          Instead of manually reading hundreds of feedback messages, 
          InsightDrop automatically analyzes feedback and highlights important insights, 
          helping teams make faster product decisions.
        </p>
      </div>
    </div>
  );
}

export default About;