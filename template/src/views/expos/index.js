import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CAlert,
  CSpinner,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CFormSelect,
  CCardTitle,
  CCardText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCloseButton,
  CCardFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPencil, 
  cilTrash, 
  cilPlus, 
  cilSearch,
  cilCalendar,
  cilLocationPin,
  cilImage,
  cilZoomIn,
  cilX,
  cilBuilding,
  cilStar,
  cilClock,
} from '@coreui/icons'
import { getExpos, deleteExpo } from '../../services/expos'

const ExposList = () => {
  const navigate = useNavigate()
  const [expos, setExpos] = useState([])
  const [filteredExpos, setFilteredExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [imageErrors, setImageErrors] = useState({})
  // Modal state for image preview
  const [imageModal, setImageModal] = useState({
    visible: false,
    imageUrl: '',
    title: '',
    loading: false
  })

  useEffect(() => {
    fetchExpos()
  }, [])

  useEffect(() => {
    filterExpos()
  }, [expos, searchTerm, filterStatus])

  const fetchExpos = async () => {
    try {
      setLoading(true)
      const data = await getExpos()
      setExpos(data)
    } catch (error) {
      console.error('Error fetching expos:', error)
      showAlert('Error loading expos. Please try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterExpos = () => {
    let filtered = expos.filter(expo => {
      const matchesSearch = expo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expo.theme.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || expo.status === filterStatus
      return matchesSearch && matchesStatus
    })
    setFilteredExpos(filtered)
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleCreate = () => {
    navigate('/dashboard/expos/create')
  }

  const handleView = (expo) => {
    navigate(`/dashboard/expos/${expo._id}`)
  }

  const handleEdit = (expo) => {
    navigate(`/dashboard/expos/edit/${expo._id}`)
  }

  const handleDelete = async (expo) => {
    if (window.confirm(`Are you sure you want to delete expo "${expo.title}"?`)) {
      try {
        await deleteExpo(expo._id)
        showAlert('Expo deleted successfully!', 'success')
        fetchExpos()
      } catch (error) {
        console.error('Error deleting expo:', error)
        showAlert('Error deleting expo. Please try again.', 'danger')
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'upcoming': { color: 'info', text: 'Upcoming' },
      'ongoing': { color: 'success', text: 'Ongoing' },
      'completed': { color: 'secondary', text: 'Completed' },
      'cancelled': { color: 'danger', text: 'Cancelled' }
    }
    const config = statusConfig[status] || { color: 'secondary', text: status }
    return <CBadge color={config.color}>{config.text}</CBadge>
  }

  const getStatusCount = (status) => {
    return expos.filter(expo => expo.status === status).length
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/'
    const serverUrl = baseUrl.replace('/api', '')
    return `${serverUrl}${imagePath}`
  }

  const handleImageError = (expoId) => {
    setImageErrors(prev => ({ ...prev, [expoId]: true }))
  }

  // Handle image preview modal
  const handleImagePreview = (expo) => {
    if (!expo.attachment || imageErrors[expo._id]) {
      showAlert('No image available for this expo', 'warning')
      return
    }

    setImageModal({
      visible: true,
      imageUrl: getImageUrl(expo.attachment),
      title: expo.title,
      loading: true
    })
  }

  const handleImageLoad = () => {
    setImageModal(prev => ({ ...prev, loading: false }))
  }

  const handleImageModalError = () => {
    setImageModal(prev => ({ ...prev, loading: false }))
    showAlert('Failed to load image', 'danger')
  }

  const closeImageModal = () => {
    setImageModal({
      visible: false,
      imageUrl: '',
      title: '',
      loading: false
    })
  }

  // Helper function to get days until expo
  const getDaysUntilExpo = (dateString) => {
    const expoDate = new Date(dateString)
    const today = new Date()
    const diffTime = expoDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <CSpinner color="primary" />
        <p className="mt-2">Loading expos...</p>
      </div>
    )
  }

  return (
    <>
      {alert.show && (
        <CAlert 
          color={alert.color} 
          dismissible 
          onClose={() => setAlert({ show: false, message: '', color: '' })}
        >
          {alert.message}
        </CAlert>
      )}

      {/* Image Preview Modal */}
      <CModal
        size="lg"
        visible={imageModal.visible}
        onClose={closeImageModal}
        backdrop="static"
        scrollable={true}
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilImage} className="me-2" />
            {imageModal.title}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center p-4">
          {imageModal.loading && (
            <div className="mb-3">
              <CSpinner color="primary" />
              <p className="mt-2">Loading image...</p>
            </div>
          )}
          {imageModal.imageUrl && (
            <div style={{ position: 'relative' }}>
              <img
                src={imageModal.imageUrl}
                alt={imageModal.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onLoad={handleImageLoad}
                onError={handleImageModalError}
              />
             
            </div>
          )}
          
        </CModalBody>
      </CModal>

      {/* Statistics Cards */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-info">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('upcoming')}</div>
                <div>Upcoming</div>
              </div>
              <CIcon icon={cilCalendar} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-success">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('ongoing')}</div>
                <div>Ongoing</div>
              </div>
              <CIcon icon={cilCalendar} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-secondary">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('completed')}</div>
                <div>Completed</div>
              </div>
              <CIcon icon={cilCalendar} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-danger">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('cancelled')}</div>
                <div>Cancelled</div>
              </div>
              <CIcon icon={cilCalendar} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Main Content */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Expos Management</strong>
              <div className="d-flex gap-2">
                <CButton 
                  color={viewMode === 'table' ? 'primary' : 'secondary'}
                  variant={viewMode === 'table' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </CButton>
                <CButton 
                  color={viewMode === 'cards' ? 'primary' : 'secondary'}
                  variant={viewMode === 'cards' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  Card View
                </CButton>
                <CButton color="primary" onClick={handleCreate}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Add New Expo
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Search and Filter */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Search by title, location, or theme..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Content based on view mode */}
              {viewMode === 'table' ? (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell>Theme</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Floors</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredExpos.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          No expos found
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredExpos.map((expo) => (
                        <CTableRow key={expo._id}>
                        
                          <CTableDataCell>
                            <strong>{expo.title}</strong>
                          </CTableDataCell>
                          <CTableDataCell>{formatDate(expo.date)}</CTableDataCell>
                          <CTableDataCell>
                            <CIcon icon={cilLocationPin} className="me-1" />
                            {expo.location}
                          </CTableDataCell>
                          <CTableDataCell>{expo.theme}</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(expo.status)}</CTableDataCell>
                          <CTableDataCell>{expo.floors} floor(s)</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                                                          {imageErrors[expo._id] || !expo.attachment ? (
                              <div style={{ 
                                width: '50px', 
                                height: '30px', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6c757d'
                              }}>
                                <span style={{ fontSize: '12px' }}>No Image</span>
                              </div>
                            ) : (
                              <CButton
                                color="info"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleImagePreview(expo)}
                                title="View Image"
                              >
                                <CIcon icon={cilZoomIn} className="me-1" />
                                <span style={{ fontSize: '11px' }}>Preview</span>
                              </CButton>
                            )}

                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(expo)}
                                title="Edit"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(expo)}
                                title="Delete"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              ) : (
                <CRow>
                  {filteredExpos.length === 0 ? (
                    <CCol xs={12} className="text-center py-5">
                      <CIcon icon={cilImage} size="4xl" className="text-muted mb-3" />
                      <h5 className="text-muted">No expos found</h5>
                      <p className="text-muted">Try adjusting your search or filter criteria</p>
                    </CCol>
                  ) : (
                    filteredExpos.map((expo) => {
                      const daysUntil = getDaysUntilExpo(expo.date)
                      return (
                        <CCol xs={12} md={6} lg={4} key={expo._id} className="mb-4">
                          <CCard 
                            className="h-100 shadow-sm border-0"
                            style={{ 
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '0.375rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)'
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            {/* Status Badge Overlay */}
                            <div style={{ position: 'relative' }}>
                              <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                zIndex: 2
                              }}>
                                {getStatusBadge(expo.status)}
                              </div>

                              {/* Image Display Area */}
                              <div style={{ 
                                height: '220px', 
                                position: 'relative',
                                borderRadius: '0.375rem 0.375rem 0 0',
                                overflow: 'hidden'
                              }}>
                                {imageErrors[expo._id] || !expo.attachment ? (
                                  <div style={{ 
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                  }}>
                                    <CIcon 
                                      icon={cilImage} 
                                      size="4xl" 
                                      className="mb-3" 
                                      style={{ color: 'rgba(255,255,255,0.8)' }}
                                    />
                                    <span style={{ 
                                      color: 'rgba(255,255,255,0.9)',
                                      fontSize: '14px',
                                      fontWeight: '500'
                                    }}>
                                      No Image Available
                                    </span>
                                  </div>
                                ) : (
                                  <img
                                    src={getImageUrl(expo.attachment)}
                                    alt={expo.title}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleImagePreview(expo)}
                                    onError={() => handleImageError(expo._id)}
                                  />
                                )}
                              </div>
                            </div>

                            <CCardBody className="p-4" style={{ 
                              backgroundColor: '#2d3748', // Dark background
                              color: 'white'
                            }}>
                              {/* Title and Theme */}
                              <div className="mb-3">
                                <CCardTitle className="mb-2 h5" style={{ 
                                  fontWeight: '600',
                                  color: 'white',
                                  lineHeight: '1.3'
                                }}>
                                  {expo.title}
                                </CCardTitle>
                                <div className="d-flex align-items-center mb-2">
                                  <CIcon icon={cilStar} className="me-2" size="sm" style={{ color: '#ffd700' }} />
                                  <span style={{
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                  }}>
                                    {expo.theme}
                                  </span>
                                </div>
                              </div>

                              {/* Date and Location Info */}
                              <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                  <CIcon icon={cilCalendar} className="me-2" size="sm" style={{ color: '#87ceeb' }} />
                                  <span className="fw-medium" style={{ color: 'white' }}>
                                    {formatDate(expo.date)}
                                  </span>
                                  {expo.status === 'upcoming' && daysUntil > 0 && (
                                    <span style={{
                                      marginLeft: '8px',
                                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                      color: 'white',
                                      padding: '4px 8px',
                                      borderRadius: '12px',
                                      fontSize: '11px',
                                      fontWeight: '500',
                                      border: '1px solid rgba(102, 126, 234, 0.3)'
                                    }}>
                                      <CIcon icon={cilClock} className="me-1" size="sm" />
                                      {daysUntil} days left
                                    </span>
                                  )}
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <CIcon icon={cilLocationPin} className="me-2" size="sm" style={{ color: '#ff6b9d' }} />
                                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>{expo.location}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <CIcon icon={cilBuilding} className="me-2" size="sm" style={{ color: '#98fb98' }} />
                                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {expo.floors} Floor{expo.floors > 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              <CCardText style={{ 
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                minHeight: '3rem',
                                marginBottom: '1rem'
                              }}>
                                {expo.description?.substring(0, 120)}
                                {expo.description?.length > 120 && '...'}
                              </CCardText>
                            </CCardBody>

                            {/* Action Buttons Footer with same gradient */}
                            <CCardFooter style={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              padding: '1rem 1.5rem',
                              borderRadius: '0 0 0.375rem 0.375rem'
                            }}>
                              <div className="d-flex gap-2">
                                <CButton
                                  size="sm"
                                  onClick={() => handleEdit(expo)}
                                  className="flex-fill"
                                  style={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'
                                    e.target.style.transform = 'translateY(-2px)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                                    e.target.style.transform = 'translateY(0)'
                                  }}
                                >
                                  <CIcon icon={cilPencil} className="me-1" />
                                  Edit
                                </CButton>
                                <CButton
                                  size="sm"
                                  onClick={() => handleDelete(expo)}
                                  title="Delete Expo"
                                  style={{ 
                                    backgroundColor: 'rgba(255,75,75,0.8)',
                                    border: '1px solid rgba(255,75,75,0.9)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,75,75,1)'
                                    e.target.style.transform = 'translateY(-2px)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,75,75,0.8)'
                                    e.target.style.transform = 'translateY(0)'
                                  }}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </div>
                            </CCardFooter>
                          </CCard>
                        </CCol>
                      )
                    })
                  )}
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ExposList