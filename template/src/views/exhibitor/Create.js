import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilSave,
  cilArrowLeft,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilLocationPin,
  cilGrid
} from '@coreui/icons'
import { createExhibitor } from '../../services/exhibitors'
import { getExpos } from '../../services/expos'
import { getAvailableBoothsForExpo } from '../../services/booths'

const CreateExhibitor = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingBooths, setLoadingBooths] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expos, setExpos] = useState([])
  const [availableBooths, setAvailableBooths] = useState([])
  const [boothsByFloor, setBoothsByFloor] = useState({})
  const [selectedExpo, setSelectedExpo] = useState(null)

  const [formData, setFormData] = useState({
    expo_id: '',
    company_name: '',
    product_description: '',
    booth_selection: '',
    contact_info: {
      email: '',
      phone: ''
    }
  })

  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    fetchExpos()
  }, [])

  useEffect(() => {
    if (formData.expo_id) {
      fetchAvailableBooths(formData.expo_id)
    } else {
      setAvailableBooths([])
      setBoothsByFloor({})
      setSelectedExpo(null)
    }
  }, [formData.expo_id])

  const fetchExpos = async () => {
    try {
      const data = await getExpos()
      // Filter to show only upcoming and ongoing expos
      const availableExpos = data.filter(expo => 
        expo.status === 'upcoming' || expo.status === 'ongoing'
      )
      setExpos(availableExpos)
    } catch (err) {
      console.error('Error fetching expos:', err)
      setError('Failed to load expos')
    }
  }

  const fetchAvailableBooths = async (expoId) => {
    try {
      setLoadingBooths(true)
      const response = await getAvailableBoothsForExpo(expoId)
      
      setAvailableBooths(response.availableBooths)
      setSelectedExpo(response.expo)
      
      // Group booths by floor
      const grouped = response.availableBooths.reduce((acc, booth) => {
        if (!acc[booth.floor]) {
          acc[booth.floor] = []
        }
        acc[booth.floor].push(booth)
        return acc
      }, {})
      
      setBoothsByFloor(grouped)
    } catch (err) {
      console.error('Error fetching available booths:', err)
      setError('Failed to load available booths')
      setAvailableBooths([])
      setBoothsByFloor({})
    } finally {
      setLoadingBooths(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.expo_id) {
      errors.expo_id = 'Please select an expo'
    }

    if (!formData.company_name.trim()) {
      errors.company_name = 'Company name is required'
    }

    if (!formData.contact_info.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_info.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.contact_info.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'email' || name === 'phone') {
      setFormData(prev => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const submitData = {
        ...formData,
        company_name: formData.company_name.trim(),
        product_description: formData.product_description.trim(),
        booth_selection: formData.booth_selection || null
      }

      await createExhibitor(submitData)
      setSuccess('Exhibitor created successfully!')
      
      setTimeout(() => {
        navigate('/dashboard/exhibitor')
      }, 2000)

    } catch (err) {
      console.error('Error creating exhibitor:', err)
      setError(err.response?.data?.message || 'Failed to create exhibitor')
    } finally {
      setLoading(false)
    }
  }

  const getSelectedBooth = () => {
    return availableBooths.find(booth => booth._id === formData.booth_selection)
  }

  const formatPrice = (price) => {
    if (!price) return 'Free'
    const priceValue = typeof price === 'object' ? parseFloat(price.$numberDecimal) : parseFloat(price)
    return `$${priceValue.toFixed(2)}`
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  <CIcon icon={cilBuilding} className="me-2" />
                  Create New Exhibitor
                </h4>
                <small className="text-body-secondary">
                  Add a new exhibitor to the system
                </small>
              </div>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate('/dashboard/exhibitor')}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back to List
              </CButton>
            </div>
          </CCardHeader>

          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-4">
                {error}
              </CAlert>
            )}

            {success && (
              <CAlert color="success" className="mb-4">
                {success}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  {/* Expo Selection */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="expo_id">
                      Select Expo <span className="text-danger">*</span>
                    </CFormLabel>
                    <CFormSelect
                      id="expo_id"
                      name="expo_id"
                      value={formData.expo_id}
                      onChange={handleInputChange}
                      invalid={!!validationErrors.expo_id}
                    >
                      <option value="">Choose an expo...</option>
                      {expos.map((expo) => (
                        <option key={expo._id} value={expo._id}>
                          {expo.title} - {new Date(expo.date).toLocaleDateString()}
                        </option>
                      ))}
                    </CFormSelect>
                    {validationErrors.expo_id && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.expo_id}
                      </div>
                    )}
                  </div>

                  {/* Selected Expo Info - Updated with same styling as booth details */}
                  {selectedExpo && (
                    <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded">
                      <h6 className="text-primary">Selected Expo Details</h6>
                      <div className="small">
                        <div><strong>Event:</strong> {selectedExpo.title}</div>
                        <div><strong>Date:</strong> {new Date(selectedExpo.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</div>
                        <div><strong>Floors:</strong> {selectedExpo.floors}</div>
                        <div><strong>Available Booths:</strong>
                          <CBadge color="info" className="ms-1">{availableBooths.length} booths</CBadge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Company Name */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="company_name">
                      Company Name <span className="text-danger">*</span>
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      invalid={!!validationErrors.company_name}
                      placeholder="Enter company name"
                    />
                    {validationErrors.company_name && (
                      <div className="invalid-feedback">
                        {validationErrors.company_name}
                      </div>
                    )}
                  </div>

                  {/* Product Description */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="product_description">
                      Product/Service Description
                    </CFormLabel>
                    <CFormTextarea
                      id="product_description"
                      name="product_description"
                      rows={4}
                      value={formData.product_description}
                      onChange={handleInputChange}
                      placeholder="Describe your products or services..."
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  {/* Contact Information */}
                  <div className="mb-4">
                    <h5>Contact Information</h5>
                    
                    <div className="mb-3">
                      <CFormLabel htmlFor="email">
                        Email Address <span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          id="email"
                          name="email"
                          value={formData.contact_info.email}
                          onChange={handleInputChange}
                          invalid={!!validationErrors.email}
                          placeholder="company@example.com"
                        />
                      </CInputGroup>
                      {validationErrors.email && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.email}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="phone">
                        Phone Number <span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.contact_info.phone}
                          onChange={handleInputChange}
                          invalid={!!validationErrors.phone}
                          placeholder="+1 (555) 123-4567"
                        />
                      </CInputGroup>
                      {validationErrors.phone && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booth Selection */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="booth_selection">
                      Booth Selection (Optional)
                      {loadingBooths && <CSpinner size="sm" className="ms-2" />}
                    </CFormLabel>
                    <CFormSelect
                      id="booth_selection"
                      name="booth_selection"
                      value={formData.booth_selection}
                      onChange={handleInputChange}
                      disabled={!formData.expo_id || loadingBooths}
                    >
                      <option value="">
                        {!formData.expo_id 
                          ? 'Select an expo first' 
                          : availableBooths.length === 0 
                            ? 'No booths available' 
                            : 'No booth selected'
                        }
                      </option>
                      {Object.keys(boothsByFloor).map(floor => (
                        <optgroup key={floor} label={`Floor ${floor}`}>
                          {boothsByFloor[floor].map((booth) => (
                            <option key={booth._id} value={booth._id}>
                              Booth {booth.booth_number} - {booth.length}x{booth.width} {booth.size_unit}
                              {booth.has_power && ' • Power'} 
                              {booth.has_wifi && ' • WiFi'} 
                              {booth.is_corner_booth && ' • Corner'} 
                              - {formatPrice(booth.price)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </CFormSelect>
                    <small className="text-body-secondary">
                      Booth can be assigned later by admin
                    </small>
                  </div>

                  {/* Selected Booth Details */}
                  {getSelectedBooth() && (
                    <div className="mb-3 p-3 bg-success bg-opacity-10 rounded">
                      <h6 className="text-success">Selected Booth Details</h6>
                      <div className="small">
                        <div><strong>Booth:</strong> {getSelectedBooth().booth_number}</div>
                        <div><strong>Floor:</strong> {getSelectedBooth().floor}</div>
                        <div><strong>Size:</strong> {getSelectedBooth().length}x{getSelectedBooth().width} {getSelectedBooth().size_unit}</div>
                        <div><strong>Price:</strong> {formatPrice(getSelectedBooth().price)}</div>
                        <div><strong>Features:</strong>
                          {getSelectedBooth().has_power && <CBadge color="info" className="ms-1">Power</CBadge>}
                          {getSelectedBooth().has_wifi && <CBadge color="info" className="ms-1">WiFi</CBadge>}
                          {getSelectedBooth().is_corner_booth && <CBadge color="warning" className="ms-1">Corner</CBadge>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Note */}
                  <div className="mb-3 p-3 bg-info bg-opacity-10 rounded">
                    <h6 className="text-info">Application Status</h6>
                    <p className="mb-0 small">
                      New exhibitor applications start with "Pending" status and require admin approval.
                    </p>
                  </div>
                </CCol>
              </CRow>

              {/* Submit Buttons */}
              <hr />
              <div className="d-flex justify-content-end gap-3">
                <CButton
                  type="button"
                  color="secondary"
                  onClick={() => navigate('/dashboard/exhibitor')}
                >
                  Cancel
                </CButton>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Create Exhibitor
                    </>
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateExhibitor