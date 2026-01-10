import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminAuthContext } from "../context/AdminAuthContext";
import "../pages/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminToken, logout } = useContext(AdminAuthContext);

  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // 🔹 View State
  const [view, setView] = useState("incidents");

  // 🔹 Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // 🔹 Comments
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  // 🔹 Resolution
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [incidentToClose, setIncidentToClose] = useState(null);

  useEffect(() => {
    fetchIncidents();
    fetchStats();
  }, []);

  /* ================= FETCH INCIDENTS ================= */
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/incidents",
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setIncidents(res.data.incidents);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/incidents/stats",
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INCIDENT ACTIONS ================= */
  const handleStatusChange = async (id, status) => {
    if (status === "Closed") {
      setIncidentToClose(id);
      setShowResolutionModal(true);
      return;
    }

    await axios.put(
      `http://localhost:5000/api/admin/incidents/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    fetchIncidents();
    fetchStats();
  };

  const handlePriorityChange = async (id, priority) => {
    await axios.put(
      `http://localhost:5000/api/admin/incidents/${id}/priority`,
      { priority },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    fetchIncidents();
  };

  const handleViewDetails = async (id) => {
    const res = await axios.get(
      `http://localhost:5000/api/admin/incidents/${id}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    setSelectedIncident(res.data.incident);
  };

  /* ================= COMMENTS ================= */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await axios.post(
      `http://localhost:5000/api/admin/incidents/${selectedIncident.referenceId}/comments`,
      { text: newComment },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    setSelectedIncident(res.data.incident);
    setNewComment("");
    setShowCommentBox(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    const res = await axios.delete(
      `http://localhost:5000/api/admin/incidents/${selectedIncident.referenceId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    setSelectedIncident(res.data.incident);
  };

  /* ================= RESOLUTION ================= */
  const handleSubmitResolution = async () => {
    await axios.put(
      `http://localhost:5000/api/admin/incidents/${incidentToClose}/resolution`,
      { notes: resolutionNotes },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    await axios.put(
      `http://localhost:5000/api/admin/incidents/${incidentToClose}/status`,
      { status: "Closed" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    fetchIncidents();
    fetchStats();

    setShowResolutionModal(false);
    setResolutionNotes("");
    setIncidentToClose(null);
  };

  /* ================= REVIEWS ================= */
  const fetchReviews = async () => {
    setReviewsLoading(true);
    const res = await axios.get(
      "http://localhost:5000/api/reviews/all",
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    setReviews(res.data.reviews);
    setReviewsLoading(false);
  };

  const handleApproveReview = async (id) => {
    await axios.put(
      `http://localhost:5000/api/reviews/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    fetchReviews();
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await axios.delete(
      `http://localhost:5000/api/reviews/${id}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    fetchReviews();
  };

  /* ================= FILTER ================= */
  const filteredIncidents = incidents.filter((i) => {
    return (
      (statusFilter === "All" || i.status === statusFilter) &&
      (priorityFilter === "All" || i.priority === priorityFilter)
    );
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={() => setView("incidents")}>Incidents</button>
          <button onClick={() => { setView("reviews"); fetchReviews(); }}>
            Reviews
          </button>
          <button onClick={() => navigate("/aware")}>Awareness Hub</button>
          <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
            Logout
          </button>
        </div>
      </div>

      {/* ================= INCIDENTS VIEW ================= */}
      {view === "incidents" && (
        <>
          {stats && (
            <div className="stats-container">
              <div className="stat-card"><h3>{stats.total}</h3><p>Total</p></div>
              <div className="stat-card pending"><h3>{stats.byStatus.pending}</h3><p>Pending</p></div>
              <div className="stat-card closed"><h3>{stats.byStatus.closed}</h3><p>Closed</p></div>
            </div>
          )}

          <table className="incident-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((i) => (
                <tr key={i._id}>
                  <td>{i.referenceId}</td>
                  <td>{i.incidentType}</td>
                  <td>
                    <select value={i.priority}
                      onChange={(e) => handlePriorityChange(i.referenceId, e.target.value)}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </td>
                  <td>
                    <select value={i.status}
                      onChange={(e) => handleStatusChange(i.referenceId, e.target.value)}>
                      <option>Pending</option>
                      <option>In Review</option>
                      <option>In Progress</option>
                      <option>Closed</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleViewDetails(i.referenceId)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= REVIEWS VIEW ================= */}
      {view === "reviews" && (
        <div className="reviews-management">
          <h3>Manage Reviews</h3>

          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : (
            <table className="incident-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>{r.role}</td>
                    <td>{"⭐".repeat(r.rating)}</td>
                    <td>{r.review}</td>
                    <td>{r.isApproved ? "Approved" : "Pending"}</td>
                    <td>
                      {!r.isApproved && (
                        <button onClick={() => handleApproveReview(r._id)}>
                          Approve
                        </button>
                      )}
                      <button onClick={() => handleDeleteReview(r._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
