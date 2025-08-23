import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CBadge,
} from "@coreui/react";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/feedback");
        setFeedbacks(res.data);
      } catch (err) {
        setError("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) return <CSpinner color="primary" />;
  if (error) return <CAlert color="danger">{error}</CAlert>;

  return (
    <CRow className="g-4">
      {feedbacks.map((fb, index) => (
        <CCol key={index} md={6} lg={4}>
          <CCard
            style={{
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            }}
          >
            {/* Name / Email */}
            <CCardHeader
              style={{
                fontWeight: "600",
                fontSize: "1.1rem",
                color: "#d42121",
              }}
            >
              {fb.fullName || "Anonymous"}{" "}
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                ({fb.email})
              </span>
            </CCardHeader>

            <CCardBody>
              {/* Event Type */}
              <p>
                <strong>Event Type:</strong> {fb.eventType}
              </p>

              {/* Ratings */}
              <p>
                <strong>Satisfaction:</strong> {fb.satisfaction} / 5
              </p>
              <p>
                <strong>Ease of Use:</strong> {fb.easeOfUse} / 5
              </p>
              <p>
                <strong>Customer Service:</strong> {fb.customerService} / 5
              </p>
              <p>
                <strong>Features:</strong> {fb.features} / 5
              </p>

              {/* Recommendation */}
              <p>
                <strong>Recommendation:</strong>{" "}
                <CBadge color="info">{fb.recommendation}</CBadge>
              </p>

              {/* Improvement */}
              {fb.improvement && (
                <p>
                  <strong>Improvement Suggestion:</strong> {fb.improvement}
                </p>
              )}

              {/* Success Story */}
              {fb.successStory && (
                <p>
                  <strong>Success Story:</strong> {fb.successStory}
                </p>
              )}

              {/* Public Use */}
              <p>
                <strong>Allow Public Use:</strong>{" "}
                {fb.allowPublicUse ? "✅ Yes" : "❌ No"}
              </p>

              {/* Date */}
              <p
                style={{
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                Submitted: {new Date(fb.createdAt).toLocaleString()}
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default Feedback;
