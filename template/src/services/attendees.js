import api from '../utils/api'

export const registerAttendee = async (data) => {
  try {
    console.log('Registering attendee with data:', data)
    const response = await api.post('/attendees/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return response.data
  } catch (error) {
    console.error('Error registering attendee:', error)
    throw error
  }
}

export const getAttendeesByExpo = async (expoId) => {
  try {
    const response = await api.get(`/attendees/expo/${expoId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching attendees:', error)
    throw error
  }
}

export const getAttendeeById = async (id) => {
  try {
    const response = await api.get(`/attendees/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching attendee:', error)
    throw error
  }
}

export const getAttendeeByBadgeId = async (badgeId) => {
  try {
    const response = await api.get(`/attendees/badge/${badgeId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching attendee by badge ID:', error)
    throw error
  }
}

export const updateAttendeeStatus = async (id, status) => {
  try {
    const response = await api.put(`/attendees/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error('Error updating attendee status:', error)
    throw error
  }
}