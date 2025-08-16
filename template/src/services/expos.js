import api from '../utils/api'

export const getExpos = async (params = {}) => {
  try {
    const response = await api.get('/expos', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching expos:', error)
    throw error
  }
}

export const getExpo = async (id) => {
  try {
    const response = await api.get(`/expos/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching expo:', error)
    throw error
  }
}

export const createExpo = async (data) => {
  try {
    console.log('Creating expo with data:', data)
    const response = await api.post('/expos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating expo:', error);
    throw error;
  }
}


export const updateExpo = async (id, data) => {
  try {
    const response = await api.put(`/expos/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating expo:', error)
    throw error
  }
}

export const deleteExpo = async (id) => {
  try {
    const response = await api.delete(`/expos/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting expo:', error)
    throw error
  }
}

// Add new function to get available floors for a date
export const getAvailableFloors = async (date) => {
  try {
    const response = await api.get('/expos/available-floors', { 
      params: { date } 
    })
    return response.data
  } catch (error) {
    console.error('Error fetching available floors:', error)
    throw error
  }
}

export const getSchedulesByExpo = async (expoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/expo/${expoId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedules')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching schedules:', error)
    throw error
  }
}