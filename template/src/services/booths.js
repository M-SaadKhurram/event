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

// Get available booths for specific expo
export const getAvailableBoothsForExpo = async (expoId, floor = null) => {
  try {
    const params = {}
    if (floor) params.floor = floor
    
    const response = await api.get(`/booths/expo/${expoId}/available`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching available booths for expo:', error)
    throw error
  }
}

// Get booths by expo and floor
export const getBoothsByExpoAndFloor = async (expoId, floor) => {
  try {
    const response = await api.get(`/booths/expo/${expoId}/floor/${floor}`)
    return response.data
  } catch (error) {
    console.error('Error fetching booths by expo and floor:', error)
    throw error
  }
}

// Get booths by expo
export const getBoothsByExpo = async (expoId) => {
  try {
    const response = await api.get('/booths', { params: { expo_id: expoId } })
    return response.data
  } catch (error) {
    console.error('Error fetching booths for expo:', error)
    throw error
  }
}
