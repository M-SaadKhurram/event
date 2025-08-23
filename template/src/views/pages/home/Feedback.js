import React, { useState } from 'react'
import { 
  CRow, 
  CCol, 
  CCard, 
  CCardBody, 
  CButton,
  CContainer,
  CBadge,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormLabel,
  CAlert,
  CProgress,
  CFormCheck,
  CToast,
  CToastBody,
  CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilStar, 
  cilHeart, 
  cilThumbUp,
  cilCommentSquare,
  cilUser,
  cilEnvelopeOpen,
  cilSpeedometer,
  cilShieldAlt,
  cilChart
} from '@coreui/icons'
import { submitFeedback } from '../../../services/feedback' // adjust path if needed
 
const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    eventType: '',
    overallRating: '',
    easeOfUse: '',
    customerService: '',
    features: '',
    recommendation: '',
    improvements: '',
    testimonial: '',
    allowPublic: false
  })
  const [showAlert, setShowAlert] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFeedbackData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitFeedback(feedbackData)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
      // Reset form
      setFeedbackData({
        name: '',
        email: '',
        eventType: '',
        overallRating: '',
        easeOfUse: '',
        customerService: '',
        features: '',
        recommendation: '',
        improvements: '',
        testimonial: '',
        allowPublic: false
      })
    } catch (err) {
      alert('Error submitting feedback. Please try again.')
    }
  }

  const StarRating = ({ rating, onRatingChange, name }) => {
    return (
      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange({ target: { name, value: star.toString() } })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: star <= parseInt(rating) ? '#fbbf24' : '#e5e7eb',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (star <= parseInt(rating)) {
                e.target.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
            }}
          >
            ⭐
          </button>
        ))}
        <span style={{ 
          marginLeft: '0.5rem', 
          fontSize: '0.9rem', 
          color: '#64748b',
          alignSelf: 'center'
        }}>
          {rating && `${rating}/5`}
        </span>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* Toast Notification */}
      <CToaster placement="top-end">
        {showToast && (
          <CToast autohide visible color="success" onClose={() => setShowToast(false)}>
            <CToastBody>
              🎉 Thank you! Your feedback has been submitted.
            </CToastBody>
          </CToast>
        )}
      </CToaster>

      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg,  #8b0000 0%)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 80px 80px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>

        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <CRow className="justify-content-center text-center">
            <CCol lg={8} className="text-white">
              <CBadge 
                className="mb-3 px-3 py-1"
                style={{ 
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'white',
                  borderRadius: '50px',
                  background: 'rgba(7, 150, 62, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(149, 255, 127, 0.1)'
                }}
              >
                💬 Your Feedback Matters
              </CBadge>
              
              <h1 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: '800', 
                lineHeight: '1.2',
                marginBottom: '1.2rem',
                background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Help Us{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #2cc727ff 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Improve
                </span>{' '}
                Your Experience
              </h1>
              
              <p style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                opacity: 0.95,
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}>
                Your voice matters. Let us know your EventSphere experience so we can elevate expo management to new heights
              </p>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Feedback Stats Section */}
      <div style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <CContainer>
          <CRow>
            {[
              { icon: cilStar, value: '4.9/5', label: 'Average Rating', color: '#fbbf24', emoji: '⭐' },
              { icon: cilHeart, value: '15,000+', label: 'Happy Clients', color: '#ef4444', emoji: '❤️' },
              { icon: cilThumbUp, value: '98%', label: 'Satisfaction Rate', color: '#10b981', emoji: '👍' },
              { icon: cilCommentSquare, value: '5,200+', label: 'Reviews Received', color: '#3b82f6', emoji: '💬' }
            ].map((stat, index) => (
              <CCol lg={3} md={6} className="mb-3" key={index}>
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.borderColor = stat.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '0.8rem'
                  }}>
                    {stat.emoji}
                  </div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: stat.color,
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    color: '#64748b', 
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    {stat.label}
                  </div>
                </div>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </div>

      {/* Feedback Form Section */}
      <div style={{ padding: '5rem 0', background: '#fff' }}>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol lg={10}>
              {showAlert && (
                <CAlert color="success" className="mb-4">
                  <strong>Thank you!</strong> Your feedback has been submitted successfully. 
                  We appreciate your time and insights! 🎉
                </CAlert>
              )}

              <CCard style={{ 
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #8b0000 0%, #ac51c3ff 200%)',
                  padding: '2.5rem 2rem',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontWeight: '700', 
                    marginBottom: '0.8rem',
                    fontSize: '1.8rem'
                  }}>
                    📝 Let’s Hear from You
                  </h3>
                  <p style={{ 
                    opacity: 0.9, 
                    margin: 0,
                    fontSize: '1.1rem'
                  }}>
                    From your experience comes our progress. Share your thoughts :)
                  </p>
                  
                  {/* Progress Bar */}
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <span>Progress</span>
                      <span>{Math.round((Object.values(feedbackData).filter(v => v !== '' && v !== false).length / 11) * 100)}%</span>
                    </div>
                    <CProgress 
                      value={Math.round((Object.values(feedbackData).filter(v => v !== '' && v !== false).length / 11) * 100)}
                      style={{ 
                        height: '8px',
                        background: 'rgba(255, 69, 69, 0.2)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
                
                {/* form section */}
                <CCardBody style={{ padding: '3rem',background: 'linear-gradient(135deg, #c71616ff 0%, #de4b9aff 100%)', }}>
                  <CForm onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h5 style={{ 
                        fontWeight: '700', 
                        color: '#ffffffff',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>👤</span>
                        Contact Information
                      </h5>
                      
                      <CRow>
                        <CCol md={6} className="mb-3">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            Full Name *
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            name="name"
                            value={feedbackData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            style={{ 
                              borderRadius: '10px',
                              border: '2px solid #e5e7eb',
                              padding: '12px 16px'
                            }}
                          />
                        </CCol>
                        <CCol md={6} className="mb-3">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            Email Address *
                          </CFormLabel>
                          <CFormInput
                            type="email"
                            name="email"
                            value={feedbackData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                            style={{ 
                              borderRadius: '10px',
                              border: '2px solid #e5e7eb',
                              padding: '12px 16px'
                            }}
                          />
                        </CCol>
                      </CRow>
                      
                      <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                        Event Type *
                      </CFormLabel>
                      <CFormSelect
                        name="eventType"
                        value={feedbackData.eventType}
                        onChange={handleInputChange}
                        required
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #ebe5e5ff',
                          padding: '12px 16px'
                        }}
                      >
                        <option value="">Select event type you organized/attended</option>
                        <option value="technology">Technology Expo</option>
                        <option value="healthcare">Healthcare Conference</option>
                        <option value="manufacturing">Manufacturing Trade Show</option>
                        <option value="food">Food & Beverage Expo</option>
                        <option value="fashion">Fashion Show</option>
                        <option value="automotive">Automotive Expo</option>
                        <option value="other">Other</option>
                      </CFormSelect>
                    </div>

                    {/* Rating Section */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h5 style={{ 
                        fontWeight: '700', 
                        color: '#ffffffff',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>⭐</span>
                        Rate Your Experience
                      </h5>
                      
                      <CRow>
                        <CCol md={6} className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            Overall Satisfaction *
                          </CFormLabel>
                          <StarRating 
                            rating={feedbackData.overallRating}
                            onRatingChange={handleInputChange}
                            name="overallRating"
                          />
                        </CCol>
                        <CCol md={6} className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            Ease of Use *
                          </CFormLabel>
                          <StarRating 
                            rating={feedbackData.easeOfUse}
                            onRatingChange={handleInputChange}
                            name="easeOfUse"
                          />
                        </CCol>
                      </CRow>
                      
                      <CRow>
                        <CCol md={6} className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            Customer Service *
                          </CFormLabel>
                          <StarRating 
                            rating={feedbackData.customerService}
                            onRatingChange={handleInputChange}
                            name="customerService"
                          />
                        </CCol>
                        <CCol md={6} className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            Features & Functionality *
                          </CFormLabel>
                          <StarRating 
                            rating={feedbackData.features}
                            onRatingChange={handleInputChange}
                            name="features"
                          />
                        </CCol>
                      </CRow>
                    </div>

                    {/* Recommendation Section */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h5 style={{ 
                        fontWeight: '700', 
                        color: '#ffffffff',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>👥</span>
                        Recommendation
                      </h5>
                      
                      <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                        Would you recommend EventSphere to others? *
                      </CFormLabel>
                      <CFormSelect
                        name="recommendation"
                        value={feedbackData.recommendation}
                        onChange={handleInputChange}
                        required
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 16px'
                        }}
                      >
                        <option value="">Select your recommendation level</option>
                        <option value="definitely">Definitely - Without hesitation</option>
                        <option value="probably">Probably - Very likely</option>
                        <option value="maybe">Maybe - Depends on the situation</option>
                        <option value="unlikely">Unlikely - Probably not</option>
                        <option value="never">Never - Would not recommend</option>
                      </CFormSelect>
                    </div>

                    {/* Detailed Feedback Section */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h5 style={{ 
                        fontWeight: '700', 
                        color: '#ffffffff',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>💭</span>
                        Detailed Feedback
                      </h5>
                      
                      <CRow>
                        <CCol md={12} className="mb-3">
                          <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                            What could we improve?
                          </CFormLabel>
                          <CFormTextarea
                            name="improvements"
                            value={feedbackData.improvements}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us what features, services, or aspects you'd like us to improve..."
                            style={{ 
                              borderRadius: '10px',
                              border: '2px solid #e5e7eb',
                              padding: '12px 16px'
                            }}
                          />
                        </CCol>
                      </CRow>
                      
                      <CFormLabel style={{ fontWeight: '600', color: '#ffffffff' }}>
                        Share your success story (Optional)
                      </CFormLabel>
                      <CFormTextarea
                        name="testimonial"
                        value={feedbackData.testimonial}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your positive experience with EventSphere. How did our platform help make your event successful?"
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 16px'
                        }}
                      />
                    </div>

                    {/* Privacy Section */}
                    <div style={{ marginBottom: '2rem' }}>
                      <CFormCheck
                        id="allowPublic"
                        name="allowPublic"
                        checked={feedbackData.allowPublic}
                        onChange={handleInputChange}
                        label="I allow EventSphere to use my feedback publicly (with my name) for testimonials and marketing purposes"
                        style={{ 
                          fontSize: '0.95rem',
                          color: feedbackData.allowPublic ? 'red' : '#8b6464ff'
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <CButton 
                        type="submit"
                        style={{
                          background: 'linear-gradient(135deg, #e11212ff 0%, #df772cff 130%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '15px 40px',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: 'white',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        🚀 Submit Feedback
                      </CButton>
                      
                      <p style={{ 
                        marginTop: '1rem', 
                        fontSize: '0.85rem', 
                        color: '#ffffffff',
                        maxWidth: '500px',
                        margin: '1rem auto 0'
                      }}>
                        Your feedback is valuable to us. We read every submission and use your insights 
                        to continuously improve our event management platform.
                      </p>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>

{/* Customer Reviews Section */}
<div style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #f9fcf8ff 0%, #e2e8f0 100%)' }}>
  <CContainer>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{ 
        fontWeight: '800', 
        color: '#1e293b',
        marginBottom: '1rem',
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)'
      }}>
        What Our Clients Say
      </h2>
      <p style={{ 
        fontSize: '1.1rem', 
        color: '#64748b',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        Real stories from event organizers across Pakistan who trust EventSphere
      </p>
    </div>
    
    <CRow>
      {[
        {
          name: "Tasmia",
          company: "Karachi Expo Planners",
          rating: 5,
          text: "EventSphere helped us flawlessly manage our Karachi Trade Fair. From ticketing to crowd management, everything was smooth and organized.",
          avatar: "👩‍💼"
        },
        {
          name: "Umaima",
          company: "Lahore Wedding & Event Services",
          rating: 5,
          text: "We organized a large-scale cultural festival in Lahore with EventSphere. The coordination tools saved us days of work and improved vendor communication.",
          avatar: "👩‍💻"
        },
        {
          name: "Adnan",
          company: "Islamabad Corporate Events",
          rating: 5,
          text: "Our Islamabad Business Conference ran without a hitch thanks to EventSphere. The local support team understood our needs and delivered beyond expectations.",
          avatar: "👨‍💼"
        }
      ].map((review, index) => (
        <CCol lg={4} md={6} className="mb-4" key={index}>
          <CCard style={{
            border: 'none',
            borderRadius: '16px',
            height: '100%',
            background: '#60eb60ff',
            boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)'
          }}>
            <CCardBody style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#ffb700ff', fontSize: '1.2rem' }}>⭐</span>
                ))}
              </div>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: 1.6, 
                color: '#374151',
                marginBottom: '1.5rem',
                fontStyle: 'italic'
              }}>
                "{review.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  fontSize: '2rem',
                  background: 'linear-gradient(135deg, #ff0000ff 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {review.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>
                    {review.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#000000ff' }}>
                    {review.company}
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  </CContainer>
</div>


      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}
      </style>
    </div>
  )
}

export default Feedback