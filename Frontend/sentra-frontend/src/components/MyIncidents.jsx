import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../pages/MyIncidents.css";

export default function MyIncidents() {
  const { token } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/incidents/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIncidents(res.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, [token]);

  if (loading) {
    return <p className="loading-text">Loading incidents...</p>;
  }

  return (
    <div className="incidents-container">
      <h3 className="incidents-title">My Submitted Incidents</h3>

      {incidents.length === 0 ? (
        <p className="no-incidents">No incidents submitted yet.</p>
      ) : (
        incidents.map((incident) => (
          <div key={incident._id} className="incident-card">
            <p>
              <strong>Reference ID:</strong>{" "}
              <span className="incident-ref">{incident.referenceId}</span>
            </p>

            <p>
              <strong>Type:</strong> {incident.incidentType}
            </p>

            <p>
              <strong>Description:</strong> {incident.description}
            </p>

            <p>
              <strong>Location:</strong> {incident.location}
            </p>

            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(incident.dateTime).toLocaleString()}
            </p>

            <hr />

            {/* ✅ ACCUSED DETAILS (NEVER ANONYMOUS) */}
            <p>
              <strong>Accused Name:</strong>{" "}
              {incident.accused?.name || "N/A"}
            </p>

            <p>
              <strong>Accused Role:</strong>{" "}
              {incident.accused?.role || "N/A"}
            </p>

            {incident.accused?.department && (
              <p>
                <strong>Department:</strong>{" "}
                {incident.accused.department}
              </p>
            )}

            {incident.accused?.relationship && (
              <p>
                <strong>Relationship:</strong>{" "}
                {incident.accused.relationship}
              </p>
            )}

            <p>
              <strong>Submitted As:</strong>{" "}
              {incident.isAnonymous ? "Anonymous" : "Non-anonymous"}
            </p>

            <p
              className={`incident-status ${
                incident.status.toLowerCase().replace(" ", "-")
              }`}
            >
              <strong>Status:</strong> {incident.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
