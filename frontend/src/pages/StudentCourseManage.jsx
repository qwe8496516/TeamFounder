import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'

// Constants
const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
]

const IMPORTANCE_LEVELS = [
  { value: 0, label: 'Trival', color: 'gray' },
  { value: 1, label: 'Minor', color: 'blue' },
  { value: 2, label: 'Normal', color: 'green' },
  { value: 3, label: 'Major', color: 'yellow' },
  { value: 4, label: 'Critical', color: 'red' }
]

// Components
const CourseInfoCard = ({ course }) => (
  <div className="hidden md:block w-full md:w-96 flex-shrink-0">
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col group">
      <div className="relative w-full h-40">
        <img 
          className="w-full h-full object-cover" 
          src={course.image} 
          alt={course.name} 
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>
        <span className="absolute top-4 right-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {course.courseCode}
        </span>
        <div className="absolute bottom-0 left-0 w-full px-4 pb-3">
          <h1 className="text-xl font-bold text-white drop-shadow mb-1">{course.name}</h1>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <InfoItem 
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          label="Semester"
          value={`${course.academicYear}-${course.semester}`}
        />
        <InfoItem 
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          label="Students"
          value={course.students}
        />
        <InfoItem 
          icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          label="Announcements"
          value={course.announcements?.length || 0}
        />
        <div className="border-t border-gray-200 my-2"></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H7a1 1 0 00-1 1v14a1 1 0 001 1h3" />
            </svg>
            <span className="text-gray-700 font-semibold">Description</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-5">{course.description}</p>
        </div>
      </div>
    </div>
  </div>
)

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
    </svg>
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="ml-auto font-semibold text-gray-900">{value}</span>
  </div>
)

const ImportanceTag = ({ level }) => {
  const importanceLevel = IMPORTANCE_LEVELS.find(l => l.value === level) || IMPORTANCE_LEVELS[0]
  return (
    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium transition-all duration-300 bg-${importanceLevel.color}-100 text-${importanceLevel.color}-600`}>
      {importanceLevel.label}
    </span>
  )
}

const AnnouncementItem = ({ announcement, onClick }) => (
  <div 
    className={`announcement-item flex items-center px-6 py-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 group ${
      !announcement.isRead ? 'bg-gray-50 hover:shadow-md' : ''
    } hover:translate-y-[-2px]`}
    onClick={() => onClick(announcement)}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center">
        {!announcement.isRead && (
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse"></span>
        )}
        <span className={`font-semibold truncate transition-colors duration-200 ${
          !announcement.isRead ? 'text-gray-900 group-hover:text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
        }`}>{announcement.title}</span>
        <ImportanceTag level={announcement.importanceLevel} />
      </div>
      <div className="text-xs text-gray-400 truncate mt-1 transition-colors duration-200 group-hover:text-gray-600">
        {announcement.content}
      </div>
    </div>
    <div className="ml-4 flex flex-col items-end justify-between h-full min-h-[40px]">
      <span className={`px-2 py-0.5 rounded text-xs font-medium mb-auto transition-all duration-300 ${
        announcement.isRead 
          ? 'bg-gray-200 text-gray-500 group-hover:bg-gray-300' 
          : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
      }`}>{announcement.isRead ? 'Read' : 'Unread'}</span>
      <span className="text-xs text-gray-400 mt-auto whitespace-nowrap transition-colors duration-200 group-hover:text-gray-600">
        {announcement.date}
      </span>
    </div>
  </div>
)

const AnnouncementModal = ({ announcement, onClose }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-gray-200 animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
      </div>
      <h2 className="text-2xl font-bold mb-1 break-words transition-colors duration-200 hover:text-indigo-600">
        {announcement.title}
      </h2>
      <div className="text-xs text-gray-500 mb-4">
        Posted by: {announcement.author || 'Professor'}
      </div>
      <div className="text-gray-700 whitespace-pre-line mb-6 border-t border-b py-6 border-gray-100 text-base leading-relaxed transition-all duration-300 hover:bg-gray-50">
        {announcement.content}
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded text-xs font-semibold shadow-sm transition-all duration-300 ${
          announcement.isRead 
            ? 'bg-gray-200 text-gray-500' 
            : 'bg-indigo-100 text-indigo-600'
        }`}>
          {announcement.isRead ? 'Read' : 'Unread'}
        </span>
        <span className="text-xs text-gray-400">{announcement.date}</span>
      </div>
    </div>
  </div>
)

// Main Component
function StudentCourseManage() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  // State
  const [course, setCourse] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = announcements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(announcements.length / itemsPerPage)

  // Effects
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const container = document.querySelector('.divide-y')
      if (!container) return

      const firstAnnouncementElement = container.querySelector('.announcement-item')
      if (!firstAnnouncementElement) {
        setItemsPerPage(5)
        return
      }

      const itemHeight = firstAnnouncementElement.offsetHeight
      const containerHeight = container.clientHeight
      
      const items = Math.floor(containerHeight / itemHeight)
      setItemsPerPage(Math.max(1, items))
    }

    calculateItemsPerPage()
    window.addEventListener('resize', calculateItemsPerPage)
    if (announcements.length > 0) {
      calculateItemsPerPage()
    }

    return () => window.removeEventListener('resize', calculateItemsPerPage)
  }, [announcements])

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

        const [courseResponse, announcementsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/course/${courseCode}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8080/api/announcements`, {
            params: { courseCode },
            headers: { Authorization: `Bearer ${token}` }
          })
        ])
        
        const courseWithImage = {
          ...courseResponse.data,
          image: COURSE_IMAGES[
            Array.from(courseCode).reduce((acc, char) => acc + char.charCodeAt(0), 0) % COURSE_IMAGES.length
          ]
        }
        
        const formattedAnnouncements = announcementsResponse.data.map(a => ({
          ...a,
          date: new Date(a.createdAt).toISOString().slice(0, 10),
          isRead: a.isRead || false
        }))
        
        formattedAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        setCourse(courseWithImage)
        setAnnouncements(formattedAnnouncements)
      } catch (err) {
        console.error('Error fetching course data:', err)
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

  // Handlers
  const handleOpenAnnouncement = async (announcement) => {
    setSelectedAnnouncement(announcement)
    if (!announcement.isRead) {
      try {
        const token = localStorage.getItem('token')
        await axios.post(`http://localhost:8080/api/announcements/${announcement.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAnnouncements(prev => prev.map(a => a.id === announcement.id ? { ...a, isRead: true } : a))
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to mark as read',
          confirmButtonColor: '#4f46e5'
        })
      }
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render helpers
  const renderPagination = () => (
    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-4">
      <div className="flex flex-1 justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )

  if (isLoading) return <Loading />

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
    <div className="bg-gray-50 flex flex-col items-center pt-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
        <CourseInfoCard course={course} />

        {/* Announcements List */}
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-center items-center px-6 py-4 border-b border-gray-200">
              <div className="text-lg font-bold text-gray-700">Announcements</div>
            </div>
            <div className="divide-y divide-gray-100 h-[calc(100vh-16rem)] overflow-y-auto">
              {announcements.length === 0 ? (
                <div className="p-8">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No announcements</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no announcements for this course yet.
                    </p>
                  </div>
                </div>
              ) : (
                currentItems.map(announcement => (
                  <AnnouncementItem 
                    key={announcement.id}
                    announcement={announcement}
                    onClick={handleOpenAnnouncement}
                  />
                ))
              )}
            </div>
            {announcements.length > 0 && renderPagination()}
          </div>
        </div>
      </div>

      {selectedAnnouncement && (
        <AnnouncementModal 
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  )
}

export default StudentCourseManage 