import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import api from '../../../utils/api'
import { useAuth } from '../../../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMsg, setForgotMsg] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      if (response.data.success) {
        login(response.data.user, response.data.token)
        setSuccess('Login successful! Redirecting to dashboard...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        setError(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check if the server is running.')
      } else {
        setError('An error occurred. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const handleForgotPassword = async () => {
    setForgotLoading(true)
    setForgotMsg('')
    setError('')
    try {
      const response = await api.post('/auth/forgot-password', { email })
      if (response.data.success) {
        setForgotMsg('Password reset! Check your email for the new password.')
      } else {
        setError(response.data.message || 'Failed to reset password')
      }
    } catch (err) {
      setError('Failed to reset password. Try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <CCardBody className="p-4" style={{ padding: '2rem' }}>
                <CForm onSubmit={handleSubmit}>
                  <h1 style={{ fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Login</h1>
                  <p className="text-body-secondary mb-4">Sign In to your account</p>
                  
                  {error && (
                    <CAlert color="danger" className="mb-3">
                      {error}
                    </CAlert>
                  )}
                  
                  {success && (
                    <CAlert color="success" className="mb-3">
                      {success}
                    </CAlert>
                  )}

                  {forgotMsg && (
                    <CAlert color="info" className="mb-3">
                      {forgotMsg}
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e5e7eb', borderRight: 'none' }}>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      name="email"
                      placeholder="Email" 
                      autoComplete="email"
                      type="email"
                      value={email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      style={{ borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none' }}
                    />
                  </CInputGroup>
                  
                  <CInputGroup className="mb-4">
                    <CInputGroupText style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e5e7eb', borderRight: 'none' }}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      style={{ borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none' }}
                    />
                  </CInputGroup>
                  
                  <div className="d-grid">
                    <CButton 
                      color="success" 
                      type="submit"
                      disabled={loading}
                      style={{ 
                        background: 'linear-gradient(135deg, #3b82f6 0%, #10b981dd 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: '0 8px 20px #3b82f630'
                      }}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </CButton>
                  </div>

                  <div className="text-center mt-4">
                    <CButton
                      color="link"
                      className="px-0"
                      onClick={handleForgotPassword}
                      disabled={forgotLoading || !email}
                      style={{ 
                        textDecoration: 'none', 
                        color: '#3b82f6',
                        fontWeight: '600',
                        padding: 0
                      }}
                    >
                      {forgotLoading ? 'Sending...' : 'Forgot password?'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
