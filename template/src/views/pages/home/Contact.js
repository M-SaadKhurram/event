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
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPhone,
  cilEnvelopeOpen,
  cilLocationPin,
  cilClock,
  cilUser,
  cilBuilding
} from '@coreui/icons'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  })
  const [showAlert, setShowAlert] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)

    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: ''
    })
  }

  return (
    <div style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
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
                  background: 'green',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                📞 Contact EventSphere
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
                Let's{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #32ab14ff 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Connect
                </span>{' '}
                and Transform Your Events
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                opacity: 0.95,
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}>
                With EventSphere, every expo is crafted to be seamless, innovative, and unforgettable, ensuring your vision comes to life flawlessly.
              </p>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Contact Form & Info Section */}
      <div style={{ padding: '5rem 0', background: '#fff' }}>
        <CContainer>
          <CRow>
            {/* Contact Form */}
            <CCol lg={8} className="mb-4">
              <CCard style={{
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                minHeight: '820px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  padding: '2rem 2rem 1rem'
                }}>
                  <h3 style={{
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>✉️</span>
                    Send Us a Message
                  </h3>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <CCardBody style={{ padding: '2rem', background: 'linear-gradient(135deg, #41e860ff 0%, #1dce46ff 100%)',}}>
                  {showAlert && (
                    <CAlert color="success" className="mb-4">
                      <strong>Success!</strong> Your message has been sent. We'll contact you soon!
                    </CAlert>
                  )}

                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      <CCol md={6} className="mb-3">
                        <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                          Full Name *
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          style={{
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 16px',
                          }}
                        />
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                          Email Address *
                        </CFormLabel>
                        <CFormInput
                          type="email"
                          name="email"
                          value={formData.email}
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

                    <CRow>
                      <CCol md={6} className="mb-3">
                        <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                          Company/Organization
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Enter company name"
                          style={{
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 16px'
                          }}
                        />
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                          Phone Number
                        </CFormLabel>
                        <CFormInput
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          style={{
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 16px'
                          }}
                        />
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6} className="mb-3">
                        <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                          Inquiry Type *
                        </CFormLabel>
                        <CFormSelect
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          required
                          style={{
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 16px'
                          }}
                        >
                          <option value="">Select inquiry type</option>
                          <option value="general">General Information</option>
                          <option value="demo">Request a Demo</option>
                          <option value="pricing">Pricing & Plans</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                          Subject *
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Enter subject"
                          required
                          style={{
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 16px'
                          }}
                        />
                      </CCol>
                    </CRow>

                    <div className="mb-4">
                      <CFormLabel style={{ fontWeight: '600', color: '#374151' }}>
                        Message *
                      </CFormLabel>
                      <CFormTextarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Tell us about your event requirements..."
                        required
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 16px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <CButton
                        type="submit"
                        size="lg"
                        style={{
                          background: 'linear-gradient(135deg, #f24444ff 0%, #a26f4bff 100%)',
                          border: 'none',
                          padding: '14px 28px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          borderRadius: '12px',
                          boxShadow: '0 8px 20px rgba(247, 144, 144, 0.4)',
                          marginTop:'50px'
                        }}
                      >
                        🚀 Send Message
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Contact Information */}
            {/* Contact Information */}
            <CCol lg={4}>
              <div style={{ position: 'sticky', top: '2rem' }}>
                {/* Quick Contact */}
                <CCard style={{
                  border: 'none',
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  overflow: 'hidden'
                }}>
                  <CCardBody style={{ padding: '2rem' }}>
                    <h4 style={{
                      fontWeight: '700',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>📞</span>
                      Quick Contact
                    </h4>

                    <div className="mb-3">
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.8rem',
                        borderRadius: '10px'
                      }}>
                        <CIcon icon={cilPhone} style={{ marginRight: '0.8rem', fontSize: '1.1rem' }} />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Call Us</div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>+92 300 1234567</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.8rem',
                        borderRadius: '10px'
                      }}>
                        <CIcon icon={cilEnvelopeOpen} style={{ marginRight: '0.8rem', fontSize: '1.1rem' }} />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Email Us</div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>support@eventSphere.pk</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.8rem',
                        borderRadius: '10px'
                      }}>
                        <span style={{ marginRight: '0.8rem', fontSize: '1.1rem' }}>💬</span>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>WhatsApp</div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>+92 300 7654321</div>
                        </div>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>

                {/* Office Locations */}
                <CCard style={{
                  border: 'none',
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                  boxShadow: '0 6px 25px rgba(45, 45, 45, 0.08)'
                }}>
                  <CCardBody style={{ padding: '2rem' }}>
                    <h5 style={{
                      fontWeight: '700',
                      color: '#ffffffff',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.1rem' }}>🏢</span>
                      Our Offices
                    </h5>

                    {[
                      {
                        city: 'Karachi',
                        address: '12th Floor, Ocean Mall,\nClifton, Karachi',
                        color: '#16a34a'
                      },
                      {
                        city: 'Lahore',
                        address: 'Gulberg III,\nMain Boulevard, Lahore',
                        color: '#0d9488'
                      },
                      {
                        city: 'Islamabad',
                        address: 'Blue Area,\nIslamabad',
                        color: '#dc2626'
                      }
                    ].map((office, index) => (
                      <div key={index} style={{
                        marginBottom: index < 2 ? '1.2rem' : 0,
                        padding: '1rem',
                        background: `${office.color}08`,
                        borderRadius: '10px',
                        borderLeft: `3px solid ${office.color}`
                      }}>
                        <div style={{
                          fontWeight: '600',
                          color: office.color,
                          marginBottom: '0.3rem',
                          fontSize: '0.9rem'
                        }}>
                          {office.city}
                        </div>
                        <div style={{
                          color: '#64748b',
                          fontSize: '0.8rem',
                          lineHeight: 1.4,
                          whiteSpace: 'pre-line'
                        }}>
                          {office.address}
                        </div>
                      </div>
                    ))}
                  </CCardBody>
                </CCard>



              </div>
            </CCol>

          </CRow>
        </CContainer>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
        `}
      </style>
    </div>
  )
}

export default Contact