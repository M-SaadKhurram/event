import api from '../utils/api'

export const getExhibitors = async (params = {}) => {
  try {
    const response = await api.get('/exhibitors', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching exhibitors:', error)
    throw error
  }
}

export const getExhibitor = async (id) => {
  try {
    const response = await api.get(`/exhibitors/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching exhibitor:', error)
    throw error
  }
}

export const createExhibitor = async (data) => {
  try {
    console.log('Creating exhibitor with data:', data)
    const response = await api.post('/exhibitors', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating exhibitor:', error)
    throw error
  }
}

export const updateExhibitor = async (id, data) => {
  try {
    const response = await api.put(`/exhibitors/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating exhibitor:', error)
    throw error
  }
}

export const deleteExhibitor = async (id) => {
  try {
    const response = await api.delete(`/exhibitors/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting exhibitor:', error)
    throw error
  }
}

export const approveExhibitor = async (id) => {
  try {
    const response = await api.put(`/exhibitors/${id}/approve`)
    return response.data
  } catch (error) {
    console.error('Error approving exhibitor:', error)
    throw error
  }
}