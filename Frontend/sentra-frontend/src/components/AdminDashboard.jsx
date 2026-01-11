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

  // 🔹 View State (NEW - for Reviews tab)
  const [view, setView] = useState("incidents");

  // 🔹 Reviews State (NEW)
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Comments
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Resolution
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [incidentToClose, setIncidentToClose] = useState(null);

  useEffect(() => {
    fetchIncidents();
    fetchStats();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admin/incidents",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setIncidents(response.data.incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/incidents/stats",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStatusChange = async (referenceId, newStatus) => {
    if (newStatus === "Closed") {
      setIncidentToClose(referenceId);
      setShowResolutionModal(true);
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/incidents/${referenceId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setIncidents(incidents.map(inc => 
        inc.referenceId === referenceId 
          ? { ...inc, status: newStatus }
          : inc
      ));

      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handlePriorityChange = async (referenceId, newPriority) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/incidents/${referenceId}/priority`,
        { priority: newPriority },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setIncidents(incidents.map(inc => 
        inc.referenceId === referenceId 
          ? { ...inc, priority: newPriority }
          : inc
      ));

      if (selectedIncident && selectedIncident.referenceId === referenceId) {
        setSelectedIncident({ ...selectedIncident, priority: newPriority });
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      alert("Failed to update priority");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/incidents/${selectedIncident.referenceId}/comments`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setSelectedIncident(response.data.incident);
      setNewComment("");
      setShowCommentBox(false);
      alert("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/incidents/${selectedIncident.referenceId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setSelectedIncident(response.data.incident);
      alert("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleSubmitResolution = async () => {
    if (!resolutionNotes.trim()) {
      alert("Please enter resolution notes before closing the incident");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/incidents/${incidentToClose}/resolution`,
        { notes: resolutionNotes },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      await axios.put(
        `http://localhost:5000/api/admin/incidents/${incidentToClose}/status`,
        { status: "Closed" },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setIncidents(incidents.map(inc => 
        inc.referenceId === incidentToClose 
          ? { ...inc, status: "Closed" }
          : inc
      ));

      fetchStats();
      setShowResolutionModal(false);
      setResolutionNotes("");
      setIncidentToClose(null);
      alert("Incident closed successfully");
    } catch (error) {
      console.error("Error closing incident:", error);
      alert("Failed to close incident");
    }
  };

  const handleLogout = () => {
  logout();
  window.location.href = "/";
};

  const handleViewDetails = async (referenceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/incidents/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      setSelectedIncident(response.data.incident);
    } catch (error) {
      console.error("Error fetching incident details:", error);
    }
  };

  // 🔹 NEW: Reviews Functions
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/reviews/all",
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setReviews(res.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleApproveReview = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reviews/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchReviews();
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/${id}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = 
      inc.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      inc.incidentType.toLowerCase().includes(search.toLowerCase()) ||
      inc.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === "All" || inc.status === statusFilter;

    const matchesRole = 
      roleFilter === "All" || 
      inc.isAnonymous ||
      inc.reportedBy?.role === roleFilter;

    const matchesPriority =
      priorityFilter === "All" || inc.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesPriority;
  });

  if (loading) {
    return <div className="admin-dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={() => setView("incidents")}>Incidents</button>
          <button onClick={() => { setView("reviews"); fetchReviews(); }}>
            Reviews
          </button>
          <button onClick={() => navigate("/aware")}>Awareness Hub</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Incidents View */}
      {view === "incidents" && (
        <>
          {/* Statistics Cards */}
          {stats && (
            <div className="stats-container">
              <div className="stat-card">
                <h3>{stats.total}</h3>
                <p>Total Incidents</p>
              </div>
              <div className="stat-card pending">
                <h3>{stats.byStatus.pending}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-card review">
                <h3>{stats.byStatus.inReview}</h3>
                <p>In Review</p>
              </div>
              <div className="stat-card progress">
                <h3>{stats.byStatus.inProgress}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-card closed">
                <h3>{stats.byStatus.closed}</h3>
                <p>Closed</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="filters-container">
            <input
              className="search-box"
              placeholder="Search by Reference ID, Type, or Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="status-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>

            <select
              className="status-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Table */}
          <table className="incident-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No incidents found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc._id}>
                    <td>{inc.referenceId}</td>
                    <td>{inc.incidentType}</td>
                    <td>
                      <select
                        value={inc.priority || "Medium"}
                        onChange={(e) =>
                          handlePriorityChange(inc.referenceId, e.target.value)
                        }
                        className={`priority-select ${(inc.priority || "Medium").toLowerCase()}`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </td>
                    <td>{inc.location}</td>
                    <td>{new Date(inc.dateTime).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={inc.status}
                        onChange={(e) =>
                          handleStatusChange(inc.referenceId, e.target.value)
                        }
                        className={`status-select ${inc.status.toLowerCase().replace(" ", "-")}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      {inc.isAnonymous ? (
                        <span className="anonymous-badge">Anonymous</span>
                      ) : (
                        inc.reportedBy?.userId?.name || "N/A"
                      )}
                    </td>
                    <td>
                      {inc.isAnonymous ? (
                        <span style={{ color: "#95a5a6", fontStyle: "italic" }}>Hidden</span>
                      ) : (
                        <span className={`role-badge ${inc.reportedBy?.role}`}>
                          {inc.reportedBy?.role === "student" ? "Student" : 
                           inc.reportedBy?.role === "staff" ? "Staff" : "N/A"}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(inc.referenceId)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Reviews View */}
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
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal for Incident Details */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
            <h3>Incident Details</h3>
            
            <div className="modal-content">
              <div className="detail-grid">
                <p><strong>Reference ID:</strong> {selectedIncident.referenceId}</p>
                <p><strong>Type:</strong> {selectedIncident.incidentType}</p>
                <p><strong>Location:</strong> {selectedIncident.location}</p>
                <p><strong>Date & Time:</strong> {new Date(selectedIncident.dateTime).toLocaleString()}</p>
                
                <p>
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedIncident.status.toLowerCase().replace(" ", "-")}`}>
                    {selectedIncident.status}
                  </span>
                </p>

                <p>
                  <strong>Priority:</strong> 
                  <span className={`priority-badge ${(selectedIncident.priority || "Medium").toLowerCase()}`}>
                    {selectedIncident.priority || "Medium"}
                  </span>
                </p>
              </div>
              
              <hr />
              
              <h4>Description</h4>
              <p className="description-text">{selectedIncident.description}</p>
              
              <hr />
              
              <h4>Accused Person</h4>
              <div className="detail-grid">
                <p><strong>Name:</strong> {selectedIncident.accused.name}</p>
                <p><strong>Role:</strong> {selectedIncident.accused.role}</p>
                {selectedIncident.accused.department && (
                  <p><strong>Department:</strong> {selectedIncident.accused.department}</p>
                )}
                {selectedIncident.accused.relationship && (
                  <p><strong>Relationship:</strong> {selectedIncident.accused.relationship}</p>
                )}
              </div>
              
              <hr />
              
              <h4>Reporter Information</h4>
              {selectedIncident.isAnonymous ? (
                <p className="anonymous-text">This report was submitted anonymously</p>
              ) : (
                <div className="detail-grid">
                  <p><strong>Name:</strong> {selectedIncident.reportedBy?.userId?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {selectedIncident.reportedBy?.userId?.email || "N/A"}</p>
                  <p>
                    <strong>Role:</strong> 
                    <span className={`role-badge ${selectedIncident.reportedBy?.role}`}>
                      {selectedIncident.reportedBy?.role === "student" ? "Student" : 
                       selectedIncident.reportedBy?.role === "staff" ? "Staff" : "N/A"}
                    </span>
                  </p>
                  {selectedIncident.reportedBy?.userId?.department && (
                    <p><strong>Department:</strong> {selectedIncident.reportedBy.userId.department}</p>
                  )}
                  {selectedIncident.reportedBy?.userId?.courseYear && (
                    <p><strong>Course/Year:</strong> {selectedIncident.reportedBy.userId.courseYear}</p>
                  )}
                </div>
              )}
              
              <p><strong>Reported On:</strong> {new Date(selectedIncident.createdAt).toLocaleString()}</p>

              {/* Comments Section */}
              <hr />
              <div className="comments-section">
                <div className="comments-header">
                  <h4>Admin Comments & Notes ({selectedIncident.comments?.length || 0})</h4>
                  <button 
                    className="add-comment-btn"
                    onClick={() => setShowCommentBox(!showCommentBox)}
                  >
                    {showCommentBox ? "Cancel" : "+ Add Comment"}
                  </button>
                </div>

                {showCommentBox && (
                  <div className="comment-input-box">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comment or notes..."
                      rows="3"
                    />
                    <button onClick={handleAddComment} className="submit-comment-btn">
                      Submit Comment
                    </button>
                  </div>
                )}

                <div className="comments-list">
                  {selectedIncident.comments && selectedIncident.comments.length > 0 ? (
                    selectedIncident.comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-header-row">
                          <span className="comment-author">{comment.addedBy}</span>
                          <span className="comment-date">
                            {new Date(comment.addedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        <button 
                          className="delete-comment-btn"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet. Add the first one!</p>
                  )}
                </div>
              </div>

              {/* Resolution Section */}
              {selectedIncident.status === "Closed" && selectedIncident.resolution?.notes && (
                <>
                  <hr />
                  <div className="resolution-section">
                    <h4>Resolution</h4>
                    <p className="resolution-text">{selectedIncident.resolution.notes}</p>
                    <p className="resolution-meta">
                      Resolved by {selectedIncident.resolution.resolvedBy} on{" "}
                      {new Date(selectedIncident.resolution.resolvedAt).toLocaleString()}
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

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="modal-overlay" onClick={() => setShowResolutionModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Close Incident - Add Resolution Notes</h3>
            <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>
              Please provide details about how this incident was resolved before closing it.
            </p>
            
            <textarea
              className="resolution-textarea"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="E.g., Counseling provided to both parties. Disciplinary action taken. Issue resolved."
              rows="6"
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button 
                className="submit-resolution-btn"
                onClick={handleSubmitResolution}
              >
                Submit & Close Incident
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowResolutionModal(false);
                  setResolutionNotes("");
                  setIncidentToClose(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}