import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  if (loading) {
    return (
      <div className="auth-box">
        <div className="loader"></div>
        <h2>Creating Account...</h2>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-box">
        <h1>✓ Account Created</h1>
        <p>Redirecting to Login...</p>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;