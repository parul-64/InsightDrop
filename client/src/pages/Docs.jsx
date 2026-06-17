import Navbar from "../components/Navbar";

function Docs() {
  return (
    <div className="dashboard-box">
      <Navbar />

      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Feedback Form Setup
      </h1>

      <div className="card">
        <pre>
{`<form action="http://localhost:5000/api/feedback" method="POST">

  <input type="hidden" name="projectKey" value="INS_your_project_key" />

  <input type="text" name="name" placeholder="Your Name" required />

  <input type="email" name="email" placeholder="Your Email" required />

  <textarea name="message" placeholder="Your Feedback" required></textarea>

  <button type="submit">Submit Feedback</button>

</form>`}
        </pre>
      </div>
    </div>
  );
}

export default Docs;