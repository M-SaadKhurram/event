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
  cilLightbulb,
  cilHeart
} from '@coreui/icons'

const About = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    years: 0,
    countries: 0,
    employees: 0,
    satisfaction: 0
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
      animateNumber(10, 'years')
      animateNumber(25, 'countries')
      animateNumber(200, 'employees')
      animateNumber(99, 'satisfaction')
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
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
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 80px 80px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>

        <CContainer style={{ position: 'relative', zIndex: 2 }}>
          <CRow className="align-items-center">
            <CCol lg={8} className="text-white">
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
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                🌟 About EventSphere Management
              </CBadge>
              
              <h1 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: '800', 
                lineHeight: '1.2',
                marginBottom: '1.2rem',
                background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Pioneering the Future of{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Expo Management
                </span>
              </h1>
              
              <p style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                opacity: 0.95,
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '600px'
              }}>
                Since our inception, we've been transforming the expo and trade show industry 
                with innovative technology solutions that deliver exceptional experiences for 
                organizers, exhibitors, and attendees worldwide.
              </p>

              {/* Stats */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1.5rem', 
                maxWidth: '600px'
              }}>
                {[
                  { key: 'years', label: 'Years of Excellence', suffix: '+', icon: '🎯' },
                  { key: 'countries', label: 'Countries Served', suffix: '+', icon: '🌍' },
                  { key: 'employees', label: 'Expert Team', suffix: '+', icon: '👥' },
                  { key: 'satisfaction', label: 'Client Satisfaction', suffix: '%', icon: '⭐' }
                ].map((stat) => (
                  <div key={stat.key} className="text-center" style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '1.2rem 0.8rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
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
          </CRow>
        </CContainer>
      </div>

      {/* Our Story Section */}
      <div style={{ padding: '5rem 0', background: '#fff' }}>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol lg={10}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <CBadge 
                  color="primary" 
                  className="mb-3 px-3 py-1"
                  style={{ 
                    fontSize: '0.9rem',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    borderRadius: '50px',
                    fontWeight: '600'
                  }}
                >
                  📖 Our Journey
                </CBadge>
                <h2 style={{ 
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
                  fontWeight: '800', 
                  color: '#1e293b',
                  marginBottom: '1rem'
                }}>
                  The EventSphere Story
                </h2>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.7, 
                  color: '#374151',
                  marginBottom: '1.5rem'
                }}>
                  Founded in 2014, EventSphere Management emerged from a simple observation: 
                  the expo and trade show industry was struggling with outdated processes 
                  that created friction for everyone involved. Our founders, seasoned 
                  professionals in event management and technology, envisioned a world 
                  where organizing large-scale events would be seamless, efficient, and enjoyable.
                </p>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.7, 
                  color: '#374151',
                  marginBottom: '1.5rem'
                }}>
                  What started as a small team of passionate innovators has grown into a 
                  global leader in expo management solutions. We've successfully managed 
                  over 500 major trade shows and exhibitions across 25 countries, 
                  connecting millions of professionals and facilitating billions in business transactions.
                </p>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.7, 
                  color: '#374151'
                }}>
                  Today, EventSphere continues to push the boundaries of what's possible 
                  in event management, leveraging cutting-edge technology, data analytics, 
                  and user experience design to create memorable experiences that drive 
                  meaningful business outcomes.
                </p>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Values Section */}
      <div style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <CContainer>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
              fontWeight: '800', 
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Our Core{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Values
              </span>
            </h2>
          </div>
          
          <CRow>
            {[
              {
                icon: cilLightbulb,
                title: 'Innovation First',
                description: 'We constantly push boundaries to create cutting-edge solutions that redefine industry standards.',
                color: '#f59e0b',
                emoji: '💡'
              },
              {
                icon: cilHeart,
                title: 'Client-Centric Approach',
                description: 'Every decision we make is guided by our commitment to delivering exceptional value to our clients.',
                color: '#ef4444',
                emoji: '❤️'
              },
              {
                icon: cilShieldAlt,
                title: 'Reliability & Trust',
                description: 'We build lasting partnerships through consistent delivery and unwavering commitment to excellence.',
                color: '#10b981',
                emoji: '🛡️'
              },
              {
                icon: cilGlobeAlt,
                title: 'Global Impact',
                description: 'We connect people and businesses worldwide, fostering international collaboration and growth.',
                color: '#3b82f6',
                emoji: '🌍'
              },
              {
                icon: cilSpeedometer,
                title: 'Continuous Growth',
                description: 'We embrace change and continuously evolve to meet the dynamic needs of our industry.',
                color: '#8b5cf6',
                emoji: '🚀'
              },
              {
                icon: cilStar,
                title: 'Excellence Standards',
                description: 'We maintain the highest quality standards in everything we do, from technology to customer service.',
                color: '#06b6d4',
                emoji: '🏆'
              }
            ].map((value, index) => (
              <CCol lg={4} md={6} className="mb-4" key={index}>
                <CCard style={{ 
                  border: 'none',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  height: '100%',
                  background: 'white',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
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
                  <CCardBody style={{ padding: 0 }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '15px',
                      background: `linear-gradient(135deg, ${value.color}20 0%, ${value.color}10 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      position: 'relative'
                    }}>
                      <CIcon icon={value.icon} style={{ color: value.color, fontSize: '1.5rem' }} />
                      <div style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        fontSize: '1.2rem'
                      }}>{value.emoji}</div>
                    </div>
                    
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b',
                      marginBottom: '1rem',
                      fontSize: '1.1rem'
                    }}>
                      {value.title}
                    </h5>
                    <p style={{ 
                      color: '#64748b', 
                      lineHeight: 1.6, 
                      margin: 0,
                      fontSize: '0.95rem'
                    }}>
                      {value.description}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </div>

      {/* Team Section */}
      <div style={{ padding: '5rem 0', background: '#fff' }}>
        <CContainer>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <CBadge 
              color="success" 
              className="mb-3 px-3 py-1"
              style={{ 
                fontSize: '0.9rem',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                borderRadius: '50px',
                fontWeight: '600'
              }}
            >
              👥 Our Team
            </CBadge>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
              fontWeight: '800', 
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Meet the Experts Behind{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                EventSphere
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#64748b', 
              maxWidth: '600px', 
              margin: '0 auto'
            }}>
              Our diverse team of industry experts, technologists, and innovators 
              work together to deliver exceptional expo management solutions.
            </p>
          </div>
          
          <CRow>
            {[
              {
                name: 'Sarah Johnson',
                role: 'Chief Executive Officer',
                description: '15+ years in event management with expertise in scaling global operations.',
                image: '👩‍💼',
                color: '#667eea'
              },
              {
                name: 'Michael Chen',
                role: 'Chief Technology Officer',
                description: 'Technology visionary with a track record of building enterprise-scale platforms.',
                image: '👨‍💻',
                color: '#f59e0b'
              },
              {
                name: 'Emma Rodriguez',
                role: 'VP of Client Success',
                description: 'Passionate about delivering exceptional client experiences and driving success.',
                image: '👩‍🚀',
                color: '#10b981'
              },
              {
                name: 'David Kim',
                role: 'Head of Innovation',
                description: 'Leading our R&D efforts to pioneer next-generation event technologies.',
                image: '👨‍🔬',
                color: '#8b5cf6'
              }
            ].map((member, index) => (
              <CCol lg={3} md={6} className="mb-4" key={index}>
                <div style={{
                  background: 'white',
                  borderRadius: '18px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = member.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${member.color}20 0%, ${member.color}10 100%)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem'
                  }}>
                    {member.image}
                  </div>
                  
                  <h5 style={{ 
                    fontWeight: '700', 
                    color: '#1e293b',
                    marginBottom: '0.5rem'
                  }}>
                    {member.name}
                  </h5>
                  
                  <CBadge 
                    style={{ 
                      background: member.color,
                      color: 'white',
                      marginBottom: '1rem',
                      fontSize: '0.75rem',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '15px'
                    }}
                  >
                    {member.role}
                  </CBadge>
                  
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    margin: 0
                  }}>
                    {member.description}
                  </p>
                </div>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </div>

      {/* CTA Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '5rem 0'
      }}>
        <CContainer>
          <CRow className="justify-content-center text-center">
            <CCol lg={8}>
              <h2 style={{ 
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
                fontWeight: '800', 
                color: 'white',
                marginBottom: '1.2rem'
              }}>
                Ready to{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Partner
                </span>{' '}
                with Us?
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '2.5rem',
                lineHeight: 1.7
              }}>
                Join thousands of successful event organizers who trust EventSphere 
                to deliver exceptional expo experiences.
              </p>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '1rem', 
                justifyContent: 'center'
              }}>
                <CButton 
                  as={Link} 
                  to="/contact" 
                  size="lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.4)'
                  }}
                >
                  🤝 Get in Touch
                </CButton>
                <CButton 
                  as={Link} 
                  to="/register" 
                  size="lg" 
                  variant="outline"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  🚀 Start Today
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
        `}
      </style>
    </div>
  )
}

export default About