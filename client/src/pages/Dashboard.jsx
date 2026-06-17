import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [openProjectId, setOpenProjectId] = useState(null);

  const [creatingProject, setCreatingProject] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [projectDeleted, setProjectDeleted] = useState(false);
  const [projectError, setProjectError] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [keyCopied, setKeyCopied] = useState(false);

  const [aiSummary, setAiSummary] = useState("");
  const [topKeywords, setTopKeywords] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const token = localStorage.getItem("token");

  const positiveCount = feedbacks.filter((fb) => fb.sentiment === "Positive").length;
  const negativeCount = feedbacks.filter((fb) => fb.sentiment === "Negative").length;
  const neutralCount = feedbacks.filter((fb) => fb.sentiment === "Neutral").length;

  const bugCount = feedbacks.filter((fb) => fb.category === "Bug").length;
  const uiCount = feedbacks.filter((fb) => fb.category === "UI Issue").length;
  const performanceCount = feedbacks.filter((fb) => fb.category === "Performance").length;
  const featureRequestCount = feedbacks.filter((fb) => fb.category === "Feature Request").length;
  const appreciationCount = feedbacks.filter((fb) => fb.category === "Appreciation").length;

  const categoryData = [
    { name: "Bug", count: bugCount },
    { name: "UI Issue", count: uiCount },
    { name: "Performance", count: performanceCount },
    { name: "Feature", count: featureRequestCount },
    { name: "Appreciation", count: appreciationCount },
  ];

  const sentimentData = [
    { name: "Positive", value: positiveCount },
    { name: "Negative", value: negativeCount },
    { name: "Neutral", value: neutralCount },
  ];

  const sentimentColors = ["#22c55e", "#ef4444", "#94a3b8"];

  const validCategories = categoryData.filter((item) => item.count > 0);

  const topCategory =
    validCategories.length > 0
      ? validCategories.reduce((max, item) =>
          item.count > max.count ? item : max
        ).name
      : "No clear category";

  const filteredFeedbacks = feedbacks.filter((fb) => {
  const search = searchTerm.toLowerCase();

  return (
    fb.name.toLowerCase().includes(search) ||
    fb.email.toLowerCase().includes(search) ||
    fb.message.toLowerCase().includes(search) ||
    fb.category.toLowerCase().includes(search) ||
    fb.sentiment.toLowerCase().includes(search) ||
    fb.priority.toLowerCase().includes(search)
  );
});

  const hasIssues = bugCount > 0 || uiCount > 0 || performanceCount > 0;
const hasFeatureRequests = featureRequestCount > 0;

const overviewText =
  feedbacks.length === 0
    ? "Select a project to generate a feedback overview."
    : appreciationCount > 0 && hasIssues
    ? `Feedback is mixed. Users appreciate the product, but ${topCategory} is also appearing in the feedback and should be monitored.`
    : appreciationCount > 0 && hasFeatureRequests
    ? "Users are responding positively to the product and also suggesting new improvements."
    : topCategory === "Appreciation"
    ? "Users are responding positively to the product. Feedback mainly highlights appreciation, which indicates a good user experience."
    : negativeCount > positiveCount
    ? `Most reported feedback is related to ${topCategory}. Addressing this area could significantly improve user experience.`
    : positiveCount > negativeCount
    ? `Users are generally satisfied with the product. The main feedback area is ${topCategory}, so this area can be monitored while improving the product.`
    : "Feedback is currently mixed. Additional feedback will help identify stronger user trends and priorities.";

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://insightdrop.onrender.com/api/projects", 
      {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch projects");
    }
  };

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setProjectError(true);
      setTimeout(() => setProjectError(false), 2500);
      return;
    }

    try {
      setCreatingProject(true);

      await axios.post(
        "https://insightdrop.onrender.com/api/projects",
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCreatingProject(false);
      setProjectSuccess(true);

      setTimeout(() => {
        setProjectSuccess(false);
        setProjectName("");
        fetchProjects();
      }, 2500);
    } catch (error) {
      setCreatingProject(false);
      console.log(error);
      alert("Failed to create project");
    }
  };

  const viewFeedbacks = async (project) => {
    try {
      if (openProjectId === project._id) {
        setOpenProjectId(null);
        setFeedbacks([]);
        return;
      }

      setOpenProjectId(project._id);

      const res = await axios.get(
        `https://insightdrop.onrender.com/api/feedback/${project._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbacks(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch feedbacks");
    }
  };

  const generateAISummary = async () => {
  try {
    setLoadingSummary(true);

    const res = await axios.post(
      "https://insightdrop.onrender.com/api/ai/summary",
      { feedbacks },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = res.data.summary;
    const parts = result.split("AI INSIGHTS:");
    if (parts.length === 2) {
      const keywordsPart = parts[0]
      .replace("TOP KEYWORDS:", "")
      .trim()
      .split("\n")
      .filter((item) => item.trim() !== "");
      
      setTopKeywords(keywordsPart);
      setAiSummary(parts[1].trim());
    } else {
      setAiSummary(result);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to generate AI summary");
  } finally {
    setLoadingSummary(false);
  }
};

  const deleteFeedback = async (feedbackId) => {
    try {
      await axios.delete(`https://insightdrop.onrender.com/api/feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
      setFeedbackToDelete(null);
    } catch (error) {
      console.log(error);
      alert("Failed to delete feedback");
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`https://insightdrop.onrender.com/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjectDeleted(true);

      setTimeout(() => {
        setProjectDeleted(false);
        setFeedbacks([]);
        setOpenProjectId(null);
        fetchProjects();
      }, 2500);
    } catch (error) {
      console.log(error);
      alert("Failed to delete project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (creatingProject) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <div className="loader"></div>
          <h2>Creating Project...</h2>
          <p>Please wait while we generate your project key.</p>
        </div>
      </div>
    );
  }

  if (projectSuccess) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <h1>✓ Project Created</h1>
          <p>Your project has been created successfully.</p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <h1>Project Name Required</h1>
          <p>Please enter a project name before creating a project.</p>
        </div>
      </div>
    );
  }

  if (projectToDelete) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <h2>Delete Project?</h2>
          <p>This action cannot be undone.</p>

          <div className="project-actions">
            <button onClick={() => setProjectToDelete(null)}>Cancel</button>
            <button
              className="delete-btn"
              onClick={() => {
                deleteProject(projectToDelete);
                setProjectToDelete(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (projectDeleted) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <h1>✓ Project Deleted</h1>
          <p>Your project has been removed successfully.</p>
        </div>
      </div>
    );
  }

  if (keyCopied) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <h2>✓ Project Key Copied</h2>
          <p>Your project key has been copied successfully.</p>
        </div>
      </div>
    );
  }

  if (feedbackToDelete) {
    return (
      <div className="dashboard-box">
        <div className="hero">
          <h2>Delete Feedback?</h2>
          <p>This feedback will be removed permanently.</p>

          <div className="project-actions">
            <button onClick={() => setFeedbackToDelete(null)}>Cancel</button>
            <button
              className="delete-btn"
              onClick={() => deleteFeedback(feedbackToDelete)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-box">
      <Navbar />

      <div className="hero">
        <h1>InsightDrop Dashboard</h1>
        <p>
          Create projects, generate project keys, collect feedback from external
          websites, and manage all responses in one place.
        </p>
      </div>

      <form onSubmit={createProject}>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <button type="submit">Create Project</button>
      </form>

      <h2>My Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="card">
            <h3>{project.name}</h3>

            <p className="project-key">Project Key: {project.projectKey}</p>

            <div className="project-actions">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(project.projectKey);
                  setKeyCopied(true);
                  setTimeout(() => setKeyCopied(false), 2500);
                }}
              >
                Copy Key
              </button>

              <button onClick={() => viewFeedbacks(project)}>
                {openProjectId === project._id ? "Hide Feedbacks" : "View Feedbacks"}
              </button>

              <button
                className="delete-btn"
                onClick={() => setProjectToDelete(project._id)}
              >
                Delete
              </button>
            </div>

            {openProjectId === project._id && (
              <div className="project-feedbacks">
                <h4>Feedbacks</h4>
                <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />

                {filteredFeedbacks.length === 0 ? (
                  <p>No matching feedback found.</p>
                ) : (
                  filteredFeedbacks.map((fb) => (
                    <div key={fb._id} className="card feedback-card">
                      <div className="feedback-header">
                        <div>
                          <h4>👤 {fb.name}</h4>
                          <p>📧 {fb.email}</p>
                        </div>

                        <button
                          className="delete-btn"
                          onClick={() => setFeedbackToDelete(fb._id)}
                        >
                          Delete
                        </button>
                      </div>

                      <p className="feedback-message">"{fb.message}"</p>

                      <div className="feedback-tags">
                        <span className="tag category-tag">{fb.category}</span>
                        <span className="tag sentiment-tag">{fb.sentiment}</span>
                        <span className="tag priority-tag">{fb.priority}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}

      <h2>Feedback Intelligence</h2>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{feedbacks.length}</h3>
          <p>Total Feedbacks</p>
        </div>

        <div className="stat-card">
          <h3>{positiveCount}</h3>
          <p>Positive</p>
        </div>

        <div className="stat-card">
          <h3>{negativeCount}</h3>
          <p>Negative</p>
        </div>

        <div className="stat-card">
          <h3>{featureRequestCount}</h3>
          <p>Feature Requests</p>
        </div>
      </div>

      <div className="card">
        <h2>Feedback Categories</h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />

              <Tooltip
                formatter={(value) => [`Count: ${value}`]}
                labelFormatter={() => ""}
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                }}
              />

              <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>Sentiment Overview</h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={entry.name} fill={sentimentColors[index]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`Count: ${value}`]}
                labelFormatter={() => ""}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>Feedback Overview</h2>
        <button onClick={generateAISummary}>
          {loadingSummary ? "Generating..." : "Generate AI Insights"}
        </button>
        {topKeywords.length > 0 && (
          <div className="card" style={{ marginTop: "15px" }}>
            <h3>Top Keywords</h3>
            
            <div className="keyword-list">
              {topKeywords.map((keyword, index) => (
                <span key={index} className="keyword-chip">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        {aiSummary && (
          <div className="card" style={{ marginTop: "15px" }}>
            <h3>AI Insights</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{aiSummary}</p>
          </div>
        )}
        <p style={{ lineHeight: "1.8" }}>{overviewText}</p>
      </div>
      </div>
  );
}

export default Dashboard;