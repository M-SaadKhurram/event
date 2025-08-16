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
  CSpinner,
  CAlert,
  CInputGroup,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilFilter,
  cilBuilding,
  cilLocationPin,
  cilCalendar,
  cilPhone,
  cilEnvelopeClosed
} from '@coreui/icons'
import { getExhibitors, deleteExhibitor } from '../../services/exhibitors'

const ExhibitorIndex = () => {
  const navigate = useNavigate()
  const [exhibitors, setExhibitors] = useState([])
  const [filteredExhibitors, setFilteredExhibitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState({ visible: false, exhibitor: null })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchExhibitors()
  }, [])

  useEffect(() => {
    filterExhibitors()
  }, [exhibitors, searchTerm, statusFilter])

  const fetchExhibitors = async () => {
    try {
      setLoading(true)
      const data = await getExhibitors()
      setExhibitors(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch exhibitors')
      console.error('Error fetching exhibitors:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterExhibitors = () => {
    let filtered = exhibitors

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exhibitor =>
        exhibitor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.expo_id?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exhibitor => exhibitor.status === statusFilter)
    }

    setFilteredExhibitors(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleDelete = async (exhibitorId) => {
    try {
      await deleteExhibitor(exhibitorId)
      setExhibitors(prev => prev.filter(exhibitor => exhibitor._id !== exhibitorId))
      setDeleteModal({ visible: false, exhibitor: null })
    } catch (err) {
      console.error('Error deleting exhibitor:', err)
      setError('Failed to delete exhibitor')
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Pagination
  const totalPages = Math.ceil(filteredExhibitors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentExhibitors = filteredExhibitors.slice(startIndex, endIndex)

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </CPaginationItem>
      )
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <CPagination>
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </CPaginationItem>
          {pages}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" />
      </div>
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
                  Exhibitors Management
                </h4>
                <small className="text-body-secondary">
                  Manage exhibitor applications and booth assignments
                </small>
              </div>
              <CButton
                color="primary"
                onClick={() => navigate('/exhibitor/create')}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add Exhibitor
              </CButton>
            </div>
          </CCardHeader>

          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-4">
                {error}
              </CAlert>
            )}

            {/* Filters */}
            <CRow className="mb-4">
              <CCol md={6}>
                <CInputGroup>
                  <CFormInput
                    placeholder="Search by company name, expo, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <CButton color="outline-secondary" variant="outline">
                    <CIcon icon={cilSearch} />
                  </CButton>
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CDropdown>
                  <CDropdownToggle color="outline-secondary">
                    <CIcon icon={cilFilter} className="me-2" />
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => setStatusFilter('all')}>
                      All Status
                    </CDropdownItem>
                    <CDropdownItem onClick={() => setStatusFilter('pending')}>
                      Pending
                    </CDropdownItem>
                    <CDropdownItem onClick={() => setStatusFilter('approved')}>
                      Approved
                    </CDropdownItem>
                    <CDropdownItem onClick={() => setStatusFilter('rejected')}>
                      Rejected
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
              <CCol md={3}>
                <div className="text-body-secondary">
                  Showing {currentExhibitors.length} of {filteredExhibitors.length} exhibitors
                </div>
              </CCol>
            </CRow>

            {/* Table */}
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Company</CTableHeaderCell>
                  <CTableHeaderCell>Expo</CTableHeaderCell>
                  <CTableHeaderCell>Contact</CTableHeaderCell>
                  <CTableHeaderCell>Booth</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentExhibitors.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center py-4">
                      <div className="text-body-secondary">
                        {filteredExhibitors.length === 0 && exhibitors.length > 0
                          ? 'No exhibitors match your search criteria'
                          : 'No exhibitors found'}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentExhibitors.map((exhibitor) => (
                    <CTableRow key={exhibitor._id}>
                      <CTableDataCell>
                        <div>
                          <div className="fw-semibold">{exhibitor.company_name}</div>
                          {exhibitor.product_description && (
                            <small className="text-body-secondary">
                              {exhibitor.product_description.length > 50
                                ? `${exhibitor.product_description.substring(0, 50)}...`
                                : exhibitor.product_description}
                            </small>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {exhibitor.expo_id ? (
                          <div>
                            <div className="fw-semibold">{exhibitor.expo_id.title}</div>
                            <small className="text-body-secondary">
                              <CIcon icon={cilCalendar} size="sm" className="me-1" />
                              {formatDate(exhibitor.expo_id.date)}
                            </small>
                            <br />
                            <small className="text-body-secondary">
                              <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                              {exhibitor.expo_id.location}
                            </small>
                          </div>
                        ) : (
                          <span className="text-body-secondary">No Expo</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          <small className="d-block">
                            <CIcon icon={cilEnvelopeClosed} size="sm" className="me-1" />
                            {exhibitor.contact_info?.email || 'N/A'}
                          </small>
                          <small className="d-block">
                            <CIcon icon={cilPhone} size="sm" className="me-1" />
                            {exhibitor.contact_info?.phone || 'N/A'}
                          </small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {exhibitor.booth_selection ? (
                          <div>
                            <div className="fw-semibold">
                              Booth {exhibitor.booth_selection.booth_number}
                            </div>
                            <small className="text-body-secondary">
                              Floor {exhibitor.booth_selection.floor}
                            </small>
                          </div>
                        ) : (
                          <span className="text-body-secondary">Not Assigned</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusColor(exhibitor.status)}>
                          {exhibitor.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(exhibitor.created_at)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton
                            color="info"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/exhibitor/edit/${exhibitor._id}`)}
                          >
                            <CIcon icon={cilPencil} size="sm" />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteModal({ visible: true, exhibitor })}
                          >
                            <CIcon icon={cilTrash} size="sm" />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            {renderPagination()}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, exhibitor: null })}
      >
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete <strong>{deleteModal.exhibitor?.company_name}</strong>?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setDeleteModal({ visible: false, exhibitor: null })}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={() => handleDelete(deleteModal.exhibitor._id)}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ExhibitorIndex