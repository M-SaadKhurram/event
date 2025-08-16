import React, { useRef } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPrint,
  cilQrCode,
  cilCalendar,
  cilLocationPin,
  cilUser,
  cilEnvelopeClosed,
  cilBuilding,
  cilCheckCircle,
  cilCloudDownload
} from '@coreui/icons'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const EntryPass = ({ visible, onClose, attendee, expo }) => {
  const entryPassRef = useRef(null)

  const getExpoCategory = (expo) => {
    const title = expo.title.toLowerCase()
    const theme = expo.theme?.toLowerCase() || ''

    if (title.includes('tech') || theme.includes('tech') || title.includes('innovation')) {
      return { category: 'Technology', color: '#2563eb', gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
    } else if (title.includes('health') || theme.includes('health') || title.includes('medical')) {
      return { category: 'Healthcare', color: '#059669', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
    } else if (title.includes('food') || theme.includes('food') || title.includes('beverage')) {
      return { category: 'Food & Beverage', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }
    } else if (title.includes('fashion') || theme.includes('fashion') || title.includes('lifestyle')) {
      return { category: 'Fashion', color: '#ea580c', gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)' }
    } else if (title.includes('auto') || theme.includes('auto') || title.includes('car')) {
      return { category: 'Automotive', color: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }
    } else {
      return { category: 'General', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }
    }
  }

  const generateQRCode = async (data) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        width: 150,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      })
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code:', error)
      return null
    }
  }

  const downloadAsPDF = async () => {
    if (!entryPassRef.current) return

    try {
      const canvas = await html2canvas(entryPassRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297] // A4 size
      })

      const imgWidth = 180
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const x = (210 - imgWidth) / 2
      const y = 20

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      pdf.save(`${attendee.full_name}-Entry-Pass.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const printPass = () => {
    if (!entryPassRef.current) return

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Entry Pass - ${attendee.full_name}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${entryPassRef.current.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const { color, gradient, category } = getExpoCategory(expo)

  const [qrCodeDataURL, setQrCodeDataURL] = React.useState('')

  React.useEffect(() => {
    const generateQR = async () => {
      const qrData = JSON.stringify({
        badge_id: attendee.badge_id,
        expo_id: attendee.expo_id,
        attendee_id: attendee.id,
        type: 'attendee'
      })
      const qrCode = await generateQRCode(qrData)
      if (qrCode) {
        setQrCodeDataURL(qrCode)
      }
    }
    
    if (visible && attendee && expo) {
      generateQR()
    }
  }, [visible, attendee, expo])

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader style={{
        background: gradient,
        color: 'white',
        border: 'none'
      }}>
        <CModalTitle style={{ fontWeight: '700', fontSize: '1.3rem' }}>
          <CIcon icon={cilQrCode} className="me-2" />
          Entry Pass Generated
        </CModalTitle>
      </CModalHeader>

      <CModalBody style={{ padding: '2rem' }}>
        <div
          ref={entryPassRef}
          style={{
            background: 'white',
            border: `3px solid ${color}`,
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          {/* Header Section */}
          <div style={{
            background: gradient,
            color: 'white',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="text-center mb-3">
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  marginBottom: '0.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  ENTRY PASS
                </h1>
                <CBadge
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {category}
                </CBadge>
              </div>

              <div className="text-center">
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  marginBottom: '0.5rem'
                }}>
                  {expo.title}
                </h2>
                {expo.theme && (
                  <p style={{
                    fontSize: '1.1rem',
                    opacity: 0.9,
                    marginBottom: 0,
                    fontStyle: 'italic'
                  }}>
                    {expo.theme}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ padding: '2rem' }}>
            <CRow>
              {/* Attendee Information */}
              <CCol md={8}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '15px',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#1e293b',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    ATTENDEE INFORMATION
                  </h3>

                  <div className="row g-3">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <div style={{
                          background: color,
                          borderRadius: '8px',
                          padding: '0.5rem',
                          marginRight: '1rem'
                        }}>
                          <CIcon icon={cilUser} style={{ color: 'white', fontSize: '1.1rem' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                            Full Name
                          </div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b' }}>
                            {attendee.full_name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <div style={{
                          background: color,
                          borderRadius: '8px',
                          padding: '0.5rem',
                          marginRight: '1rem'
                        }}>
                          <CIcon icon={cilEnvelopeClosed} style={{ color: 'white', fontSize: '1.1rem' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                            Email Address
                          </div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                            {attendee.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {attendee.organization && (
                      <div className="col-12">
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            background: color,
                            borderRadius: '8px',
                            padding: '0.5rem',
                            marginRight: '1rem'
                          }}>
                            <CIcon icon={cilBuilding} style={{ color: 'white', fontSize: '1.1rem' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                              Organization
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                              {attendee.organization}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <div style={{
                          background: color,
                          borderRadius: '8px',
                          padding: '0.5rem',
                          marginRight: '1rem'
                        }}>
                          <CIcon icon={cilCalendar} style={{ color: 'white', fontSize: '1.1rem' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                            Event Date
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {new Date(expo.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <div style={{
                          background: color,
                          borderRadius: '8px',
                          padding: '0.5rem',
                          marginRight: '1rem'
                        }}>
                          <CIcon icon={cilLocationPin} style={{ color: 'white', fontSize: '1.1rem' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                            Venue
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {expo.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>

              {/* QR Code Section */}
              <CCol md={4}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  height: 'fit-content'
                }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '1rem'
                  }}>
                    SCAN TO VERIFY
                  </h4>
                  
                  {qrCodeDataURL && (
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      border: '2px solid #e2e8f0'
                    }}>
                      <img
                        src={qrCodeDataURL}
                        alt="QR Code"
                        style={{
                          width: '120px',
                          height: '120px',
                          display: 'block',
                          margin: '0 auto'
                        }}
                      />
                    </div>
                  )}

                  <div style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '1rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      Badge ID
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {attendee.badge_id}
                    </div>
                  </div>

                  <CBadge
                    style={{
                      background: '#10b981',
                      color: 'white',
                      fontSize: '0.8rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '15px',
                      marginTop: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    <CIcon icon={cilCheckCircle} className="me-1" />
                    Verified
                  </CBadge>
                </div>
              </CCol>
            </CRow>

            {/* Footer */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
              borderRadius: '15px',
              textAlign: 'center',
              border: `1px solid ${color}25`
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                This pass is valid for the duration of the event. Please keep it with you at all times.
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                marginBottom: 0
              }}>
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </CModalBody>

      <CModalFooter style={{ background: '#f8fafc', border: 'none' }}>
        <div className="d-flex gap-2 w-100">
          <CButton
            color="primary"
            onClick={downloadAsPDF}
            style={{
              background: gradient,
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              flex: 1
            }}
          >
            <CIcon icon={cilCloudDownload} className="me-2" />
            Download PDF
          </CButton>
          
          <CButton
            color="info"
            variant="outline"
            onClick={printPass}
            style={{
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              flex: 1
            }}
          >
            <CIcon icon={cilPrint} className="me-2" />
            Print Pass
          </CButton>
          
          <CButton
            color="light"
            onClick={onClose}
            style={{
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              border: '2px solid #e5e7eb'
            }}
          >
            Close
          </CButton>
        </div>
      </CModalFooter>
    </CModal>
  )
}

export default EntryPass