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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <CSpinner color="primary" />
      </div>
    );
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <CAlert color="danger">{error}</CAlert>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#fff",
          fontWeight: "700",
          letterSpacing: "1px",
          textShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        User Feedback & Testimonials
      </h2>
      <CRow className="g-4">
        {feedbacks.length === 0 ? (
          <CCol xs={12} className="text-center py-5">
            <CCard
              className="mx-auto"
              style={{
                maxWidth: "400px",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
              }}
            >
              <CCardBody>
                <h5 className="mb-3">No feedback yet</h5>
                <p className="mb-0">Be the first to share your experience!</p>
              </CCardBody>
            </CCard>
          </CCol>
        ) : (
          feedbacks.map((fb, index) => (
            <CCol key={index} md={6} lg={4}>
              <CCard
                className="h-100 shadow-sm border-0"
                style={{
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #f8fffa 0%, #e7eafc 100%)",
                  color: "#22223b",
                  transition: "transform 0.2s",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <CCardHeader
                  style={{
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    color: "#3a7ca5",
                    background: "rgba(58,124,165,0.08)",
                    borderRadius: "16px 16px 0 0",
                    padding: "1rem",
                  }}
                >
                  {fb.fullName || "Anonymous"}{" "}
                  <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                    ({fb.email})
                  </span>
                </CCardHeader>

                <CCardBody style={{ padding: "1.5rem", color: "#22223b" }}>
                  <div className="mb-2">
                    <CBadge color="info" className="me-2">
                      {fb.eventType}
                    </CBadge>
                    <CBadge color="warning" className="me-2">
                      Satisfaction: {fb.satisfaction}/5
                    </CBadge>
                    <CBadge color="success" className="me-2">
                      Ease: {fb.easeOfUse}/5
                    </CBadge>
                    <CBadge color="primary" className="me-2">
                      Service: {fb.customerService}/5
                    </CBadge>
                    <CBadge color="secondary" className="me-2">
                      Features: {fb.features}/5
                    </CBadge>
                  </div>
                  <p>
                    <strong style={{ color: "#3a7ca5" }}>Recommendation:</strong>{" "}
                    <CBadge color="success" style={{ fontSize: "1rem" }}>
                      {fb.recommendation}
                    </CBadge>
                  </p>
                  {fb.improvement && (
                    <p>
                      <strong style={{ color: "#3a7ca5" }}>Improvement Suggestion:</strong>{" "}
                      <span style={{ color: "#d7263d" }}>{fb.improvement}</span>
                    </p>
                  )}
                  {fb.successStory && (
                    <p>
                      <strong style={{ color: "#3a7ca5" }}>Success Story:</strong>{" "}
                      <span style={{ color: "#009688" }}>{fb.successStory}</span>
                    </p>
                  )}
                  <p>
                    <strong style={{ color: "#3a7ca5" }}>Allow Public Use:</strong>{" "}
                    {fb.allowPublicUse ? (
                      <span style={{ color: "#43aa8b" }}>✅ Yes</span>
                    ) : (
                      <span style={{ color: "#d7263d" }}>❌ No</span>
                    )}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      color: "#6c757d",
                      marginTop: "1rem",
                    }}
                  >
                    Submitted: {new Date(fb.createdAt).toLocaleString()}
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        )}
      </CRow>
    </div>
  );
};

export default Feedback;