import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Match from './pages/MatchList'
import Course from './pages/Course'
import Team from './pages/Team'
import Navbar from './components/Navbar'
import Loading from './components/Loading'
import ProfessorCourses from './pages/ProfessorCourses'
import StudentProfile from './pages/StudentProfile'
import NotFound from './pages/NotFound'
import ProfessorCourseManage from './pages/ProfessorCourseManage'

function NavbarWrapper({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isNotFoundPage = location.pathname === '/404' || location.pathname === '*'
  
  useEffect(() => {
  }, [location.pathname])
  
  if (isAuthPage || isNotFoundPage) {
    return null
  }
  
  return <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavbarWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
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
                <Course />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
