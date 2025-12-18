import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onSuccess, error }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Enter Username & Password!!");
      return;
    }
    onSuccess(username, password);
    navigate("/mainList");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">Trading Dashboard Login</div>

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="login-hint">
          Secure WebSocket authentication
        </div>
      </div>
    </div>
  );
}
