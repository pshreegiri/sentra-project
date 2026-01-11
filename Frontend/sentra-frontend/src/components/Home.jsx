import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/home.css"

export default function Home() {
  const [showRole, setShowRole] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };

  // ✅ Fetch ONLY approved reviews from backend
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews/approved");
      console.log("✅ Approved reviews fetched:", response.data.reviews);
      setReviews(response.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      setLoading(false);
    }
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index) => {
    setCurrentReview(index);
  };

  // Reveal animation on scroll
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="nav-left"></div>

        <div className="nav-center">
          <span className="logo-text">Sentra System</span>
        </div>

        <div className="nav-right">
          <button className="nav-login" onClick={() => navigate("/aware")}>
            Awareness Hub
          </button>

          <button className="nav-login" onClick={() => navigate("/login")}>
            Login
          </button>

          <button
            className="nav-login"
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            🌙
          </button>
        </div>
      </nav>

      <main className="main-content reveal">
        <h1>Incident Reporting & Safety Management</h1>
        <p>
          A secure platform for students and staff to report incidents and
          maintain a safe educational environment.
        </p>

        {!showRole ? (
          <div className="center-buttons">
            <button className="btn primary" onClick={() => setShowRole(true)}>
              Register
            </button>

            <button
              className="btn secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn primary admin"
              onClick={() => navigate("/admin-login")}
            >
              Admin Login
            </button>
          </div>
        ) : (
          <div className="center-buttons">
            <button
              className="btn student"
              onClick={() => navigate("/register/student")}
            >
              🎓 Student
            </button>

            <button
              className="btn staff"
              onClick={() => navigate("/register/staff")}
            >
              🧑‍🏫 Staff
            </button>
          </div>
        )}
      </main>

      <section className="features-section reveal">
        <h2>Why Choose Sentra?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>🔒 Secure Reporting</h3>
            <p>Report incidents anonymously with complete confidentiality.</p>
          </div>

          <div className="feature-card">
            <h3>⚡ Quick Response</h3>
            <p>Authorities receive alerts instantly for faster action.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Central Dashboard</h3>
            <p>Admins can monitor and manage incidents efficiently.</p>
          </div>

          <div className="feature-card">
            <h3>🎓 Campus Safety</h3>
            <p>Designed specifically for educational institutions.</p>
          </div>
        </div>
      </section>

      {/* ✅ ONLY APPROVED REVIEWS CAROUSEL */}
      {loading ? (
        <section className="reviews-section reveal">
          <p>Loading reviews...</p>
        </section>
      ) : reviews.length > 0 ? (
        <section className="reviews-section reveal">
          <h2>What Our Users Say</h2>
          <p className="reviews-subtitle">
            Real feedback from students and staff who trust Sentra
          </p>

          <div className="carousel-container">
            <button 
              className="carousel-btn"
              onClick={prevReview}
              aria-label="Previous review"
            >
              ‹
            </button>

            <div className="review-card">
              <div className="review-header">
                <div className="avatar">
                  {reviews[currentReview].role === "student" ? "👩‍🎓" : "👨‍🏫"}
                </div>
                <div className="review-info">
                  <h3>{reviews[currentReview].name}</h3>
                  <p className="review-role">
                    {reviews[currentReview].role === "student" ? "Student" : "Staff"} • {reviews[currentReview].department}
                  </p>
                  <div className="stars">
                    {[...Array(reviews[currentReview].rating)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-text">"{reviews[currentReview].review}"</p>
            </div>

            <button 
              className="carousel-btn"
              onClick={nextReview}
              aria-label="Next review"
            >
              ›
            </button>
          </div>

          <div className="dots-container">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentReview ? 'active' : ''}`}
                onClick={() => goToReview(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="how-section reveal">
        <h2>How Sentra Works</h2>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Register as Student or Staff</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Submit Incident Details</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Authorities Review the Case</p>
          </div>
          <div className="step">
            <span>4</span>
            <p>Action Taken & Status Updated</p>
          </div>
        </div>
      </section>

      <section className="about-section reveal">
        <h2>About Sentra System</h2>
        <p>
          Sentra is a web-based incident reporting and safety management platform
          designed to help educational institutions handle sensitive issues like
          ragging, harassment, and safety threats.
        </p>
      </section>

      <section className="cta-section reveal">
        <h2>Your Safety Matters</h2>
        <p>Join Sentra today and help create a safer campus.</p>
        <button className="btn primary" onClick={() => {window.scrollTo({top:0, behavior:"smooth"})}}>
          Get Started
        </button>
      </section>

      <footer className="footer">
        <p>© 2026 Sentra System. All Rights Reserved.</p>
        <span>Designed for Educational Institutions</span>
      </footer>
    </div>
  );
}