import { useState } from "react";
import "./login.css";

// DEMO ONLY: real login will be checked by the Java backend
const accounts = [
  { email: "student@college.edu", password: "student123", role: "STUDENT", name: "Student" },
  { email: "admin@messmate.com", password: "admin123", role: "ADMIN", name: "Mess Admin" },
];

export default function Login({ onLogin }) {
  const [role, setRole] = useState("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function chooseRole(r) {
    setRole(r);
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    const account = accounts.find(
      (a) =>
        a.email === email.trim().toLowerCase() &&
        a.password === password &&
        a.role === role
    );
    if (!account) {
      setError("Invalid email or password for this role.");
      return;
    }
    setError("");
    onLogin({ role: account.role, email: account.email, name: account.name });
  }

  function fillDemo() {
    const demo = accounts.find((a) => a.role === role);
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-side">
          <span className="logo">🍽️</span>
          <h1>MessMate</h1>
          <p>
            Your hostel mess, made simple. See the menu, skip meals, share
            feedback and stay updated.
          </p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <h2>Welcome back 👋</h2>
          <p className="sub">Log in to continue</p>

          <div className="role-toggle">
            <button
              type="button"
              className={role === "STUDENT" ? "active" : ""}
              onClick={() => chooseRole("STUDENT")}
            >
              🎓 Student
            </button>
            <button
              type="button"
              className={role === "ADMIN" ? "active" : ""}
              onClick={() => chooseRole("ADMIN")}
            >
              🛠️ Admin
            </button>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={show ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn">
            Log in as {role === "ADMIN" ? "Admin" : "Student"}
          </button>

          <p className="demo-hint">
            Testing?{" "}
            <button type="button" onClick={fillDemo}>
              Use the demo {role.toLowerCase()} account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}