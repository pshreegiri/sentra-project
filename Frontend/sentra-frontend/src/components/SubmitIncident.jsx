import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../pages/SubmitIncident.css";

export default function SubmitIncident() {
  const { token } = useContext(AuthContext);

  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");

  // Accused details
  const [accusedName, setAccusedName] = useState("");
  const [accusedRole, setAccusedRole] = useState("");
  const [accusedDept, setAccusedDept] = useState("");
  const [relationship, setRelationship] = useState("");

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/incidents",
        {
          incidentType,
          description,
          location,
          dateTime,
          accusedName,
          accusedRole,
          accusedDept,
          relationship,
          isAnonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReferenceId(response.data.referenceId);

      // reset form
      setIncidentType("");
      setDescription("");
      setLocation("");
      setDateTime("");
      setAccusedName("");
      setAccusedRole("");
      setAccusedDept("");
      setRelationship("");
      setIsAnonymous(false);
    } catch (error) {
      console.error(error);
      alert("Error submitting incident");
    }
  };

  return (
    <div className="incident-form-wrapper">
      <form className="incident-form" onSubmit={handleSubmit}>
        <h3 className="form-title">Submit Incident</h3>

        <label className="form-label">Incident Type</label>
        <select
          className="form-input"
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="Harassment">Harassment</option>
          <option value="Bullying">Bullying</option>
          <option value="Ragging">Ragging</option>
          <option value="Safety Issue">Safety Issue</option>
          <option value="Other">Other</option>
        </select>

        <label className="form-label">Description</label>
        <textarea
          className="form-input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="form-label">Location</label>
        <input
          className="form-input"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label className="form-label">Date & Time</label>
        <input
          className="form-input"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          max={getCurrentDateTime()}
          required
        />

        <hr className="form-divider" />

        <h4 className="sub-title">Accused Person Details</h4>

        <label className="form-label">Name of Accused</label>
        <input
          className="form-input"
          type="text"
          value={accusedName}
          onChange={(e) => setAccusedName(e.target.value)}
          required
        />

        <label className="form-label">Role</label>
        <select
          className="form-input"
          value={accusedRole}
          onChange={(e) => setAccusedRole(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
          <option value="Unknown">Unknown</option>
        </select>

        <label className="form-label">Department</label>
        <input
          className="form-input"
          type="text"
          value={accusedDept}
          onChange={(e) => setAccusedDept(e.target.value)}
        />

        <label className="form-label">Relationship / Identification Info</label>
        <input
          className="form-input"
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="Senior, classmate, faculty, etc."
        />

        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span>Submit as Anonymous</span>
        </div>

        <button type="submit" className="submit-btn">
          Submit Incident
        </button>
      </form>

      {referenceId && (
        <div className="success-box">
          <h4>Incident Submitted Successfully</h4>
          <p>
            <strong>Reference ID:</strong> {referenceId}
          </p>
          <p>Please save this ID for tracking your incident.</p>
        </div>
      )}
    </div>
  );
}
