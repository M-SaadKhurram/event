// Create: src/layout/PublicLayout.js
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import PublicHeader from '../components/PublicHeader'

// Lazy load public pages
const Home = React.lazy(() => import('../views/pages/home/Home'))
const About = React.lazy(() => import('../views/pages/home/About'))
const Contact = React.lazy(() => import('../views/pages/home/Contact'))
const Feedback = React.lazy(() => import('../views/pages/home/Feedback'))
const ExpoDetail= React.lazy(() => import('../views/pages/expo/ExpoDetail'))
const PublicLayout = () => {
  return (
    <div>
      <PublicHeader />
      <main>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="expo/:id" element={<ExpoDetail />} />
            {/* Add more public routes as needed */}
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default PublicLayout