import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function ProfessorCourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockCourse = {
          id: parseInt(courseId),
          name: 'Web Development',
          code: 'CS101',
          semester: 'Spring 2024',
          students: 45,
          description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.'
        }

        const mockAnnouncements = [
          {
            id: 1,
            title: 'Midterm Exam Schedule',
            content: 'The midterm exam will be held on March 15th at 2:00 PM in Room 101.',
            date: '2024-03-01',
            author: 'Professor Smith'
          },
          {
            id: 2,
            title: 'Project Submission Deadline',
            content: 'The final project submission deadline has been extended to March 20th.',
            date: '2024-03-05',
            author: 'Professor Smith'
          }
        ]

        setCourse(mockCourse)
        setAnnouncements(mockAnnouncements)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const handleSubmitAnnouncement = (e) => {
    e.preventDefault()
    const newAnnouncementObj = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date().toISOString().split('T')[0],
      author: 'Professor Smith'
    }
    setAnnouncements([newAnnouncementObj, ...announcements])
    setNewAnnouncement({ title: '', content: '' })
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/professor/course"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{course.name}</h1>
          <p className="text-gray-600 mt-2">{course.code} - {course.semester}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Management</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Assignment
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Grade Submissions
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View Students
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Announcements</h2>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => document.getElementById('announcement-modal').classList.remove('hidden')}
                >
                  New Announcement
                </button>
              </div>

              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{announcement.content}</p>
                    <p className="mt-2 text-sm text-gray-500">Posted by {announcement.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="announcement-modal" className="hidden fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitAnnouncement}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      rows="4"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Post Announcement
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => document.getElementById('announcement-modal').classList.add('hidden')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessorCourseDetail 