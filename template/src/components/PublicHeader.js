// Create: src/components/PublicHeader.js
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CButton,
  CCollapse,
  CNavbarToggler
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilX } from '@coreui/icons'

const PublicHeader = () => {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About Us', icon: '🏢' },
    { path: '/contact', label: 'Contact', icon: '📞' },
    { path: '/feedback', label: 'Feedback', icon: '💬' }
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <CHeader 
      position="sticky" 
      className="mb-0" 
      style={{ 
        background: 'linear-gradient(135deg, #e00f0fff 0%, #9c2626 100%)',
        borderBottom: 'none',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
      }}
    >
      <CContainer fluid className="px-4">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Brand Logo */}
          <Link 
            to="/"
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>🎪</span>
            EventSphere
          </Link>

          {/* Desktop Navigation */}
          <CHeaderNav 
            className="d-none d-md-flex" 
            style={{ alignItems: 'center', gap: '0.5rem' }}
          >
            {navItems.map((item) => (
              <CNavItem key={item.path}>
                <CNavLink
                  as={Link}
                  to={item.path}
                  style={{
                    color: isActive(item.path) ? '#37d137ff' : 'rgba(255,255,255,0.9)',
                    textDecoration: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    background: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.background = 'rgba(255,255,255,0.1)'
                      e.target.style.color = '#37d137ff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.background = 'transparent'
                      e.target.style.color = 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                  {item.label}
                </CNavLink>
              </CNavItem>
            ))}
            
            <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem' }}>
              <CButton
                as={Link}
                to="/login"
                size="sm"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem'
                }}
              >
                Login
              </CButton>
              <CButton
                as={Link}
                to="/register?role=Exhibitor"
                size="sm"
                style={{
                  background: 'linear-gradient(135deg, #32c63cff 0%, #d97706 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  boxShadow: '0 4px 15px rgba(245,158,11,0.3)'
                }}
              >
                Get Started
              </CButton>
            </div>
          </CHeaderNav>

          {/* Mobile Menu Toggle */}
          <CNavbarToggler
            className="d-md-none"
            style={{ 
              border: 'none', 
              color: 'white',
              fontSize: '1.2rem'
            }}
            onClick={() => setVisible(!visible)}
          >
            <CIcon icon={visible ? cilX : cilMenu} />
          </CNavbarToggler>
        </div>

        {/* Mobile Navigation */}
        <CCollapse visible={visible} className="d-md-none">
          <div style={{ 
            padding: '1rem 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '1rem'
          }}>
            {navItems.map((item) => (
              <CNavLink
                key={item.path}
                as={Link}
                to={item.path}
                onClick={() => setVisible(false)}
                style={{
                  color: isActive(item.path) ? '#fbbf24' : 'rgba(255,255,255,0.9)',
                  textDecoration: 'none',
                  padding: '0.75rem 0',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRadius: '8px',
                  paddingLeft: '1rem',
                  marginBottom: '0.25rem'
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                {item.label}
              </CNavLink>
            ))}
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CButton
                as={Link}
                to="/login"
                onClick={() => setVisible(false)}
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '8px'
                }}
              >
                Login
              </CButton>
              <CButton
                as={Link}
                to="/register?role=Exhibitor"
                onClick={() => setVisible(false)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '8px'
                }}
              >
                Get Started
              </CButton>
            </div>
          </div>
        </CCollapse>
      </CContainer>
    </CHeader>
  )
}

export default PublicHeader