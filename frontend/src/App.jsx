import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentCourse from './pages/StudentCourse'
import Team from './pages/Team'
import Navbar from './components/Navbar'
import Loading from './components/Loading'
import ProfessorCourses from './pages/ProfessorCourses'
import StudentProfile from './pages/StudentProfile'
import StudentCourseManage from './pages/StudentCourseManage'
import StudentCourseTeamUp from './pages/StudentCourseTeamUp'
import StudentCourseMatch from './pages/StudentCourseMatch'
import StudentCourseInvitations from './pages/StudentCourseInvitations'
import NotFound from './pages/NotFound'
import ProfessorCourseManage from './pages/ProfessorCourseManage'
import ProfessorCourseTeamUp from './pages/ProfessorCourseTeamUp'
import ProfessorProfile from './pages/ProfessorProfile'
import ProfessorCourseAnnouncement from './pages/ProfessorCourseAnnouncement'

function NavbarWrapper({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation()
  const validPages = ['/login', '/register', '/student/course', '/student/teams', '/student/profile', '/student/course/:courseCode', '/student/course/:courseCode/match', '/student/course/:courseCode/team', '/student/course/:courseCode/invitations', '/professor/course', '/professor/course/:courseCode', '/professor/profile', '/professor/course/:courseCode/team', '/professor/course/:courseCode/announcement']
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isNotFoundPage = !validPages.some(page => {
    const pagePattern = page.replace(/:[^/]+/, '[^/]+')
    const regex = new RegExp(`^${pagePattern}$`)
    return regex.test(location.pathname)
  })
  
  if (isAuthPage || isNotFoundPage) {
    return null
  }
  
  return <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
}

function AnimatedRoutes({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation()

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student/course"
          element={
            <ProtectedRoute>
              <StudentCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseCode"
          element={
            <ProtectedRoute>
              <StudentCourseManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseCode/team"
          element={
            <ProtectedRoute>
              <StudentCourseTeamUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseCode/match"
          element={
            <ProtectedRoute>
              <StudentCourseMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:courseCode/invitations"
          element={
            <ProtectedRoute>
              <StudentCourseInvitations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/course"
          element={
            <ProtectedRoute>
              <ProfessorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/course/:courseCode"
          element={
            <ProtectedRoute>
              <ProfessorCourseManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/course/:courseCode/announcement"
          element={
            <ProtectedRoute>
              <ProfessorCourseAnnouncement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/course/:courseCode/team"
          element={
            <ProtectedRoute>
              <ProfessorCourseTeamUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/profile"
          element={
            <ProtectedRoute>
              <ProfessorProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const navigate = useNavigate()

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      if (token && role) {
        setIsLoggedIn(true)
      }
      setIsLoading(false)
    }

    checkLoginStatus()
  }, [isAuthPage])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${!isAuthPage ? 'pt-16' : ''}`}>
      <NavbarWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <AnimatedRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
