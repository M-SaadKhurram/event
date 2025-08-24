import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
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
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilArrowLeft } from '@coreui/icons';
import axios from 'axios';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get role from URL params or default to 'Attendee'
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') || 'Attendee';
  
  // State variables to hold form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState(initialRole); // Role is now fixed based on URL param
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      setLoading(false);
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    try {
      // Send signup request to backend API
      const response = await axios.post('http://localhost:8080/api/auth/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle response
      if (response.data.success) {
        alert(`Registration successful as ${role}!`);
        navigate('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Attendee': return '#10b981';
      case 'Exhibitor': return '#3b82f6';
      case 'Admin': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Attendee': return '👤';
      case 'Exhibitor': return '🏢';
      case 'Admin': return '👑';
      default: return '👤';
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <CCardBody className="p-4" style={{ padding: '2rem' }}>
                {/* Back Button */}
                <div className="mb-3">
                  <CButton 
                    color="light" 
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    style={{ 
                      borderRadius: '10px',
                      padding: '0.5rem 1rem',
                      fontWeight: '600'
                    }}
                  >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Back
                  </CButton>
                </div>

                <CForm onSubmit={handleSubmit}>
                  <h1 style={{ fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Create Account</h1>
                  <p className="text-body-secondary mb-4">Join us and start your journey</p>
                  
                  {/* Role Display */}
                  <div className="mb-4 text-center">
                    <div style={{
                      background: `${getRoleColor(role)}15`,
                      borderRadius: '15px',
                      padding: '1.5rem',
                      border: `2px solid ${getRoleColor(role)}25`
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {getRoleIcon(role)}
                      </div>
                      <CBadge 
                        style={{ 
                          background: getRoleColor(role),
                          color: 'white',
                          fontSize: '1rem',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '25px',
                          fontWeight: '600'
                        }}
                      >
                        Registering as {role}
                      </CBadge>
                      <p style={{ 
                        color: '#64748b', 
                        marginTop: '1rem', 
                        marginBottom: 0,
                        fontSize: '0.9rem'
                      }}>
                        {role === 'Attendee' 
                          ? 'Browse events, book tickets, and network with professionals'
                          : 'Showcase your products, connect with customers, and grow your business'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Username */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e5e7eb', borderRight: 'none' }}>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Full Name"
                      autoComplete="username"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none' }}
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e5e7eb', borderRight: 'none' }}>
                      @
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email Address"
                      autoComplete="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none' }}
                    />
                  </CInputGroup>

                  {/* Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e5e7eb', borderRight: 'none' }}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none' }}
                    />
                  </CInputGroup>

                  {/* Confirm Password */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e5e7eb', borderRight: 'none' }}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none' }}
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton 
                      color="success" 
                      type="submit"
                      disabled={loading}
                      style={{ 
                        background: `linear-gradient(135deg, ${getRoleColor(role)} 0%, ${getRoleColor(role)}dd 100%)`,
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: `0 8px 20px ${getRoleColor(role)}30`
                      }}
                    >
                      {loading ? 'Creating Account...' : `Create ${role} Account`}
                    </CButton>
                  </div>

                  <div className="text-center mt-4">
                    <p style={{ color: '#ffd500ff', fontSize: '0.9rem' }}>
                      Already have an account?{' '}
                      <CButton
                        color="link"
                        onClick={() => navigate('/login')}
                        style={{ 
                          textDecoration: 'none', 
                  
                          color: '#37bc06ff',
                          fontWeight: '600',
                          paddingBottom:'13px',
                        }}
                      >
                        Sign In
                      </CButton>
                    </p>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
