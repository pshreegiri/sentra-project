import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../pages/MyIncidents.css"; 

export default function MyIncidents() {
  const { user } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        // Fetch all incidents from backend
        const res = await axios.get("http://localhost:5000/api/incidents");

        const myIncidents = res.data.filter(
          (incident) => incident.reportedBy?.email === user.email
        );

        setIncidents(myIncidents);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchMyIncidents();
  }, [user]);

  if (loading) {
    return <p className="loading-text">Loading incidents...</p>;
  }

  return (
    <div className="incidents-container">
      <h3 className="incidents-title">My Incidents</h3>

      {incidents.length === 0 ? (
        <p className="no-incidents">No incidents submitted yet.</p>
      ) : (
        incidents.map((incident) => (
          <div key={incident._id} className="incident-card">
            <p>
              <strong>Reference ID:</strong>{" "}
              <span className="incident-ref">{incident.referenceId}</span>
            </p>
            <p><strong>Type:</strong> {incident.incidentType}</p>
            <p><strong>Description:</strong> {incident.description}</p>
            <p><strong>Location:</strong> {incident.location}</p>
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(incident.dateTime).toLocaleString()}
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
