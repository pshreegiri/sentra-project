import { useNavigate } from "react-router-dom";
import "../pages/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const incidents = [
    {
      id: "INC001",
      type: "Harassment",
      location: "Classroom",
      status: "In Review",
    },
    {
      id: "INC002",
      type: "Ragging",
      location: "Hostel",
      status: "In Progress",
    },
    {
      id: "INC003",
      type: "Theft",
      location: "Library",
      status: "Resolved",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="header-buttons">
          <button className="hub-btn" onClick={() => navigate("/aware")}>
            Awareness Hub
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Incident Tracking */}
      <h3 className="section-title">Incident Tracking</h3>

      <table className="incident-table">
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i, index) => (
            <tr key={index}>
              <td>{i.id}</td>
              <td>{i.type}</td>
              <td>{i.location}</td>
              <td>
                <span className={`status ${i.status.replace(" ", "").toLowerCase()}`}>
                  {i.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
