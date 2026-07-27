import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Courses from './pages/Courses'
import TestSeries from './pages/TestSeries'
import PDFLibrary from './pages/PDFLibrary'
import VideoLectures from './pages/VideoLectures'
import Notes from './pages/Notes'
import PracticeSets from './pages/PracticeSets'
import CurrentAffairs from './pages/CurrentAffairs'
import PreviousPapers from './pages/PreviousPapers'
import About from './pages/About'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import StudentDashboard from './pages/StudentDashboard'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

function PageWrapper({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
            <Route path="/test-series" element={<PageWrapper><TestSeries /></PageWrapper>} />
            <Route path="/pdf-library" element={<PageWrapper><PDFLibrary /></PageWrapper>} />
            <Route path="/video-lectures" element={<PageWrapper><VideoLectures /></PageWrapper>} />
            <Route path="/notes" element={<PageWrapper><Notes /></PageWrapper>} />
            <Route path="/practice-sets" element={<PageWrapper><PracticeSets /></PageWrapper>} />
            <Route path="/current-affairs" element={<PageWrapper><CurrentAffairs /></PageWrapper>} />
            <Route path="/previous-papers" element={<PageWrapper><PreviousPapers /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageWrapper><StudentDashboard /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <PageWrapper><AdminPanel /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
