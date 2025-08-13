import React, { useState, useEffect } from 'react'
import { 
  CRow, 
  CCol, 
  CCard, 
  CCardBody, 
  CButton,
  CContainer,
  CBadge,
  CProgress
} from '@coreui/react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { 
  cilCalendar, 
  cilPeople, 
  cilChart, 
  cilStar, 
  cilCheckCircle,
  cilSpeedometer,
  cilLockLocked,
  cilBullhorn,
  cilLocationPin,
  cilClock,
  cilShieldAlt,
  cilGlobeAlt,
  cilLightbulb
} from '@coreui/icons'

const Home = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    expos: 0,
    attendees: 0,
    exhibitors: 0,
    success: 0
  })

  // Animate numbers on component mount
  useEffect(() => {
    const animateNumber = (target, key, duration = 2000) => {
      const increment = target / (duration / 16)
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedNumbers(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, 16)
    }

    const timer = setTimeout(() => {
      animateNumber(500, 'expos')
      animateNumber(1000, 'attendees')
      animateNumber(10000, 'exhibitors')
      animateNumber(98, 'success')
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* Enhanced Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 80px 80px, 40px 40px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>

        {/* Floating Shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'bounce 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '5%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '30px',
          transform: 'rotate(45deg)',
          animation: 'rotate 8s linear infinite'
        }}></div>
        
        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <CRow className="align-items-center">
            <CCol lg={6} className="text-white">
              <div style={{ marginBottom: '1.5rem' }}>
                <CBadge 
                  color="light" 
                  className="mb-3 px-3 py-1"
                  style={{ 
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#667eea',
                    borderRadius: '50px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  🏆 EventSphere Management - Industry Pioneer
                </CBadge>
              </div>
              
              <h1 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: '800', 
                lineHeight: '1.2',
                marginBottom: '1.2rem',
                background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Revolutionize Your{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  position: 'relative'
                }}>
                  Trade Shows
                  <div style={{
                    position: 'absolute',
                    bottom: '-3px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                    borderRadius: '1px'
                  }}></div>
                </span>{' '}
                & Large-Scale Expos
              </h1>
              
              <p style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                opacity: 0.95,
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '600px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Transform traditional expo management with our cutting-edge platform. 
                Eliminate manual processes, streamline communication, and deliver 
                real-time insights that drive success.
              </p>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '1rem', 
                marginBottom: '3rem' 
              }}>
                <CButton 
                  as={Link} 
                  to="/register" 
                  size="lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    padding: '14px 28px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)'
                    e.target.style.boxShadow = '0 12px 25px rgba(245,158,11,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)'
                    e.target.style.boxShadow = '0 8px 20px rgba(245,158,11,0.4)'
                  }}
                >
                  🚀 Transform Your Expo
                </CButton>
                
                <CButton 
                  as={Link} 
                  to="/login" 
                  size="lg" 
                  variant="outline"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    padding: '14px 28px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    borderWidth: '2px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.6)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  📊 Watch Demo
                </CButton>
              </div>
              
              {/* Enhanced Trust Indicators with Animation */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1.5rem', 
                maxWidth: '600px'
              }}>
                {[
                  { key: 'expos', label: 'Expos Managed', suffix: '+', icon: '🎯' },
                  { key: 'attendees', label: 'Attendees Connected', suffix: 'K+', icon: '👥' },
                  { key: 'exhibitors', label: 'Exhibitors Served', suffix: '+', icon: '🏢' },
                  { key: 'success', label: 'Success Rate', suffix: '%', icon: '⭐' }
                ].map((stat) => (
                  <div key={stat.key} className="text-center" style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '1.2rem 0.8rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{stat.icon}</div>
                    <div style={{ 
                      fontSize: '1.8rem', 
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #ffffff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {animatedNumbers[stat.key]}{stat.suffix}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: '500' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CCol>
            
            <CCol lg={6} className="mt-4 mt-lg-0">
              <div style={{ 
                position: 'relative',
                padding: '1.5rem'
              }}>
                {/* Enhanced Dashboard Preview */}
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #f59e0b, #10b981, #3b82f6, #8b5cf6)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.8 }}>
                      🟢 Live System
                    </div>
                  </div>
                  
                  <div style={{ 
                    color: 'white', 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>⚡</span> EventSphere Control Center
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.1) 100%)', 
                      padding: '1.2rem', 
                      borderRadius: '12px',
                      border: '1px solid rgba(245,158,11,0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '1rem'
                      }}>📈</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24', marginBottom: '0.3rem' }}>2,847</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Live Attendees</div>
                    </div>
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(52,211,153,0.1) 100%)', 
                      padding: '1.2rem', 
                      borderRadius: '12px',
                      border: '1px solid rgba(52,211,153,0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '1rem'
                      }}>🏢</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#34d399', marginBottom: '0.3rem' }}>156</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Active Booths</div>
                    </div>
                  </div>
                  
                  {/* Enhanced Chart */}
                  <div style={{
                    height: '80px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: '10px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '12px',
                      fontSize: '0.7rem',
                      opacity: 0.8
                    }}>📊 Real-time Analytics</div>
                    {[15, 25, 35, 45, 55, 65, 75, 85].map((left, index) => (
                      <div key={index} style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: `${left}%`,
                        width: '4px',
                        height: `${30 + (index * 4)}%`,
                        background: index < 4 ? 
                          'linear-gradient(180deg, #fbbf24, #f59e0b)' : 
                          'linear-gradient(180deg, #34d399, #10b981)',
                        borderRadius: '2px',
                        animation: `growUp 1.5s ease-out ${index * 0.1}s both`
                      }}></div>
                    ))}
                  </div>
                </div>
                
                {/* Enhanced Floating Elements */}
                <div style={{
                  position: 'absolute',
                  top: '5%',
                  right: '5%',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '16px',
                  padding: '1rem',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  <CIcon icon={cilCalendar} style={{ color: '#fbbf24', fontSize: '1.3rem' }} />
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '5%',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '16px',
                  padding: '1rem',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  animation: 'float 3s ease-in-out infinite 1.5s'
                }}>
                  <CIcon icon={cilPeople} style={{ color: '#34d399', fontSize: '1.3rem' }} />
                </div>

                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-8%',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  padding: '0.8rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  <CIcon icon={cilChart} style={{ color: '#8b5cf6', fontSize: '1.2rem' }} />
                </div>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Enhanced Problem Statement Section */}
      <div style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(220,38,38,0.05) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(234,88,12,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <CBadge 
              color="danger" 
              className="mb-3 px-3 py-1"
              style={{ 
                fontSize: '0.9rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '50px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(220,38,38,0.2)'
              }}
            >
              🚨 Critical Challenges We Solve
            </CBadge>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
              fontWeight: '800', 
              color: '#1e293b',
              marginBottom: '1rem',
              lineHeight: '1.3'
            }}>
              Traditional Expo Management{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Pain Points
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#64748b', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              EventSphere identified critical inefficiencies that cost the industry 
              billions annually and frustrate stakeholders
            </p>
          </div>
          
          <CRow>
            {[
              {
                icon: cilCalendar,
                title: 'Manual Registration Systems',
                description: 'Time-consuming paper-based processes leading to 40% higher error rates and significant delays in attendee management',
                color: '#dc2626',
                stats: '40% Error Rate',
                emoji: '📝'
              },
              {
                icon: cilBullhorn,
                title: 'Disjointed Communication',
                description: 'Fragmented channels causing confusion, with 65% of exhibitors reporting communication issues during events',
                color: '#ea580c',
                stats: '65% Confusion Rate',
                emoji: '📢'
              },
              {
                icon: cilChart,
                title: 'Limited Real-time Information',
                description: 'Lack of live updates preventing 80% of organizers from making informed decisions during critical moments',
                color: '#d97706',
                stats: '80% Blind Decisions',
                emoji: '📊'
              }
            ].map((problem, index) => (
              <CCol lg={4} md={6} className="mb-4" key={index}>
                <CCard style={{ 
                  border: 'none',
                  borderRadius: '18px',
                  padding: '1.8rem',
                  height: '100%',
                  background: 'white',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${problem.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)'
                }}>
                  <CCardBody style={{ padding: 0, position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '15px',
                      background: `linear-gradient(135deg, ${problem.color}20 0%, ${problem.color}10 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      position: 'relative'
                    }}>
                      <CIcon icon={problem.icon} style={{ color: problem.color, fontSize: '1.5rem' }} />
                      <div style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        fontSize: '1.2rem'
                      }}>{problem.emoji}</div>
                    </div>
                    
                    <CBadge 
                      style={{ 
                        background: problem.color,
                        color: 'white',
                        marginBottom: '1rem',
                        fontSize: '0.75rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '15px'
                      }}
                    >
                      {problem.stats}
                    </CBadge>
                    
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b',
                      marginBottom: '1rem',
                      fontSize: '1.1rem'
                    }}>
                      {problem.title}
                    </h5>
                    <p style={{ 
                      color: '#64748b', 
                      lineHeight: 1.6, 
                      margin: 0,
                      fontSize: '0.95rem'
                    }}>
                      {problem.description}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </div>

      {/* Upcoming Events Section */}
      <div style={{ padding: '5rem 0', background: '#fff', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(59,130,246,0.05) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(139,92,246,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <CBadge 
              color="primary" 
              className="mb-3 px-3 py-1"
              style={{ 
                fontSize: '0.9rem',
                backgroundColor: '#dbeafe',
                color: '#2563eb',
                borderRadius: '50px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
              }}
            >
              🎯 Upcoming Events
            </CBadge>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
              fontWeight: '800', 
              color: '#1e293b',
              marginBottom: '1rem',
              lineHeight: '1.3'
            }}>
              Join Our{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Upcoming Events
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#64748b', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Experience the future of expo management at these exciting upcoming events
            </p>
          </div>
          
          <CRow>
            {[
              {
                title: 'TechExpo 2024',
                date: 'March 15-17, 2024',
                location: 'Dubai World Trade Centre',
                attendees: '25,000+',
                exhibitors: '500+',
                status: 'Registration Open',
                color: '#2563eb',
                bgColor: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
                category: 'Technology',
                image: '🌐'
              },
              {
                title: 'Healthcare Innovation Summit',
                date: 'April 22-24, 2024',
                location: 'Singapore Expo',
                attendees: '15,000+',
                exhibitors: '300+',
                status: 'Early Bird',
                color: '#059669',
                bgColor: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%)',
                category: 'Healthcare',
                image: '🏥'
              },
              {
                title: 'Global Manufacturing Expo',
                date: 'May 10-12, 2024',
                location: 'ExCeL London',
                attendees: '30,000+',
                exhibitors: '600+',
                status: 'Almost Full',
                color: '#dc2626',
                bgColor: 'linear-gradient(135deg, #fee2e2 0%, #fef3c7 100%)',
                category: 'Manufacturing',
                image: '🏭'
              },
              {
                title: 'Food & Beverage Showcase',
                date: 'June 5-7, 2024',
                location: 'Las Vegas Convention Center',
                attendees: '20,000+',
                exhibitors: '400+',
                status: 'Planning Phase',
                color: '#7c3aed',
                bgColor: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)',
                category: 'Food & Beverage',
                image: '🍽️'
              },
              {
                title: 'Fashion Week International',
                date: 'July 18-21, 2024',
                location: 'Milan Convention Centre',
                attendees: '18,000+',
                exhibitors: '250+',
                status: 'Coming Soon',
                color: '#ea580c',
                bgColor: 'linear-gradient(135deg, #fed7aa 0%, #fde68a 100%)',
                category: 'Fashion',
                image: '👗'
              },
              {
                title: 'Auto Expo 2024',
                date: 'August 12-15, 2024',
                location: 'Detroit Cobo Center',
                attendees: '40,000+',
                exhibitors: '800+',
                status: 'Registration Open',
                color: '#0891b2',
                bgColor: 'linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%)',
                category: 'Automotive',
                image: '🚗'
              }
            ].map((event, index) => (
              <CCol lg={4} md={6} className="mb-4" key={index}>
                <CCard style={{ 
                  border: 'none',
                  borderRadius: '18px',
                  height: '100%',
                  background: event.bgColor,
                  boxShadow: '0 6px 25px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.06)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '60px',
                    height: '60px',
                    background: `${event.color}15`,
                    borderRadius: '50%'
                  }}></div>
                  
                  <CCardBody style={{ padding: '1.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2.5rem' }}>{event.image}</div>
                      <CBadge 
                        style={{ 
                          background: event.color,
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {event.status}
                      </CBadge>
                    </div>
                    
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b',
                      marginBottom: '0.8rem',
                      fontSize: '1.1rem'
                    }}>
                      {event.title}
                    </h5>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '0.4rem',
                        fontSize: '0.85rem',
                        color: '#64748b'
                      }}>
                        <CIcon icon={cilCalendar} style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
                        {event.date}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '0.4rem',
                        fontSize: '0.85rem',
                        color: '#64748b'
                      }}>
                        <CIcon icon={cilLocationPin} style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
                        {event.location}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '0.8rem',
                      marginBottom: '1.2rem'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '700', 
                          color: event.color 
                        }}>
                          {event.attendees}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Attendees</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '700', 
                          color: event.color 
                        }}>
                          {event.exhibitors}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Exhibitors</div>
                      </div>
                    </div>
                    
                    <CButton 
                      size="sm"
                      style={{ 
                        background: event.color,
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        width: '100%'
                      }}
                    >
                      Learn More
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </div>

      {/* Enhanced Industry Focus Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(30,64,175,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(124,58,237,0.3) 0%, transparent 50%)
          `
        }}></div>
        
        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
              fontWeight: '800', 
              color: 'white',
              marginBottom: '1rem',
              lineHeight: '1.3'
            }}>
              Serving Industries{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Across the Globe
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.8)', 
              maxWidth: '650px', 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              EventSphere Management leads large-scale expo transformation across diverse industries
            </p>
          </div>
          
          <CRow className="justify-content-center">
            {[
              { name: 'Technology & Innovation', count: '150+', icon: '💻', color: '#3b82f6' },
              { name: 'Healthcare & Medical', count: '120+', icon: '🏥', color: '#10b981' },
              { name: 'Manufacturing & Industrial', count: '100+', icon: '🏭', color: '#f59e0b' },
              { name: 'Food & Beverage', count: '80+', icon: '🍽️', color: '#ef4444' },
              { name: 'Fashion & Lifestyle', count: '75+', icon: '👗', color: '#8b5cf6' },
              { name: 'Automotive & Transport', count: '65+', icon: '🚗', color: '#06b6d4' }
            ].map((industry, index) => (
              <CCol lg={4} md={6} className="mb-3" key={index}>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.borderColor = industry.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '0.8rem'
                  }}>
                    {industry.icon}
                  </div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '800', 
                    color: industry.color,
                    marginBottom: '0.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {industry.count}
                  </div>
                  <div style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    {industry.name}
                  </div>
                </div>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </div>

      {/* Enhanced CTA Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `
        }}></div>
        
        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <CRow className="justify-content-center text-center">
            <CCol lg={10}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
                  fontWeight: '800', 
                  color: 'white',
                  marginBottom: '1.2rem',
                  lineHeight: '1.3',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  Ready to{' '}
                  <span style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Revolutionize
                  </span>{' '}
                  Your Expo?
                </h2>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '2.5rem',
                  lineHeight: 1.7,
                  maxWidth: '700px',
                  margin: '0 auto 2.5rem'
                }}>
                  Join EventSphere Management and transform your traditional expo management 
                  into a seamless, technology-driven experience that delights every stakeholder.
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '1rem', 
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <CButton 
                  as={Link} 
                  to="/register" 
                  size="lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)'
                    e.target.style.boxShadow = '0 12px 30px rgba(245,158,11,0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)'
                    e.target.style.boxShadow = '0 8px 20px rgba(245,158,11,0.4)'
                  }}
                >
                  🚀 Start Your Transformation
                </CButton>
                <CButton 
                  as={Link} 
                  to="/login" 
                  size="lg" 
                  variant="outline"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    borderWidth: '2px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.6)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  📞 Contact EventSphere
                </CButton>
              </div>
              
              {/* Trust badges */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                opacity: 0.8
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>🏆</div>
                  <div style={{ fontSize: '0.8rem' }}>Industry Leader</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>🔒</div>
                  <div style={{ fontSize: '0.8rem' }}>Enterprise Secure</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>⚡</div>
                  <div style={{ fontSize: '0.8rem' }}>24/7 Support</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>✅</div>
                  <div style={{ fontSize: '0.8rem' }}>Proven Results</div>
                </div>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Home