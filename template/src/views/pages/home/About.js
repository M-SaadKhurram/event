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
        background: 'linear-gradient(135deg,  #8b0000 0%)',
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
            
                className="mb-3 px-3 py-1"
                style={{ 
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'white',
                  borderRadius: '50px',
                  background: 'rgba(7, 150, 62, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  marginTop: '1rem'
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
                Innovating the Future of{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #0dbd28ff 0%, #da9826ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Global Events
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
                maxWidth: '630px',
                marginBottom: '2rem'
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
                      background: 'linear-gradient(135deg, #1bac33ff 0%, #ca9f42ff 100%)',
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
            <CCol lg={9}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <CBadge 
                  className="mb-3 px-3 py-1"
                  style={{ 
                    fontSize: '0.9rem',
                    backgroundColor: '#119e16ff',
                    color: 'white',
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
                  Our EventSphere Chronicles
                </h2>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #3edf25ff 0%, #b2b87dff 100%)',
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
                  Founded in 2022, EventSphere Management was created to transform the way expos and trade shows are conceived, planned, and experienced. Our founders recognized a clear gap in the industry — outdated processes and disconnected tools that slowed organizers, frustrated exhibitors, and left attendees wanting more. From day one, our mission has been to eliminate these barriers and set a new benchmark for efficiency, innovation, and engagement.
                </p>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.7, 
                  color: '#374151',
                  marginBottom: '1.5rem'
                }}>
                  In just a short span, we have grown from a passionate startup into a trusted partner for event organizers worldwide. Our team has successfully powered high-impact trade shows and exhibitions across diverse industries, connecting professionals, fostering collaboration, and unlocking new business opportunities on a global scale.
                </p>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.7, 
                  color: '#374151'
                }}>
                  Today, EventSphere stands at the forefront of event technology and management innovation. We integrate advanced digital solutions, real-time analytics, and human-centered design to create experiences that are seamless, memorable, and results-driven — shaping the future of how the world connects through events.

                </p>

                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.7, 
                  color: '#374151'
                }}>
                  Looking ahead, our commitment is clear: to continue redefining what’s possible in the world of expos. By embracing emerging technologies, nurturing global partnerships, and placing people at the heart of every event, EventSphere is not just keeping pace with the future — we’re building it
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
                background: 'linear-gradient(135deg, #901a1aff 0%, #d850a0ff 100%)',
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
                title: 'Vision-Driven Innovation',
                description: 'We design forward-thinking solutions that set new trends and inspire the future of event management.',
                color: '#f59e0b',
                emoji: '💡'
              },
              {
                icon: cilHeart,
                title: 'People First',
                description: 'Our priority is creating value and memorable experiences for everyone — organizers, exhibitors, and attendees.',
                color: '#ef4444',
                emoji: '❤️'
              },
              {
                icon: cilShieldAlt,
                title: 'Trusted Excellence',
                description: 'We uphold integrity and reliability in every partnership, delivering results that exceed expectations.',
                color: '#10b981',
                emoji: '🛡️'
              },
              {
                icon: cilGlobeAlt,
                title: 'Global Connections',
                description: 'We unite people, brands, and ideas across borders to foster growth and collaboration worldwide.',
                color: '#3b82f6',
                emoji: '🌍'
              },
              {
                icon: cilSpeedometer,
                title: 'Agile Growth',
                description: 'We adapt quickly to industry shifts, turning challenges into opportunities for progress.',
                color: '#8b5cf6',
                emoji: '🚀'
              },
              {
                icon: cilStar,
                title: 'Pursuit of Perfection',
                description: 'We aim for excellence in every detail, from our technology to our customer support.',
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
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(195, 65, 65, 1)'
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
                color: 'white',
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
              Meet the Team Behind{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #4f9325ff 0%, #c79b17ff 100%)',
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
              At EventSphere, collaboration fuels our success — uniting industry veterans, technology pioneers, and creative minds to shape the future of expo and trade show management.
            </p>
          </div>
          
          <CRow>
            {[
              {
                name: 'Sakina Khan',
                role: 'Chief Executive Officer',
                description: 'Visionary leader driving EventSphere’s strategic growth and shaping the future of global expo management.',
                image: '👩‍💼',
                color: '#667eea'
              },
              {
                name: 'Saad Khurram',
                role: 'Chief Technology Officer',
                description: 'Architect of cutting-edge event technologies, leading innovation and digital transformation initiatives.',
                image: '👨‍💻',
                color: '#f59e0b'
              },
              {
                name: 'Yazdan Khan',
                role: 'VP of Client Success',
                description: 'Dedicated to delivering exceptional client experiences and building long-term partnerships worldwide.',
                image: '🤝',
                color: '#10b981'
              },
              {
                name: 'Zubair Khan',
                role: 'Head of Innovation',
                description: 'Pioneering next-generation event solutions through research, creativity, and forward-thinking strategies.',
                image: '🚀',
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
        background:'linear-gradient(135deg,  #8b0000 0%)',
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
                  background: 'linear-gradient(135deg, #3ee847ff 0%, #ce9415ff 100%)',
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
                    background: 'linear-gradient(135deg, #14ab17ff 0%, #d8821fff 100%)',
                    border: 'none',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.4)'
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