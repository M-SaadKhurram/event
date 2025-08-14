import React, { useState, useEffect } from 'react'
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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
  CSpinner,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPencil, 
  cilTrash, 
  cilPlus, 
  cilSearch,
  cilGrid,
  cilLightbulb, // Use cilLightbulb instead of cilPower
  cilWifi,
  cilLocationPin
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const BoothsList = () => {
  const navigate = useNavigate()
  const [booths, setBooths] = useState([])
  const [filteredBooths, setFilteredBooths] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBooth, setEditingBooth] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [boothToDelete, setBoothToDelete] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'active',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchBooths()
  }, [])

  useEffect(() => {
    filterBooths()
  }, [booths, searchTerm, filterStatus])

  const fetchBooths = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockData = [
        {
          id: 1,
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
          assigned_to: null,
          notes: 'Prime location near entrance'
        },
        {
          id: 2,
          booth_number: 'B205',
          floor: 2,
          length: 12,
          width: 10,
          size_unit: 'ft',
          status: 'booked',
          price: 2000.00,
          has_power: true,
          has_wifi: true,
          is_corner_booth: true,
          assigned_to: 'Tech Corp',
          notes: 'Corner booth with extra visibility'
        },
        {
          id: 3,
          booth_number: 'C310',
          floor: 3,
          length: 8,
          width: 6,
          size_unit: 'ft',
          status: 'reserved',
          price: 1200.00,
          has_power: false,
          has_wifi: true,
          is_corner_booth: false,
          assigned_to: 'StartupXYZ',
          notes: 'Budget-friendly option'
        },
        {
          id: 4,
          booth_number: 'D415',
          floor: 4,
          length: 15,
          width: 12,
          size_unit: 'ft',
          status: 'under_maintenance',
          price: 2500.00,
          has_power: true,
          has_wifi: true,
          is_corner_booth: true,
          assigned_to: null,
          notes: 'Electrical maintenance required'
        }
      ]
      setBooths(mockData)
    } catch (error) {
      showAlert('Error fetching booths', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterBooths = () => {
    let filtered = booths

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booth => 
        booth.booth_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booth.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booth.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booth => booth.status === filterStatus)
    }

    setFilteredBooths(filtered)
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 3000)
  }

  const handleCreate = () => {
    window.location.href = '#/booths/create'
  }

  const handleEdit = (booth) => {
    window.location.href = `#/booths/edit/${booth.id}`
  }

  const handleDelete = (booth) => {
    setBoothToDelete(booth)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      // TODO: Replace with actual API call
      setBooths(booths.filter(b => b.id !== boothToDelete.id))
      showAlert('Booth deleted successfully', 'success')
    } catch (error) {
      showAlert('Error deleting booth', 'danger')
    } finally {
      setDeleteModal(false)
      setBoothToDelete(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      available: 'success',
      reserved: 'warning',
      booked: 'info',
      under_maintenance: 'danger'
    }
    return <CBadge color={statusColors[status]}>{status.replace('_', ' ')}</CBadge>
  }

  const getStatusCount = (status) => {
    return booths.filter(booth => booth.status === status).length
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Replace with your API call
      // const response = await fetch('/api/booths', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      // if (response.ok) {
      //   navigate('/booths')
      // }
      
      console.log('Form submitted:', formData)
      setLoading(false)
    } catch (error) {
      console.error('Error creating booth:', error)
      setLoading(false)
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

      {/* Statistics Cards */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-success">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('available')}</div>
                <div>Available Booths</div>
              </div>
              <CIcon icon={cilGrid} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-info">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('booked')}</div>
                <div>Booked Booths</div>
              </div>
              <CIcon icon={cilLocationPin} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-warning">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('reserved')}</div>
                <div>Reserved Booths</div>
              </div>
              <CIcon icon={cilLightbulb} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-danger">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('under_maintenance')}</div>
                <div>Under Maintenance</div>
              </div>
              <CIcon icon={cilWifi} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <strong>Booths Management</strong>
                <CButton color="primary" onClick={handleCreate}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Add New Booth
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Filters */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Search booths..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="booked">Booked</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Table */}
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Booth #</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Floor</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Size</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Assigned To</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Features</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center py-4">
                        <CSpinner color="primary" />
                        <div className="mt-2">Loading booths...</div>
                      </CTableDataCell>
                    </CTableRow>
                  ) : filteredBooths.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center py-4">
                        {searchTerm || filterStatus !== 'all' ? 'No booths match your filters' : 'No booths found'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredBooths.map((booth) => (
                      <CTableRow key={booth.id}>
                        <CTableDataCell>
                          <strong>{booth.booth_number}</strong>
                        </CTableDataCell>
                        <CTableDataCell>Floor {booth.floor}</CTableDataCell>
                        <CTableDataCell>
                          {booth.length} × {booth.width} {booth.size_unit}
                          {booth.is_corner_booth && (
                            <CBadge color="secondary" className="ms-2">Corner</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{getStatusBadge(booth.status)}</CTableDataCell>
                        <CTableDataCell>
                          ${booth.price?.toFixed(2) || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {booth.assigned_to || <span className="text-muted">Unassigned</span>}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            {booth.has_power && (
                              <CBadge color="info" title="Power Available">
                                <CIcon icon={cilLightbulb} size="sm" />
                              </CBadge>
                            )}
                            {booth.has_wifi && (
                              <CBadge color="info" title="WiFi Available">
                                <CIcon icon={cilWifi} size="sm" />
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(booth)}
                              title="Edit booth"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(booth)}
                              title="Delete booth"
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete booth <strong>{boothToDelete?.booth_number}</strong>?
          {boothToDelete?.assigned_to && (
            <div className="mt-2">
              <CBadge color="warning">
                Warning: This booth is currently assigned to {boothToDelete.assigned_to}
              </CBadge>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Delete Booth
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Create Booth Form (Hidden) */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4" style={{ display: 'none' }}>
            <CCardHeader>
              <strong>Create New Booth</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleFormSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="name">Booth Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="location">Location</CFormLabel>
                    <CFormInput
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                    />
                  </CCol>
                </CRow>
                
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="status">Status</CFormLabel>
                    <CFormSelect
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <CFormLabel htmlFor="description">Description</CFormLabel>
                    <CFormTextarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleFormChange}
                    />
                  </CCol>
                </CRow>
                
                <CRow>
                  <CCol xs={12}>
                    <CButton 
                      type="submit" 
                      color="primary" 
                      disabled={loading}
                      className="me-2"
                    >
                      {loading ? 'Creating...' : 'Create Booth'}
                    </CButton>
                    <CButton 
                      type="button" 
                      color="secondary"
                      onClick={() => navigate('/booths')}
                    >
                      Cancel
                    </CButton>
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

export default BoothsList