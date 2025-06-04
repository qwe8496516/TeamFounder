import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Announcement from '../components/Announcement'
import AnnouncementModal from '../components/AnnouncementModal'
import Loading from '../components/Loading'

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
        const announcementsResponse = await axios.get(`http://localhost:8080/api/announcements`, {
          params: {
            courseCode: courseCode
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const formattedAnnouncements = announcementsResponse.data.map(announcement => {
          const timestamp = new Date(announcement.createdAt).getTime()
          return {
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            date: new Date(announcement.createdAt).toISOString().split('T')[0],
            timestamp: timestamp,
            author: 'Professor',
            importanceLevel: announcement.importanceLevel
          }
        })
        
        formattedAnnouncements.sort((a, b) => {
          const importanceDiff = b.importanceLevel - a.importanceLevel
          if (importanceDiff !== 0) {
            return importanceDiff
          }
          return b.timestamp - a.timestamp
        })
        
        console.log('Sorted announcements:', formattedAnnouncements)
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

  const handleAddAnnouncement = (newAnnouncement) => {
    const now = new Date()
    const timestamp = now.getTime()
    const formattedAnnouncement = {
      ...newAnnouncement,
      date: now.toISOString().split('T')[0],
      timestamp: timestamp,
      author: 'Professor'
    }
    console.log('New announcement timestamp:', timestamp)
    
    const updatedAnnouncements = [...announcements, formattedAnnouncement]
    updatedAnnouncements.sort((a, b) => {
      const importanceDiff = b.importanceLevel - a.importanceLevel
      if (importanceDiff !== 0) {
        return importanceDiff
      }
      return b.timestamp - a.timestamp
    })
    
    console.log('Updated announcements:', updatedAnnouncements)
    setAnnouncements(updatedAnnouncements)
    setIsNewAnnouncementOpen(false)
  }

  if (isLoading) {
    return (
      <Loading />
    )
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-8">
        <div className="hidden md:block w-full md:w-96 flex-shrink-0 mb-8 md:mb-0">
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
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-gray-500 text-sm">Semester</span>
                <span className="ml-auto font-semibold text-gray-900">{course.academicYear}-{course.semester}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="text-gray-500 text-sm">Students</span>
                <span className="ml-auto font-semibold text-gray-900">{course.students}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                <span className="text-gray-500 text-sm">Announcements</span>
                <span className="ml-auto font-semibold text-gray-900">{announcements.length}</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H7a1 1 0 00-1 1v14a1 1 0 001 1h3" /></svg>
                  <span className="text-gray-700 font-semibold">Description</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-5">{course.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div className="text-lg font-bold text-gray-700">Announcements</div>
              <button
                onClick={() => setIsNewAnnouncementOpen(true)}
                className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </div>
            <div className="divide-y divide-gray-100">
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
                announcements.map((announcement) => (
                  <div key={announcement.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900 mr-2">{announcement.title}</span>
                      <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-500">{announcement.date}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 mb-2">{announcement.content}</div>
                    <div className="text-xs text-gray-500">Posted by: {announcement.author || 'Professor'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <AnnouncementModal
        isOpen={isNewAnnouncementOpen}
        onClose={() => setIsNewAnnouncementOpen(false)}
        onSubmit={handleAddAnnouncement}
        importanceLevels={IMPORTANCE_LEVELS}
        courseCode={courseCode}
      />
    </div>
  )
}

export default ProfessorCourseManage 