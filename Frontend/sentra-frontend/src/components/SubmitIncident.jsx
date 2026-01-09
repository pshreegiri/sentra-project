import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function SubmitIncident() {
  const { token } = useContext(AuthContext); // 🔐 JWT token

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [file, setFile] = useState(null);

  // Accused details
  const [accusedName, setAccusedName] = useState("");
  const [accusedRole, setAccusedRole] = useState("");
  const [accusedDept, setAccusedDept] = useState("");
  const [relationship, setRelationship] = useState("");

  // Anonymous + reference ID
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/incidents",
        {
          incidentType: type,
          description,
          location,
          dateTime,

          accusedName,
          accusedDetails: `${accusedRole} | ${accusedDept} | ${relationship}`, // 👈 combined safely
          isAnonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 JWT SENT HERE
          },
        }
      );

      setReferenceId(response.data.referenceId);

      // reset form
      setType("");
      setDescription("");
      setLocation("");
      setDateTime("");
      setFile(null);
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
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <h3>Submit Incident</h3>

        {/* Incident Type */}
        <label>Incident Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="">Select Type</option>
          <option value="Harassment">Harassment</option>
          <option value="Bullying">Bullying</option>
          <option value="Ragging">Ragging</option>
          <option value="Safety Issue">Safety Issue</option>
          <option value="Other">Other</option>
        </select>

        {/* Description */}
        <label>Description</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {/* Location */}
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {/* Date & Time */}
        <label>Date & Time</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <hr />

        {/* Accused Details */}
        <h4>Accused Person Details</h4>

        <label>Name of Accused</label>
        <input
          type="text"
          value={accusedName}
          onChange={(e) => setAccusedName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Role</label>
        <select
          value={accusedRole}
          onChange={(e) => setAccusedRole(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
          <option value="Unknown">Unknown</option>
        </select>

        <label>Department / Year</label>
        <input
          type="text"
          value={accusedDept}
          onChange={(e) => setAccusedDept(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Relationship / Identification Info</label>
        <input
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="Senior, classmate, faculty, etc."
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Attach File (optional)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "15px" }}
        />

        {/* Anonymous */}
        <label style={{ display: "block", marginBottom: "15px" }}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          &nbsp; Submit as Anonymous
        </label>

        <button type="submit">Submit Incident</button>
      </form>

      {referenceId && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "2px dashed green",
          }}
        >
          <h4>Incident Submitted Successfully</h4>
          <p>
            <strong>Reference ID:</strong> {referenceId}
          </p>
          <p>Please save this ID for tracking your incident later.</p>
        </div>
      )}
    </div>
  );
}
