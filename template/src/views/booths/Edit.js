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
  CFormCheck,
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
  cilLightbulb,
  cilLocationPin,
  cilWeightlifitng,
  cilWifiSignal0,
  cilWifiSignal4,
  
} from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getBooth, updateBooth } from '../../services/booths'

const BoothEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })

  useEffect(() => {
    if (id) {
      fetchBooth()
    }
  }, [id])

  const fetchBooth = async () => {
    try {
      setLoading(true)
      const response = await getBooth(id)
      
      // Handle the response structure from your backend
      const booth = response.booth || response
      
      // Format price for display
      let formattedPrice = ''
      if (booth.price) {
        // Handle Mongoose Decimal128 format
        if (typeof booth.price === 'object' && booth.price.$numberDecimal) {
          formattedPrice = booth.price.$numberDecimal
        } else {
          formattedPrice = booth.price.toString()
        }
      }

      setFormData({
        booth_number: booth.booth_number || '',
        floor: booth.floor || 1,
        length: booth.length?.toString() || '',
        width: booth.width?.toString() || '',
        size_unit: booth.size_unit || 'ft',
        status: booth.status || 'available',
        price: formattedPrice,
        has_power: booth.has_power || false,
        has_wifi: booth.has_wifi || false,
        is_corner_booth: booth.is_corner_booth || false,
        notes: booth.notes || '',
      })
    } catch (error) {
      console.error('Error fetching booth:', error)
      
      let errorMessage = 'Error loading booth details'
      if (error.response?.status === 404) {
        errorMessage = 'Booth not found'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to view this booth'
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.booth_number.trim()) {
      newErrors.booth_number = 'Booth number is required'
    }

    if (!formData.length || formData.length <= 0) {
      newErrors.length = 'Length must be greater than 0'
    }

    if (!formData.width || formData.width <= 0) {
      newErrors.width = 'Width must be greater than 0'
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = 'Price cannot be negative'
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
      // Prepare data for API
      const dataToSave = {
        booth_number: formData.booth_number.trim(),
        floor: parseInt(formData.floor),
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        size_unit: formData.size_unit,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : 0,
        has_power: formData.has_power,
        has_wifi: formData.has_wifi,
        is_corner_booth: formData.is_corner_booth,
        notes: formData.notes.trim(),
      }
      
      await updateBooth(id, dataToSave)
      
      showAlert('Booth updated successfully!', 'success')
      
      // Navigate back to list after short delay
      setTimeout(() => {
        navigate('/dashboard/booths')
      }, 2000)
      
    } catch (error) {
      console.error('Error updating booth:', error)
      
      let errorMessage = 'Error updating booth. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid booth data. Please check your inputs.'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to update this booth.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Booth not found.'
      } else if (error.response?.status === 409) {
        errorMessage = 'A booth with this number already exists on this floor.'
      }
      
      showAlert(errorMessage, 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateArea = () => {
    const length = parseFloat(formData.length)
    const width = parseFloat(formData.width)
    if (length && width) {
      return (length * width).toFixed(2)
    }
    return '0'
  }

  if (loading) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center py-5">
              <CSpinner color="primary" />
              <div className="mt-2">Loading booth details...</div>
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
                <strong>Edit Booth</strong>
                <CButton 
                  color="secondary" 
                  variant="outline"
                  onClick={() => navigate('/dashboard/booths')}
                  disabled={isSubmitting}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to Booths
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="booth_number">Booth Number *</CFormLabel>
                    <CFormInput
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
                      disabled={isSubmitting}
                    >
                      <option value={1}>Floor 1</option>
                      <option value={2}>Floor 2</option>
                      <option value={3}>Floor 3</option>
                      <option value={4}>Floor 4</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel htmlFor="length">Length *</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="length"
                        name="length"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={formData.length}
                        onChange={handleInputChange}
                        invalid={!!errors.length}
                        placeholder="10"
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
                        id="width"
                        name="width"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={formData.width}
                        onChange={handleInputChange}
                        invalid={!!errors.width}
                        placeholder="8"
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

                {/* Booth Details - Enhanced styling */}
                <CRow className="mb-3">
                  <CCol md={12}>
                    <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded">
                      <h6 className="text-primary">Booth Details</h6>
                      <div className="small">
                        <div><strong>Booth Number:</strong> {formData.booth_number}</div>
                        <div><strong>Floor:</strong> {formData.floor}</div>
                        <div>
                          <strong>Size:</strong> {formData.length} x {formData.width} {formData.size_unit}
                        </div>
                        <div>
                          <strong>Total Area:</strong> {calculateArea()} {formData.size_unit}²
                        </div>
                        <div>
                          <strong>Status:</strong> {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                        </div>
                        <div>
                          <strong>Price:</strong> ${formData.price}
                        </div>
                        <div>
                          <strong>Features:</strong>
                          {formData.has_power && <span className="ms-2 badge bg-info">Power</span>}
                          {formData.has_wifi && <span className="ms-2 badge bg-info">WiFi</span>}
                          {formData.is_corner_booth && <span className="ms-2 badge bg-warning text-dark">Corner</span>}
                        </div>
                        {formData.notes && (
                          <div className="mt-2">
                            <strong>Notes:</strong> {formData.notes}
                          </div>
                        )}
                      </div>
                    </div>
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
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="booked">Booked</option>
                      <option value="under_maintenance">Under Maintenance</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="price">Price</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>$</CInputGroupText>
                      <CFormInput
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        invalid={!!errors.price}
                        placeholder="1500.00"
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                  </CCol>
                </CRow>

                {/* Features Section */}
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <CFormLabel>Booth Features</CFormLabel>
                    <div className="d-flex gap-4 mt-2">
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
                        label={
                          <span>
                            <CIcon icon={cilWifiSignal4} className="me-2" />
                            WiFi Available
                          </span>
                        }
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

                <CRow className="mb-4">
                  <CCol xs={12}>
                    <CFormLabel htmlFor="notes">Additional Notes</CFormLabel>
                    <CFormTextarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Optional additional information about this booth..."
                      disabled={isSubmitting}
                    />
                  </CCol>
                </CRow>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <CButton 
                    color="secondary" 
                    onClick={() => navigate('/dashboard/booths')} 
                    disabled={isSubmitting}
                  >
                    Cancel
                  </CButton>
                  <CButton 
                    color="primary" 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        Update Booth
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

export default BoothEdit