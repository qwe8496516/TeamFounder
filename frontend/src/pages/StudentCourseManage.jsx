import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'

function StudentCourseManage() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = announcements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(announcements.length / itemsPerPage)

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const container = document.querySelector('.divide-y');
      if (!container) return;

      const firstAnnouncementElement = container.querySelector('.announcement-item');
      if (!firstAnnouncementElement) {
        setItemsPerPage(5);
        return;
      }

      const itemHeight = firstAnnouncementElement.offsetHeight;
      const containerHeight = container.clientHeight;
      
      const items = Math.floor(containerHeight / itemHeight);
      console.log(Math.floor(containerHeight / itemHeight));
      setItemsPerPage(Math.max(1, items));
    };

    calculateItemsPerPage();

    window.addEventListener('resize', calculateItemsPerPage);
    if (announcements.length > 0) {
      calculateItemsPerPage();
    }

    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, [announcements]); 

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
        const response = await axios.get(`http://localhost:8080/api/announcements`, {
          params: { courseCode },
          headers: { Authorization: `Bearer ${token}` }
        })
        
        const formatted = response.data.map(a => ({
          ...a,
          date: new Date(a.createdAt).toISOString().slice(0, 10),
          isRead: a.isRead || false
        }))
        formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setAnnouncements(formatted)
      } catch (err) {
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

  return (
    <div className="bg-gray-50 flex flex-col items-center pt-8 ">
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
            currentItems.map(a => (
              <div
                key={a.id}
                className={`announcement-item flex items-center px-6 py-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 group ${
                  !a.isRead ? 'bg-gray-50 hover:shadow-md' : ''
                } hover:translate-y-[-2px]`}
                onClick={() => handleOpenAnnouncement(a)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    {!a.isRead && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse"></span>
                    )}
                    <span className={`font-semibold truncate transition-colors duration-200 ${
                      !a.isRead ? 'text-gray-900 group-hover:text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`}>{a.title}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1 transition-colors duration-200 group-hover:text-gray-600">{a.content}</div>
                </div>
                <div className="ml-4 flex flex-col items-end justify-between h-full min-h-[40px]">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium mb-auto transition-all duration-300 ${
                    a.isRead 
                      ? 'bg-gray-200 text-gray-500 group-hover:bg-gray-300' 
                      : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
                  }`}>{a.isRead ? 'Read' : 'Unread'}</span>
                  <span className="text-xs text-gray-400 mt-auto whitespace-nowrap transition-colors duration-200 group-hover:text-gray-600">{a.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {announcements.length > 0 && renderPagination()}
      </div>

      {selectedAnnouncement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-gray-200 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
            </div>
            <h2 className="text-2xl font-bold mb-1 break-words transition-colors duration-200 hover:text-indigo-600">{selectedAnnouncement.title}</h2>
            <div className="text-xs text-gray-500 mb-4">Posted by: {selectedAnnouncement.author || 'Professor'}</div>
            <div className="text-gray-700 whitespace-pre-line mb-6 border-t border-b py-6 border-gray-100 text-base leading-relaxed transition-all duration-300 hover:bg-gray-50">{selectedAnnouncement.content}</div>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded text-xs font-semibold shadow-sm transition-all duration-300 ${
                  selectedAnnouncement.isRead 
                    ? 'bg-gray-200 text-gray-500' 
                    : 'bg-indigo-100 text-indigo-600'
              }`}>{selectedAnnouncement.isRead ? 'Read' : 'Unread'}</span>
              <span className="text-xs text-gray-400">{selectedAnnouncement.date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentCourseManage 