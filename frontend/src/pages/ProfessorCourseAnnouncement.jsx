import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import AnnouncementModal from '../components/AnnouncementModal'
import { motion } from 'framer-motion'

const IMPORTANCE_LEVELS = [
  { value: 0, label: 'Trival' },
  { value: 1, label: 'Minor' },
  { value: 2, label: 'Normal' },
  { value: 3, label: 'Major' },
  { value: 4, label: 'Critical' }
]

function ProfessorCourseAnnouncement() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  // State
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = announcements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(announcements.length / itemsPerPage)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(3)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4)
      } else {
        setItemsPerPage(5)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchAnnouncements = async () => {
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
          date: new Date(announcement.createdAt).toISOString().split('T')[0],
          timestamp: new Date(announcement.createdAt).getTime(),
          author: 'Professor',
          importanceLevel: announcement.importanceLevel
        }))
        
        formattedAnnouncements.sort((a, b) => {
          const importanceDiff = b.importanceLevel - a.importanceLevel
          if (importanceDiff !== 0) return importanceDiff
          return b.timestamp - a.timestamp
        })
        
        setAnnouncements(formattedAnnouncements)
      } catch (err) {
        console.error('Error fetching announcements:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load announcements',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [courseCode, navigate])

  const handleAddAnnouncement = (newAnnouncement) => {
    const now = new Date()
    const formattedAnnouncement = {
      ...newAnnouncement,
      date: now.toISOString().split('T')[0],
      timestamp: now.getTime(),
      author: 'Professor'
    }
    
    const updatedAnnouncements = [...announcements, formattedAnnouncement]
    updatedAnnouncements.sort((a, b) => {
      const importanceDiff = b.importanceLevel - a.importanceLevel
      if (importanceDiff !== 0) return importanceDiff
      return b.timestamp - a.timestamp
    })
    
    setAnnouncements(updatedAnnouncements)
    setIsNewAnnouncementOpen(false)
  }

  const handleOpenAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="bg-gray-50 flex flex-col items-center pt-8">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
          <Link
            to={`/professor/course/${courseCode}`}
            className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
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
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-white text-gray-900 shadow-sm"
            aria-current="page"
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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div className="text-xl font-bold text-gray-700">Announcements</div>
              <button
                onClick={() => setIsNewAnnouncementOpen(true)}
                className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Announcement
              </button>
            </div>
            <div className="h-[425px]">
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
                  currentItems.map((announcement) => (
                    <div 
                      key={announcement.id} 
                      className="px-6 py-4 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md rounded-lg cursor-pointer transform"
                      onClick={() => handleOpenAnnouncement(announcement)}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                            {announcement.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium transition-all duration-300 ${
                            announcement.importanceLevel === 0 ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' :
                            announcement.importanceLevel === 1 ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' :
                            announcement.importanceLevel === 2 ? 'bg-green-100 text-green-600 hover:bg-green-200' :
                            announcement.importanceLevel === 3 ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' :
                            'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}>
                            {IMPORTANCE_LEVELS.find(level => level.value === announcement.importanceLevel)?.label || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-800 max-w-[70%] line-clamp-1">
                            {announcement.content}
                          </div>
                          <span className="text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-700">
                            {announcement.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {announcements.length > 0 && renderPagination()}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnnouncementModal
        isOpen={isNewAnnouncementOpen}
        onClose={() => setIsNewAnnouncementOpen(false)}
        onSubmit={handleAddAnnouncement}
        importanceLevels={IMPORTANCE_LEVELS}
        courseCode={courseCode}
      />

      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border border-gray-200 animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedAnnouncement.title}</h2>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 hover:rotate-90"
                onClick={() => setSelectedAnnouncement(null)}
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line mb-6 border-t border-b py-6 border-gray-100 text-base leading-relaxed">
              {selectedAnnouncement.content}
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                selectedAnnouncement.importanceLevel === 0 ? 'bg-gray-100 text-gray-600' :
                selectedAnnouncement.importanceLevel === 1 ? 'bg-blue-100 text-blue-600' :
                selectedAnnouncement.importanceLevel === 2 ? 'bg-green-100 text-green-600' :
                selectedAnnouncement.importanceLevel === 3 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {IMPORTANCE_LEVELS.find(level => level.value === selectedAnnouncement.importanceLevel)?.label || 'Unknown'}
              </span>
              <span className="text-xs text-gray-500">{selectedAnnouncement.date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessorCourseAnnouncement 