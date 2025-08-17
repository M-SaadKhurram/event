import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  cilLocationPin
} from '@coreui/icons'
import { getExhibitor, updateExhibitor } from '../../services/exhibitors'
import { getExpos } from '../../services/expos'

const EditExhibitor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expos, setExpos] = useState([])
  const [exhibitor, setExhibitor] = useState(null)

  const [formData, setFormData] = useState({
    expo_id: '',
    company_name: '',
    product_description: '',
    booth_selection: '',
    status: 'pending',
    contact_info: {
      email: '',
      phone: ''
    }
  })

  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (id) {
      fetchExhibitor()
      fetchExpos()
    }
  }, [id])

  const fetchExhibitor = async () => {
    try {
      setLoading(true)
      const data = await getExhibitor(id)
      setExhibitor(data)
      setFormData({
        expo_id: data.expo_id?._id || '',
        company_name: data.company_name || '',
        product_description: data.product_description || '',
        booth_selection: data.booth_selection?._id || '',
        status: data.status || 'pending',
        contact_info: {
          email: data.contact_info?.email || '',
          phone: data.contact_info?.phone || ''
        }
      })
    } catch (err) {
      setError('Failed to fetch exhibitor details')
      console.error('Error fetching exhibitor:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpos = async () => {
    try {
      const data = await getExpos()
      setExpos(data)
    } catch (err) {
      console.error('Error fetching expos:', err)
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
      setSubmitting(true)
      setError('')

      const submitData = {
        ...formData,
        company_name: formData.company_name.trim(),
        product_description: formData.product_description.trim(),
        booth_selection: formData.booth_selection || null
      }

      await updateExhibitor(id, submitData)
      setSuccess('Exhibitor updated successfully!')
      
      setTimeout(() => {
        navigate('/dashboard/exhibitor')
      }, 2000)

    } catch (err) {
      console.error('Error updating exhibitor:', err)
      setError(err.response?.data?.message || 'Failed to update exhibitor')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getSelectedExpo = () => {
    return expos.find(expo => expo._id === formData.expo_id)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (!exhibitor) {
    return (
      <CAlert color="danger">
        Exhibitor not found
      </CAlert>
    )
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
                  Edit Exhibitor
                </h4>
                <small className="text-body-secondary">
                  Update exhibitor information
                </small>
              </div>
              <div className="d-flex gap-2">
                <CBadge color={getStatusColor(exhibitor.status)} size="lg">
                  {exhibitor.status}
                </CBadge>
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate('/dashboard/exhibitor')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to List
                </CButton>
              </div>
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

                  {/* Selected Expo Info */}
                  {getSelectedExpo() && (
                    <div className="mb-3 p-3 rounded" style={{ background: 'rgba(59,130,246,0.08)', borderLeft: '4px solid #3b82f6' }}>
                      <h6 className="mb-2" style={{ color: '#2563eb' }}>
                        <CIcon icon={cilCalendar} className="me-2" />
                        Selected Expo Details
                      </h6>
                      <div className="small">
                        <div>
                          <strong>Event:</strong> {getSelectedExpo().title}
                        </div>
                        <div>
                          <strong>Date:</strong> {new Date(getSelectedExpo().date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div>
                          <strong>Location:</strong> {getSelectedExpo().location}
                        </div>
                        {getSelectedExpo().theme && (
                          <div><strong>Theme:</strong> {getSelectedExpo().theme}</div>
                        )}
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

                  {/* Status */}
                  <div className="mb-3">
                    <CFormLabel htmlFor="status">
                      Application Status
                    </CFormLabel>
                    <CFormSelect
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </CFormSelect>
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

                  {/* Current Booth Info */}
                  {exhibitor.booth_selection && (
                    <div className="mb-3 p-3 bg-success bg-opacity-10 rounded">
                      <h6 className="text-success">Current Booth Assignment</h6>
                      <p className="mb-0">
                        <strong>Booth {exhibitor.booth_selection.booth_number}</strong> - Floor {exhibitor.booth_selection.floor}
                      </p>
                    </div>
                  )}

                  {/* Exhibitor Info */}
                  <div className="mb-3 p-3 rounded" style={{ background: 'rgba(16,185,129,0.08)', borderLeft: '4px solid #10b981' }}>
                    <h6 className="mb-2" style={{ color: '#059669' }}>
                      <CIcon icon={cilBuilding} className="me-2" />
                      Exhibitor Details
                    </h6>
                    <div className="small">
                      <div><strong>Created:</strong> {new Date(exhibitor.created_at).toLocaleDateString()}</div>
                      <div><strong>Last Updated:</strong> {new Date(exhibitor.updated_at).toLocaleDateString()}</div>
                      <div><strong>ID:</strong> {exhibitor._id}</div>
                    </div>
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
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Update Exhibitor
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

export default EditExhibitor