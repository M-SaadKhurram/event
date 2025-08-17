import React, { useState } from 'react'
import { CForm, CFormInput, CButton, CAlert } from '@coreui/react'
import api from '../../../utils/api'
import { useAuth } from '../../../context/AuthContext'
 
const ChangePassword = () => {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setError('')
    try {
      const res = await api.post('/auth/change-password', { email: user?.email, oldPassword, newPassword })
      if (res.data.success) {
        setMsg('Password changed successfully!')
      } else {
        setError(res.data.message || 'Failed to change password')
      }
    } catch (err) {
      // Improved error handling: show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to change password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      {msg && <CAlert color="success">{msg}</CAlert>}
      {error && <CAlert color="danger">{error}</CAlert>}
      <CFormInput
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        required
        className="mb-2"
      />
      <CFormInput
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        className="mb-2"
      />
      <CButton type="submit" color="primary" disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </CButton>
    </CForm>
  )
}

export default ChangePassword

