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
          date: new Date(a.createdAt).toLocaleDateString(),
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

  if (isLoading) return <Loading />

  return (
    <div className="bg-gray-50 flex flex-col items-center pt-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
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
            announcements.map(a => (
              <div
                key={a.id}
                className={`flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition group ${!a.isRead ? 'bg-gray-50' : ''}`}
                onClick={() => handleOpenAnnouncement(a)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    {!a.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>}
                    <span className={`font-semibold truncate ${!a.isRead ? 'text-gray-900' : 'text-gray-500'}`}>{a.title}</span>
                    <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${a.isRead ? 'bg-gray-200 text-gray-500' : 'bg-indigo-100 text-indigo-600'}`}>{a.isRead ? 'Read' : 'Unread'}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1">{a.content}</div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{a.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* 公告详情弹窗 */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedAnnouncement(null)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedAnnouncement.title}</h2>
            <div className="text-xs text-gray-400 mb-4">{selectedAnnouncement.date}</div>
            <div className="text-gray-700 whitespace-pre-line mb-4">{selectedAnnouncement.content}</div>
            <div className="text-xs text-gray-500">Posted by: {selectedAnnouncement.author || 'Professor'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentCourseManage 