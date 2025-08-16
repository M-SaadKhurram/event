import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
  CSpinner,
  CAlert,
  CFormCheck,
  CProgress,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilBuilding,
  cilCloudUpload,
  cilCheckCircle,
  cilArrowLeft,
  cilCalendar,
  cilLocationPin,
  
  cilPrint,
  cilCloudDownload
} from '@coreui/icons'
import { getExpo } from '../../../services/expos'
import { registerAttendee } from '../../../services/attendees'
import EntryPass from './EntryPass'

const AttendeeRegistration = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role')
  
  const [expo, setExpo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredAttendee, setRegisteredAttendee] = useState(null)
  const [showEntryPass, setShowEntryPass] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    attachment: null
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (id) {
      fetchExpoDetail()
    } else {
      setError('Expo ID is required')
      setLoading(false)
    }
  }, [id])

  const fetchExpoDetail = async () => {
    try {
      setLoading(true)
      const data = await getExpo(id)
      setExpo(data)
    } catch (err) {
      setError('Failed to load expo details')
      console.error('Error fetching expo:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required'
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          attachment: 'File size must be less than 5MB'
        }))
        return
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          attachment: 'Only JPEG, PNG and PDF files are allowed'
        }))
        return
      }
      
      setFormData(prev => ({
        ...prev,
        attachment: file
      }))
      
      // Clear attachment error
      if (validationErrors.attachment) {
        setValidationErrors(prev => ({
          ...prev,
          attachment: ''
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setSubmitting(true)
      setError('')
      
      const submitData = new FormData()
      submitData.append('expo_id', id)
      submitData.append('full_name', formData.full_name.trim())
      submitData.append('email', formData.email.trim())
      
      if (formData.phone) {
        submitData.append('phone', formData.phone.trim())
      }
      
      if (formData.organization) {
        submitData.append('organization', formData.organization.trim())
      }
      
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment)
      }
      
      const response = await registerAttendee(submitData)
      
      if (response.success) {
        setRegisteredAttendee(response.data)
        setSuccess(true)
        setCurrentStep(3)
      }
      
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getExpoCategory = (expo) => {
    const title = expo.title.toLowerCase()
    const theme = expo.theme?.toLowerCase() || ''

    if (title.includes('tech') || theme.includes('tech') || title.includes('innovation')) {
      return { category: 'Technology', color: '#2563eb', gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
    } else if (title.includes('health') || theme.includes('health') || title.includes('medical')) {
      return { category: 'Healthcare', color: '#059669', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
    } else if (title.includes('food') || theme.includes('food') || title.includes('beverage')) {
      return { category: 'Fashion', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }
    } else if (title.includes('fashion') || theme.includes('fashion') || title.includes('lifestyle')) {
      return { category: 'Fashion', color: '#ea580c', gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)' }
    } else if (title.includes('auto') || theme.includes('auto') || title.includes('car')) {
      return { category: 'Automotive', color: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }
    } else {
      return { category: 'General', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }
    }
  }

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <CSpinner color="primary" size="lg" />
          <p className="mt-3" style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading registration form...</p>
        </div>
      </div>
    )
  }

  if (error && !expo) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', paddingTop: '2rem' }}>
        <CContainer>
          <CAlert color="danger" style={{ borderRadius: '15px', border: 'none', boxShadow: '0 8px 25px rgba(239,68,68,0.1)' }}>
            <h5>Error</h5>
            <p className="mb-0">{error}</p>
          </CAlert>
          <CButton
            color="primary"
            onClick={() => navigate(-1)}
            style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Go Back
          </CButton>
        </CContainer>
      </div>
    )
  }

  const { color, gradient } = expo ? getExpoCategory(expo) : { color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, ${color}10 1px, transparent 1px),
          radial-gradient(circle at 80% 80%, ${color}05 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}></div>

      <CContainer style={{ paddingTop: '2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <CRow className="mb-4">
          <CCol>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <CButton
                color="light"
                variant="ghost"
                onClick={() => navigate(-1)}
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  fontWeight: '600',
                  color: '#1e293b'
                }}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back to Expo
              </CButton>

              {expo && (
                <CBadge
                  style={{
                    background: gradient,
                    color: 'white',
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '20px',
                    fontWeight: '600',
                    boxShadow: `0 4px 15px ${color}30`
                  }}
                >
                  Attendee Registration
                </CBadge>
              )}
            </div>
          </CCol>
        </CRow>

        {/* Progress Bar */}
        <CRow className="mb-4">
          <CCol>
            <CCard style={{
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <CCardBody style={{ padding: '2rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>
                    Registration Progress
                  </span>
                  <span style={{ fontSize: '0.9rem', color: color, fontWeight: '600' }}>
                    Step {currentStep} of 3
                  </span>
                </div>
                <CProgress
                  value={(currentStep / 3) * 100}
                  style={{
                    height: '12px',
                    borderRadius: '6px',
                    background: '#e5e7eb'
                  }}
                >
                  <div
                    style={{
                      background: gradient,
                      height: '100%',
                      borderRadius: '6px',
                      width: `${(currentStep / 3) * 100}%`,
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </CProgress>
                <div className="d-flex justify-content-between mt-2">
                  <span style={{ fontSize: '0.8rem', color: currentStep >= 1 ? color : '#94a3b8' }}>Expo Info</span>
                  <span style={{ fontSize: '0.8rem', color: currentStep >= 2 ? color : '#94a3b8' }}>Registration</span>
                  <span style={{ fontSize: '0.8rem', color: currentStep >= 3 ? color : '#94a3b8' }}>Entry Pass</span>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          {/* Expo Information */}
          <CCol lg={4}>
            {expo && (
              <CCard style={{
                border: 'none',
                borderRadius: '20px',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: '2rem'
              }}>
                <CCardHeader style={{
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                  border: 'none',
                  borderRadius: '20px 20px 0 0',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  padding: '1.5rem'
                }}>
                  <CIcon icon={cilCalendar} className="me-2" />
                  Event Details
                </CCardHeader>
                <CCardBody style={{ padding: '2rem' }}>
                  <h4 style={{ fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>
                    {expo.title}
                  </h4>
                  
                  {expo.theme && (
                    <p style={{ color: '#64748b', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                      Theme: {expo.theme}
                    </p>
                  )}

                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      background: color,
                      borderRadius: '8px',
                      padding: '0.5rem',
                      marginRight: '0.75rem'
                    }}>
                      <CIcon icon={cilCalendar} style={{ color: 'white', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {new Date(expo.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Event Date</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      background: color,
                      borderRadius: '8px',
                      padding: '0.5rem',
                      marginRight: '0.75rem'
                    }}>
                      <CIcon icon={cilLocationPin} style={{ color: 'white', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{expo.location}</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Venue</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div style={{
                      background: color,
                      borderRadius: '8px',
                      padding: '0.5rem',
                      marginRight: '0.75rem'
                    }}>
                      <CIcon icon={cilBuilding} style={{ color: 'white', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {expo.floors} Floor{expo.floors > 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Exhibition Area</div>
                    </div>
                  </div>

                  {expo.attachment && (
                    <div style={{
                      marginTop: '1.5rem',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={`http://localhost:8080/${expo.attachment}`}
                        alt={expo.title}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                </CCardBody>
              </CCard>
            )}
          </CCol>

          {/* Registration Form */}
          <CCol lg={8}>
            {success && registeredAttendee ? (
              <CCard style={{
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <CCardHeader style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '20px 20px 0 0',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.3rem',
                  padding: '2rem'
                }}>
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Registration Successful!
                </CCardHeader>
                <CCardBody style={{ padding: '3rem' }}>
                  <div className="text-center mb-4">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h3 style={{ fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>
                      Welcome to {expo?.title}!
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
                      Your registration has been confirmed. You can now download your entry pass.
                    </p>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: '15px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h5 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
                      Registration Details
                    </h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <strong>Name:</strong> {registeredAttendee.full_name}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Email:</strong> {registeredAttendee.email}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Badge ID:</strong> {registeredAttendee.badge_id}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Status:</strong> 
                        <CBadge color="success" className="ms-2">
                          {registeredAttendee.status}
                        </CBadge>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-3">
                    <CButton
                      size="lg"
                      onClick={() => setShowEntryPass(true)}
                      style={{
                        background: gradient,
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        boxShadow: `0 8px 20px ${color}30`
                      }}
                    >
                      <CIcon icon={cilCloudDownload} className="me-2" />
                      Generate Entry Pass
                    </CButton>
                    
                    <CButton
                      color="light"
                      size="lg"
                      onClick={() => navigate('/')}
                      style={{
                        borderRadius: '12px',
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        border: '2px solid #e5e7eb'
                      }}
                    >
                      Back to Home
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            ) : (
              <CCard style={{
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <CCardHeader style={{
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                  border: 'none',
                  borderRadius: '20px 20px 0 0',
                  fontWeight: '700',
                  fontSize: '1.3rem',
                  padding: '2rem'
                }}>
                  <CIcon icon={cilUser} className="me-2" />
                  Attendee Registration Form
                </CCardHeader>
                <CCardBody style={{ padding: '3rem' }}>
                  {error && (
                    <CAlert
                      color="danger"
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(239,68,68,0.1)',
                        marginBottom: '2rem'
                      }}
                    >
                      {error}
                    </CAlert>
                  )}

                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                            Full Name *
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            invalid={!!validationErrors.full_name}
                            placeholder="Enter your full name"
                            style={{
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              border: `2px solid ${validationErrors.full_name ? '#ef4444' : '#e5e7eb'}`,
                              fontSize: '1rem'
                            }}
                          />
                          {validationErrors.full_name && (
                            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                              {validationErrors.full_name}
                            </div>
                          )}
                        </div>
                      </CCol>
                      
                      <CCol md={6}>
                        <div className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                            Email Address *
                          </CFormLabel>
                          <CFormInput
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            invalid={!!validationErrors.email}
                            placeholder="Enter your email address"
                            style={{
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              border: `2px solid ${validationErrors.email ? '#ef4444' : '#e5e7eb'}`,
                              fontSize: '1rem'
                            }}
                          />
                          {validationErrors.email && (
                            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                              {validationErrors.email}
                            </div>
                          )}
                        </div>
                      </CCol>
                      
                      <CCol md={6}>
                        <div className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                            Phone Number
                          </CFormLabel>
                          <CFormInput
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            invalid={!!validationErrors.phone}
                            placeholder="Enter your phone number"
                            style={{
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              border: `2px solid ${validationErrors.phone ? '#ef4444' : '#e5e7eb'}`,
                              fontSize: '1rem'
                            }}
                          />
                          {validationErrors.phone && (
                            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                              {validationErrors.phone}
                            </div>
                          )}
                        </div>
                      </CCol>
                      
                      <CCol md={6}>
                        <div className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                            Organization
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            placeholder="Company or institution (optional)"
                            style={{
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              border: '2px solid #e5e7eb',
                              fontSize: '1rem'
                            }}
                          />
                        </div>
                      </CCol>
                      
                      <CCol md={12}>
                        <div className="mb-4">
                          <CFormLabel style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                            ID Document (Optional)
                          </CFormLabel>
                          <div style={{
                            border: `2px dashed ${validationErrors.attachment ? '#ef4444' : '#cbd5e1'}`,
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            background: '#f8fafc',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => document.getElementById('attachment').click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault()
                            const files = e.dataTransfer.files
                            if (files.length > 0) {
                              const event = { target: { files } }
                              handleFileChange(event)
                            }
                          }}
                          >
                            <CIcon icon={cilCloudUpload} size="2xl" style={{ color: color, marginBottom: '1rem' }} />
                            <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                              {formData.attachment ? formData.attachment.name : 'Upload ID Card, Student Proof, etc.'}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 0 }}>
                              Drag and drop or click to browse (JPEG, PNG, PDF - Max 5MB)
                            </p>
                            <CFormInput
                              type="file"
                              id="attachment"
                              name="attachment"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.pdf"
                              style={{ display: 'none' }}
                            />
                          </div>
                          {validationErrors.attachment && (
                            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                              {validationErrors.attachment}
                            </div>
                          )}
                        </div>
                      </CCol>
                    </CRow>

                    <div style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      marginBottom: '2rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <CFormCheck
                        id="terms"
                        label={
                          <span style={{ color: '#64748b', fontSize: '0.95rem' }}>
                            I agree to the terms and conditions and privacy policy of the event. I understand that my information will be used for event registration and communication purposes.
                          </span>
                        }
                        required
                        style={{ marginBottom: 0 }}
                      />
                    </div>

                    <div className="d-grid gap-3">
                      <CButton
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        style={{
                          background: gradient,
                          border: 'none',
                          borderRadius: '12px',
                          padding: '1rem 2rem',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          boxShadow: `0 8px 20px ${color}30`
                        }}
                      >
                        {submitting ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            Complete Registration
                          </>
                        )}
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>
      </CContainer>

      {/* Entry Pass Modal */}
      {registeredAttendee && expo && (
        <EntryPass
          visible={showEntryPass}
          onClose={() => setShowEntryPass(false)}
          attendee={registeredAttendee}
          expo={expo}
        />
      )}
    </div>
  )
}

export default AttendeeRegistration