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
  cilPeople,
  cilLocationPin,
  cilCalendar,
} from '@coreui/icons'
import { getAttendeesByExpo } from '../../../services/attendees'
import { getExpos } from '../../../services/expos'

const AttendeesList = () => {
  const navigate = useNavigate()
  const [attendees, setAttendees] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterExpo, setFilterExpo] = useState('all')
  const [filteredAttendees, setFilteredAttendees] = useState([])

  useEffect(() => {
    fetchExpos()
  }, [])

  useEffect(() => {
    if (filterExpo !== 'all') {
      fetchAttendees(filterExpo)
    } else {
      setAttendees([])
      setFilteredAttendees([])
    }
  }, [filterExpo])

  useEffect(() => {
    filterAttendees()
  }, [attendees, searchTerm])

  const fetchExpos = async () => {
    try {
      const data = await getExpos()
      setExpos(data)
    } catch (error) {
      console.error('Error fetching expos:', error)
      showAlert('Error loading expos. Please try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendees = async (expoId) => {
    try {
      setLoading(true)
      const response = await getAttendeesByExpo(expoId)
      setAttendees(response.data || [])
    } catch (error) {
      console.error('Error fetching attendees:', error)
      showAlert('Error loading attendees. Please try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterAttendees = () => {
    let filtered = attendees.filter(attendee => {
      const matchesSearch = attendee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (attendee.organization && attendee.organization.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesSearch
    })
    setFilteredAttendees(filtered)
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleRegister = () => {
    navigate('/dashboard/attendees/register')
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'registered': { color: 'info', text: 'Registered' },
      'checked_in': { color: 'success', text: 'Checked In' },
      'cancelled': { color: 'danger', text: 'Cancelled' }
    }
    const config = statusConfig[status] || { color: 'secondary', text: status }
    return <CBadge color={config.color}>{config.text}</CBadge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && filterExpo === 'all') {
    return (
      <div className="text-center p-4">
        <CSpinner color="primary" />
        <p className="mt-2">Loading expos...</p>
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

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Attendees Management</strong>
             
            </CCardHeader>
            <CCardBody>
              {/* Filters */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    value={filterExpo}
                    onChange={(e) => setFilterExpo(e.target.value)}
                  >
                    <option value="all">Select an Expo</option>
                    {expos.map((expo) => (
                      <option key={expo._id} value={expo._id}>
                        {expo.title} - {formatDate(expo.date)}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Search by name, email, or organization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={filterExpo === 'all'}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              {filterExpo === 'all' ? (
                <div className="text-center py-5">
                  <CIcon icon={cilPeople} size="3xl" className="text-muted mb-3" />
                  <h5 className="text-muted">Select an Expo</h5>
                  <p className="text-muted">Choose an expo from the dropdown to view attendees</p>
                </div>
              ) : loading ? (
                <div className="text-center p-4">
                  <CSpinner color="primary" />
                  <p className="mt-2">Loading attendees...</p>
                </div>
              ) : filteredAttendees.length === 0 ? (
                <div className="text-center py-5">
                  <CIcon icon={cilPeople} size="3xl" className="text-muted mb-3" />
                  <h5 className="text-muted">No Attendees Found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'No attendees match your search criteria' : 'No attendees registered for this expo yet'}
                  </p>
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Badge ID</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Organization</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Registration Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredAttendees.map((attendee) => (
                      <CTableRow key={attendee._id}>
                        <CTableDataCell>
                          <strong>{attendee.badge_id}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{attendee.full_name}</CTableDataCell>
                        <CTableDataCell>{attendee.email}</CTableDataCell>
                        <CTableDataCell>{attendee.organization || '-'}</CTableDataCell>
                        <CTableDataCell>{attendee.phone || '-'}</CTableDataCell>
                        <CTableDataCell>{getStatusBadge(attendee.status)}</CTableDataCell>
                        <CTableDataCell>{formatDate(attendee.registration_date)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AttendeesList