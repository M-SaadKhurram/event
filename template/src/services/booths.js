import api from '../utils/api'

export const getBooths = async (params = {}) => {
  try {
    const response = await api.get('/booths', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching booths:', error)
    throw error
  }
}

export const getBooth = async (id) => {
  try {
    const response = await api.get(`/booths/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching booth:', error)
    throw error
  }
}

export const createBooth = async (data) => {
  try {
    const response = await api.post('/booths', data)
    return response.data
  } catch (error) {
    console.error('Error creating booth:', error)
    throw error
  }
}

export const updateBooth = async (id, data) => {
  try {
    const response = await api.put(`/booths/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating booth:', error)
    throw error
  }
}

export const deleteBooth = async (id) => {
  try {
    const response = await api.delete(`/booths/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting booth:', error)
    throw error
  }
}
