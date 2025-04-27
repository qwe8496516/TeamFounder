import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MatchCard({ student }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!student) {
    return (
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-24 w-24 mx-auto bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mx-auto mt-4"></div>
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mx-auto mt-2"></div>
        </div>
      </div>
    )
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="w-full max-w-sm bg-indigo-50 border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-700">
      <div className="flex justify-end px-4 pt-4 relative" ref={dropdownRef}>
        <button
          id="dropdownButton"
          onClick={toggleDropdown}
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 transition-colors duration-200"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        {/* Dropdown menu */}
        <div
          id="dropdown"
          className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 absolute right-0 top-10 transition-all duration-200 transform ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <Link
                to={`/student/profile/${student.id || ''}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
              >
                View Profile
              </Link>
            </li>
            <li>
              <Link
                to={`/student/chat/${student.id || ''}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
              >
                Send Invitation
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  // Handle report action
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
              >
                Report
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <div className="relative group">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-xl transition-transform duration-300 group-hover:scale-110"
            src={student.avatar || '/default-avatar.png'}
            alt={`${student.name || 'Student'}'s avatar`}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white transition-colors duration-200">
          {student.name || 'Unnamed'}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {student.major || 'Student'}
        </span>
        
        {/* Skills display */}
        <div className="mt-4 px-4 w-full">
          <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills</h6>
          <div className="flex flex-wrap gap-2">
            {student.skills?.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-300 transition-all duration-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 shadow-sm"
              >
                {skill}
              </span>
            ))}
            {(!student.skills || student.skills.length === 0) && (
              <span className="text-sm text-gray-500 dark:text-gray-400">No skills</span>
            )}
          </div>
        </div>

        <div className="mt-4 px-4 w-full">
          <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Interests</h6>
          <div className="flex flex-wrap gap-2">
            {student.interests?.slice(0, 5).map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-300 transition-all duration-200 hover:bg-purple-200 dark:hover:bg-purple-800 shadow-sm"
              >
                {interest}
              </span>
            ))}
            {(!student.interests || student.interests.length === 0) && (
              <span className="text-sm text-gray-500 dark:text-gray-400">No interests</span>
            )}
          </div>
        </div>

        {student.matchScore && (
          <div className="mt-4 px-4 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Match Score</span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-500">
                {student.matchScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${student.matchScore}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex mt-6 space-x-4">
          <Link
            to={`/student/profile/${student.id || ''}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            View Profile
          </Link>
          <Link
            to={`/student/chat/${student.id || ''}`}
            className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Send Invitation
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MatchCard 