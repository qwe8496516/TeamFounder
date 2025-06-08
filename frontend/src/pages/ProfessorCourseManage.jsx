import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'

const courseImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
]

function ProfessorCourseManage() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  // State
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [announcementCount, setAnnouncementCount] = useState(0)
  const [isTeamUpEnabled, setIsTeamUpEnabled] = useState(false)
  const [couserStatus, setCouserStatus] = useState(0)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please login first',
            confirmButtonColor: '#4f46e5'
          }).then(() => {
            navigate('/login')
          })
          return
        }

        const courseResponse = await axios.get(`http://localhost:8080/api/course/${courseCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const courseWithImage = {
          ...courseResponse.data,
          image: courseImages[
            Array.from(courseCode).reduce((acc, char) => acc + char.charCodeAt(0), 0) % courseImages.length
          ]
        }
        
        setCourse(courseWithImage)
        setIsTeamUpEnabled(courseResponse.data.teamStatus)
        setCouserStatus(courseResponse.data.courseStatus)

        const announcementsResponse = await axios.get(`http://localhost:8080/api/announcements/${courseCode}/count`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAnnouncementCount(announcementsResponse.data)

      } catch (err) {
        console.error('Error fetching data:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load course information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseCode, navigate])

  if (isLoading) {
    return <Loading />
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <Link
              to={`/professor/course/${courseCode}`}
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-white text-gray-900 shadow-sm"
              aria-current="page"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Course Info</span>
              </div>
            </Link>
            <Link
              to={`/professor/course/${courseCode}/announcement`}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Announcements</span>
              </div>
            </Link>
            <Link
              to={`/professor/course/${courseCode}/team`}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Team Up</span>
              </div>
            </Link>
          </nav>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Course Info Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Course Header */}
            <div className="relative h-80">
              <div className="absolute inset-0">
                <img 
                  className="w-full h-full object-cover" 
                  src={course.image} 
                  alt={course.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
              </div>
              <div className="relative h-full px-8 py-12 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gray-600 rounded-full shadow-lg">
                      {course.courseCode}
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-white">{course.name}</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-base text-gray-300">Academic Year</p>
                      <p className="text-lg font-semibold text-white">{course.academicYear}</p>
                    </div>
                    <div className="h-12 w-px bg-white/20"></div>
                    <div className="text-right">
                      <p className="text-base text-gray-300">Semester</p>
                      <p className="text-lg font-semibold text-white">{course.semester}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Course Overview
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-600">Students</span>
                        </div>
                        <div className="min-w-[100px] flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-900">{course.students}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                          </div>
                          <span className="text-gray-600">Announcements</span>
                        </div>
                        <div className="min-w-[100px] flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-900">{announcementCount}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-600">Team Status</span>
                        </div>
                        <div className="min-w-[100px] flex items-center justify-center">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            isTeamUpEnabled 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-red-700 bg-red-100'
                          }`}>
                            {isTeamUpEnabled ? 'OPEN' : 'CLOSED' }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-600">Status</span>
                        </div>
                        <div className="min-w-[100px] flex items-center justify-center">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            couserStatus === 0 
                              ? 'text-green-700 bg-green-100' 
                              : couserStatus === 1
                              ? 'text-red-700 bg-red-100'
                              : 'text-gray-700 bg-gray-100'
                          }`}>
                            {couserStatus === 0 
                              ? 'ACTIVE' 
                              : couserStatus === 1
                              ? 'INACTIVE'
                              : 'ARCHIVED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      Course Description
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{course.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfessorCourseManage 