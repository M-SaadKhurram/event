  import React, { useState, useEffect, useMemo } from 'react'
  import { useParams, useNavigate, Link } from 'react-router-dom'
  import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CBadge,
    CSpinner,
    CAlert,
    CProgress,
    CListGroup,
    CListGroupItem,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import {
    cilArrowLeft,
    cilCalendar,
    cilLocationPin,
    cilBuilding,
    cilChart,
    cilShare,
    cilClock,
    cilCheckCircle,
    cilInfo,
    cilUser,
    cilSearch,
    cilEnvelopeClosed,
    cilGlobeAlt,
    cilCloudDownload,
    cilBell,
    cilHeart,
    cilPrint,
    cilOptions,
    cilBolt,
    cilWifiSignal4
  } from '@coreui/icons'
  import { getExpo } from '../../../services/expos'
  import { getSchedulesByExpo } from '../../../services/schedules'
  import { getBoothsByExpo } from '../../../services/booths'

  const ExpoDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expo, setExpo] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [booths, setBooths] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingSchedules, setLoadingSchedules] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('overview')
    const [scheduleFilter, setScheduleFilter] = useState('all')
    const [boothSearch, setBoothSearch] = useState('')

    useEffect(() => {
      fetchExpoDetail()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
      if (expo?._id) {
        getBoothsByExpo(expo._id).then(setBooths).catch(() => setBooths([]))
      }
    }, [expo])

    const fetchExpoDetail = async () => {
      try {
        setLoading(true)
        const data = await getExpo(id)
        setExpo(data || null)
        if (data?._id) {
          fetchSchedules(data._id)
        } else {
          setSchedules([])
        }
      } catch (err) {
        console.error('Error fetching expo:', err)
        setError('Failed to load expo details')
        setExpo(null)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }

    const fetchSchedules = async (expoId) => {
      try {
        setLoadingSchedules(true)
        const data = await getSchedulesByExpo(expoId)
        setSchedules(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching schedules:', err)
        setSchedules([])
      } finally {
        setLoadingSchedules(false)
      }
    }

    const getExpoCategory = (expoObj) => {
      const title = (expoObj?.title || '').toLowerCase()
      const theme = (expoObj?.theme || '').toLowerCase()

      if (title.includes('tech') || theme.includes('tech') || title.includes('innovation')) {
        return { category: 'Technology', color: '#2563eb', image: '🌐', gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
      } else if (title.includes('health') || theme.includes('health') || title.includes('medical')) {
        return { category: 'Healthcare', color: '#059669', image: '🏥', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
      } else if (title.includes('food') || theme.includes('food') || title.includes('beverage')) {
        return { category: 'Food & Beverage', color: '#7c3aed', image: '🍽️', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }
      } else if (title.includes('fashion') || theme.includes('fashion') || title.includes('lifestyle')) {
        return { category: 'Fashion', color: '#ea580c', image: '👗', gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)' }
      } else if (title.includes('auto') || theme.includes('auto') || title.includes('car')) {
        return { category: 'Automotive', color: '#0891b2', image: '🚗', gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }
      } else if (title.includes('manufacturing') || theme.includes('manufacturing') || title.includes('industrial')) {
        return { category: 'Manufacturing', color: '#dc2626', image: '🏭', gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }
      } else {
        return { category: 'General', color: '#6b7280', image: '🎯', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'TBA'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'TBA'
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (timeString) => {
      if (!timeString) return 'TBA'
      try {
        const [h, m] = timeString.split(':').map((x) => parseInt(x, 10))
        const dt = new Date()
        dt.setHours(h || 0, m || 0, 0, 0)
        return dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } catch {
        return 'TBA'
      }
    }

    const formatDuration = (start, end) => {
      try {
        const s = new Date(`1970-01-01T${start || '00:00'}:00`)
        const e = new Date(`1970-01-01T${end || '00:00'}:00`)
        const diffMin = Math.max(0, Math.floor((e - s) / 60000))
        return diffMin ? `${diffMin} minutes` : 'TBA'
      } catch {
        return 'TBA'
      }
    }

    const formatPrice = (p) => {
      if (!p && p !== 0) return '—'
      const val = typeof p === 'object' && p?.$numberDecimal ? Number(p.$numberDecimal) : Number(p)
      if (isNaN(val)) return String(p)
      return val.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    }

    const getStatusColor = (status) => {
      switch ((status || '').toLowerCase()) {
        case 'upcoming': return '#3b82f6'
        case 'ongoing': return '#10b981'
        case 'completed': return '#6b7280'
        case 'cancelled': return '#ef4444'
        default: return '#6b7280'
      }
    }

    const daysUntil = useMemo(() => {
      if (!expo?.date) return null
      const eventDate = new Date(expo.date)
      const today = new Date()
      const diffTime = eventDate.setHours(0,0,0,0) - today.setHours(0,0,0,0)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }, [expo])

    const getCountdownText = () => {
      if (daysUntil == null) return 'Date TBA'
      if (daysUntil > 0) return `${daysUntil} days to go`
      if (daysUntil === 0) return 'Today!'
      return `Event ended`
    }

    const groupSchedulesByDate = (list) =>
      list.reduce((groups, schedule) => {
        const key = new Date(schedule.date).toDateString()
        ;(groups[key] ||= []).push(schedule)
        return groups
      }, {})

    const sortedByTime = (list) =>
      [...list].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'))

    const schedulesFiltered = useMemo(() => {
      if (!Array.isArray(schedules)) return []
      if (scheduleFilter === 'all') return schedules
      const today = new Date(); today.setHours(0,0,0,0)
      return schedules.filter(s => {
        const d = new Date(s.date); d.setHours(0,0,0,0)
        if (scheduleFilter === 'today') return d.getTime() === today.getTime()
        if (scheduleFilter === 'upcoming') return d > today
        if (scheduleFilter === 'past') return d < today
        return true
      })
    }, [schedules, scheduleFilter])

    const groupedSchedules = useMemo(() => groupSchedulesByDate(schedulesFiltered), [schedulesFiltered])

    const filteredBooths = useMemo(() => {
      const q = (boothSearch || '').toLowerCase()
      if (!q) return booths
      return booths.filter((booth) => {
        return (
          booth?.booth_number?.toLowerCase().includes(q) ||
          String(booth?.floor ?? '').toLowerCase().includes(q) ||
          booth?.status?.toLowerCase().includes(q) ||
          booth?.assigned_to?.company_name?.toLowerCase().includes(q)
        )
      })
    }, [boothSearch, booths])

    const handleRegistration = (role) => {
      if (!expo) return
      if (role === 'Attendee') {
        navigate(`/attendee/register/${expo.id || expo._id}`)
      } else {
        navigate(`/register?role=${role}`)
      }
    }

    // Early states
    if (loading) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="text-center">
            <CSpinner color="primary" size="lg" />
            <p className="mt-3" style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading expo details...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', paddingTop: '2rem' }}>
          <CContainer>
            <CAlert color="danger" style={{ borderRadius: '15px', border: 'none', boxShadow: '0 8px 25px rgba(239,68,68,0.1)' }}>
              <div className="d-flex align-items-center">
                <CIcon icon={cilInfo} className="me-2" size="lg" />
                <div>
                  <h5 className="mb-1">Error Loading Expo</h5>
                  <p className="mb-0">{error}</p>
                </div>
              </div>
            </CAlert>
            <CButton
              color="primary"
              onClick={() => navigate(-1)}
              style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Go Back
            </CButton>
          </CContainer>
        </div>
      )
    }

    if (!expo) {
      return (
        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', paddingTop: '2rem' }}>
          <CContainer>
            <CAlert color="warning" style={{ borderRadius: '15px', border: 'none', boxShadow: '0 8px 25px rgba(245,158,11,0.1)' }}>
              <div className="d-flex align-items-center">
                <CIcon icon={cilInfo} className="me-2" size="lg" />
                <div>
                  <h5 className="mb-1">Expo Not Found</h5>
                  <p className="mb-0">The expo you're looking for doesn't exist or has been removed.</p>
                </div>
              </div>
            </CAlert>
            <CButton
              color="primary"
              onClick={() => navigate(-1)}
              style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Go Back
            </CButton>
          </CContainer>
        </div>
      )
    }

    const { category, color, image, gradient } = getExpoCategory(expo)

    return (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, ${color}10 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, ${color}05 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />

        <CContainer style={{ paddingTop: '2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <CRow className="mb-4">
            <CCol>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <CButton
                  color="light"
                  onClick={() => navigate(-1)}
                  style={{
                    borderRadius: '12px',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    fontWeight: 600,
                    color: '#1e293b'
                  }}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to Home
                </CButton>

                <div className="d-flex gap-2 flex-wrap">
                  <CButton
                    color="light"
                    size="sm"
                    style={{
                      borderRadius: '10px',
                      padding: '0.5rem 1rem',
                      borderColor: color,
                      color: color,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <CIcon icon={cilShare} className="me-1" />
                    Share
                  </CButton>
                  <CButton
                    color="light"
                    size="sm"
                    style={{
                      borderRadius: '10px',
                      padding: '0.5rem 1rem',
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <CIcon icon={cilHeart} className="me-1" />
                    Save
                  </CButton>
                  <CDropdown>
                    <CDropdownToggle
                      color="light"
                      size="sm"
                      style={{
                        borderRadius: '10px',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CIcon icon={cilOptions} className="me-1" />
                      More
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>
                        <CIcon icon={cilCloudDownload} className="me-2" />
                        Download Brochure
                      </CDropdownItem>
                      <CDropdownItem>
                        <CIcon icon={cilPrint} className="me-2" />
                        Print Details
                      </CDropdownItem>
                      <CDropdownItem>
                        <CIcon icon={cilBell} className="me-2" />
                        Set Reminder
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Hero */}
          <CRow className="mb-4">
            <CCol lg={8}>
              <CCard style={{
                border: 'none',
                borderRadius: '25px',
                background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: `${color}10`,
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  right: '30px',
                  fontSize: '5rem',
                  opacity: 0.2,
                  transform: 'rotate(15deg)'
                }}>
                  {image}
                </div>

                <CCardBody style={{ padding: '3rem', position: 'relative', zIndex: 3 }}>
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <CBadge
                      style={{
                        background: gradient,
                        color: 'white',
                        fontSize: '0.9rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '20px',
                        display: 'inline-block',
                        boxShadow: `0 4px 15px ${color}30`
                      }}
                    >
                      {category}
                    </CBadge>
                    <CBadge
                      style={{
                        background: getStatusColor(expo.status),
                        color: 'white',
                        fontSize: '0.8rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '15px',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        boxShadow: `0 4px 15px ${getStatusColor(expo.status)}30`
                      }}
                    >
                      {expo.status || 'Upcoming'}
                    </CBadge>
                  </div>

                  <h1 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 900,
                    color: '#1e293b',
                    marginBottom: '1.5rem',
                    lineHeight: 1.1
                  }}>
                    {expo.title}
                  </h1>

                  {expo.theme && (
                    <div style={{
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: '15px',
                      padding: '1rem 1.5rem',
                      marginBottom: '2rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: 0, fontWeight: 500 }}>
                        <strong>Theme:</strong> {expo.theme}
                      </p>
                    </div>
                  )}

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}>
                        <div className="d-flex align-items-center">
                          <div style={{ background: color, borderRadius: '12px', padding: '0.8rem', marginRight: '1rem' }}>
                            <CIcon icon={cilCalendar} style={{ color: 'white', fontSize: '1.3rem' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                              {formatDate(expo.date)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                              {getCountdownText()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}>
                        <div className="d-flex align-items-center">
                          <div style={{ background: color, borderRadius: '12px', padding: '0.8rem', marginRight: '1rem' }}>
                            <CIcon icon={cilLocationPin} style={{ color: 'white', fontSize: '1.3rem' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                              {expo.location || 'TBA'}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                              {expo.floors ?? 0} Floor{(expo.floors || 0) > 1 ? 's' : ''} Available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {daysUntil != null && daysUntil > 0 && (
                    <div style={{
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: '15px',
                      padding: '1.5rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                          <CIcon icon={cilClock} className="me-2" />
                          Event Countdown
                        </span>
                        <span style={{ fontSize: '0.9rem', color: color, fontWeight: 600 }}>
                          {daysUntil} days remaining
                        </span>
                      </div>
                      <CProgress
                        value={Math.max(0, 100 - (daysUntil / 30) * 100)}
                        style={{ height: '12px', borderRadius: '6px', background: '#e5e7eb' }}
                      >
                        <div
                          style={{
                            background: gradient,
                            height: '100%',
                            borderRadius: '6px',
                            width: `${Math.max(0, 100 - (daysUntil / 30) * 100)}%`,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </CProgress>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>

            <CCol lg={4}>
              <CCard style={{
                border: 'none',
                borderRadius: '20px',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <CCardHeader style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: 'none',
                  borderRadius: '20px 20px 0 0',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  padding: '1.5rem'
                }}>
                  <CIcon icon={cilChart} className="me-2" />
                  Quick Stats
                </CCardHeader>
                <CCardBody style={{ padding: '1.5rem' }}>
                  <div className="d-grid gap-3">
                    <div className="text-center p-3" style={{
                      background: `${color}15`,
                      borderRadius: '15px',
                      border: `2px solid ${color}25`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ fontSize: '2.5rem', color: color, fontWeight: 900, position: 'relative', zIndex: 2 }}>
                        {expo.floors ?? 0}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: 600 }}>
                        Exhibition Floors
                      </div>
                    </div>

                    <div className="text-center p-3" style={{
                      background: '#10b98115',
                      borderRadius: '15px',
                      border: '2px solid #10b98125'
                    }}>
                      <div style={{ fontSize: '1.05rem', color: '#10b981', fontWeight: 700 }}>
                        {category}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: 600 }}>
                        Industry Focus
                      </div>
                    </div>

                    <div className="text-center p-3" style={{
                      background: '#3b82f615',
                      borderRadius: '15px',
                      border: '2px solid #3b82f625'
                    }}>
                      <div style={{ fontSize: '2.5rem', color: '#3b82f6' }}>
                        <CIcon icon={cilCheckCircle} />
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: 600 }}>
                        Verified Event
                      </div>
                    </div>

                    <div className="text-center p-3" style={{
                      background: '#f59e0b15',
                      borderRadius: '15px',
                      border: '2px solid #f59e0b25'
                    }}>
                      <div style={{ fontSize: '2.5rem', color: '#f59e0b', fontWeight: 900 }}>
                        {schedules.length}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: 600 }}>
                        Scheduled Events
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Tabs */}
          <CRow className="mb-4">
            <CCol>
              <CCard style={{
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <CCardBody style={{ padding: '1.5rem' }}>
                  <CNav variant="pills" role="tablist" style={{ gap: '0.5rem' }}>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                        style={{
                          borderRadius: '12px',
                          padding: '0.75rem 1.5rem',
                          fontWeight: 600,
                          background: activeTab === 'overview' ? gradient : 'transparent',
                          color: activeTab === 'overview' ? 'white' : '#64748b',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CIcon icon={cilInfo} className="me-2" />
                        Overview
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === 'schedule'}
                        onClick={() => setActiveTab('schedule')}
                        style={{
                          borderRadius: '12px',
                          padding: '0.75rem 1.5rem',
                          fontWeight: 600,
                          background: activeTab === 'schedule' ? gradient : 'transparent',
                          color: activeTab === 'schedule' ? 'white' : '#64748b',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CIcon icon={cilClock} className="me-2" />
                        Schedule ({schedules.length})
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === 'details'}
                        onClick={() => setActiveTab('details')}
                        style={{
                          borderRadius: '12px',
                          padding: '0.75rem 1.5rem',
                          fontWeight: 600,
                          background: activeTab === 'details' ? gradient : 'transparent',
                          color: activeTab === 'details' ? 'white' : '#64748b',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CIcon icon={cilBuilding} className="me-2" />
                        Details
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Tab Content */}
          <CTabContent>
            {/* Overview */}
            <CTabPane visible={activeTab === 'overview'}>
              <CRow>
                <CCol lg={8}>
                  {expo.description && (
                    <CCard style={{
                      border: 'none',
                      borderRadius: '20px',
                      marginBottom: '2rem',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <CCardHeader style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: 'none',
                        borderRadius: '20px 20px 0 0',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        padding: '1.5rem'
                      }}>
                        <CIcon icon={cilInfo} className="me-2" />
                        About This Expo
                      </CCardHeader>
                      <CCardBody style={{ padding: '2rem' }}>
                        <p style={{ lineHeight: 1.8, color: '#4b5563', fontSize: '1.1rem', marginBottom: 0 }}>
                          {expo.description}
                        </p>
                      </CCardBody>
                    </CCard>
                  )}

                  {expo.attachment && (
                    <CCard style={{
                      border: 'none',
                      borderRadius: '20px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <CCardHeader style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: 'none',
                        borderRadius: '20px 20px 0 0',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        padding: '1.5rem'
                      }}>
                        <CIcon icon={cilGlobeAlt} className="me-2" />
                        Event Gallery
                      </CCardHeader>
                      <CCardBody style={{ padding: '2rem' }}>
                        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
                          <img
                            src={`http://localhost:8080/${expo.attachment}`}
                            alt={expo.title}
                            style={{
                              width: '100%',
                              height: '400px',
                              objectFit: 'cover',
                              borderRadius: '15px',
                              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '0 0 15px 15px'
                          }}>
                            <h5 style={{ margin: 0, fontWeight: 700 }}>{expo.title}</h5>
                            <p style={{ margin: 0, opacity: 0.9 }}>Official event image</p>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  )}
                </CCol>

                <CCol lg={4}>
                  {/* Join */}
                  <CCard style={{
                    border: 'none',
                    borderRadius: '20px',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <CCardHeader style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      border: 'none',
                      borderRadius: '20px 20px 0 0',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      padding: '1.5rem'
                    }}>
                      <CIcon icon={cilUser} className="me-2" />
                      Join This Event
                    </CCardHeader>
                    <CCardBody style={{ padding: '2rem' }}>
                      <div className="d-grid gap-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #10b98115 0%, #10b98108 100%)',
                          borderRadius: '15px',
                          padding: '1.5rem',
                          border: '2px solid #10b98125',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👤</div>
                          <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                            Join as Attendee
                          </h6>
                          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Browse exhibitions, attend sessions, and network with professionals
                          </p>
                          <CButton
                            onClick={() => handleRegistration('Attendee')}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1.5rem',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              boxShadow: '0 8px 20px #10b98130',
                              width: '100%'
                            }}
                          >
                            Register as Attendee
                          </CButton>
                        </div>

                        <div style={{
                          background: 'linear-gradient(135deg, #3b82f615 0%, #3b82f608 100%)',
                          borderRadius: '15px',
                          padding: '1.5rem',
                          border: '2px solid #3b82f625',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
                          <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                            Join as Exhibitor
                          </h6>
                          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Showcase your products, connect with customers, and grow your business
                          </p>
                          <CButton
                            onClick={() => handleRegistration('Exhibitor')}
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1.5rem',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              boxShadow: '0 8px 20px #3b82f630',
                              width: '100%'
                            }}
                          >
                            Register as Exhibitor
                          </CButton>
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', margin: '1rem 0', position: 'relative' }}>
                          <span style={{
                            background: 'white',
                            color: '#64748b',
                            padding: '0 1rem',
                            position: 'absolute',
                            top: '-0.6rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.8rem',
                            fontWeight: 500
                          }}>
                            OR
                          </span>
                        </div>

                        <CButton color="light" style={{ borderRadius: '12px', padding: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                          <CIcon icon={cilCloudDownload} className="me-2" />
                          Download Brochure
                        </CButton>
                        <CButton color="info" variant="outline" style={{ borderRadius: '12px', padding: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                          Contact Organizer
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>

                  {/* Event Information */}
                  <CCard style={{
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
                    background: '#f3f4f6', // More contrast
                    backdropFilter: 'blur(10px)'
                  }}>
                    <CCardHeader style={{
                      background: 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)',
                      border: 'none',
                      borderRadius: '20px 20px 0 0',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      padding: '1.5rem',
                      color: '#1e293b'
                    }}>
                      <CIcon icon={cilInfo} className="me-2" />
                      Event Information
                    </CCardHeader>
                    <CCardBody style={{ padding: '2rem' }}>
                      <CListGroup flush>
                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-3" style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                          <span style={{ color: '#64748b', fontWeight: 500 }}>Status</span>
                          <CBadge style={{ background: getStatusColor(expo.status), color: 'white', textTransform: 'capitalize', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600 }}>
                            {expo.status || 'Upcoming'}
                          </CBadge>
                        </CListGroupItem>

                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-3" style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                          <span style={{ color: '#64748b', fontWeight: 500 }}>Date</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{new Date(expo.date).toLocaleDateString() || 'TBA'}</span>
                        </CListGroupItem>

                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-3" style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                          <span style={{ color: '#64748b', fontWeight: 500 }}>Location</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{expo.location || 'TBA'}</span>
                        </CListGroupItem>

                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-3" style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                          <span style={{ color: '#64748b', fontWeight: 500 }}>Floors</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{expo.floors ?? '—'}</span>
                        </CListGroupItem>

                        {expo.theme && (
                          <CListGroupItem className="border-0 px-0 py-3" style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                            <span style={{ color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Theme</span>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{expo.theme}</span>
                          </CListGroupItem>
                        )}

                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-3" style={{ background: '#fff' }}>
                          <span style={{ color: '#64748b', fontWeight: 500 }}>Created</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>
                            {expo.createdAt ? new Date(expo.createdAt).toLocaleDateString() : '—'}
                          </span>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>

            {/* Schedule */}
            <CTabPane visible={activeTab === 'schedule'}>
              <CRow>
                <CCol>
                  <CCard style={{
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <CCardHeader style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      border: 'none',
                      borderRadius: '20px 20px 0 0',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      padding: '1.5rem'
                    }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <CIcon icon={cilClock} className="me-2" />
                          Event Schedule ({schedulesFiltered.length} events)
                        </div>
                        <div className="d-flex gap-2">
                          {['all', 'today', 'upcoming', 'past'].map((filter) => (
                            <CButton
                              key={filter}
                              size="sm"
                              color={scheduleFilter === filter ? 'primary' : 'light'}
                              onClick={() => setScheduleFilter(filter)}
                              style={{
                                borderRadius: '8px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                border: scheduleFilter === filter ? 'none' : '1px solid #e5e7eb'
                              }}
                            >
                              {filter}
                            </CButton>
                          ))}
                        </div>
                      </div>
                    </CCardHeader>
                    <CCardBody style={{ padding: '2rem' }}>
                      {loadingSchedules ? (
                        <div className="text-center py-5">
                          <CSpinner color="primary" />
                          <p className="mt-3" style={{ color: '#64748b' }}>Loading schedule...</p>
                        </div>
                      ) : schedulesFiltered.length === 0 ? (
                        <div className="text-center py-5">
                          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📅</div>
                          <h5 style={{ color: '#64748b', marginBottom: '1rem' }}>
                            {scheduleFilter === 'all' ? 'No Schedule Available' : `No ${scheduleFilter} events`}
                          </h5>
                          <p style={{ color: '#94a3b8' }}>
                            {scheduleFilter === 'all'
                              ? 'The event schedule will be updated soon.'
                              : `No events found for “${scheduleFilter}”.`}
                          </p>
                        </div>
                      ) : (
                        <div>
                          {Object.entries(groupedSchedules).map(([date, dayList], idx, arr) => (
                            <div key={date} style={{ marginBottom: idx < arr.length - 1 ? '3rem' : 0 }}>
                              <div style={{
                                background: gradient,
                                color: 'white',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                boxShadow: `0 4px 15px ${color}30`
                              }}>
                                <CIcon icon={cilCalendar} className="me-2" />
                                {new Date(date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                                <CBadge color="light" className="ms-2" style={{ color: color, fontWeight: 600 }}>
                                  {dayList.length} event{dayList.length > 1 ? 's' : ''}
                                </CBadge>
                              </div>

                              <div style={{
                                background: 'rgba(255,255,255,0.8)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                border: '1px solid rgba(0,0,0,0.1)'
                              }}>
                                <CTable responsive hover style={{ margin: 0 }}>
                                  <CTableHead style={{ background: 'rgba(248,250,252,0.8)' }}>
                                    <CTableRow>
                                      <CTableHeaderCell style={{ border: 'none', padding: '1rem', fontWeight: 700, color: '#1e293b' }}>
                                        Time
                                      </CTableHeaderCell>
                                      <CTableHeaderCell style={{ border: 'none', padding: '1rem', fontWeight: 700, color: '#1e293b' }}>
                                        Event
                                      </CTableHeaderCell>
                                      <CTableHeaderCell style={{ border: 'none', padding: '1rem', fontWeight: 700, color: '#1e293b' }}>
                                        Speaker
                                      </CTableHeaderCell>
                                      <CTableHeaderCell style={{ border: 'none', padding: '1rem', fontWeight: 700, color: '#1e293b' }}>
                                        Description
                                      </CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {sortedByTime(dayList).map((s, i) => (
                                      <CTableRow
                                        key={s._id || i}
                                        style={{ borderLeft: `4px solid ${color}`, transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = `${color}08`
                                          e.currentTarget.style.transform = 'translateX(3px)'
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = 'transparent'
                                          e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                      >
                                        <CTableDataCell style={{ border: 'none', padding: '1.2rem 1rem' }}>
                                          <div style={{
                                            background: `${color}15`,
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            textAlign: 'center',
                                            border: `1px solid ${color}25`
                                          }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: color }}>
                                              {formatTime(s.startTime)}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                              {formatTime(s.endTime)}
                                            </div>
                                          </div>
                                        </CTableDataCell>
                                        <CTableDataCell style={{ border: 'none', padding: '1.2rem 1rem' }}>
                                          <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem', fontSize: '1rem' }}>
                                            {s.title || 'Untitled Event'}
                                          </h6>
                                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            <CIcon icon={cilClock} className="me-1" />
                                            Duration: {formatDuration(s.startTime, s.endTime)}
                                          </div>
                                        </CTableDataCell>
                                        <CTableDataCell style={{ border: 'none', padding: '1.2rem 1rem' }}>
                                          {s.speaker ? (
                                            <div className="d-flex align-items-center">
                                              <div style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                background: gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '0.8rem'
                                              }}>
                                                <CIcon icon={cilUser} style={{ color: 'white', fontSize: '0.9rem' }} />
                                              </div>
                                              <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                                                  {s.speaker}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Speaker</div>
                                              </div>
                                            </div>
                                          ) : (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>TBA</span>
                                          )}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ border: 'none', padding: '1.2rem 1rem' }}>
                                          {s.description ? (
                                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 0, maxWidth: '250px' }}>
                                              {s.description.length > 100 ? `${s.description.substring(0, 100)}…` : s.description}
                                            </p>
                                          ) : (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No description available</span>
                                          )}
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                  </CTableBody>
                                </CTable>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>

            {/* Details */}
            <CTabPane visible={activeTab === 'details'}>
              <CRow>
                <CCol lg={8}>
                  <CCard style={{
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <CCardHeader style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      border: 'none',
                      borderRadius: '20px 20px 0 0',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      padding: '1.5rem'
                    }}>
                      <CIcon icon={cilBuilding} className="me-2" />
                      Detailed Information
                    </CCardHeader>
                    <CCardBody style={{ padding: '2rem' }}>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '15px',
                            padding: '1.5rem',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div className="d-flex align-items-center mb-3">
                              <div style={{ background: color, borderRadius: '8px', padding: '0.5rem', marginRight: '0.75rem' }}>
                                <CIcon icon={cilCalendar} style={{ color: 'white' }} />
                              </div>
                              <h6 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Event Date</h6>
                            </div>
                            <p style={{ color: '#64748b', marginBottom: 0 }}>{formatDate(expo.date)}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '15px',
                            padding: '1.5rem',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div className="d-flex align-items-center mb-3">
                              <div style={{ background: color, borderRadius: '8px', padding: '0.5rem', marginRight: '0.75rem' }}>
                                <CIcon icon={cilLocationPin} style={{ color: 'white' }} />
                              </div>
                              <h6 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Location</h6>
                            </div>
                            <p style={{ color: '#64748b', marginBottom: 0 }}>{expo.location || 'TBA'}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '15px',
                            padding: '1.5rem',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div className="d-flex align-items-center mb-3">
                              <div style={{ background: color, borderRadius: '8px', padding: '0.5rem', marginRight: '0.75rem' }}>
                                <CIcon icon={cilBuilding} style={{ color: 'white' }} />
                              </div>
                            <h6 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Exhibition Floors</h6>
                            </div>
                            <p style={{ color: '#64748b', marginBottom: 0 }}>{expo.floors ?? 0} Floor{(expo.floors || 0) > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: '15px',
                            padding: '1.5rem',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div className="d-flex align-items-center mb-3">
                              <div style={{ background: color, borderRadius: '8px', padding: '0.5rem', marginRight: '0.75rem' }}>
                                <CIcon icon={cilClock} style={{ color: 'white' }} />
                              </div>
                              <h6 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Event Duration</h6>
                            </div>
                            <p style={{ color: '#64748b', marginBottom: 0 }}>
                              {formatDuration(expo.startTime, expo.endTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>

          {/* Booths */}
          <CCard className="mb-4" style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
            background: '#f3f4f6'
          }}>
            <CCardHeader style={{
              background: 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#1e293b',
              position: 'sticky',
              top: 0,
              zIndex: 2
            }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="mb-0 text-primary">Booths in this Expo</h5>
                  <small className="text-body-secondary">
                    All booths for: <strong>{booths[0]?.expo_id?.title || expo?.title || 'Expo'}</strong>
                  </small>
                </div>
                <div className="input-group" style={{ maxWidth: 320 }}>
                  <span className="input-group-text bg-white border-end-0">
                    <CIcon icon={cilSearch} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search booth, floor, status, exhibitor..."
                    value={boothSearch}
                    onChange={e => setBoothSearch(e.target.value)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  />
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {filteredBooths.length === 0 ? (
                <div className="text-center text-muted py-4">No booths found for this expo.</div>
              ) : (
                <CTable hover responsive style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                  <CTableHead>
                    <CTableRow style={{ background: '#e0e7ff' }}>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Booth #</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Floor</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Size</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Status</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Price</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Features</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Notes</CTableHeaderCell>
                      <CTableHeaderCell style={{ fontWeight: 700, color: '#1e293b', padding: '1rem' }}>Exhibitor</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredBooths.map((booth, idx) => (
                      <CTableRow
                        key={booth._id}
                        style={{
                          background: idx % 2 === 0 ? '#f9fafb' : '#fff',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#f9fafb' : '#fff'}
                      >
                        <CTableDataCell style={{ padding: '1rem' }}><strong>{booth.booth_number || '—'}</strong></CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>{booth.floor ?? '—'}</CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>
                          {(booth.length ?? '—')} x {(booth.width ?? '—')} {booth.size_unit || ''}
                        </CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>
                          <CBadge color={
                            booth.status === 'available' ? 'success' :
                            booth.status === 'reserved' ? 'warning' :
                            booth.status === 'booked' ? 'secondary' :
                            booth.status === 'under_maintenance' ? 'danger' : 'secondary'
                          } style={{
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            padding: '0.5em 1em',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px #e0e7ff55'
                          }}>
                            {booth.status ? (booth.status.charAt(0).toUpperCase() + booth.status.slice(1)) : '—'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>{formatPrice(booth.price)}</CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>
                          {booth.has_power && <CBadge color="info" className="me-1"><CIcon icon={cilBolt} /> Power</CBadge>}
                          {booth.has_wifi && <CBadge color="info" className="me-1"><CIcon icon={cilWifiSignal4} /> WiFi</CBadge>}
                          {booth.is_corner_booth && <CBadge color="warning" className="me-1"><CIcon icon={cilLocationPin} /> Corner</CBadge>}
                          {!booth.has_power && !booth.has_wifi && !booth.is_corner_booth && <span className="text-muted">—</span>}
                        </CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>{booth.notes || <span className="text-muted">—</span>}</CTableDataCell>
                        <CTableDataCell style={{ padding: '1rem' }}>
                          {booth.assigned_to ? (
                            <div style={{ minWidth: 180 }}>
                              <div style={{ fontWeight: 700, color: '#2563eb' }}>
                                {booth.assigned_to.company_name}
                              </div>
                              <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                                {booth.assigned_to.product_description}
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#059669', marginTop: '0.3rem' }}>
                                <CIcon icon={cilEnvelopeClosed} className="me-1" />
                                {booth.assigned_to.contact_info?.email}
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#0891b2' }}>
                                <CIcon icon={cilLocationPin} className="me-1" />
                                {booth.assigned_to.contact_info?.phone}
                              </div>
                              <CBadge color="success" className="mt-1" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                <CIcon icon={cilCheckCircle} className="me-1" />
                                Approved
                              </CBadge>
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontStyle: 'italic' }}>No exhibitor assigned</span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    )
  }

  export default ExpoDetail
