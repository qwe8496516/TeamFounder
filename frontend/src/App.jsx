import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/Login'
import Register from './pages/Register'
import Match from './pages/MatchList'
import StudentCourse from './pages/StudentCourse'
import Team from './pages/Team'
import Navbar from './components/Navbar'
import Loading from './components/Loading'
import ProfessorCourses from './pages/ProfessorCourses'
import StudentProfile from './pages/StudentProfile'
import NotFound from './pages/NotFound'
import ProfessorCourseManage from './pages/ProfessorCourseManage'
import ProfessorProfile from './pages/ProfessorProfile'

function NavbarWrapper({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation()
  const validPages = ['/login', '/register', '/student/match', '/student/course', '/student/teams', '/student/profile', '/professor/course', '/professor/courses/:courseId', '/professor/profile']
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isNotFoundPage = !validPages.includes(location.pathname)
  
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
          path="/student/match"
          element={
            <ProtectedRoute>
              <Match />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course"
          element={
            <ProtectedRoute>
              <StudentCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/teams"
          element={
            <ProtectedRoute>
              <Team />
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
          path="/professor/course"
          element={
            <ProtectedRoute>
              <ProfessorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/courses/:courseId"
          element={
            <ProtectedRoute>
              <ProfessorCourseManage />
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-gray-50 ${ isLoggedIn ? 'pt-16' : 'pt-0'}`}>
        <NavbarWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <AnimatedRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
    </BrowserRouter>
  )
}

export default App
