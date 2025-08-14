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
  CFormSwitch,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormFeedback,
  CAlert,
  CBadge,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilSave, 
  cilArrowLeft, 
  cilLightbulb, // Use cilLightbulb instead of cilPower
  cilWifi, 
  cilLocationPin 
} from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'

const BoothForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

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
    assigned_to: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })

  useEffect(() => {
    if (isEdit) {
      fetchBooth()
    }
  }, [id, isEdit])

  const fetchBooth = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockBooth = {
        id: parseInt(id),
        booth_number: 'A101',
        floor: 1,
        length: 10,
        width: 8,
        size_unit: 'ft',
        status: 'available',
        price: 1500.00,
        has_power: true,
        has_wifi: true,
        is_corner_booth: false,
        assigned_to: '',
        notes: 'Prime location near entrance'
      }
      setFormData(mockBooth)
    } catch (error) {
      showAlert('Error fetching booth details', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 3000)
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
      return
    }

    setIsSubmitting(true)
    try {
      // Convert numeric fields
      const dataToSave = {
        ...formData,
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        price: formData.price ? parseFloat(formData.price) : null,
        floor: parseInt(formData.floor),
      }
      
      // TODO: Replace with actual API call
      console.log('Saving booth:', dataToSave)
      
      showAlert(
        isEdit ? 'Booth updated successfully' : 'Booth created successfully', 
        'success'
      )
      
      // Navigate back to list after short delay
      setTimeout(() => {
        navigate('/booths')
      }, 1500)
      
    } catch (error) {
      showAlert('Error saving booth', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateArea = () => {
    const length = parseFloat(formData.length)
    const width = parseFloat(formData.width)
    if (length && width) {
      return (length * width).toFixed(1)
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
                <strong>{isEdit ? 'Edit Booth' : 'Create New Booth'}</strong>
                <CButton 
                  color="secondary" 
                  variant="outline"
                  onClick={() => navigate('/booths')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to List
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
                    />
                    <CFormFeedback invalid>{errors.booth_number}</CFormFeedback>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="floor">Floor</CFormLabel>
                    <CFormSelect
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                    >
                      <option value={1}>Floor 1 - Ground Level</option>
                      <option value={2}>Floor 2 - Mezzanine</option>
                      <option value={3}>Floor 3 - Upper Level</option>
                      <option value={4}>Floor 4 - Premium Level</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={3}>
                    <CFormLabel htmlFor="length">Length *</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="length"
                        name="length"
                        type="number"
                        step="0.1"
                        value={formData.length}
                        onChange={handleInputChange}
                        invalid={!!errors.length}
                        placeholder="10"
                      />
                      <CInputGroupText>{formData.size_unit}</CInputGroupText>
                    </CInputGroup>
                    <CFormFeedback invalid>{errors.length}</CFormFeedback>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="width">Width *</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="width"
                        name="width"
                        type="number"
                        step="0.1"
                        value={formData.width}
                        onChange={handleInputChange}
                        invalid={!!errors.width}
                        placeholder="8"
                      />
                      <CInputGroupText>{formData.size_unit}</CInputGroupText>
                    </CInputGroup>
                    <CFormFeedback invalid>{errors.width}</CFormFeedback>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="size_unit">Unit</CFormLabel>
                    <CFormSelect
                      id="size_unit"
                      name="size_unit"
                      value={formData.size_unit}
                      onChange={handleInputChange}
                    >
                      <option value="ft">Feet (ft)</option>
                      <option value="m">Meters (m)</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Total Area</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        value={calculateArea()}
                        disabled
                        className="bg-light"
                      />
                      <CInputGroupText>{formData.size_unit}²</CInputGroupText>
                    </CInputGroup>
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
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="booked">Booked</option>
                      <option value="under_maintenance">Under Maintenance</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="price">Price (Optional)</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText>$</CInputGroupText>
                      <CFormInput
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        invalid={!!errors.price}
                        placeholder="1500.00"
                      />
                    </CInputGroup>
                    <CFormFeedback invalid>{errors.price}</CFormFeedback>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="assigned_to">Assigned To (Optional)</CFormLabel>
                    <CFormInput
                      id="assigned_to"
                      name="assigned_to"
                      value={formData.assigned_to}
                      onChange={handleInputChange}
                      placeholder="Exhibitor name or company"
                    />
                  </CCol>
                </CRow>

                {/* Features Section */}
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <h6 className="mb-3">Booth Features</h6>
                  </CCol>
                  <CCol md={4}>
                    <CFormSwitch
                      id="has_power"
                      name="has_power"
                      label={
                        <span>
                          <CIcon icon={cilLightbulb} className="me-2" />
                          Power Available
                        </span>
                      }
                      checked={formData.has_power}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormSwitch
                      id="has_wifi"
                      name="has_wifi"
                      label={
                        <span>
                          <CIcon icon={cilWifi} className="me-2" />
                          WiFi Available
                        </span>
                      }
                      checked={formData.has_wifi}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormSwitch
                      id="is_corner_booth"
                      name="is_corner_booth"
                      label={
                        <span>
                          <CIcon icon={cilLocationPin} className="me-2" />
                          Corner Booth
                        </span>
                      }
                      checked={formData.is_corner_booth}
                      onChange={handleInputChange}
                    />
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
                      placeholder="Optional additional information about this booth (location benefits, restrictions, etc.)"
                    />
                  </CCol>
                </CRow>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <CButton 
                    color="secondary" 
                    onClick={() => navigate('/booths')} 
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        {isEdit ? 'Update Booth' : 'Create Booth'}
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

export default BoothForm