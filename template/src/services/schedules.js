import api from '../utils/api'

export const getSchedules = async (params = {}) => {
  try {
    const response = await api.get('/schedules', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching schedules:', error)
    throw error
  }
}

export const getSchedulesByExpo = async (expoId) => {
  try {
    const response = await api.get(`/schedules/expo/${expoId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching schedules by expo:', error)
    throw error
  }
}

export const getSchedule = async (id) => {
  try {
    const response = await api.get(`/schedules/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching schedule:', error)
    throw error
  }
}

export const createSchedule = async (data) => {
  try {
    const response = await api.post('/schedules', data)
    return response.data
  } catch (error) {
    console.error('Error creating schedule:', error)
    throw error
  }
}

export const updateSchedule = async (id, data) => {
  try {
    const response = await api.put(`/schedules/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating schedule:', error)
    throw error
  }
}

export const deleteSchedule = async (id) => {
  try {
    const response = await api.delete(`/schedules/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting schedule:', error)
    throw error
  }
}