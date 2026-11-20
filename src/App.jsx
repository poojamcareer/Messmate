import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import StudentApp from "./StudentApp";
import AdminApp from "./AdminApp";

function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem("messmate-auth"));
  } catch {
    return null;
  }
}

export default function App() {
  const [auth, setAuth] = useState(loadAuth); // { role, email, name } or null
  const navigate = useNavigate();

  function handleLogin(account) {
    localStorage.setItem("messmate-auth", JSON.stringify(account));
    setAuth(account);
    navigate(account.role === "ADMIN" ? "/admin" : "/student");
  }

  function handleLogout() {
    localStorage.removeItem("messmate-auth");
    setAuth(null);
    navigate("/login");
  }

  const home = auth?.role === "ADMIN" ? "/admin" : "/student";

  return (
    <Routes>
      <Route path="/login"
             element={auth ? <Navigate to={home} replace /> : <Login onLogin={handleLogin} />} />
      <Route path="/student"
             element={auth?.role === "STUDENT"
               ? <StudentApp onLogout={handleLogout} />
               : <Navigate to="/login" replace />} />
      <Route path="/admin"
             element={auth?.role === "ADMIN"
               ? <AdminApp onLogout={handleLogout} />
               : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}