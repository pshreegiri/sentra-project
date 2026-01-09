import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import SubmitIncident from "./SubmitIncident";
import MyIncidents from "./MyIncidents";
import "../pages/StudentDashboard.css";

export default function StudentDashboard() {
  const { authUser, logout } = useContext(AuthContext);
  const [view, setView] = useState("submit");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Student Dashboard</h2>
          <p>
            Welcome, <strong>{authUser?.email}</strong>
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-nav">
        <button
          className={`nav-btn ${view === "submit" ? "active" : ""}`}
          onClick={() => setView("submit")}
        >
          Report Incident
        </button>

        <button
          className={`nav-btn ${view === "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          My Incidents
        </button>
      </div>

      <div className="dashboard-content">
        {view === "submit" && <SubmitIncident />}
        {view === "list" && <MyIncidents />}
      </div>
    </div>
  );
}
