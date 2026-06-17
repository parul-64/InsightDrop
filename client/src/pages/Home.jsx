import Login from "./Login";

function Home() {
  return (
    <div className="simple-home">
      <div className="home-brand">
        <h2>InsightDrop</h2>
      </div>

      <div className="home-layout">
        <div className="home-text">
          <span>Feedback Intelligence Platform</span>

          <h1>
            Capture feedback from every project.
          </h1>

          <p>
            Create project keys, collect user feedback, and manage all responses
            from one simple dashboard.
          </p>
        </div>

        <div className="home-form">
          <Login />
        </div>
      </div>
    </div>
  );
}

export default Home;