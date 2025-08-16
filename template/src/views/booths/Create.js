import React, { useState, useEffect } from 'react'
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
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilSave, 
  cilArrowLeft, 
  cilLightbulb,
  cilLocationPin,
  cilCalendar
} from '@coreui/icons'
import { createBooth } from '../../services/booths'
import { getExpos } from '../../services/expos'

const BoothCreate = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [expos, setExpos] = useState([])
  const [selectedExpo, setSelectedExpo] = useState(null)
  const [formData, setFormData] = useState({
    expo_id: '',
    booth_number: '',
    floor: 1,
    length: '',
    width: '',
    size_unit: 'ft',
    status: 'available',
    price: '',
    has_power: false,
    has_wifi: false,
    is_corner_booth: false,
    notes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchExpos()
  }, [])

  useEffect(() => {
    if (formData.expo_id) {
      const expo = expos.find(e => e._id === formData.expo_id)
      setSelectedExpo(expo)
      
      // Reset floor if it exceeds expo's floor limit
      if (expo && formData.floor > expo.floors) {
        setFormData(prev => ({ ...prev, floor: 1 }))
      }
    } else {
      setSelectedExpo(null)
    }
  }, [formData.expo_id, expos])

  const fetchExpos = async () => {
    try {
      const data = await getExpos()
      setExpos(data)
    } catch (err) {
      console.error('Error fetching expos:', err)
      showAlert('Failed to load expos', 'danger')
    }
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.expo_id) {
      newErrors.expo_id = 'Please select an expo'
    }
    
    if (!formData.booth_number.trim()) {
      newErrors.booth_number = 'Booth number is required'
    }
    
    if (!formData.length || formData.length <= 0) {
      newErrors.length = 'Length must be greater than 0'
    }
    
    if (!formData.width || formData.width <= 0) {
      newErrors.width = 'Width must be greater than 0'
    }
    
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Price must be 0 or greater'
    }

    if (selectedExpo && formData.floor > selectedExpo.floors) {
      newErrors.floor = `Floor cannot exceed ${selectedExpo.floors} for this expo`
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
      // Convert price to number and prepare data for API
      const boothData = {
        ...formData,
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        price: parseFloat(formData.price) || 0,
        floor: parseInt(formData.floor)
      }

      const response = await createBooth(boothData)
      
      showAlert('Booth created successfully!', 'success')
      
      // Redirect to booths list after short delay
      setTimeout(() => {
        navigate('/dashboard/booths')
      }, 2000)
      
    } catch (error) {
      console.error('Error creating booth:', error)
      
      let errorMessage = 'Error creating booth. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid booth data. Please check your inputs.'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to create booths.'
      } else if (error.response?.status === 409) {
        errorMessage = 'A booth with this number already exists on this floor for this expo.'
      }
      
      showAlert(errorMessage, 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateArea = () => {
    if (formData.length && formData.width) {
      return (parseFloat(formData.length) * parseFloat(formData.width)).toFixed(2)
    }
    return '0'
  }

  const getAvailableFloors = () => {
    if (!selectedExpo) return [1, 2, 3, 4]
    const floors = []
    for (let i = 1; i <= selectedExpo.floors; i++) {
      floors.push(i)
    }
    return floors
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
              <strong>Create New Booth</strong>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate('/dashboard/booths')}
                disabled={isSubmitting}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back to Booths
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                {/* Expo Selection */}
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="expo_id">Select Expo *</CFormLabel>
                    <CFormSelect
                      id="expo_id"
                      name="expo_id"
                      value={formData.expo_id}
                      onChange={handleInputChange}
                      invalid={!!errors.expo_id}
                      disabled={isSubmitting}
                    >
                      <option value="">Choose an expo...</option>
                      {expos.map((expo) => (
                        <option key={expo._id} value={expo._id}>
                          {expo.title} - {new Date(expo.date).toLocaleDateString()} ({expo.floors} floors)
                        </option>
                      ))}
                    </CFormSelect>
                    {errors.expo_id && (
                      <div className="invalid-feedback">{errors.expo_id}</div>
                    )}
                  </CCol>
                </CRow>

                {/* Selected Expo Info - Enhanced styling */}
                {selectedExpo && (
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded">
                        <h6 className="text-primary">Selected Expo Details</h6>
                        <div className="small">
                          <div><strong>Event:</strong> {selectedExpo.title}</div>
                          <div>
                            <strong>Date:</strong> {new Date(selectedExpo.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div><strong>Floors:</strong> {selectedExpo.floors}</div>
                                                  </div>
                      </div>
                    </CCol>
                  </CRow>
                )}

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="booth_number">Booth Number *</CFormLabel>
                    <CFormInput
                      type="text"
                      id="booth_number"
                      name="booth_number"
                      value={formData.booth_number}
                      onChange={handleInputChange}
                      invalid={!!errors.booth_number}
                      placeholder="e.g., A101, B205"
                      disabled={isSubmitting}
                    />
                    {errors.booth_number && (
                      <div className="invalid-feedback">{errors.booth_number}</div>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="floor">Floor *</CFormLabel>
                    <CFormSelect
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      invalid={!!errors.floor}
                      disabled={isSubmitting || !formData.expo_id}
                    >
                      {getAvailableFloors().map(floor => (
                        <option key={floor} value={floor}>Floor {floor}</option>
                      ))}
                    </CFormSelect>
                    {errors.floor && (
                      <div className="invalid-feedback">{errors.floor}</div>
                    )}
                    {selectedExpo && (
                      <small className="text-body-secondary">
                        Maximum {selectedExpo.floors} floors available for this expo
                      </small>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel htmlFor="length">Length *</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        id="length"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        invalid={!!errors.length}
                        placeholder="10"
                        min="0.1"
                        step="0.1"
                        disabled={isSubmitting}
                      />
                      <CInputGroupText>{formData.size_unit}</CInputGroupText>
                    </CInputGroup>
                    {errors.length && (
                      <div className="invalid-feedback">{errors.length}</div>
                    )}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="width">Width *</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        id="width"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        invalid={!!errors.width}
                        placeholder="8"
                        min="0.1"
                        step="0.1"
                        disabled={isSubmitting}
                      />
                      <CInputGroupText>{formData.size_unit}</CInputGroupText>
                    </CInputGroup>
                    {errors.width && (
                      <div className="invalid-feedback">{errors.width}</div>
                    )}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="size_unit">Unit *</CFormLabel>
                    <CFormSelect
                      id="size_unit"
                      name="size_unit"
                      value={formData.size_unit}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="ft">Feet</option>
                      <option value="m">Meters</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                {formData.length && formData.width && (
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <div className="alert alert-info">
                        <strong>Total Area:</strong> {calculateArea()} {formData.size_unit}²
                      </div>
                    </CCol>
                  </CRow>
                )}

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="price">Price *</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>$</CInputGroupText>
                      <CFormInput
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        invalid={!!errors.price}
                        placeholder="1500.00"
                        min="0"
                        step="0.01"
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="status">Status</CFormLabel>
                    <CFormSelect
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="booked">Booked</option>
                      <option value="under_maintenance">Under Maintenance</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Features</CFormLabel>
                    <div className="d-flex gap-4">
                      <CFormCheck
                        id="has_power"
                        name="has_power"
                        checked={formData.has_power}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        label={
                          <span>
                            <CIcon icon={cilLightbulb} className="me-2" />
                            Power Available
                          </span>
                        }
                      />
                      <CFormCheck
                        id="has_wifi"
                        name="has_wifi"
                        checked={formData.has_wifi}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        label="WiFi Available"
                      />
                      <CFormCheck
                        id="is_corner_booth"
                        name="is_corner_booth"
                        checked={formData.is_corner_booth}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        label={
                          <span>
                            <CIcon icon={cilLocationPin} className="me-2" />
                            Corner Booth
                          </span>
                        }
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="notes">Notes</CFormLabel>
                    <CFormTextarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes about this booth..."
                      disabled={isSubmitting}
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol xs={12}>
                    <div className="d-flex gap-2">
                      <CButton 
                        type="submit" 
                        color="primary" 
                        disabled={isSubmitting || !formData.expo_id}
                      >
                        <CIcon icon={cilSave} className="me-2" />
                        {isSubmitting ? 'Creating...' : 'Create Booth'}
                      </CButton>
                      <CButton 
                        type="button" 
                        color="secondary"
                        onClick={() => navigate('/dashboard/booths')}
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

export default BoothCreate