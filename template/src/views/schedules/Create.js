import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { createSchedule } from '../../services/schedules'
import { getExpos } from '../../services/expos'

const CreateSchedule = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
    fetchExpos()
  }, [])

  const fetchExpos = async () => {
    try {
      const data = await getExpos()
      setExpos(data)
    } catch (err) {
      setError('Failed to fetch expos')
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

      await createSchedule(scheduleData)
      navigate('/dashboard/schedules')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0].substring(0, 5)
    return { date, time }
  }

  const { date: currentDate, time: currentTime } = getCurrentDateTime()

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Create New Schedule</strong>
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
                    min={currentDate}
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
                    min={formData.start_date || currentDate}
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
                  onClick={() => navigate('/dashboard/schedules')}
                  disabled={loading}
                >
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Create Schedule'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateSchedule