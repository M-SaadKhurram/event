import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilClock,
  cilGrid,
  cilPlus,
  cilHamburgerMenu,
  cilBuilding,
  cilCommentSquare, // Add feedback icon
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import { useAuth } from './context/AuthContext'
 
const useNavigation = () => {
  const { user } = useAuth()

  // Exhibitor-only navigation
  if (user?.role == 'Exhibitor') {
    return [
      {
        component: CNavGroup,
        name: 'Exhibitors',
        to: '/dashboard/exhibitor',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'All Exhibitors',
            to: '/dashboard/exhibitor',
          },
          {
            component: CNavItem,
            name: 'Add Exhibitor',
            to: '/dashboard/exhibitor/create',
            icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Feedback',
        to: '/dashboard/feedback',
        icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'User Feedback',
            to: '/dashboard/feedback',
          },
        ],
      },
    ]
  }

  // Admin (or other roles) navigation
  return [
    {
      component: CNavGroup,
      name: 'Expos',
      to: '/dashboard/expos',
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      items: [
        { component: CNavItem, name: 'All Expos', to: '/dashboard/expos' },
        {
          component: CNavItem,
          name: 'Add Expo',
          to: '/dashboard/expos/create',
          icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Booths',
      to: '/dashboard/booths',
      icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
      items: [
        { component: CNavItem, name: 'All Booths', to: '/dashboard/booths' },
        {
          component: CNavItem,
          name: 'Add Booth',
          to: '/dashboard/booths/create',
          icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Schedules',
      to: '/dashboard/schedules',
      icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
      items: [
        { component: CNavItem, name: 'All Schedules', to: '/dashboard/schedules' },
        {
          component: CNavItem,
          name: 'Add Schedule',
          to: '/dashboard/schedules/create',
          icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Attendees',
      to: '/dashboard/attendee',
      icon: <CIcon icon={cilHamburgerMenu} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All Attendees', to: '/dashboard/attendee' }],
    },
    {
      component: CNavGroup,
      name: 'Exhibitors',
      to: '/dashboard/exhibitor',
      icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      items: [
        { component: CNavItem, name: 'All Exhibitors', to: '/dashboard/exhibitor' },
        {
          component: CNavItem,
          name: 'Add Exhibitor',
          to: '/dashboard/exhibitor/create',
          icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Feedback',
      to: 'dashboard/feedback',
      icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'User Feedback',
          to: 'dashboard/feedback',
        },
      ],
    },
  ]
}

export default useNavigation
