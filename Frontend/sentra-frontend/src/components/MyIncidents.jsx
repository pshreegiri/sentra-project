import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../pages/MyIncidents.css";

export default function MyIncidents() {
  const { token } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null); // ✅ NEW: For modal

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
            <div className="incident-header">
              <p>
                <strong>Reference ID:</strong>{" "}
                <span className="incident-ref">{incident.referenceId}</span>
              </p>
              
              {/* ✅ Status Badge */}
              <span className={`status-badge ${incident.status.toLowerCase().replace(" ", "-")}`}>
                {incident.status}
              </span>
            </div>

            <p>
              <strong>Type:</strong> {incident.incidentType}
            </p>

            <p>
              <strong>Location:</strong> {incident.location}
            </p>

            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(incident.dateTime).toLocaleString()}
            </p>

            <p>
              <strong>Description:</strong> {incident.description}
            </p>

            <hr />

            {/* ✅ ACCUSED DETAILS */}
            <div className="accused-section">
              <h4>Accused Person</h4>
              <p>
                <strong>Name:</strong> {incident.accused?.name || "N/A"}
              </p>

              <p>
                <strong>Role:</strong> {incident.accused?.role || "N/A"}
              </p>

              {incident.accused?.department && (
                <p>
                  <strong>Department:</strong> {incident.accused.department}
                </p>
              )}

              {incident.accused?.relationship && (
                <p>
                  <strong>Relationship:</strong> {incident.accused.relationship}
                </p>
              )}
            </div>

            <hr />

            <p>
              <strong>Submitted As:</strong>{" "}
              {incident.isAnonymous ? (
                <span className="anonymous-badge">Anonymous</span>
              ) : (
                "Non-anonymous"
              )}
            </p>

            <p>
              <strong>Submitted On:</strong>{" "}
              {new Date(incident.createdAt).toLocaleString()}
            </p>

            {/* ✅ NEW: Resolution Section (Only for Closed incidents) */}
            {incident.status === "Closed" && incident.resolution?.notes && (
              <div className="resolution-section">
                <h4>📋 Resolution</h4>
                <p className="resolution-text">{incident.resolution.notes}</p>
                <p className="resolution-date">
                  Resolved on: {new Date(incident.resolution.resolvedAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* ✅ NEW: View Details Button */}
            <button 
              className="view-details-btn"
              onClick={() => setSelectedIncident(incident)}
            >
              View Full Details
            </button>
          </div>
        ))
      )}

      {/* ✅ NEW: Detail Modal */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Incident Details</h3>
            
            <div className="modal-content">
              <p>
                <strong>Reference ID:</strong> {selectedIncident.referenceId}
              </p>
              
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${selectedIncident.status.toLowerCase().replace(" ", "-")}`}>
                  {selectedIncident.status}
                </span>
              </p>

              <p>
                <strong>Type:</strong> {selectedIncident.incidentType}
              </p>

              <p>
                <strong>Location:</strong> {selectedIncident.location}
              </p>

              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(selectedIncident.dateTime).toLocaleString()}
              </p>

              <hr />

              <h4>Description</h4>
              <p className="description-text">{selectedIncident.description}</p>

              <hr />

              <h4>Accused Person</h4>
              <p>
                <strong>Name:</strong> {selectedIncident.accused?.name || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {selectedIncident.accused?.role || "N/A"}
              </p>
              {selectedIncident.accused?.department && (
                <p>
                  <strong>Department:</strong> {selectedIncident.accused.department}
                </p>
              )}
              {selectedIncident.accused?.relationship && (
                <p>
                  <strong>Relationship:</strong> {selectedIncident.accused.relationship}
                </p>
              )}

              <hr />

              <p>
                <strong>Submitted As:</strong>{" "}
                {selectedIncident.isAnonymous ? (
                  <span className="anonymous-badge">Anonymous</span>
                ) : (
                  "Non-anonymous"
                )}
              </p>

              <p>
                <strong>Submitted On:</strong>{" "}
                {new Date(selectedIncident.createdAt).toLocaleString()}
              </p>

              {/* ✅ Resolution (if closed) */}
              {selectedIncident.status === "Closed" && selectedIncident.resolution?.notes && (
                <>
                  <hr />
                  <div className="resolution-section">
                    <h4>📋 Resolution</h4>
                    <p className="resolution-text">{selectedIncident.resolution.notes}</p>
                    <p className="resolution-date">
                      Resolved by: {selectedIncident.resolution.resolvedBy}
                    </p>
                    <p className="resolution-date">
                      Resolved on: {new Date(selectedIncident.resolution.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            <button className="close-btn" onClick={() => setSelectedIncident(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}