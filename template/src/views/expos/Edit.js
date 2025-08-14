import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilSave, 
  cilArrowLeft, 
  cilCalendar,
  cilLocationPin,
  cilImage,
  cilWarning
} from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getExpo, updateExpo, getAvailableFloors } from '../../services/expos'

const ExpoEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    theme: '',
    status: 'upcoming',
    floors: 1,
    attachment: null
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [imageError, setImageError] = useState(false)
  
  // Add validation states
  const [availableFloors, setAvailableFloors] = useState([1, 2, 3, 4])
  const [checkingFloors, setCheckingFloors] = useState(false)
  const [floorWarning, setFloorWarning] = useState('')
  const [originalFloor, setOriginalFloor] = useState(null) // Track original floor

  useEffect(() => {
    if (id) {
      fetchExpo()
    }
  }, [id])

  const fetchExpo = async () => {
    try {
      setLoading(true)
      const response = await getExpo(id)
      
      const expo = response.expo || response
      
      // Format date for input
      const formattedDate = expo.date ? expo.date.split('T')[0] : ''

      setFormData({
        title: expo.title || '',
        date: formattedDate,
        location: expo.location || '',
        description: expo.description || '',
        theme: expo.theme || '',
        status: expo.status || 'upcoming',
        floors: expo.floors || 1,
        attachment: null
      })

      // Set original floor for validation
      setOriginalFloor(expo.floors || 1)

      // Set current image for display
      if (expo.attachment) {
        setCurrentImage(expo.attachment)
        setImageError(false)
      }

      // Check available floors for the current date
      if (formattedDate) {
        checkAvailableFloors(formattedDate, expo.floors)
      }

    } catch (error) {
      console.error('Error fetching expo:', error)
      
      let errorMessage = 'Error loading expo details'
      if (error.response?.status === 404) {
        errorMessage = 'Expo not found'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to view this expo'
      }
      
      showAlert(errorMessage, 'danger')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  // Check available floors when date changes (including current expo's floor)
  const checkAvailableFloors = async (selectedDate, currentExpoFloor = null) => {
    if (!selectedDate) {
      setAvailableFloors([1, 2, 3, 4])
      setFloorWarning('')
      return
    }

    setCheckingFloors(true)
    try {
      const response = await getAvailableFloors(selectedDate)
      
      // Include the current expo's original floor as available (since we're editing it)
      let availableFloorsForEdit = [...response.availableFloors]
      const expoOriginalFloor = currentExpoFloor || originalFloor
      
      if (expoOriginalFloor && !availableFloorsForEdit.includes(expoOriginalFloor)) {
        availableFloorsForEdit.push(expoOriginalFloor)
        availableFloorsForEdit.sort((a, b) => a - b)
      }
      
      setAvailableFloors(availableFloorsForEdit)
      
      // Filter out current expo's floor from occupied floors for warning
      const occupiedFloorsExceptCurrent = response.occupiedFloors.filter(
        floor => floor !== expoOriginalFloor
      )
      
      if (occupiedFloorsExceptCurrent.length > 0) {
        setFloorWarning(`Floor(s) ${occupiedFloorsExceptCurrent.join(', ')} are already occupied on this date by other expos.`)
      } else {
        setFloorWarning('')
      }

      // If currently selected floor is not available, reset to first available
      if (!availableFloorsForEdit.includes(parseInt(formData.floors))) {
        setFormData(prev => ({
          ...prev,
          floors: availableFloorsForEdit[0] || 1
        }))
      }
    } catch (error) {
      console.error('Error checking available floors:', error)
      setAvailableFloors([1, 2, 3, 4])
      setFloorWarning('')
    } finally {
      setCheckingFloors(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      const file = files[0]
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      
      // Create image preview
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target.result)
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))

      // Check available floors when date changes
      if (name === 'date') {
        checkAvailableFloors(value)
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Expo title is required'
    }

    if (!formData.date) {
      newErrors.date = 'Expo date is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.theme.trim()) {
      newErrors.theme = 'Theme is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.floors < 1) {
      newErrors.floors = 'Number of floors must be at least 1'
    }

    if (availableFloors.length === 0) {
      newErrors.floors = 'No floors are available for the selected date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showAlert('Please fix the errors below', 'danger')
      return
    }

    setIsSubmitting(true)
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('date', formData.date)
      formDataToSend.append('location', formData.location.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('theme', formData.theme.trim())
      formDataToSend.append('status', formData.status)
      formDataToSend.append('floors', parseInt(formData.floors))
      
      // Only append attachment if a new one was selected
      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment)
      }
      
      await updateExpo(id, formDataToSend)
      
      showAlert('Expo updated successfully!', 'success')
      
      // Navigate back to list after short delay
      setTimeout(() => {
        navigate('/dashboard/expos')
      }, 2000)
      
    } catch (error) {
      console.error('Error updating expo:', error)
      
      let errorMessage = 'Error updating expo. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid expo data. Please check your inputs.'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to update this expo.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Expo not found.'
      }
      
      showAlert(errorMessage, 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const serverUrl = baseUrl.replace('/api', '')
    return `${serverUrl}/${imagePath}`
  }

  // Fixed: Handle image error without infinite loop
  const handleImageError = (e) => {
    setImageError(true)
    e.target.style.display = 'none'
  }

  if (loading) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center py-5">
              <CSpinner color="primary" />
              <div className="mt-2">Loading expo details...</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
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

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <strong>Edit Expo</strong>
                <CButton 
                  color="secondary" 
                  variant="outline"
                  onClick={() => navigate('/dashboard/expos')}
                  disabled={isSubmitting}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to Expos
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={8}>
                    <CFormLabel htmlFor="title">Expo Title *</CFormLabel>
                    <CFormInput
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      invalid={!!errors.title}
                      placeholder="e.g., Tech Innovation Expo 2024"
                      disabled={isSubmitting}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="date">Expo Date *</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        invalid={!!errors.date}
                        disabled={isSubmitting}
                      />
                      {checkingFloors && (
                        <CInputGroupText>
                          <CSpinner size="sm" />
                        </CInputGroupText>
                      )}
                    </CInputGroup>
                    {errors.date && (
                      <div className="invalid-feedback">{errors.date}</div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="location">Location *</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormInput
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        invalid={!!errors.location}
                        placeholder="e.g., Convention Center, City"
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="theme">Theme *</CFormLabel>
                    <CFormInput
                      id="theme"
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      invalid={!!errors.theme}
                      placeholder="e.g., Technology, Healthcare, Fashion"
                      disabled={isSubmitting}
                    />
                    {errors.theme && (
                      <div className="invalid-feedback">{errors.theme}</div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="status">Status</CFormLabel>
                    <CFormSelect
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="floors">Number of Floors *</CFormLabel>
                    <CFormSelect
                      id="floors"
                      name="floors"
                      value={formData.floors}
                      onChange={handleInputChange}
                      invalid={!!errors.floors}
                      disabled={isSubmitting || checkingFloors}
                    >
                      {availableFloors.length === 0 ? (
                        <option value="">No floors available</option>
                      ) : (
                        availableFloors.map(floor => (
                          <option key={floor} value={floor}>
                            {floor} Floor{floor > 1 ? 's' : ''}
                            {floor === originalFloor ? ' (Current)' : ''}
                          </option>
                        ))
                      )}
                    </CFormSelect>
                    {errors.floors && (
                      <div className="invalid-feedback">{errors.floors}</div>
                    )}
                    {floorWarning && (
                      <div className="text-warning mt-1">
                        <CIcon icon={cilWarning} className="me-1" />
                        {floorWarning}
                      </div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="description">Description *</CFormLabel>
                    <CFormTextarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      invalid={!!errors.description}
                      placeholder="Describe the expo, its purpose, expected attendees, and key highlights..."
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="attachment">Expo Image</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilImage} />
                      </CInputGroupText>
                      <CFormInput
                        type="file"
                        id="attachment"
                        name="attachment"
                        accept="image/*"
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    <small className="text-muted">
                      Leave empty to keep current image. Supported: JPG, PNG, GIF. Max: 5MB
                    </small>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Current/Preview Image</CFormLabel>
                    <div>
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="New Preview" 
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '200px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #28a745'
                          }}
                        />
                      ) : currentImage && !imageError ? (
                        <img 
                          src={getImageUrl(currentImage)} 
                          alt="Current" 
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '200px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e0e0e0'
                          }}
                          onError={handleImageError}
                        />
                      ) : (
                        <div style={{ 
                          width: '200px', 
                          height: '200px', 
                          backgroundColor: '#f8f9fa',
                          border: '2px dashed #dee2e6',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6c757d',
                          flexDirection: 'column'
                        }}>
                          <CIcon icon={cilImage} size="3xl" className="mb-2" />
                          <span>No Image Available</span>
                        </div>
                      )}
                    </div>
                  </CCol>
                </CRow>

                <div className="d-flex justify-content-end gap-2">
                  <CButton 
                    color="secondary" 
                    onClick={() => navigate('/dashboard/expos')} 
                    disabled={isSubmitting}
                  >
                    Cancel
                  </CButton>
                  <CButton 
                    color="primary" 
                    type="submit" 
                    disabled={isSubmitting || availableFloors.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        Update Expo
                      </>
                    )}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ExpoEdit