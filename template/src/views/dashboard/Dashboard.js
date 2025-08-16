import React, { useContext } from 'react'
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilCalendar, cilBuilding, cilStar } from '@coreui/icons'
import { useAuth } from '../../context/AuthContext'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  const { user } = useAuth()

  // Example stats, replace with API data
  const stats = [
    { label: 'Total Expos', value: 12, icon: cilCalendar, color: 'primary' },
    { label: 'Booths', value: 48, icon: cilBuilding, color: 'info' },
    { label: 'Attendees', value: 320, icon: cilUser, color: 'success' },
    { label: 'Exhibitors', value: 24, icon: cilStar, color: 'warning' },
  ]

  // Example table data, replace with API data
  const recentExpos = [
    { title: 'Tech Innovators Expo', date: '2025-08-10', booths: 20, status: 'Ongoing' },
    { title: 'Health & Wellness Fair', date: '2025-07-22', booths: 15, status: 'Completed' },
    { title: 'Food & Beverage Summit', date: '2025-09-05', booths: 13, status: 'Upcoming' },
  ]

  return (
    <div>
      {/* Welcome & Role */}
      <CCard className="mb-4" style={{ borderRadius: '18px', background: 'linear-gradient(135deg,#2563eb15,#6366f110)' }}>
        <CCardBody>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h2 style={{ fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                <CIcon icon={cilSpeedometer} className="me-2" style={{ color: '#2563eb', fontSize: '2rem' }} />
                Welcome{user?.name ? `, ${user.name}` : ''}
              </h2>
              <CBadge color="info" style={{ fontSize: '1rem', borderRadius: '8px', padding: '0.5em 1em', fontWeight: 600, color:'white', background: '#e0f2fe' }}>
                {user?.role || 'User'}
              </CBadge>
            </div>
           
          </div>
        </CCardBody>
      </CCard>

      {/* Stats Widgets */}
      <CRow className="mb-4">
        {stats.map((stat, idx) => (
          <CCol key={stat.label} xs={12} sm={6} lg={3}>
            <CCard style={{ borderRadius: '16px', boxShadow: '0 4px 16px #2563eb11' }}>
              <CCardBody className="d-flex align-items-center gap-3">
                <div style={{
                  background: `var(--cui-${stat.color}-bg, #2563eb22)`,
                  borderRadius: '50%',
                  padding: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color:'white',
                }}>
                  <CIcon icon={stat.icon} style={{ color: `var(--cui-${stat.color}, #2563eb)`, fontSize: '1.7rem' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.3rem', color:'white' }}>{stat.value}</div>
                  <div style={{ color: '#475569', fontWeight: 500 }}>{stat.label}</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Main Chart */}
      <CCard className="mb-4" style={{ borderRadius: '18px' }}>
        <CCardHeader style={{ fontWeight: 700, fontSize: '1.1rem', background: '#f3f4f6' ,color:'#1f2937'}}>
          Expo Attendance Overview
        </CCardHeader>
        <CCardBody>
          <MainChart />
        </CCardBody>
      </CCard>

      {/* Recent Expos Table */}
      <CCard className="mb-4" style={{ borderRadius: '18px' }}>
        <CCardHeader style={{ fontWeight: 700, fontSize: '1.1rem', background: '#f3f4f6'
          ,color:'#1f2937'
         }}>
          Recent Expos
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Booths</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {recentExpos.map((expo, idx) => (
                <CTableRow key={expo.title}>
                  <CTableDataCell>{expo.title}</CTableDataCell>
                  <CTableDataCell>{expo.date}</CTableDataCell>
                  <CTableDataCell>{expo.booths}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={
                      expo.status === 'Ongoing' ? 'success' :
                      expo.status === 'Completed' ? 'secondary' :
                      expo.status === 'Upcoming' ? 'warning' : 'info'
                    } style={{ fontWeight: 600 }}>
                      {expo.status}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Dashboard
