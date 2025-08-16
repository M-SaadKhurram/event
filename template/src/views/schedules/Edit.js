import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { getSchedule, updateSchedule } from '../../services/schedules'
import { getExpos } from '../../services/expos'
const EditSchedule = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [expos, setExpos] = useState([])
  const [formData, setFormData] = useState({
    expo_id: '',
    session_name: '',
    start_time: '',
    start_date: '',
    end_time: '',
    end_date: '',
    speaker: '',
    location: '',
    description: '',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setFetchLoading(true)
      const [scheduleData, exposData] = await Promise.all([
        getSchedule(id),
        getExpos()
      ])
      
      setExpos(exposData)
      
      // Format the schedule data for the form
      const startDate = new Date(scheduleData.time_slot.start)
      const endDate = new Date(scheduleData.time_slot.end)
      
      setFormData({
        expo_id: scheduleData.expo_id?._id || '',
        session_name: scheduleData.session_name,
        start_date: startDate.toISOString().split('T')[0],
        start_time: startDate.toTimeString().split(' ')[0].substring(0, 5),
        end_date: endDate.toISOString().split('T')[0],
        end_time: endDate.toTimeString().split(' ')[0].substring(0, 5),
        speaker: scheduleData.speaker,
        location: scheduleData.location,
        description: scheduleData.description || '',
      })
    } catch (err) {
      setError('Failed to fetch schedule data')
      console.error('Error fetching schedule:', err)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Combine date and time for start and end
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)

      const scheduleData = {
        expo_id: formData.expo_id,
        session_name: formData.session_name,
        time_slot: {
          start: startDateTime,
          end: endDateTime,
        },
        speaker: formData.speaker,
        location: formData.location,
        description: formData.description,
      }

      await updateSchedule(id, scheduleData)
      navigate('/dashboard/schedules')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update schedule')
      console.error('Error updating schedule:', err)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Edit Schedule</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                {error}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="expo_id">Expo *</CFormLabel>
                  <CFormSelect
                    id="expo_id"
                    name="expo_id"
                    value={formData.expo_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select an expo...</option>
                    {expos.map((expo) => (
                      <option key={expo._id} value={expo._id}>
                        {expo.title} - {expo.location}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="session_name">Session Name *</CFormLabel>
                  <CFormInput
                    type="text"
                    id="session_name"
                    name="session_name"
                    value={formData.session_name}
                    onChange={handleChange}
                    placeholder="Enter session name"
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="start_date">Start Date *</CFormLabel>
                  <CFormInput
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="start_time">Start Time *</CFormLabel>
                  <CFormInput
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="end_date">End Date *</CFormLabel>
                  <CFormInput
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="end_time">End Time *</CFormLabel>
                  <CFormInput
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="speaker">Speaker *</CFormLabel>
                  <CFormInput
                    type="text"
                    id="speaker"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                    placeholder="Enter speaker name"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="location">Location *</CFormLabel>
                  <CFormInput
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor="description">Description</CFormLabel>
                  <CFormTextarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter session description (optional)"
                  />
                </CCol>
              </CRow>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate('/schedules')}
                  disabled={loading}
                >
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Update Schedule'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditSchedule