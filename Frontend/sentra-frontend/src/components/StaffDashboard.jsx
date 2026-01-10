import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SubmitIncident from "./SubmitIncident";
import MyIncidents from "./MyIncidents";
// import "./staffDashboard.css";

export default function StaffDashboard() {
  const { authUser, logout, token } = useContext(AuthContext);
  const [view, setView] = useState("list");
  
  // ✅ Review state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Logout function
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // ✅ Submit Review
  const handleSubmitReview = async () => {
    if (!reviewText.trim() || reviewText.length < 20) {
      alert("Please write at least 20 characters in your review");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        "http://localhost:5000/api/reviews/submit",
        { review: reviewText, rating },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );
      
      alert("Thank you! Your review has been submitted for admin approval.");
      setShowReviewModal(false);
      setReviewText("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Staff Dashboard</h2>
          <p>
            Welcome, <strong>{authUser?.email}</strong>
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
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

        {/* ✅ NEW: Review Button */}
        <button
          className="nav-btn review-btn"
          onClick={() => setShowReviewModal(true)}
        >
          📝 Leave a Review
        </button>
      </div>

      <div className="dashboard-content">
        {view === "list" && <MyIncidents />}
        {view === "submit" && <SubmitIncident />}
      </div>

      {/* ✅ REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-box review-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Your Experience with Sentra</h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Your feedback helps us improve and helps others trust our platform
            </p>

            {/* Rating */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                Rating:
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "30px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      filter: star <= rating ? "none" : "grayscale(1)"
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                Your Review:
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with Sentra... (minimum 20 characters)"
                rows="6"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
              <p style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
                {reviewText.length} / 500 characters
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1
                }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewText("");
                  setRating(5);
                }}
                style={{
                  padding: "12px 24px",
                  background: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#999", marginTop: "15px", textAlign: "center" }}>
              Your review will be visible on the homepage after admin approval
            </p>
          </div>
        </div>
      )}
    </div>
  );
}