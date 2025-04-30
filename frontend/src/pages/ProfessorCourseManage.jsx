import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Announcement from '../components/Announcement'
import AnnouncementModal from '../components/AnnouncementModal'

function ProfessorCourseManage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false)
  const IMPORTANCE_LEVELS = [
    { value: 0, label: 'Trival' },
    { value: 1, label: 'Minor' },
    { value: 2, label: 'Normal' },
    { value: 3, label: 'Major' },
    { value: 4, label: 'Critical' }
  ]

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

        const courseCode = 'CS301'

        const courseResponse = await axios.get(`http://localhost:8080/api/course/${courseCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCourse(courseResponse.data)
        const announcementsResponse = await axios.get(`http://localhost:8080/api/announcements`, {
          params: {
            courseCode: courseCode
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const formattedAnnouncements = announcementsResponse.data.map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          date: announcement.createdAt,
          author: 'Professor',
          importanceLevel: announcement.importanceLevel
        }))
        
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
  }, [courseId, navigate])

  const handleAddAnnouncement = (newAnnouncement) => {
    const updatedAnnouncements = [...announcements, newAnnouncement]
    updatedAnnouncements.sort((a, b) => b.importanceLevel - a.importanceLevel)
    setAnnouncements(updatedAnnouncements)
    setIsNewAnnouncementOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
            <button
              onClick={() => navigate('/professor/courses')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/professor/course')}
            className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-900"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48">
            <img className="w-full h-full object-cover" src={course.image ? course.image : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'} alt={course.name} />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-600 opacity-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{course.name}</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{course.code}</h2>
                <p className="text-gray-600">{course.academicYear}-{course.semester}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {course.students} students
              </div>
            </div>

            <p className="text-gray-700 mb-6">{course.description}</p>

            <div className="mb-6">
              <button
                onClick={() => setIsNewAnnouncementOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-bold font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Announcement
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Announcement key={announcement.id} importanceLevel={IMPORTANCE_LEVELS[announcement.importanceLevel]} announcement={announcement} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnnouncementModal
        isOpen={isNewAnnouncementOpen}
        onClose={() => setIsNewAnnouncementOpen(false)}
        onSubmit={handleAddAnnouncement}
        importanceLevels={IMPORTANCE_LEVELS}
        courseCode={'CS301'}
      />
    </div>
  )
}

export default ProfessorCourseManage 