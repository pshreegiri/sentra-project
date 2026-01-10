





import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([
    {
      referenceId: "INC001",
      type: "Harassment",
      location: "Classroom",
      status: "Pending",
      reportedBy: "Student",
      description: "Student harassment case in class.",
    },
    {
      referenceId: "INC002",
      type: "Bullying",
      location: "Playground",
      status: "In Review",
      reportedBy: "Staff",
      description: "Bullying reported during break.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...incidents];
    updated[index].status = newStatus;
    setIncidents(updated);
  };

  const filteredIncidents = incidents.filter(
    (i) =>
      i.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      i.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={() => navigate("/aware")}>Awareness Hub</button>
          <button className="logout-btn" onClick={() => navigate("/admin-login")}>
            Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        className="search-box"
        placeholder="Search by Reference ID or Type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="incident-table">
        <thead>
          <tr>
            <th>Reference ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Reported By</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncidents.map((inc, index) => (
            <tr key={index}>
              <td>{inc.referenceId}</td>
              <td>{inc.type}</td>
              <td>{inc.location}</td>
              <td>
                <select
                  value={inc.status}
                  onChange={(e) =>
                    handleStatusChange(index, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>In Review</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
              </td>
              <td>{inc.reportedBy}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => setSelectedIncident(inc)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedIncident && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Incident Details</h3>
            <p><b>ID:</b> {selectedIncident.referenceId}</p>
            <p><b>Type:</b> {selectedIncident.type}</p>
            <p><b>Location:</b> {selectedIncident.location}</p>
            <p><b>Status:</b> {selectedIncident.status}</p>
            <p><b>Description:</b> {selectedIncident.description}</p>

            <button onClick={() => setSelectedIncident(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
