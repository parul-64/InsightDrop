import { useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-navbar">
      <h2>InsightDrop</h2>

      <div>
        <button onClick={() => navigate("/about")}>About</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/docs")}>Docs</button>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AppNavbar;