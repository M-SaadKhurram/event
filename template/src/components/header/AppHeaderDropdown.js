import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilUser, cilSettings, cilLockLocked } from '@coreui/icons' // add cilLockLocked
import CIcon from '@coreui/icons-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import avatar10 from './../../assets/images/avatars/10.jpg'

const AppHeaderDropdown = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleChangePassword = () => {
    navigate('/dashboard/change-password') // assumes you have a route for this
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar10} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 pr-5 w-auto">
        <CDropdownHeader className="bg-body-secondary fw-semibold py-2 px-3">
          {user?.name || 'Account'}
        </CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          {user?.email}
        </CDropdownItem>
        <CDropdownItem>
          <strong>Role:</strong> {user?.role}
        </CDropdownItem>
        <CDropdownItem onClick={handleChangePassword}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Change Password
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown