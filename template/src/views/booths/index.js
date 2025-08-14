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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPencil, 
  cilTrash, 
  cilPlus, 
  cilSearch,
  cilGrid,
  cilLightbulb,
  cilLocationPin,
  cilWifiSignal4,
} from '@coreui/icons'
import { getBooths, deleteBooth } from '../../services/booths'

const BoothsList = () => {
  const navigate = useNavigate()
  const [booths, setBooths] = useState([])
  const [filteredBooths, setFilteredBooths] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchBooths()
  }, [])

  useEffect(() => {
    filterBooths()
  }, [booths, searchTerm, filterStatus])

  const fetchBooths = async () => {
    try {
      setLoading(true)
      const data = await getBooths()
      setBooths(data)
    } catch (error) {
      console.error('Error fetching booths:', error)
      showAlert('Error loading booths. Please try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterBooths = () => {
    let filtered = booths.filter(booth => {
      const matchesSearch = booth.booth_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (booth.assigned_to?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || booth.status === filterStatus
      return matchesSearch && matchesStatus
    })
    setFilteredBooths(filtered)
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleCreate = () => {
    navigate('/dashboard/booths/create')
  }

  const handleEdit = (booth) => {
    navigate(`/dashboard/booths/edit/${booth._id}`)
  }

  const handleDelete = async (booth) => {
    if (window.confirm(`Are you sure you want to delete booth ${booth.booth_number}?`)) {
      try {
        await deleteBooth(booth._id)
        showAlert('Booth deleted successfully!', 'success')
        fetchBooths() // Refresh the list
      } catch (error) {
        console.error('Error deleting booth:', error)
        showAlert('Error deleting booth. Please try again.', 'danger')
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'available': { color: 'success', text: 'Available' },
      'reserved': { color: 'warning', text: 'Reserved' },
      'booked': { color: 'primary', text: 'Booked' },
      'under_maintenance': { color: 'danger', text: 'Maintenance' }
    }
    const config = statusConfig[status] || { color: 'secondary', text: status }
    return <CBadge color={config.color}>{config.text}</CBadge>
  }

  const getStatusCount = (status) => {
    return booths.filter(booth => booth.status === status).length
  }

  const formatPrice = (price) => {
    if (!price) return '$0.00'
    // Handle Mongoose Decimal128
    const numPrice = typeof price === 'object' && price.$numberDecimal 
      ? parseFloat(price.$numberDecimal) 
      : parseFloat(price)
    return `$${numPrice.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <CSpinner color="primary" />
        <p className="mt-2">Loading booths...</p>
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

      {/* Statistics Cards */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-success">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('available')}</div>
                <div>Available</div>
              </div>
              <CIcon icon={cilGrid} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-warning">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('reserved')}</div>
                <div>Reserved</div>
              </div>
              <CIcon icon={cilGrid} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-primary">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getStatusCount('booked')}</div>
                <div>Booked</div>
              </div>
              <CIcon icon={cilGrid} height={24} />
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
              <CIcon icon={cilLightbulb} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Main Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Booths Management</strong>
              <CButton color="primary" onClick={handleCreate}>
                <CIcon icon={cilPlus} className="me-2" />
                Add New Booth
              </CButton>
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
                      placeholder="Search by booth number or assignee..."
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
                    <CTableHeaderCell>Booth #</CTableHeaderCell>
                    <CTableHeaderCell>Floor</CTableHeaderCell>
                    <CTableHeaderCell>Size</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Features</CTableHeaderCell>
                    <CTableHeaderCell>Assigned To</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredBooths.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No booths found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredBooths.map((booth) => (
                      <CTableRow key={booth._id}>
                        <CTableDataCell>
                          <strong>{booth.booth_number}</strong>
                        </CTableDataCell>
                        <CTableDataCell>Floor {booth.floor}</CTableDataCell>
                        <CTableDataCell>
                          {booth.length} × {booth.width} {booth.size_unit}
                          <br />
                          <small className="text-muted">
                            ({(booth.length * booth.width).toFixed(1)} {booth.size_unit}²)
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>{formatPrice(booth.price)}</CTableDataCell>
                        <CTableDataCell>{getStatusBadge(booth.status)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            {booth.has_power && (
                              <CBadge color="warning" title="Power Available">
                                <CIcon icon={cilLightbulb} size="sm" />
                              </CBadge>
                            )}
                            {booth.has_wifi && (
                              <CBadge color="info" title="WiFi Available">
                                <CIcon icon={cilWifiSignal4} size="sm" />
                              </CBadge>
                            )}
                            {booth.is_corner_booth && (
                              <CBadge color="success" title="Corner Booth">
                                <CIcon icon={cilLocationPin} size="sm" />
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {booth.assigned_to?.name || '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            <CButton
                              color="primary"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(booth)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(booth)}
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default BoothsList
export { default as BoothForm } from './Edit'