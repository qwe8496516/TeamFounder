import { useState, useEffect } from 'react'

function AnnouncementModal({ isOpen, onClose, onSubmit, courseCode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    importance: 'Normal',
  })

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      // When isOpen becomes false, start closing animation
      setTimeout(() => setIsVisible(false), 300)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleSubmit = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      onSubmit(newAnnouncement)
      setNewAnnouncement({ title: '', content: '', importance: 'Normal' })
      handleClose()
    }
  }

  if (!isOpen && !isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`relative w-full max-w-xl mx-auto bg-white text-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 transition-all duration-300 ease-in-out
        ${isOpen && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Centered Title */}
        <h2 className="text-2xl font-bold mb-2 text-center mt-2">Create Announcement</h2>
        {courseCode && (
          <div className="mb-6 text-blue-600 font-semibold text-lg text-center">Course: {courseCode}</div>
        )}
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold mb-1 text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Type announcement title"
            />
          </div>
          <div>
            <label htmlFor="importance" className="block text-sm font-semibold mb-1 text-gray-700">Importance Level</label>
            <select
              id="importance"
              value={newAnnouncement.importance}
              onChange={e => setNewAnnouncement({ ...newAnnouncement, importance: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-base"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-semibold mb-1 text-gray-700">Content</label>
            <textarea
              id="content"
              rows="4"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Write announcement content here"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold shadow transition"
          >
            Post Announcement
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold shadow transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal