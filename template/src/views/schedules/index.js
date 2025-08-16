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
  CButtonGroup,
  CSpinner,
  CAlert,
  CBadge,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilSearch, cilClock, cilCalendar } from '@coreui/icons'
import { getSchedules, deleteSchedule } from '../../services/schedules'

const SchedulesList = () => {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])
  const [filteredSchedules, setFilteredSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterExpo, setFilterExpo] = useState('all')

  useEffect(() => {
    fetchSchedules()
  }, [])

  useEffect(() => {
    filterSchedules()
  }, [schedules, searchTerm, filterExpo])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const data = await getSchedules()
      setSchedules(data)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      showAlert('Error loading schedules. Please try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterSchedules = () => {
    let filtered = schedules.filter(schedule => {
      const matchesSearch = schedule.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           schedule.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           schedule.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesExpo = filterExpo === 'all' || 
                         (schedule.expo_id && schedule.expo_id._id === filterExpo)
      return matchesSearch && matchesExpo
    })
    setFilteredSchedules(filtered)
  }

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleCreate = () => {
    navigate('/dashboard/schedules/create')
  }

  const handleEdit = (schedule) => {
    navigate(`/dashboard/schedules/edit/${schedule._id}`)
  }

  const handleDelete = async (schedule) => {
    if (window.confirm(`Are you sure you want to delete "${schedule.session_name}"?`)) {
      try {
        await deleteSchedule(schedule._id)
        showAlert('Schedule deleted successfully!', 'success')
        fetchSchedules()
      } catch (error) {
        console.error('Error deleting schedule:', error)
        showAlert('Error deleting schedule. Please try again.', 'danger')
      }
    }
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const formatTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${startTime} - ${endTime}`
  }

  const getUniqueExpos = () => {
    const expos = schedules
      .filter(schedule => schedule.expo_id)
      .map(schedule => schedule.expo_id)
      .filter((expo, index, self) => 
        index === self.findIndex(e => e._id === expo._id)
      )
    return expos
  }

  const getTodaySchedulesCount = () => {
    const today = new Date().toDateString()
    return schedules.filter(schedule => 
      new Date(schedule.time_slot.start).toDateString() === today
    ).length
  }

  const getUpcomingSchedulesCount = () => {
    const now = new Date()
    return schedules.filter(schedule => 
      new Date(schedule.time_slot.start) > now
    ).length
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <CSpinner color="primary" />
        <p className="mt-2">Loading schedules...</p>
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
          <CCard className="text-white bg-primary">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{schedules.length}</div>
                <div>Total Schedules</div>
              </div>
              <CIcon icon={cilCalendar} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-success">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getTodaySchedulesCount()}</div>
                <div>Today's Sessions</div>
              </div>
              <CIcon icon={cilClock} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-warning">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getUpcomingSchedulesCount()}</div>
                <div>Upcoming</div>
              </div>
              <CIcon icon={cilClock} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="text-white bg-info">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{getUniqueExpos().length}</div>
                <div>Active Expos</div>
              </div>
              <CIcon icon={cilCalendar} height={24} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Main Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Schedules Management</strong>
              <CButton color="primary" onClick={handleCreate}>
                <CIcon icon={cilPlus} className="me-2" />
                Add New Schedule
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
                      placeholder="Search by session, speaker, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    value={filterExpo}
                    onChange={(e) => setFilterExpo(e.target.value)}
                  >
                    <option value="all">All Expos</option>
                    {getUniqueExpos().map((expo) => (
                      <option key={expo._id} value={expo._id}>
                        {expo.title}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Table */}
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Session Name</CTableHeaderCell>
                    <CTableHeaderCell>Expo</CTableHeaderCell>
                    <CTableHeaderCell>Time Slot</CTableHeaderCell>
                    <CTableHeaderCell>Speaker</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredSchedules.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No schedules found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredSchedules.map((schedule) => (
                      <CTableRow key={schedule._id}>
                        <CTableDataCell>
                          <strong>{schedule.session_name}</strong>
                          {schedule.description && (
                            <div className="text-muted small">
                              {schedule.description.substring(0, 50)}
                              {schedule.description.length > 50 && '...'}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {schedule.expo_id ? (
                            <div>
                              <div className="fw-semibold">{schedule.expo_id.title}</div>
                              <div className="text-muted small">{schedule.expo_id.location}</div>
                            </div>
                          ) : (
                            <CBadge color="warning">No Expo</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold">
                            {formatTimeRange(schedule.time_slot.start, schedule.time_slot.end)}
                          </div>
                          <div className="text-muted small">
                            {new Date(schedule.time_slot.start).toLocaleDateString()}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{schedule.speaker}</CTableDataCell>
                        <CTableDataCell>{schedule.location}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            <CButton
                              color="primary"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(schedule)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(schedule)}
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

export default SchedulesList