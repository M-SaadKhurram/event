import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CAlert,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
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
import { createExpo, getAvailableFloors } from '../../services/expos'

const ExpoCreate = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
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
  const [imagePreview, setImagePreview] = useState(null)
  const [availableFloors, setAvailableFloors] = useState([1, 2, 3, 4])
  const [checkingFloors, setCheckingFloors] = useState(false)
  const [floorWarning, setFloorWarning] = useState('')

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const checkAvailableFloors = async (selectedDate) => {
    if (!selectedDate) {
      setAvailableFloors([1, 2, 3, 4])
      setFloorWarning('')
      return
    }

    setCheckingFloors(true)
    try {
      const response = await getAvailableFloors(selectedDate)
      setAvailableFloors(response.availableFloors)

      if (response.occupiedFloors.length > 0) {
        setFloorWarning(`Floor(s) ${response.occupiedFloors.join(', ')} are already occupied on this date.`)
      } else {
        setFloorWarning('')
      }

      if (!response.availableFloors.includes(parseInt(formData.floors))) {
        setFormData(prev => ({
          ...prev,
          floors: response.availableFloors[0] || 1
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

      if (name === 'date') {
        checkAvailableFloors(value)
      }
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
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
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('date', formData.date)
      formDataToSend.append('location', formData.location.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('theme', formData.theme.trim())
      formDataToSend.append('status', formData.status)
      formDataToSend.append('floors', parseInt(formData.floors))

      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment)
      }

      await createExpo(formDataToSend)

      showAlert('Expo created successfully!', 'success')

      setTimeout(() => {
        navigate('/dashboard/expos')
      }, 2000)

    } catch (error) {
      console.error('Error creating expo:', error)

      let errorMessage = 'Error creating expo. Please try again.'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid expo data. Please check your inputs.'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to create expos.'
      }

      showAlert(errorMessage, 'danger')
    } finally {
      setIsSubmitting(false)
    }
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
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Create New Expo</strong>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate('/dashboard/expos')}
                disabled={isSubmitting}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back to Expos
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={8}>
                    <CFormLabel htmlFor="title">Expo Title *</CFormLabel>
                    <CFormInput
                      type="text"
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
                        type="text"
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
                      type="text"
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
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </small>
                  </CCol>
                  <CCol md={6}>
                    {imagePreview && (
                      <div>
                        <CFormLabel>Image Preview</CFormLabel>
                        <div>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol xs={12}>
                    <div className="d-flex gap-2">
                      <CButton
                        type="submit"
                        color="primary"
                        disabled={isSubmitting || availableFloors.length === 0}
                      >
                        <CIcon icon={cilSave} className="me-2" />
                        {isSubmitting ? 'Creating...' : 'Create Expo'}
                      </CButton>
                      <CButton
                        type="button"
                        color="secondary"
                        onClick={() => navigate('/dashboard/expos')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ExpoCreate