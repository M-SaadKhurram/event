import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../context/AuthContext' // Add this import

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import useNavigation from '../_nav' // <-- change import name
import Dashboard from '../views/dashboard/Dashboard'
import { cilSpeedometer } from '@coreui/icons'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user } = useAuth() // Get user from context
  const navigation = useNavigation() // <-- call the hook to get nav items

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      style={{
        minHeight: '100vh',
        boxShadow: '0 8px 24px rgba(37,99,235,0.08)',
      }}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom" style={{ padding: '1.2rem 1.5rem', background: 'rgba(30,41,59,0.95)' }}>
        <CSidebarBrand to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
          <CIcon icon={cilSpeedometer} height={32} className="sidebar-brand-full" />
          {user?.role && (
            <span style={{
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 600,
              marginLeft: '1rem',
            }}>
              {user.role} Dashboard
            </span>
          )}
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} style={{ marginLeft: 'auto', color: '#6366f1' }} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AppSidebarNav items={navigation} /> {/* pass the array, not the function */}
      </div>
      <CSidebarFooter className="border-top d-none d-lg-flex" style={{ background: 'rgba(30,41,59,0.95)' }}>
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
          style={{ color: '#38bdf8', fontSize: '1.2rem' }}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
