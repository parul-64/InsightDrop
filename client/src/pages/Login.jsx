import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

setLoading(false);
setSuccess(true);

setTimeout(() => {
  navigate("/dashboard");
}, 3000);
    } catch (error) {
      setLoading(false);

      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);

      alert(error.response?.data?.message || error.message);
    }
  };

if (loading) {
  return (
    <div className="auth-box">
      <div className="loader"></div>
      <h2>Logging In...</h2>
      <p>Please wait while we verify your account.</p>
    </div>
  );
}

  if (success) {
    return (
      <div className="auth-box">
        <h1>✓ Login Successful</h1>
        <p>Redirecting to Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <h1>Welcome Back</h1>
<p>Sign in to manage your feedback projects.</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;